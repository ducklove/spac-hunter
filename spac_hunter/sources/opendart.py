"""OpenDART (opendart.fss.or.kr) official disclosure API client.

Activated only when the ``OPENDART_API_KEY`` environment variable is set
(``is_enabled()``). The corpCode zip (stock_code -> corp_code mapping) is
cached under ``.cache/opendart_corpcode.zip`` and refreshed at most weekly.
"""

import io
import logging
import re
import time
import xml.etree.ElementTree as ET
import zipfile
from datetime import timedelta
from pathlib import Path

from ..constants import (
    DISSOLUTION_TOKENS,
    MERGER_APPLICATION_TOKENS,
    MERGER_CANCEL_TOKENS,
    MERGER_CONFIRMATION_TOKENS,
    OPENDART_CORPCODE_CACHE_PATH,
    OPENDART_CORPCODE_URL,
    OPENDART_DOCUMENT_URL,
    OPENDART_LIST_URL,
    get_opendart_api_key,
)
from ..http import shared_session
from ..parsing import normalize_disclosure_title, parse_int, today_kst

logger = logging.getLogger(__name__)

CORPCODE_CACHE_MAX_AGE_DAYS = 7
LIST_PAGE_COUNT = 100
LIST_MAX_PAGES = 3
OPENDART_STATUS_OK = "000"
OPENDART_STATUS_NO_DATA = "013"

_HANGUL_RE = re.compile(r"[가-힣]")
_TAG_RE = re.compile(r"<[^>]+>")

# In-process memo of parsed corp-code mappings, keyed by cache path.
_corp_map_memo = {}


def is_enabled() -> bool:
    """Whether the OpenDART API can be used (OPENDART_API_KEY is set)."""
    return bool(get_opendart_api_key())


def _parse_corpcode_zip(raw: bytes) -> dict:
    """Parse the corpCode zip payload into a stock_code -> corp_code dict."""
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        names = archive.namelist()
        if not names:
            raise RuntimeError("OpenDART corpCode zip is empty")
        xml_bytes = archive.read(names[0])
    root = ET.fromstring(xml_bytes)
    mapping = {}
    for node in root.iter("list"):
        stock_code = (node.findtext("stock_code") or "").strip()
        corp_code = (node.findtext("corp_code") or "").strip()
        if len(stock_code) == 6 and corp_code:
            mapping[stock_code] = corp_code
    return mapping


def _download_corpcode_zip(api_key: str) -> bytes:
    response = shared_session().get(
        OPENDART_CORPCODE_URL, params={"crtfc_key": api_key}, timeout=30
    )
    response.raise_for_status()
    return response.content


def load_corp_code_map(cache_path=None, max_age_days=CORPCODE_CACHE_MAX_AGE_DAYS) -> dict:
    """Return the stock_code -> corp_code mapping, downloading at most weekly.

    The raw zip is cached on disk; a cached file younger than ``max_age_days``
    skips the download entirely.
    """
    api_key = get_opendart_api_key()
    if not api_key:
        raise RuntimeError("OPENDART_API_KEY가 설정되지 않았습니다")
    cache_path = Path(cache_path) if cache_path else OPENDART_CORPCODE_CACHE_PATH
    memo_key = str(cache_path)
    if memo_key in _corp_map_memo:
        return _corp_map_memo[memo_key]

    raw = None
    if cache_path.exists():
        age_seconds = time.time() - cache_path.stat().st_mtime
        if age_seconds <= max_age_days * 86400:
            raw = cache_path.read_bytes()
    if raw is None:
        raw = _download_corpcode_zip(api_key)
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_bytes(raw)
        logger.info("OpenDART corpCode 매핑 다운로드 완료 (%d bytes)", len(raw))

    mapping = _parse_corpcode_zip(raw)
    _corp_map_memo[memo_key] = mapping
    return mapping


def _fetch_list_page(api_key, corp_code, bgn_de, end_de, page_no):
    response = shared_session().get(
        OPENDART_LIST_URL,
        params={
            "crtfc_key": api_key,
            "corp_code": corp_code,
            "bgn_de": bgn_de,
            "end_de": end_de,
            "page_no": str(page_no),
            "page_count": str(LIST_PAGE_COUNT),
        },
        timeout=20,
    )
    response.raise_for_status()
    return response.json()


def fetch_opendart_disclosures(code, name, listing_date=None, today=None):
    """Fetch merger/dissolution-related disclosures for one stock code.

    Returns rows in the shared disclosure dict format; an unknown corp_code
    yields an empty list.
    """
    api_key = get_opendart_api_key()
    if not api_key:
        raise RuntimeError("OPENDART_API_KEY가 설정되지 않았습니다")
    today = today or today_kst()
    from_date = listing_date or (today - timedelta(days=365 * 4))
    corp_code = load_corp_code_map().get(code)
    if not corp_code:
        logger.info("OpenDART corp_code 미발견: %s(%s)", name, code)
        return []

    token_pool = (
        MERGER_APPLICATION_TOKENS
        + MERGER_CONFIRMATION_TOKENS
        + MERGER_CANCEL_TOKENS
        + ("주권매매거래정지", "주권매매거래정지해제")
        + DISSOLUTION_TOKENS
    )
    disclosures = []
    seen = set()
    page_no = 1
    while page_no <= LIST_MAX_PAGES:
        payload = _fetch_list_page(
            api_key,
            corp_code,
            from_date.strftime("%Y%m%d"),
            today.strftime("%Y%m%d"),
            page_no,
        )
        status = str(payload.get("status") or "")
        if status == OPENDART_STATUS_NO_DATA:
            break
        if status != OPENDART_STATUS_OK:
            raise RuntimeError(f"OpenDART 공시검색 오류 {status}: {payload.get('message')}")
        for row in payload.get("list") or []:
            title = re.sub(r"\s+", " ", str(row.get("report_nm") or "")).strip()
            normalized = normalize_disclosure_title(title)
            if not any(token in normalized for token in token_pool):
                continue
            receipt_no = str(row.get("rcept_no") or "").strip() or None
            rcept_dt = str(row.get("rcept_dt") or "").strip()
            if len(rcept_dt) == 8 and rcept_dt.isdigit():
                date_text = f"{rcept_dt[:4]}-{rcept_dt[4:6]}-{rcept_dt[6:8]}"
            else:
                date_text = rcept_dt
            key = receipt_no or f"{date_text}|{title}"
            if key in seen:
                continue
            seen.add(key)
            disclosure = {
                "date": date_text,
                "title": title,
                "company": row.get("corp_name"),
                "submitter": row.get("flr_nm"),
                "receiptNo": receipt_no,
                "source": "OpenDART 공시검색",
            }
            if receipt_no:
                disclosure["url"] = f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={receipt_no}"
            disclosures.append(disclosure)
        total_page = parse_int(payload.get("total_page")) or 1
        if page_no >= total_page:
            break
        page_no += 1
    return disclosures


def fetch_filing_list(bgn_de, end_de, corp_code=None, pblntf_ty=None, max_pages=LIST_MAX_PAGES):
    """Fetch raw list.json rows for a period, optionally scoped/typed, up to 3 pages.

    ``corp_code=None`` queries across all companies (used by the IPO calendar);
    ``pblntf_ty`` filters by disclosure type (e.g. ``"C"`` for 발행공시).
    Status 013 (no data) yields an empty list; other non-000 statuses raise.
    """
    api_key = get_opendart_api_key()
    if not api_key:
        raise RuntimeError("OPENDART_API_KEY가 설정되지 않았습니다")
    rows = []
    page_no = 1
    while page_no <= max_pages:
        params = {
            "crtfc_key": api_key,
            "bgn_de": bgn_de.strftime("%Y%m%d"),
            "end_de": end_de.strftime("%Y%m%d"),
            "page_no": str(page_no),
            "page_count": str(LIST_PAGE_COUNT),
        }
        if corp_code:
            params["corp_code"] = corp_code
        if pblntf_ty:
            params["pblntf_ty"] = pblntf_ty
        response = shared_session().get(OPENDART_LIST_URL, params=params, timeout=20)
        response.raise_for_status()
        payload = response.json()
        status = str(payload.get("status") or "")
        if status == OPENDART_STATUS_NO_DATA:
            break
        if status != OPENDART_STATUS_OK:
            raise RuntimeError(f"OpenDART 공시검색 오류 {status}: {payload.get('message')}")
        rows.extend(payload.get("list") or [])
        total_page = parse_int(payload.get("total_page")) or 1
        if page_no >= total_page:
            break
        page_no += 1
    return rows


def _decode_korean_bytes(raw: bytes) -> str:
    """Decode with cp949 and utf-8 (errors ignored), keeping whichever has more Hangul."""
    cp949_text = raw.decode("cp949", errors="ignore")
    utf8_text = raw.decode("utf-8", errors="ignore")
    if len(_HANGUL_RE.findall(utf8_text)) > len(_HANGUL_RE.findall(cp949_text)):
        return utf8_text
    return cp949_text


def fetch_document_text(receipt_no):
    """Download one disclosure document (document.xml zip) and return its plain text.

    A healthy response is a zip archive of one or more XML text files; anything
    not starting with the zip magic (``PK``) is treated as the OpenDART XML
    error payload and surfaced as a RuntimeError with its status/message.
    """
    api_key = get_opendart_api_key()
    if not api_key:
        raise RuntimeError("OPENDART_API_KEY가 설정되지 않았습니다")
    response = shared_session().get(
        OPENDART_DOCUMENT_URL,
        params={"crtfc_key": api_key, "rcept_no": str(receipt_no)},
        timeout=30,
    )
    response.raise_for_status()
    raw = response.content
    if not raw.startswith(b"PK"):
        status = message = ""
        try:
            root = ET.fromstring(raw)
            status = (root.findtext(".//status") or "").strip()
            message = (root.findtext(".//message") or "").strip()
        except ET.ParseError:
            pass
        raise RuntimeError(
            f"OpenDART 문서 다운로드 오류 {status or '?'}: {message or '비정상(zip 아님) 응답'}"
        )
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        blobs = [archive.read(name) for name in archive.namelist()]
    if not blobs:
        raise RuntimeError(f"OpenDART 문서 zip이 비어 있습니다: {receipt_no}")
    text = _decode_korean_bytes(b"\n".join(blobs))
    text = _TAG_RE.sub(" ", text)
    return re.sub(r"\s+", " ", text).strip()

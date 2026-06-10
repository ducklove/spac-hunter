"""Shared constants: paths, URLs, tokens, and defaults."""

import os
from datetime import timedelta, timezone
from pathlib import Path

# Repository root (this file lives in <root>/spac_hunter/constants.py).
ROOT = Path(__file__).resolve().parent.parent
DATA_JS_PATH = ROOT / "data.js"
CURRENT_JSON_PATH = ROOT / "current.json"
OVERRIDES_PATH = ROOT / "overrides.json"
ALERTS_JSON_PATH = ROOT / "alerts.json"
ALERTS_XML_PATH = ROOT / "alerts.xml"
CACHE_DIR = ROOT / ".cache"
OPENDART_CORPCODE_CACHE_PATH = CACHE_DIR / "opendart_corpcode.zip"

KST = timezone(timedelta(hours=9))
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"
)

DEFAULT_IPO_PRICE = 2000
DEFAULT_TRUST_RATE = 0.0
DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE = 0

KOFR_API_URL = "https://www.kofr.kr/websquare/engine/proworks/callServletService.jsp"
KOFR_MAIN_URL = "https://www.kofr.kr/main.jsp"
DART_MAIN_URL = "https://dart.fss.or.kr/dsab007/main.do"
DART_DETAIL_SEARCH_URL = "https://dart.fss.or.kr/dsab007/detailSearch.ax"
DART_CORP_SEARCH_URL = "https://dart.fss.or.kr/corp/searchCorp.ax"
OPENDART_CORPCODE_URL = "https://opendart.fss.or.kr/api/corpCode.xml"
OPENDART_LIST_URL = "https://opendart.fss.or.kr/api/list.json"
KIND_CORP_LIST_URL = "https://kind.krx.co.kr/corpgeneral/corpList.do"
KIND_CORP_LIST_PAGE_URL = f"{KIND_CORP_LIST_URL}?method=loadInitPage"
KIND_DISCLOSURE_URL = "https://kind.krx.co.kr/disclosure/searchdisclosurebycorp.do"
KIND_DISCLOSURE_PAGE_URL = f"{KIND_DISCLOSURE_URL}?method=searchDisclosureByCorpMain"
NAVER_STOCK_API_URL = "https://polling.finance.naver.com/api/realtime/domestic/stock/{code}"
NAVER_HISTORY_URL = "https://finance.naver.com/item/sise_day.naver?code={code}&page={page}"

MERGER_APPLICATION_TOKENS = (
    "SPAC합병(예비심사청구대상)",
    "회사합병결정",
)
MERGER_CONFIRMATION_TOKENS = (
    "상장예비심사결과통지(승인)",
    "SPAC소멸합병상장",
    "합병등종료보고서",
)
MERGER_CANCEL_TOKENS = (
    "합병취소",
    "부인사실발생",
    "합병결정철회",
    "철회",
    "미승인",
)
MERGER_IGNORE_TOKENS = (
    "상장예비심사청구서미제출",
)
DISSOLUTION_TOKENS = ("해산사유발생",)

# History points older than this many days are dropped when merging (3-year cap).
HISTORY_MAX_AGE_DAYS = 1095

SCHEMA_VERSION = 2

ALERTS_FEED_LINK = "https://github.com/ducklove/spac-hunter"


def get_opendart_api_key():
    """Return the OpenDART API key from the OPENDART_API_KEY env var (None when unset)."""
    return os.environ.get("OPENDART_API_KEY", "").strip() or None

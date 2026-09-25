"""Shared constants: paths, URLs, tokens, and defaults."""

import os
from pathlib import Path

from fin_commons.timeutil import KST as KST  # 재수출 — KST는 DST 없음, 고정 오프셋

# Repository root (this file lives in <root>/spac_hunter/constants.py).
ROOT = Path(__file__).resolve().parent.parent
DATA_JS_PATH = ROOT / "data.js"
CURRENT_JSON_PATH = ROOT / "current.json"
OVERRIDES_PATH = ROOT / "overrides.json"
ALERTS_JSON_PATH = ROOT / "alerts.json"
ALERTS_XML_PATH = ROOT / "alerts.xml"
ARCHIVE_JSON_PATH = ROOT / "archive.json"
FILINGS_JSON_PATH = ROOT / "filings.json"
CACHE_DIR = ROOT / ".cache"
OPENDART_CORPCODE_CACHE_PATH = CACHE_DIR / "opendart_corpcode.zip"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"
)

DEFAULT_IPO_PRICE = 2000
DEFAULT_TRUST_RATE = 0.0
DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE = 0
# 예치금 이자 차감 가정. 신탁계약내용변경 공시의 변경 전/후 예치금액으로 검증한 값:
# 특정금전신탁은 (공시 이율 - 신탁보수 0.1%p)에 법인 이자소득 원천징수 15.4%(법인세 14% +
# 지방소득세 1.4%)를 뺀 단리 이자가 만기마다 원금에 더해진다(교보13·14·15호 등). 정기예금형
# (KB·미래에셋·하나·한국투자 계열)은 보수가 없다. 종목별 보수는 domain/escrow.py가 공시 예치금으로
# 역산하고, 근거가 없을 때만 이 기본값을 쓴다.
DEFAULT_TRUST_FEE_PCT = 0.1
DEFAULT_INTEREST_TAX_PCT = 15.4
# 예치 계약 만기(재예치) 주기. 공시된 변경일 사이 구간은 이 주기로 단리→복리 전환한다.
TRUST_ROLLOVER_MONTHS = 12
# 상장폐지(해산)일 -> 잔여재산 분배일. 2025-2026 해산 스팩 9곳의 해산 공시 일정 중앙값
# (94-114일): 교보13·14·15, 한국13, 한화플러스4, IBKS23, 하나30, 대신밸런스17, 신영10호.
DEFAULT_PAYOUT_LAG_DAYS = 102
# 상장폐지 사유 발생 -> 상장폐지(정리매매 후 해산). 위 사례 6곳 11-14일의 중앙값.
DELISTING_LAG_DAYS = 13
# 코스닥 스팩 퇴출 규정: 공모 주금 납입일+30개월 내 합병 예비심사를 청구하지 않으면 관리종목,
# 그 뒤 1개월 내 해소하지 못하면 상장폐지 사유(= 납입+31개월). 합병등기 기한은 납입+36개월.
# 한국13·IBKS23·하나30·대신밸런스17·신영10호의 상장폐지 사유일이 납입+31개월과 0-2일 차이.
NO_MERGER_DELISTING_MONTHS = 31
MERGER_DEADLINE_MONTHS = 36

KOFR_API_URL = "https://www.kofr.kr/websquare/engine/proworks/callServletService.jsp"
KOFR_MAIN_URL = "https://www.kofr.kr/main.jsp"
DART_MAIN_URL = "https://dart.fss.or.kr/dsab007/main.do"
DART_DETAIL_SEARCH_URL = "https://dart.fss.or.kr/dsab007/detailSearch.ax"
DART_CORP_SEARCH_URL = "https://dart.fss.or.kr/corp/searchCorp.ax"
OPENDART_CORPCODE_URL = "https://opendart.fss.or.kr/api/corpCode.xml"
OPENDART_LIST_URL = "https://opendart.fss.or.kr/api/list.json"
OPENDART_DOCUMENT_URL = "https://opendart.fss.or.kr/api/document.xml"
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
    """Return the OpenDART API key from OPENDART_API_KEY or DART_API_KEY (None when unset)."""
    for name in ("OPENDART_API_KEY", "DART_API_KEY"):
        value = os.environ.get(name, "").strip()
        if value:
            return value
    return None

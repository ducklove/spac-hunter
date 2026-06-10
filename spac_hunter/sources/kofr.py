"""KOFR (Korea Overnight Financing Repo rate) client."""

import xml.etree.ElementTree as ET

from ..constants import KOFR_API_URL, KOFR_MAIN_URL
from ..http import make_session
from ..parsing import parse_float


def fetch_kofr_rate():
    body = (
        '<reqParam action="getLastRateList1" '
        'task="ksd.rfr.user.rate.process.RatePTask"><LANG>kor</LANG></reqParam>'
    )
    session = make_session(referer=KOFR_MAIN_URL)
    response = session.post(
        KOFR_API_URL,
        data=body.encode("utf-8"),
        headers={"Content-Type": "application/xml; charset=UTF-8"},
        timeout=20,
    )
    response.raise_for_status()
    root = ET.fromstring(response.text)
    result = root.find(".//result")
    if result is None:
        raise RuntimeError("KOFR response did not include a result node")

    def attr(name):
        node = result.find(name)
        return node.get("value").strip() if node is not None and node.get("value") else None

    latest_rate_pct = parse_float(attr("RFR_PUBN_MR"))
    if latest_rate_pct is None:
        raise RuntimeError("KOFR latest rate was unavailable")

    return {
        "source": "KOFR",
        "sourceUrl": KOFR_MAIN_URL,
        "publishedDate": attr("RFR_PUBN_DT"),
        "standardDate": attr("PUBN_MR_STD_DT"),
        "latestRatePct": latest_rate_pct,
        "rate": latest_rate_pct / 100,
        "d30AvgPct": parse_float(attr("D30_AVG_MR")),
        "d90AvgPct": parse_float(attr("D90_AVG_MR")),
        "d180AvgPct": parse_float(attr("D180_AVG_MR")),
        "lastModified": attr("LAST_MODF_DTTM"),
    }

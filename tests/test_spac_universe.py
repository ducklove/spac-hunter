from io import BytesIO
from zipfile import ZipFile

import pytest

from spac_hunter.domain.valuation import derive_sponsor
from spac_hunter.sources.kis import _parse_kosdaq_spac_master


def _master_row(code, isin, name, spac_flag):
    # Mirror the KIS fields through KRX은행, then pad the rest of the fixed-width trailer.
    market_fields = "ST" + "0" + "0000" * 3 + "N" * 9
    return f"{code:9}{isin}{name}{market_fields}{spac_flag}{' ' * 196}"


def _master_zip(*rows):
    content = BytesIO()
    with ZipFile(content, "w") as archive:
        archive.writestr("kosdaq_code.mst", ("\r\n".join(rows) + "\r\n").encode("cp949"))
    return content.getvalue()


def test_kis_master_classifies_by_spac_flag():
    spacs = _parse_kosdaq_spac_master(_master_zip(
        _master_row("206400", "KR7206400004", "아인스팩씨엔에스", "N"),
        _master_row("0205H0", "KR70205H0008", "에스케이증권제14호기업인수목적", "Y"),
    ))

    assert spacs == [{
        "code": "0205H0",
        "isin": "KR70205H0008",
        "name": "에스케이증권제14호기업인수목적",
        "market": "KOSDAQ",
        "source": "한국투자증권 코스닥 종목 마스터",
    }]
    assert derive_sponsor(spacs[0]["name"]) == "에스케이증권"


@pytest.mark.parametrize("flag, message", [("N", "스팩 0건"), ("?", "형식 오류")])
def test_invalid_or_empty_universe_fails_closed(flag, message):
    with pytest.raises(ValueError, match=message):
        _parse_kosdaq_spac_master(_master_zip(
            _master_row("206400", "KR7206400004", "아인스팩씨엔에스", flag),
        ))

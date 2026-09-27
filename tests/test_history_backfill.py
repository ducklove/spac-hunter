from spac_hunter.sources import naver


def test_chart_feed_parses_close_and_volume_and_ignores_invalid_rows(monkeypatch):
    monkeypatch.setattr(naver, "http_text", lambda *args, **kwargs: '''<protocol><chartdata>
      <item data="20240229|2450|3480|2015|2015|80399891"/>
      <item data="20240304|2005|2020|1985|2010|2513711"/>
      <item data="invalid|1|2|3|4|5"/><item data="20240305|0|0|0|0|0"/>
      <item data="bad"/>
    </chartdata></protocol>''')
    assert naver.fetch_full_naver_history("473050") == [
        {"date": "2024-02-29", "close": 2015, "volume": 80399891},
        {"date": "2024-03-04", "close": 2010, "volume": 2513711},
    ]


def test_only_incomplete_histories_are_backfilled_and_failure_is_non_destructive(monkeypatch):
    calls = []

    def fetch(code):
        calls.append(code)
        if code == "failed":
            raise ValueError("source unavailable")
        return [{"date": "2024-01-02", "close": 2000}]

    monkeypatch.setattr(naver, "fetch_full_naver_history", fetch)
    existing = {
        "complete": {"listingDate": "2024-01-02", "history": [{"date": "2024-01-02", "close": 2000}]},
        "missing": {"listingDate": "2024-01-02", "history": [{"date": "2025-01-02", "close": 2000}]},
    }
    result = naver.fetch_history_backfills(["complete", "missing", "new", "failed"], existing)
    assert set(calls) == {"missing", "new", "failed"}
    assert set(result) == {"missing", "new"}
    assert existing["missing"]["history"][0]["date"] == "2025-01-02"

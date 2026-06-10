# spac-hunter

국내 상장 스팩을 `현재가 / 공모가` 중심으로 정렬하고, 합병·청산 일정을 함께 보는 정적 대시보드입니다.

## 실행

```powershell
python fetch_data.py --history-pages 3
```

생성되는 파일:

- `data.js`: 대시보드가 읽는 전체 데이터
- `current.json`: 현재가 중심의 가벼운 스냅샷

그 다음 `index.html`을 브라우저에서 열면 됩니다.

종료 코드는 `0` 정상, `1` 수집 실패, `2` 안전 가드 거부입니다. 직전 데이터 대비 종목 수가 급감하거나 시세 수집률이 50% 미만이면 기존 데이터를 보호하기 위해 쓰기를 거부하고 exit 2로 종료하며, 의도한 축소라면 `--force`로 우회할 수 있습니다. 샘플 데이터 폴백은 `--sample`을 명시했을 때만 동작하고(라이브 수집 실패 시 데이터를 쓰지 않고 exit 1), 샘플 데이터는 가드에 걸릴 수 있어 `--sample --force`를 권장합니다.

생성된 `data.js`의 구조는 다음으로 검증합니다(표준 라이브러리만 사용, 실패 시 exit 1).

```powershell
python validate_data.py
```

`--path`로 검증 대상 파일을, `--min-count`로 최소 종목 수 기준을 바꿀 수 있습니다.

## 프로젝트 구조

```text
fetch_data.py            # 수집 CLI 진입점
validate_data.py         # data.js 구조 검증 (표준 라이브러리만 사용)
spac_hunter/             # 수집 파이프라인 패키지
  cli.py http.py constants.py parsing.py alerts.py archive.py filings.py
  sources/               # krx, kind, dart, opendart, naver, kofr
  domain/                # merger, valuation, enrich
  stats.py sample.py output.py
index.html               # 대시보드 진입점 (빌드 없음)
assets/                  # style.css, format.js, charts.js, app.js
tests/                   # pytest 테스트
pyproject.toml           # ruff 설정 (line-length 110, py311)
requirements.txt         # 런타임 의존성 (버전 고정)
requirements-dev.txt     # ruff, pytest
.github/workflows/       # pages.yml (데이터 갱신+배포), quality.yml (lint+test)
data.js / current.json   # 생성 산출물 (CI가 매일 갱신)
alerts.json / alerts.xml # 알림 누적 기록과 RSS 피드 (라이브 갱신 시 생성)
archive.json             # 상폐(유니버스 이탈) 스팩 아카이브 (라이브 갱신 시 생성)
filings.json             # 증권신고서 자동 추출값 캐시 (OpenDART 키 설정 시 점진 축적)
overrides.json           # 수동 보정 레이어 (저장소에 커밋, CI에도 적용)
```

## 개발

```powershell
pip install -r requirements.txt -r requirements-dev.txt
ruff check spac_hunter tests fetch_data.py validate_data.py
pytest -q
```

로컬 프리뷰는 `python -m http.server`를 띄워 접속하거나, `index.html`을 브라우저에서 직접 열면 됩니다(별도 빌드 없이 `file://`로도 동작).

## 데이터 소스

- KRX 상장종목검색: KOSDAQ 종목명에 `스팩` 또는 `SPAC`이 포함된 종목을 universe로 사용
- KIND 상장법인목록: 상장일, 업종, 주요제품 보강
- 합병 공시: OpenDART API(키 설정 시 최우선) → KIND 공시검색 → DART 화면 스크래핑 폴백 체인. `회사합병 결정`/`SPAC 합병(예비심사청구대상)`은 `합병 신청`, `상장예비심사결과 통지(승인)` 등은 `합병 확정` 상태로 분류하고, `해산사유 발생` 공시는 해산 배지·이벤트로 표시
- 네이버 증권: 현재가와 최근 일별 시세
- 합병 공시가 있는 종목은 더 긴 일별 시세를 가져와 공시 직전가, 다음 거래일, 최신가, 이후 고점·저점 수익률을 계산
- 시장 통계: 공모가 미만 종목수 추이, 신규등록 월별 추이, 합병 신청/확정/철회 추이, 표본 기준 합병 성사 확률과 성사 기간, 스폰서(증권사)별 통계
- 상폐 아카이브: 유니버스에서 사라진 스팩(합병 신상장·상폐)을 `archive.json`에 마지막 가격·합병 상태와 함께 기록하고, 합병 성사 통계에 아카이브 표본을 합산해 생존편향을 줄입니다 (아카이브 도입 이전에 상폐된 과거 사례는 미포함)

`data.js`에는 schemaVersion 2 형식으로 수집 요약(collection)이 함께 기록되어, 대시보드가 수집 상태와 데이터 신선도를 표시하는 데 사용합니다.

### OpenDART 연동 (선택)

[OpenDART](https://opendart.fss.or.kr/)에서 무료 회원가입 후 인증키를 발급받아 환경변수 `OPENDART_API_KEY`(또는 `DART_API_KEY`)로 설정하면(로컬 실행 시 환경변수, CI는 저장소 Settings → Secrets and variables → Actions에 등록) 공시 수집이 화면 스크래핑 대신 공식 API를 최우선으로 사용해 더 안정적으로 동작합니다. 키가 없으면 자동으로 기존 KIND → DART 체인을 사용하므로 동작 차이가 없습니다. 고유번호 매핑(corpCode.xml)은 `.cache/`에 7일간 캐시됩니다.

키가 설정되면 다음 두 기능이 추가로 활성화됩니다.

- **증권신고서 자동 추출**: 종목별 투자설명서/증권신고서 원문에서 확정공모가·공모주식수·예치금·예치이율·예치기관·청약/납입일을 추출해 `filings.json`에 축적합니다. 추출값은 `overrides.json` 다음 순위의 폴백으로 사용됩니다(공모가: overrides > 신고서 > 기본 2,000원 / 예치이율: overrides > 신고서 이율 > KOFR). 실행당 문서 요청 수는 `--filing-doc-limit`(기본 10)로 제한되어 매일 조금씩 채워지며, 특정 종목을 다시 추출하려면 `filings.json`에서 해당 엔트리를 삭제하면 됩니다. 추출은 best-effort라 값 범위 검증을 통과한 필드만 사용됩니다.
- **청약 캘린더**: 최근 30일 발행공시에서 상장 전 스팩의 증권신고서를 찾아 `data.js`의 `ipoCalendar`로 제공하고, 대시보드 "다가오는 일정"에 공모 청약 컬럼으로 표시합니다.

## 알림

라이브 갱신(`--sample` 아님)이 성공하면 직전 `data.js`와 비교해 다음 이벤트를 감지합니다.

- 합병 신청 / 확정 / 철회 공시 발생, 해산사유 발생
- 공모가 이하 진입 / 회복 (현재가/공모가 1.00x 교차)
- 청산 6개월 이내 진입, 신규 상장
- 유니버스 제외(상폐 추정) — 아카이브 등록과 동시에 알림

감지된 알림은 `alerts.json`(최신순 누적, 최대 500건)과 `alerts.xml`(RSS 2.0, 최신 50건)로 기록되어 GitHub Pages에서 RSS 리더로 구독할 수 있습니다. 저장소 secrets에 `TELEGRAM_BOT_TOKEN`과 `TELEGRAM_CHAT_ID`를 등록하면 새 알림 요약이 Telegram으로도 발송됩니다(미설정 시 건너뜀, 발송 실패는 파이프라인을 중단시키지 않음).

## 주요 계산

```text
현재가 / 공모가 = 현재가 / 공모가
공모가 괴리 = 현재가 / 공모가 - 1
추정 청산분배금 = 공모예치금 + 청산기한까지의 예상 예치이자
단순 기대수익률 = 추정 청산분배금 / 현재가 - 1
연환산 기대수익률 = (추정 청산분배금 / 현재가)^(365 / 잔여일수) - 1
```

공모가는 `overrides.json` > 증권신고서 추출값(OpenDART 키 설정 시) > 기본 2,000원 순서로 결정됩니다. 청산일은 `overrides.json`에 값이 없으면 KIND 상장일 + 36개월로 추정합니다. 일반 운영비, 상장비, 합병 추진비는 기본 계산에서 공모예치금 차감 항목으로 보지 않습니다. 실제 예치기관 수익률, 세금, 확정 분배금은 공시 확인 후 `overrides.json`으로 보정합니다. 별도 공시나 수동 입력이 없으면 예상 예치이자는 KOFR 최신 공시금리를 fallback 금리로 사용합니다.

수동 금리를 쓰려면 다음처럼 실행합니다.

```powershell
python fetch_data.py --trust-rate 0.025 --history-pages 3
```

## overrides.json 운영

`overrides.json`은 공모가, 실제 납입일/청산일, 합병 신청/확정 공시일, 예치금 기반 청산분배금 등을 보정하는 핵심 수동/반자동 레이어로, 공시 기반 기대수익률의 정확도를 높입니다. 이제 저장소에 커밋되어 매일 CI 데이터 갱신에도 동일하게 적용됩니다. 키 형식과 작성 예시는 `overrides.example.json`을 참고하세요.

## 데이터 안전장치

- 샘플 폴백 차단: `--sample` 없이 라이브 수집이 실패하면 샘플 데이터로 대체하지 않고 exit 1로 종료해 기존 데이터를 보존
- 쓰기 가드: 종목 수 급감 또는 시세 수집률 50% 미만이면 쓰기를 거부(exit 2), `--force`로만 우회
- `validate_data.py`: 생성된 `data.js` 구조를 검증하며, CI에서는 갱신 직후 실행되어 실패 시 커밋·배포를 중단
- 갱신 실패 알림: 스케줄 갱신이 실패하면 `[data-refresh] 자동 데이터 갱신 실패` 이슈를 자동 생성하고, 이미 열려 있으면 실행 링크를 코멘트로 추가

## CI 구성

- `.github/workflows/pages.yml`: 매일 18:10 KST(크론) 또는 수동 실행 시 `python fetch_data.py --history-pages 12 --merger-history-pages 60`로 데이터를 갱신하고, `validate_data.py` 검증을 통과하면 `data.js`/`current.json`을 main에 커밋한 뒤 GitHub Pages로 배포합니다. 스케줄 실행 실패 시 이슈로 알립니다.
- `.github/workflows/quality.yml`: PR과 push(main, `claude/**`)에서 `ruff check`와 `pytest -q`를 실행합니다. `data.js`/`current.json`/`docs/**`만 바뀐 커밋은 건너뜁니다.

## 대시보드 기능 요약

- 필터 / 정렬 / 검색
- 워치리스트: 별표(☆)로 관심 종목 등록(localStorage), `관심` 필터와 평균 비율·연환산 요약
- 다가오는 일정: 청산기한 12개월 월별 그룹, 최근 합병 이벤트, 최근 상장, 공모 청약 예정(OpenDART 키 설정 시)
- 공모 정보 블록: 증권신고서 추출값(공모가·예치금·예치이율 등)을 종목 상세에 표시
- 상폐·아카이브 패널: 누적 아카이브와 최근 이탈 종목 (아카이브 데이터가 있을 때 표시)
- 다크 테마
- iframe 임베드: `?embed`, `?theme`
- 딥링크: `?code`, `?filter`, `?sort`
- 금리 시나리오 슬라이더: 예치이자 가정을 바꿔 기대수익률 재계산
- 종목별 스파크라인
- CSV 내보내기
- 공시 원문 링크: 선택 종목의 합병·해산 공시 원문 바로가기
- 알림 RSS 링크(`alerts.xml`)
- 데이터 신선도 경고: 마지막 수집이 오래되면 화면에 표시

## 다음 확장

- OpenDART API 키를 사용해 `해산사유 발생`, 증권신고서/투자설명서에서 예치금·공모주식수·이자율을 자동 보강
- KIND 공모일정의 청약/납입/상장 캘린더를 별도 탭으로 추가
- 공시 원문 링크와 계산 근거를 개별 종목 상세 패널에 붙이기

전체 구조·품질 평가와 로드맵은 [docs/project-review.html](docs/project-review.html) 참고.

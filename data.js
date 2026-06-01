window.SPAC_DATA = {
  "source": "KRX/KIND/DART/Naver",
  "lastUpdated": "2026-06-01 09:29:15 KST",
  "generatedAt": "2026-06-01T09:29:15.664143+09:00",
  "methodology": {
    "universe": "KRX KOSDAQ 상장종목 중 종목명에 스팩/SPAC 포함",
    "listingInfo": "KIND 상장법인목록 이름 매칭",
    "mergerStatus": "KIND 공시검색과 DART fallback에서 회사합병 결정/SPAC 합병 예비심사청구대상은 합병 신청, 상장예비심사결과 통지(승인) 등은 합병 확정으로 분류",
    "price": "네이버 증권 실시간/최근가",
    "ipoPrice": "기본 2,000원, overrides.json으로 보정",
    "liquidationDate": "overrides.json 우선, 없으면 상장일+36개월 추정",
    "liquidationValue": "공모예치금 + 청산기한까지의 예상 예치이자. 일반 운영/합병 비용은 공모예치금에서 차감하지 않는 것으로 기본 추정",
    "trustRate": "KOFR 최신 공시금리 2.560%(2026.06.01)",
    "expectedReturn": "추정 청산분배금/현재가 - 1"
  },
  "rateAssumption": {
    "annualRate": 0.0256,
    "annualRatePct": 2.56,
    "source": "KOFR 최신 공시금리 2.560%(2026.06.01)",
    "kofr": {
      "source": "KOFR",
      "sourceUrl": "https://www.kofr.kr/main.jsp",
      "publishedDate": "2026.06.01",
      "standardDate": "2026.05.29",
      "latestRatePct": 2.56,
      "rate": 0.0256,
      "d30AvgPct": 2.53667,
      "d90AvgPct": 2.53322,
      "d180AvgPct": 2.55493,
      "lastModified": "2026.06.01 08:00:36"
    }
  },
  "summary": {
    "totalCount": 73,
    "belowIpoCount": 14,
    "nearIpoCount": 30,
    "dueSoonCount": 3,
    "mergerCount": 4,
    "mergerAppliedCount": 3,
    "mergerConfirmedCount": 1,
    "recentListingCount": 5,
    "averageRatio": 1.0345,
    "averageAnnualizedReturn": 1.65,
    "cheapest": {
      "code": "0131D0",
      "name": "키움히어로제2호스팩",
      "ratio": 0.9885,
      "currentPrice": 1977
    },
    "bestYield": {
      "code": "474660",
      "name": "신한제12호스팩",
      "annualizedReturn": 6.05,
      "currentPrice": 2050
    }
  },
  "spacs": [
    {
      "id": "0131D0",
      "code": "0131D0",
      "name": "키움히어로제2호스팩",
      "market": "KOSDAQ",
      "isin": "KR70131D0001",
      "sponsor": "키움히어로",
      "ipoPrice": 2000,
      "currentPrice": 1977,
      "change": -4,
      "changePct": -0.2,
      "ratio": 0.9885,
      "premiumPct": -1.15,
      "volume": 78783,
      "tradingValue": 156000000,
      "marketCap": 12474870000,
      "estimatedShares": 6310000,
      "listingDate": "2026-04-23",
      "liquidationDate": "2029-04-23",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 1057,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 9.14,
      "annualizedReturn": 3.07,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "키움히어로제2호스팩",
        "fullName": "키움히어로제2호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업 인수 합병",
        "listingDate": "2026-04-23",
        "fiscalMonth": "12월",
        "ceo": "박정근",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0131D0",
        "price": 1977,
        "change": -4,
        "changePct": -0.2,
        "volume": 78783,
        "tradingValue": 156000000,
        "marketCap": 12474870000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.846412+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-23",
          "close": 2735,
          "ratio": 1.3675,
          "volume": 192417182
        },
        {
          "date": "2026-04-24",
          "close": 2575,
          "ratio": 1.2875,
          "volume": 18416942
        },
        {
          "date": "2026-04-27",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 3687114
        },
        {
          "date": "2026-04-28",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 1406344
        },
        {
          "date": "2026-04-29",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 931659
        },
        {
          "date": "2026-04-30",
          "close": 2000,
          "ratio": 1.0,
          "volume": 581532
        },
        {
          "date": "2026-05-04",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 457817
        },
        {
          "date": "2026-05-06",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 520380
        },
        {
          "date": "2026-05-07",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 252296
        },
        {
          "date": "2026-05-08",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 293341
        },
        {
          "date": "2026-05-11",
          "close": 1990,
          "ratio": 0.995,
          "volume": 243303
        },
        {
          "date": "2026-05-12",
          "close": 1985,
          "ratio": 0.9925,
          "volume": 209868
        },
        {
          "date": "2026-05-13",
          "close": 1994,
          "ratio": 0.997,
          "volume": 131953
        },
        {
          "date": "2026-05-14",
          "close": 1986,
          "ratio": 0.993,
          "volume": 125686
        },
        {
          "date": "2026-05-15",
          "close": 1984,
          "ratio": 0.992,
          "volume": 154461
        },
        {
          "date": "2026-05-18",
          "close": 1983,
          "ratio": 0.9915,
          "volume": 126967
        },
        {
          "date": "2026-05-19",
          "close": 1990,
          "ratio": 0.995,
          "volume": 296484
        },
        {
          "date": "2026-05-20",
          "close": 1985,
          "ratio": 0.9925,
          "volume": 99239
        },
        {
          "date": "2026-05-21",
          "close": 1985,
          "ratio": 0.9925,
          "volume": 73197
        },
        {
          "date": "2026-05-22",
          "close": 1983,
          "ratio": 0.9915,
          "volume": 45906
        },
        {
          "date": "2026-05-26",
          "close": 1987,
          "ratio": 0.9935,
          "volume": 104876
        },
        {
          "date": "2026-05-27",
          "close": 1981,
          "ratio": 0.9905,
          "volume": 117118
        },
        {
          "date": "2026-05-28",
          "close": 1981,
          "ratio": 0.9905,
          "volume": 78003
        },
        {
          "date": "2026-05-29",
          "close": 1981,
          "ratio": 0.9905,
          "volume": 75383
        },
        {
          "date": "2026-06-01",
          "close": 1977,
          "ratio": 0.9885,
          "volume": 76490
        }
      ],
      "events": [
        {
          "date": "2026-04-23",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2026-04-23"
        },
        {
          "date": "2029-04-23",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=키움히어로제2호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0131D0"
    },
    {
      "id": "0129K0",
      "code": "0129K0",
      "name": "신한제18호스팩",
      "market": "KOSDAQ",
      "isin": "KR70129K0006",
      "sponsor": "신한",
      "ipoPrice": 2000,
      "currentPrice": 1986,
      "change": -6,
      "changePct": -0.3,
      "ratio": 0.993,
      "premiumPct": -0.7,
      "volume": 5999,
      "tradingValue": 12000000,
      "marketCap": 11161320000,
      "estimatedShares": 5620000,
      "listingDate": "2026-04-30",
      "liquidationDate": "2029-04-30",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 1064,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.65,
      "annualizedReturn": 2.89,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신한제18호스팩",
        "fullName": "신한제18호기업인수목적주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스업",
        "listingDate": "2026-04-30",
        "fiscalMonth": "12월",
        "ceo": "변창섭",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0129K0",
        "price": 1986,
        "change": -6,
        "changePct": -0.3,
        "volume": 5999,
        "tradingValue": 12000000,
        "marketCap": 11161320000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.537687+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-30",
          "close": 2355,
          "ratio": 1.1775,
          "volume": 130479859
        },
        {
          "date": "2026-05-04",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 5615751
        },
        {
          "date": "2026-05-06",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 1211819
        },
        {
          "date": "2026-05-07",
          "close": 1994,
          "ratio": 0.997,
          "volume": 348899
        },
        {
          "date": "2026-05-08",
          "close": 1996,
          "ratio": 0.998,
          "volume": 280706
        },
        {
          "date": "2026-05-11",
          "close": 1992,
          "ratio": 0.996,
          "volume": 321719
        },
        {
          "date": "2026-05-12",
          "close": 1986,
          "ratio": 0.993,
          "volume": 206696
        },
        {
          "date": "2026-05-13",
          "close": 1996,
          "ratio": 0.998,
          "volume": 217397
        },
        {
          "date": "2026-05-14",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 220561
        },
        {
          "date": "2026-05-15",
          "close": 1994,
          "ratio": 0.997,
          "volume": 138160
        },
        {
          "date": "2026-05-18",
          "close": 1990,
          "ratio": 0.995,
          "volume": 150195
        },
        {
          "date": "2026-05-19",
          "close": 1996,
          "ratio": 0.998,
          "volume": 198918
        },
        {
          "date": "2026-05-20",
          "close": 1994,
          "ratio": 0.997,
          "volume": 71806
        },
        {
          "date": "2026-05-21",
          "close": 1994,
          "ratio": 0.997,
          "volume": 51084
        },
        {
          "date": "2026-05-22",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 44821
        },
        {
          "date": "2026-05-26",
          "close": 1992,
          "ratio": 0.996,
          "volume": 99978
        },
        {
          "date": "2026-05-27",
          "close": 1993,
          "ratio": 0.9965,
          "volume": 109854
        },
        {
          "date": "2026-05-28",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 50484
        },
        {
          "date": "2026-05-29",
          "close": 1992,
          "ratio": 0.996,
          "volume": 73887
        },
        {
          "date": "2026-06-01",
          "close": 1987,
          "ratio": 0.9935,
          "volume": 5580
        }
      ],
      "events": [
        {
          "date": "2026-04-30",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2026-04-30"
        },
        {
          "date": "2029-04-30",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신한제18호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0129K0"
    },
    {
      "id": "0130D0",
      "code": "0130D0",
      "name": "신한제17호스팩",
      "market": "KOSDAQ",
      "isin": "KR70130D0002",
      "sponsor": "신한",
      "ipoPrice": 2000,
      "currentPrice": 1987,
      "change": -3,
      "changePct": -0.15,
      "ratio": 0.9935,
      "premiumPct": -0.65,
      "volume": 3967,
      "tradingValue": 8000000,
      "marketCap": 10610580000,
      "estimatedShares": 5340000,
      "listingDate": "2026-04-01",
      "liquidationDate": "2029-04-01",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 1035,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.59,
      "annualizedReturn": 2.95,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신한제17호스팩",
        "fullName": "신한제17호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융지원 서비스업",
        "listingDate": "2026-04-01",
        "fiscalMonth": "12월",
        "ceo": "이효상",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0130D0",
        "price": 1987,
        "change": -3,
        "changePct": -0.15,
        "volume": 3967,
        "tradingValue": 8000000,
        "marketCap": 10610580000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.536812+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2000,
          "ratio": 1.0,
          "volume": 442311
        },
        {
          "date": "2026-04-17",
          "close": 2000,
          "ratio": 1.0,
          "volume": 301011
        },
        {
          "date": "2026-04-20",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 182484
        },
        {
          "date": "2026-04-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 160863
        },
        {
          "date": "2026-04-22",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 75699
        },
        {
          "date": "2026-04-23",
          "close": 2000,
          "ratio": 1.0,
          "volume": 99274
        },
        {
          "date": "2026-04-24",
          "close": 2000,
          "ratio": 1.0,
          "volume": 133478
        },
        {
          "date": "2026-04-27",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 130465
        },
        {
          "date": "2026-04-28",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 121706
        },
        {
          "date": "2026-04-29",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 79492
        },
        {
          "date": "2026-04-30",
          "close": 1992,
          "ratio": 0.996,
          "volume": 186270
        },
        {
          "date": "2026-05-04",
          "close": 1998,
          "ratio": 0.999,
          "volume": 47188
        },
        {
          "date": "2026-05-06",
          "close": 2000,
          "ratio": 1.0,
          "volume": 109026
        },
        {
          "date": "2026-05-07",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 34022
        },
        {
          "date": "2026-05-08",
          "close": 1998,
          "ratio": 0.999,
          "volume": 18658
        },
        {
          "date": "2026-05-11",
          "close": 1998,
          "ratio": 0.999,
          "volume": 65689
        },
        {
          "date": "2026-05-12",
          "close": 1989,
          "ratio": 0.9945,
          "volume": 66695
        },
        {
          "date": "2026-05-13",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 41732
        },
        {
          "date": "2026-05-14",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 19997
        },
        {
          "date": "2026-05-15",
          "close": 1992,
          "ratio": 0.996,
          "volume": 18841
        },
        {
          "date": "2026-05-18",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 18321
        },
        {
          "date": "2026-05-19",
          "close": 1998,
          "ratio": 0.999,
          "volume": 47141
        },
        {
          "date": "2026-05-20",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 7896
        },
        {
          "date": "2026-05-21",
          "close": 1996,
          "ratio": 0.998,
          "volume": 7864
        },
        {
          "date": "2026-05-22",
          "close": 1994,
          "ratio": 0.997,
          "volume": 49365
        },
        {
          "date": "2026-05-26",
          "close": 1996,
          "ratio": 0.998,
          "volume": 47201
        },
        {
          "date": "2026-05-27",
          "close": 1992,
          "ratio": 0.996,
          "volume": 62348
        },
        {
          "date": "2026-05-28",
          "close": 1989,
          "ratio": 0.9945,
          "volume": 43284
        },
        {
          "date": "2026-05-29",
          "close": 1990,
          "ratio": 0.995,
          "volume": 34106
        },
        {
          "date": "2026-06-01",
          "close": 1987,
          "ratio": 0.9935,
          "volume": 3956
        }
      ],
      "events": [
        {
          "date": "2026-04-01",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2026-04-01"
        },
        {
          "date": "2029-04-01",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신한제17호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0130D0"
    },
    {
      "id": "0132G0",
      "code": "0132G0",
      "name": "교보20호스팩",
      "market": "KOSDAQ",
      "isin": "KR70132G0007",
      "sponsor": "교보",
      "ipoPrice": 2000,
      "currentPrice": 1990,
      "change": -8,
      "changePct": -0.4,
      "ratio": 0.995,
      "premiumPct": -0.5,
      "volume": 1497,
      "tradingValue": 3000000,
      "marketCap": 11880300000,
      "estimatedShares": 5970000,
      "listingDate": "2026-04-02",
      "liquidationDate": "2029-04-02",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 1036,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.43,
      "annualizedReturn": 2.89,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "교보20호스팩",
        "fullName": "교보20호기업인수목적 주식회사",
        "industry": "기타 금융업",
        "mainProduct": "기업 인수 및 합병",
        "listingDate": "2026-04-02",
        "fiscalMonth": "12월",
        "ceo": "김서호",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0132G0",
        "price": 1990,
        "change": -8,
        "changePct": -0.4,
        "volume": 1497,
        "tradingValue": 3000000,
        "marketCap": 11880300000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.102535+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 60122
        },
        {
          "date": "2026-04-17",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 729981
        },
        {
          "date": "2026-04-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 176813
        },
        {
          "date": "2026-04-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 173016
        },
        {
          "date": "2026-04-22",
          "close": 2000,
          "ratio": 1.0,
          "volume": 75674
        },
        {
          "date": "2026-04-23",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 80217
        },
        {
          "date": "2026-04-24",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 167496
        },
        {
          "date": "2026-04-27",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 124894
        },
        {
          "date": "2026-04-28",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 110940
        },
        {
          "date": "2026-04-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 52796
        },
        {
          "date": "2026-04-30",
          "close": 2000,
          "ratio": 1.0,
          "volume": 152650
        },
        {
          "date": "2026-05-04",
          "close": 1996,
          "ratio": 0.998,
          "volume": 55776
        },
        {
          "date": "2026-05-06",
          "close": 1996,
          "ratio": 0.998,
          "volume": 24277
        },
        {
          "date": "2026-05-07",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 14324
        },
        {
          "date": "2026-05-08",
          "close": 1996,
          "ratio": 0.998,
          "volume": 18717
        },
        {
          "date": "2026-05-11",
          "close": 2000,
          "ratio": 1.0,
          "volume": 49588
        },
        {
          "date": "2026-05-12",
          "close": 1998,
          "ratio": 0.999,
          "volume": 83423
        },
        {
          "date": "2026-05-13",
          "close": 2000,
          "ratio": 1.0,
          "volume": 35290
        },
        {
          "date": "2026-05-14",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 66493
        },
        {
          "date": "2026-05-15",
          "close": 2000,
          "ratio": 1.0,
          "volume": 71599
        },
        {
          "date": "2026-05-18",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 15719
        },
        {
          "date": "2026-05-19",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 49907
        },
        {
          "date": "2026-05-20",
          "close": 1992,
          "ratio": 0.996,
          "volume": 60419
        },
        {
          "date": "2026-05-21",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 12395
        },
        {
          "date": "2026-05-22",
          "close": 2000,
          "ratio": 1.0,
          "volume": 59995
        },
        {
          "date": "2026-05-26",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 5889
        },
        {
          "date": "2026-05-27",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 53651
        },
        {
          "date": "2026-05-28",
          "close": 1988,
          "ratio": 0.994,
          "volume": 35590
        },
        {
          "date": "2026-05-29",
          "close": 1998,
          "ratio": 0.999,
          "volume": 41842
        },
        {
          "date": "2026-06-01",
          "close": 1990,
          "ratio": 0.995,
          "volume": 1497
        }
      ],
      "events": [
        {
          "date": "2026-04-02",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2026-04-02"
        },
        {
          "date": "2029-04-02",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=교보20호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0132G0"
    },
    {
      "id": "0093G0",
      "code": "0093G0",
      "name": "미래에셋비전스팩8호",
      "market": "KOSDAQ",
      "isin": "KR70093G0004",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 1990,
      "change": -10,
      "changePct": -0.5,
      "ratio": 0.995,
      "premiumPct": -0.5,
      "volume": 1004,
      "tradingValue": 2000000,
      "marketCap": 12736000000,
      "estimatedShares": 6400000,
      "listingDate": "2025-11-27",
      "liquidationDate": "2028-11-27",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 910,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.43,
      "annualizedReturn": 3.3,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "미래에셋비전스팩8호",
        "fullName": "미래에셋비전기업인수목적8호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-11-27",
        "fiscalMonth": "12월",
        "ceo": "김병철",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0093G0",
        "price": 1990,
        "change": -10,
        "changePct": -0.5,
        "volume": 1004,
        "tradingValue": 2000000,
        "marketCap": 12736000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.344496+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4719
        },
        {
          "date": "2026-04-17",
          "close": 2010,
          "ratio": 1.005,
          "volume": 9831
        },
        {
          "date": "2026-04-20",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4383
        },
        {
          "date": "2026-04-21",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 11673
        },
        {
          "date": "2026-04-22",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 2422
        },
        {
          "date": "2026-04-23",
          "close": 2000,
          "ratio": 1.0,
          "volume": 5876
        },
        {
          "date": "2026-04-24",
          "close": 2010,
          "ratio": 1.005,
          "volume": 20247
        },
        {
          "date": "2026-04-27",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 30308
        },
        {
          "date": "2026-04-28",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 19456
        },
        {
          "date": "2026-04-29",
          "close": 1996,
          "ratio": 0.998,
          "volume": 3050
        },
        {
          "date": "2026-04-30",
          "close": 1998,
          "ratio": 0.999,
          "volume": 3873
        },
        {
          "date": "2026-05-04",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 10969
        },
        {
          "date": "2026-05-06",
          "close": 1996,
          "ratio": 0.998,
          "volume": 4105
        },
        {
          "date": "2026-05-07",
          "close": 1996,
          "ratio": 0.998,
          "volume": 4850
        },
        {
          "date": "2026-05-08",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 9633
        },
        {
          "date": "2026-05-11",
          "close": 1993,
          "ratio": 0.9965,
          "volume": 25784
        },
        {
          "date": "2026-05-12",
          "close": 1994,
          "ratio": 0.997,
          "volume": 2703
        },
        {
          "date": "2026-05-13",
          "close": 1996,
          "ratio": 0.998,
          "volume": 8883
        },
        {
          "date": "2026-05-14",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 13500
        },
        {
          "date": "2026-05-15",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 14457
        },
        {
          "date": "2026-05-18",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 18034
        },
        {
          "date": "2026-05-19",
          "close": 1994,
          "ratio": 0.997,
          "volume": 80081
        },
        {
          "date": "2026-05-20",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 20434
        },
        {
          "date": "2026-05-21",
          "close": 1996,
          "ratio": 0.998,
          "volume": 4778
        },
        {
          "date": "2026-05-22",
          "close": 1996,
          "ratio": 0.998,
          "volume": 1534
        },
        {
          "date": "2026-05-26",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 5711
        },
        {
          "date": "2026-05-27",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 10493
        },
        {
          "date": "2026-05-28",
          "close": 1996,
          "ratio": 0.998,
          "volume": 12794
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 9310
        },
        {
          "date": "2026-06-01",
          "close": 1990,
          "ratio": 0.995,
          "volume": 1004
        }
      ],
      "events": [
        {
          "date": "2025-11-27",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-11-27"
        },
        {
          "date": "2028-11-27",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩8호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0093G0"
    },
    {
      "id": "0072Z0",
      "code": "0072Z0",
      "name": "KB제33호스팩",
      "market": "KOSDAQ",
      "isin": "KR70072Z0006",
      "sponsor": "KB",
      "ipoPrice": 2000,
      "currentPrice": 1992,
      "change": -7,
      "changePct": -0.35,
      "ratio": 0.996,
      "premiumPct": -0.4,
      "volume": 276,
      "tradingValue": 1000000,
      "marketCap": 15706920000,
      "estimatedShares": 7885000,
      "listingDate": "2025-09-30",
      "liquidationDate": "2028-09-30",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 852,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.32,
      "annualizedReturn": 3.48,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "KB제33호스팩",
        "fullName": "케이비제33호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-09-30",
        "fiscalMonth": "12월",
        "ceo": "박성원",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0072Z0",
        "price": 1992,
        "change": -7,
        "changePct": -0.35,
        "volume": 276,
        "tradingValue": 1000000,
        "marketCap": 15706920000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.321421+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 10683
        },
        {
          "date": "2026-04-17",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 29226
        },
        {
          "date": "2026-04-20",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 6778
        },
        {
          "date": "2026-04-21",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 19098
        },
        {
          "date": "2026-04-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 6988
        },
        {
          "date": "2026-04-23",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 116606
        },
        {
          "date": "2026-04-24",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 9463
        },
        {
          "date": "2026-04-27",
          "close": 2000,
          "ratio": 1.0,
          "volume": 35586
        },
        {
          "date": "2026-04-28",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 15419
        },
        {
          "date": "2026-04-29",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 10648
        },
        {
          "date": "2026-04-30",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 2609
        },
        {
          "date": "2026-05-04",
          "close": 2000,
          "ratio": 1.0,
          "volume": 2660
        },
        {
          "date": "2026-05-06",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 26355
        },
        {
          "date": "2026-05-07",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 4345
        },
        {
          "date": "2026-05-08",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 12511
        },
        {
          "date": "2026-05-11",
          "close": 1996,
          "ratio": 0.998,
          "volume": 30935
        },
        {
          "date": "2026-05-12",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3864
        },
        {
          "date": "2026-05-13",
          "close": 2000,
          "ratio": 1.0,
          "volume": 90845
        },
        {
          "date": "2026-05-14",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 26949
        },
        {
          "date": "2026-05-15",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 7333
        },
        {
          "date": "2026-05-18",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 21282
        },
        {
          "date": "2026-05-19",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 6283
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 77839
        },
        {
          "date": "2026-05-21",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 2361
        },
        {
          "date": "2026-05-22",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 2010
        },
        {
          "date": "2026-05-26",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 2450
        },
        {
          "date": "2026-05-27",
          "close": 1994,
          "ratio": 0.997,
          "volume": 6840
        },
        {
          "date": "2026-05-28",
          "close": 2000,
          "ratio": 1.0,
          "volume": 10593
        },
        {
          "date": "2026-05-29",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 10091
        },
        {
          "date": "2026-06-01",
          "close": 1992,
          "ratio": 0.996,
          "volume": 276
        }
      ],
      "events": [
        {
          "date": "2025-09-30",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-09-30"
        },
        {
          "date": "2028-09-30",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=KB제33호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0072Z0"
    },
    {
      "id": "0096D0",
      "code": "0096D0",
      "name": "미래에셋비전스팩9호",
      "market": "KOSDAQ",
      "isin": "KR70096D0004",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 1993,
      "change": -5,
      "changePct": -0.25,
      "ratio": 0.9965,
      "premiumPct": -0.35,
      "volume": 3779,
      "tradingValue": 8000000,
      "marketCap": 10961500000,
      "estimatedShares": 5500000,
      "listingDate": "2025-12-01",
      "liquidationDate": "2028-12-01",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 914,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.26,
      "annualizedReturn": 3.22,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "미래에셋비전스팩9호",
        "fullName": "미래에셋비전기업인수목적9호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-12-01",
        "fiscalMonth": "12월",
        "ceo": "황리건",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0096D0",
        "price": 1993,
        "change": -5,
        "changePct": -0.25,
        "volume": 3779,
        "tradingValue": 8000000,
        "marketCap": 10961500000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.352659+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 6935
        },
        {
          "date": "2026-04-17",
          "close": 2010,
          "ratio": 1.005,
          "volume": 23380
        },
        {
          "date": "2026-04-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5672
        },
        {
          "date": "2026-04-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 43150
        },
        {
          "date": "2026-04-22",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3475
        },
        {
          "date": "2026-04-23",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 14074
        },
        {
          "date": "2026-04-24",
          "close": 2010,
          "ratio": 1.005,
          "volume": 18897
        },
        {
          "date": "2026-04-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 12597
        },
        {
          "date": "2026-04-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 21017
        },
        {
          "date": "2026-04-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 8849
        },
        {
          "date": "2026-04-30",
          "close": 2000,
          "ratio": 1.0,
          "volume": 881
        },
        {
          "date": "2026-05-04",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 14071
        },
        {
          "date": "2026-05-06",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 5134
        },
        {
          "date": "2026-05-07",
          "close": 2000,
          "ratio": 1.0,
          "volume": 8834
        },
        {
          "date": "2026-05-08",
          "close": 2000,
          "ratio": 1.0,
          "volume": 4348
        },
        {
          "date": "2026-05-11",
          "close": 2000,
          "ratio": 1.0,
          "volume": 84312
        },
        {
          "date": "2026-05-12",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 3684
        },
        {
          "date": "2026-05-13",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 17400
        },
        {
          "date": "2026-05-14",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 13973
        },
        {
          "date": "2026-05-15",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 40018
        },
        {
          "date": "2026-05-18",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 11448
        },
        {
          "date": "2026-05-19",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 18468
        },
        {
          "date": "2026-05-20",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 69956
        },
        {
          "date": "2026-05-21",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 3035
        },
        {
          "date": "2026-05-22",
          "close": 2000,
          "ratio": 1.0,
          "volume": 2689
        },
        {
          "date": "2026-05-26",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 2565
        },
        {
          "date": "2026-05-27",
          "close": 1994,
          "ratio": 0.997,
          "volume": 11833
        },
        {
          "date": "2026-05-28",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 10289
        },
        {
          "date": "2026-05-29",
          "close": 1998,
          "ratio": 0.999,
          "volume": 9127
        },
        {
          "date": "2026-06-01",
          "close": 1993,
          "ratio": 0.9965,
          "volume": 3779
        }
      ],
      "events": [
        {
          "date": "2025-12-01",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-01"
        },
        {
          "date": "2028-12-01",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩9호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0096D0"
    },
    {
      "id": "0115H0",
      "code": "0115H0",
      "name": "삼성스팩13호",
      "market": "KOSDAQ",
      "isin": "KR70115H0007",
      "sponsor": "삼성",
      "ipoPrice": 2000,
      "currentPrice": 1994,
      "change": -6,
      "changePct": -0.3,
      "ratio": 0.997,
      "premiumPct": -0.3,
      "volume": 28749,
      "tradingValue": 57000000,
      "marketCap": 14655900000,
      "estimatedShares": 7350000,
      "listingDate": "2026-01-21",
      "liquidationDate": "2029-01-21",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 965,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.21,
      "annualizedReturn": 3.03,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "삼성스팩13호",
        "fullName": "삼성기업인수목적13호(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2026-01-21",
        "fiscalMonth": "12월",
        "ceo": "성상환",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0115H0",
        "price": 1994,
        "change": -6,
        "changePct": -0.3,
        "volume": 28749,
        "tradingValue": 57000000,
        "marketCap": 14655900000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.457222+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2020,
          "ratio": 1.01,
          "volume": 56280
        },
        {
          "date": "2026-04-17",
          "close": 2040,
          "ratio": 1.02,
          "volume": 210164
        },
        {
          "date": "2026-04-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 37593
        },
        {
          "date": "2026-04-21",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 67638
        },
        {
          "date": "2026-04-22",
          "close": 2030,
          "ratio": 1.015,
          "volume": 25472
        },
        {
          "date": "2026-04-23",
          "close": 2020,
          "ratio": 1.01,
          "volume": 59588
        },
        {
          "date": "2026-04-24",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 45601
        },
        {
          "date": "2026-04-27",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 58587
        },
        {
          "date": "2026-04-28",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 37148
        },
        {
          "date": "2026-04-29",
          "close": 2020,
          "ratio": 1.01,
          "volume": 41303
        },
        {
          "date": "2026-04-30",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 43737
        },
        {
          "date": "2026-05-04",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 46738
        },
        {
          "date": "2026-05-06",
          "close": 2010,
          "ratio": 1.005,
          "volume": 56676
        },
        {
          "date": "2026-05-07",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 104251
        },
        {
          "date": "2026-05-08",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 32986
        },
        {
          "date": "2026-05-11",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 122287
        },
        {
          "date": "2026-05-12",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 37314
        },
        {
          "date": "2026-05-13",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 51354
        },
        {
          "date": "2026-05-14",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 36377
        },
        {
          "date": "2026-05-15",
          "close": 2000,
          "ratio": 1.0,
          "volume": 65319
        },
        {
          "date": "2026-05-18",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 51925
        },
        {
          "date": "2026-05-19",
          "close": 1998,
          "ratio": 0.999,
          "volume": 25170
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 70736
        },
        {
          "date": "2026-05-21",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 28960
        },
        {
          "date": "2026-05-22",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 24599
        },
        {
          "date": "2026-05-26",
          "close": 2000,
          "ratio": 1.0,
          "volume": 50104
        },
        {
          "date": "2026-05-27",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 27218
        },
        {
          "date": "2026-05-28",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 19558
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 54519
        },
        {
          "date": "2026-06-01",
          "close": 1994,
          "ratio": 0.997,
          "volume": 28749
        }
      ],
      "events": [
        {
          "date": "2026-01-21",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2026-01-21"
        },
        {
          "date": "2029-01-21",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=삼성스팩13호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0115H0"
    },
    {
      "id": "0101C0",
      "code": "0101C0",
      "name": "하나36호스팩",
      "market": "KOSDAQ",
      "isin": "KR70101C0008",
      "sponsor": "하나",
      "ipoPrice": 2000,
      "currentPrice": 1995,
      "change": -5,
      "changePct": -0.25,
      "ratio": 0.9975,
      "premiumPct": -0.25,
      "volume": 1315,
      "tradingValue": 3000000,
      "marketCap": 15441300000,
      "estimatedShares": 7740000,
      "listingDate": "2025-12-22",
      "liquidationDate": "2028-12-22",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 935,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.16,
      "annualizedReturn": 3.11,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "하나36호스팩",
        "fullName": "하나36호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-12-22",
        "fiscalMonth": "12월",
        "ceo": "박병기",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0101C0",
        "price": 1995,
        "change": -5,
        "changePct": -0.25,
        "volume": 1315,
        "tradingValue": 3000000,
        "marketCap": 15441300000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.923726+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 8294
        },
        {
          "date": "2026-04-17",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 60972
        },
        {
          "date": "2026-04-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 6326
        },
        {
          "date": "2026-04-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 8523
        },
        {
          "date": "2026-04-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5563
        },
        {
          "date": "2026-04-23",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 24249
        },
        {
          "date": "2026-04-24",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 22566
        },
        {
          "date": "2026-04-27",
          "close": 1998,
          "ratio": 0.999,
          "volume": 25724
        },
        {
          "date": "2026-04-28",
          "close": 1998,
          "ratio": 0.999,
          "volume": 60357
        },
        {
          "date": "2026-04-29",
          "close": 1998,
          "ratio": 0.999,
          "volume": 2599
        },
        {
          "date": "2026-04-30",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 2202
        },
        {
          "date": "2026-05-04",
          "close": 2000,
          "ratio": 1.0,
          "volume": 2824
        },
        {
          "date": "2026-05-06",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 6588
        },
        {
          "date": "2026-05-07",
          "close": 2000,
          "ratio": 1.0,
          "volume": 17134
        },
        {
          "date": "2026-05-08",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 7520
        },
        {
          "date": "2026-05-11",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 20584
        },
        {
          "date": "2026-05-12",
          "close": 1998,
          "ratio": 0.999,
          "volume": 22444
        },
        {
          "date": "2026-05-13",
          "close": 1998,
          "ratio": 0.999,
          "volume": 22214
        },
        {
          "date": "2026-05-14",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 3704
        },
        {
          "date": "2026-05-15",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 21836
        },
        {
          "date": "2026-05-18",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 18563
        },
        {
          "date": "2026-05-19",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 14675
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 18865
        },
        {
          "date": "2026-05-21",
          "close": 1993,
          "ratio": 0.9965,
          "volume": 1686
        },
        {
          "date": "2026-05-22",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 9162
        },
        {
          "date": "2026-05-26",
          "close": 1992,
          "ratio": 0.996,
          "volume": 17601
        },
        {
          "date": "2026-05-27",
          "close": 1998,
          "ratio": 0.999,
          "volume": 4125
        },
        {
          "date": "2026-05-28",
          "close": 1998,
          "ratio": 0.999,
          "volume": 9152
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 22069
        },
        {
          "date": "2026-06-01",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 54
        }
      ],
      "events": [
        {
          "date": "2025-12-22",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-22"
        },
        {
          "date": "2028-12-22",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=하나36호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0101C0"
    },
    {
      "id": "0068Y0",
      "code": "0068Y0",
      "name": "비엔케이제3호스팩",
      "market": "KOSDAQ",
      "isin": "KR70068Y0003",
      "sponsor": "비엔케이",
      "ipoPrice": 2000,
      "currentPrice": 1996,
      "change": -9,
      "changePct": -0.45,
      "ratio": 0.998,
      "premiumPct": -0.2,
      "volume": 4623,
      "tradingValue": 9000000,
      "marketCap": 8602760000,
      "estimatedShares": 4310000,
      "listingDate": "2025-11-21",
      "liquidationDate": "2028-11-21",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 904,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.1,
      "annualizedReturn": 3.2,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "비엔케이제3호스팩",
        "fullName": "비엔케이제3호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-11-21",
        "fiscalMonth": "12월",
        "ceo": "서이덕",
        "homepage": true,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0068Y0",
        "price": 1996,
        "change": -9,
        "changePct": -0.45,
        "volume": 4623,
        "tradingValue": 9000000,
        "marketCap": 8602760000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.352576+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 8868
        },
        {
          "date": "2026-04-17",
          "close": 2010,
          "ratio": 1.005,
          "volume": 8651
        },
        {
          "date": "2026-04-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 9691
        },
        {
          "date": "2026-04-21",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 14059
        },
        {
          "date": "2026-04-22",
          "close": 2020,
          "ratio": 1.01,
          "volume": 2170
        },
        {
          "date": "2026-04-23",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3388
        },
        {
          "date": "2026-04-24",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 22927
        },
        {
          "date": "2026-04-27",
          "close": 2000,
          "ratio": 1.0,
          "volume": 5513
        },
        {
          "date": "2026-04-28",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3273
        },
        {
          "date": "2026-04-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1029
        },
        {
          "date": "2026-04-30",
          "close": 2000,
          "ratio": 1.0,
          "volume": 11947
        },
        {
          "date": "2026-05-04",
          "close": 2000,
          "ratio": 1.0,
          "volume": 4588
        },
        {
          "date": "2026-05-06",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3264
        },
        {
          "date": "2026-05-07",
          "close": 2000,
          "ratio": 1.0,
          "volume": 4405
        },
        {
          "date": "2026-05-08",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1274
        },
        {
          "date": "2026-05-11",
          "close": 1996,
          "ratio": 0.998,
          "volume": 9553
        },
        {
          "date": "2026-05-12",
          "close": 1994,
          "ratio": 0.997,
          "volume": 1173
        },
        {
          "date": "2026-05-13",
          "close": 2000,
          "ratio": 1.0,
          "volume": 8726
        },
        {
          "date": "2026-05-14",
          "close": 1996,
          "ratio": 0.998,
          "volume": 3753
        },
        {
          "date": "2026-05-15",
          "close": 1996,
          "ratio": 0.998,
          "volume": 2286
        },
        {
          "date": "2026-05-18",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 13335
        },
        {
          "date": "2026-05-19",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 5321
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 2132
        },
        {
          "date": "2026-05-21",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 803
        },
        {
          "date": "2026-05-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 35014
        },
        {
          "date": "2026-05-26",
          "close": 2010,
          "ratio": 1.005,
          "volume": 384
        },
        {
          "date": "2026-05-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 102
        },
        {
          "date": "2026-05-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 447
        },
        {
          "date": "2026-05-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 777
        },
        {
          "date": "2026-06-01",
          "close": 1996,
          "ratio": 0.998,
          "volume": 4623
        }
      ],
      "events": [
        {
          "date": "2025-11-21",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-11-21"
        },
        {
          "date": "2028-11-21",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=비엔케이제3호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0068Y0"
    },
    {
      "id": "0130H0",
      "code": "0130H0",
      "name": "엔에이치스팩33호",
      "market": "KOSDAQ",
      "isin": "KR70130H0008",
      "sponsor": "엔에이치",
      "ipoPrice": 2000,
      "currentPrice": 1996,
      "change": -3,
      "changePct": -0.15,
      "ratio": 0.998,
      "premiumPct": -0.2,
      "volume": 4422,
      "tradingValue": 9000000,
      "marketCap": 15369200000,
      "estimatedShares": 7700000,
      "listingDate": "2026-03-27",
      "liquidationDate": "2029-03-27",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 1030,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 8.1,
      "annualizedReturn": 2.8,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "엔에이치스팩33호",
        "fullName": "엔에이치기업인수목적33호(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수",
        "listingDate": "2026-03-27",
        "fiscalMonth": "12월",
        "ceo": "남강욱",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0130H0",
        "price": 1996,
        "change": -3,
        "changePct": -0.15,
        "volume": 4422,
        "tradingValue": 9000000,
        "marketCap": 15369200000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.674161+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2010,
          "ratio": 1.005,
          "volume": 92920
        },
        {
          "date": "2026-04-17",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 101669
        },
        {
          "date": "2026-04-20",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 94015
        },
        {
          "date": "2026-04-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 163998
        },
        {
          "date": "2026-04-22",
          "close": 2020,
          "ratio": 1.01,
          "volume": 39794
        },
        {
          "date": "2026-04-23",
          "close": 2010,
          "ratio": 1.005,
          "volume": 38065
        },
        {
          "date": "2026-04-24",
          "close": 2010,
          "ratio": 1.005,
          "volume": 50343
        },
        {
          "date": "2026-04-27",
          "close": 2000,
          "ratio": 1.0,
          "volume": 124103
        },
        {
          "date": "2026-04-28",
          "close": 2000,
          "ratio": 1.0,
          "volume": 80598
        },
        {
          "date": "2026-04-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 45350
        },
        {
          "date": "2026-04-30",
          "close": 1998,
          "ratio": 0.999,
          "volume": 44030
        },
        {
          "date": "2026-05-04",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 36908
        },
        {
          "date": "2026-05-06",
          "close": 2000,
          "ratio": 1.0,
          "volume": 58384
        },
        {
          "date": "2026-05-07",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 62585
        },
        {
          "date": "2026-05-08",
          "close": 2000,
          "ratio": 1.0,
          "volume": 21972
        },
        {
          "date": "2026-05-11",
          "close": 2000,
          "ratio": 1.0,
          "volume": 51286
        },
        {
          "date": "2026-05-12",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 44690
        },
        {
          "date": "2026-05-13",
          "close": 2000,
          "ratio": 1.0,
          "volume": 50651
        },
        {
          "date": "2026-05-14",
          "close": 1998,
          "ratio": 0.999,
          "volume": 43959
        },
        {
          "date": "2026-05-15",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 41822
        },
        {
          "date": "2026-05-18",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 17744
        },
        {
          "date": "2026-05-19",
          "close": 2000,
          "ratio": 1.0,
          "volume": 89518
        },
        {
          "date": "2026-05-20",
          "close": 1998,
          "ratio": 0.999,
          "volume": 21439
        },
        {
          "date": "2026-05-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 39668
        },
        {
          "date": "2026-05-22",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 18438
        },
        {
          "date": "2026-05-26",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 44859
        },
        {
          "date": "2026-05-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 22720
        },
        {
          "date": "2026-05-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 12049
        },
        {
          "date": "2026-05-29",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 35059
        },
        {
          "date": "2026-06-01",
          "close": 1996,
          "ratio": 0.998,
          "volume": 3622
        }
      ],
      "events": [
        {
          "date": "2026-03-27",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2026-03-27"
        },
        {
          "date": "2029-03-27",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=엔에이치스팩33호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0130H0"
    },
    {
      "id": "0096B0",
      "code": "0096B0",
      "name": "삼성스팩12호",
      "market": "KOSDAQ",
      "isin": "KR70096B0006",
      "sponsor": "삼성",
      "ipoPrice": 2000,
      "currentPrice": 1998,
      "change": -2,
      "changePct": -0.1,
      "ratio": 0.999,
      "premiumPct": -0.1,
      "volume": 386,
      "tradingValue": 1000000,
      "marketCap": 13146840000,
      "estimatedShares": 6580000,
      "listingDate": "2025-11-28",
      "liquidationDate": "2028-11-28",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 911,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.99,
      "annualizedReturn": 3.13,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "삼성스팩12호",
        "fullName": "삼성기업인수목적12호(주)",
        "industry": "기타 금융업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-11-28",
        "fiscalMonth": "12월",
        "ceo": "김영제",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0096B0",
        "price": 1998,
        "change": -2,
        "changePct": -0.1,
        "volume": 386,
        "tradingValue": 1000000,
        "marketCap": 13146840000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.430055+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 36834
        },
        {
          "date": "2026-04-17",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 131472
        },
        {
          "date": "2026-04-20",
          "close": 2020,
          "ratio": 1.01,
          "volume": 7993
        },
        {
          "date": "2026-04-21",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 18229
        },
        {
          "date": "2026-04-22",
          "close": 2020,
          "ratio": 1.01,
          "volume": 12017
        },
        {
          "date": "2026-04-23",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 11995
        },
        {
          "date": "2026-04-24",
          "close": 2020,
          "ratio": 1.01,
          "volume": 40018
        },
        {
          "date": "2026-04-27",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 9189
        },
        {
          "date": "2026-04-28",
          "close": 2010,
          "ratio": 1.005,
          "volume": 34700
        },
        {
          "date": "2026-04-29",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 50480
        },
        {
          "date": "2026-04-30",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 29801
        },
        {
          "date": "2026-05-04",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 28331
        },
        {
          "date": "2026-05-06",
          "close": 2010,
          "ratio": 1.005,
          "volume": 40059
        },
        {
          "date": "2026-05-07",
          "close": 2010,
          "ratio": 1.005,
          "volume": 22333
        },
        {
          "date": "2026-05-08",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 21318
        },
        {
          "date": "2026-05-11",
          "close": 2000,
          "ratio": 1.0,
          "volume": 57352
        },
        {
          "date": "2026-05-12",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 51268
        },
        {
          "date": "2026-05-13",
          "close": 2000,
          "ratio": 1.0,
          "volume": 16935
        },
        {
          "date": "2026-05-14",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 20431
        },
        {
          "date": "2026-05-15",
          "close": 2000,
          "ratio": 1.0,
          "volume": 42165
        },
        {
          "date": "2026-05-18",
          "close": 2000,
          "ratio": 1.0,
          "volume": 46712
        },
        {
          "date": "2026-05-19",
          "close": 2000,
          "ratio": 1.0,
          "volume": 32528
        },
        {
          "date": "2026-05-20",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 41187
        },
        {
          "date": "2026-05-21",
          "close": 1998,
          "ratio": 0.999,
          "volume": 17255
        },
        {
          "date": "2026-05-22",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 8172
        },
        {
          "date": "2026-05-26",
          "close": 2000,
          "ratio": 1.0,
          "volume": 25319
        },
        {
          "date": "2026-05-27",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 15110
        },
        {
          "date": "2026-05-28",
          "close": 1996,
          "ratio": 0.998,
          "volume": 23090
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 40320
        },
        {
          "date": "2026-06-01",
          "close": 1998,
          "ratio": 0.999,
          "volume": 386
        }
      ],
      "events": [
        {
          "date": "2025-11-28",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-11-28"
        },
        {
          "date": "2028-11-28",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=삼성스팩12호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0096B0"
    },
    {
      "id": "0041J0",
      "code": "0041J0",
      "name": "엘에스스팩1호",
      "market": "KOSDAQ",
      "isin": "KR70041J0004",
      "sponsor": "엘에스",
      "ipoPrice": 2000,
      "currentPrice": 1998,
      "change": -22,
      "changePct": -1.09,
      "ratio": 0.999,
      "premiumPct": -0.1,
      "volume": 1777,
      "tradingValue": 4000000,
      "marketCap": 8211780000,
      "estimatedShares": 4110000,
      "listingDate": "2025-07-22",
      "liquidationDate": "2028-07-22",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 782,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.99,
      "annualizedReturn": 3.65,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "엘에스스팩1호",
        "fullName": "엘에스기업인수목적1호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-07-22",
        "fiscalMonth": "12월",
        "ceo": "이정국",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0041J0",
        "price": 1998,
        "change": -22,
        "changePct": -1.09,
        "volume": 1777,
        "tradingValue": 4000000,
        "marketCap": 8211780000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.735599+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2010,
          "ratio": 1.005,
          "volume": 4373
        },
        {
          "date": "2026-04-17",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5888
        },
        {
          "date": "2026-04-20",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 3750
        },
        {
          "date": "2026-04-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 664
        },
        {
          "date": "2026-04-22",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 711
        },
        {
          "date": "2026-04-23",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 2001
        },
        {
          "date": "2026-04-24",
          "close": 2010,
          "ratio": 1.005,
          "volume": 17124
        },
        {
          "date": "2026-04-27",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 14328
        },
        {
          "date": "2026-04-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3077
        },
        {
          "date": "2026-04-29",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 20695
        },
        {
          "date": "2026-04-30",
          "close": 2000,
          "ratio": 1.0,
          "volume": 29941
        },
        {
          "date": "2026-05-04",
          "close": 2000,
          "ratio": 1.0,
          "volume": 805
        },
        {
          "date": "2026-05-06",
          "close": 2010,
          "ratio": 1.005,
          "volume": 20521
        },
        {
          "date": "2026-05-07",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1467
        },
        {
          "date": "2026-05-08",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4600
        },
        {
          "date": "2026-05-11",
          "close": 2000,
          "ratio": 1.0,
          "volume": 29365
        },
        {
          "date": "2026-05-12",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1913
        },
        {
          "date": "2026-05-13",
          "close": 2010,
          "ratio": 1.005,
          "volume": 11709
        },
        {
          "date": "2026-05-14",
          "close": 2010,
          "ratio": 1.005,
          "volume": 58
        },
        {
          "date": "2026-05-15",
          "close": 2000,
          "ratio": 1.0,
          "volume": 17829
        },
        {
          "date": "2026-05-18",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 8341
        },
        {
          "date": "2026-05-19",
          "close": 2000,
          "ratio": 1.0,
          "volume": 7933
        },
        {
          "date": "2026-05-20",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 22478
        },
        {
          "date": "2026-05-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 394
        },
        {
          "date": "2026-05-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 730
        },
        {
          "date": "2026-05-26",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3051
        },
        {
          "date": "2026-05-27",
          "close": 2000,
          "ratio": 1.0,
          "volume": 5562
        },
        {
          "date": "2026-05-28",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 864
        },
        {
          "date": "2026-05-29",
          "close": 2020,
          "ratio": 1.01,
          "volume": 22940
        },
        {
          "date": "2026-06-01",
          "close": 1998,
          "ratio": 0.999,
          "volume": 1777
        }
      ],
      "events": [
        {
          "date": "2025-07-22",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-07-22"
        },
        {
          "date": "2028-07-22",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=엘에스스팩1호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0041J0"
    },
    {
      "id": "0105P0",
      "code": "0105P0",
      "name": "유진스팩12호",
      "market": "KOSDAQ",
      "isin": "KR70105P0009",
      "sponsor": "유진",
      "ipoPrice": 2000,
      "currentPrice": 1998,
      "change": 0,
      "changePct": 0.0,
      "ratio": 0.999,
      "premiumPct": -0.1,
      "volume": null,
      "tradingValue": null,
      "marketCap": 11308680000,
      "estimatedShares": 5660000,
      "listingDate": "2025-12-11",
      "liquidationDate": "2028-12-11",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 924,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.99,
      "annualizedReturn": 3.08,
      "status": "공모가 이하",
      "badges": [
        "공모가 이하"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "유진스팩12호",
        "fullName": "유진기업인수목적12호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "합병",
        "listingDate": "2025-12-11",
        "fiscalMonth": "12월",
        "ceo": "안용아",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0105P0",
        "price": 1998,
        "change": 0,
        "changePct": 0.0,
        "volume": null,
        "tradingValue": null,
        "marketCap": 11308680000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.80646+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3027
        },
        {
          "date": "2026-04-17",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1556
        },
        {
          "date": "2026-04-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3523
        },
        {
          "date": "2026-04-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1378
        },
        {
          "date": "2026-04-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3212
        },
        {
          "date": "2026-04-23",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3312
        },
        {
          "date": "2026-04-24",
          "close": 2010,
          "ratio": 1.005,
          "volume": 25968
        },
        {
          "date": "2026-04-27",
          "close": 2010,
          "ratio": 1.005,
          "volume": 11909
        },
        {
          "date": "2026-04-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 22709
        },
        {
          "date": "2026-04-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1487
        },
        {
          "date": "2026-04-30",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3202
        },
        {
          "date": "2026-05-04",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3503
        },
        {
          "date": "2026-05-06",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 7982
        },
        {
          "date": "2026-05-07",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1915
        },
        {
          "date": "2026-05-08",
          "close": 2000,
          "ratio": 1.0,
          "volume": 2433
        },
        {
          "date": "2026-05-11",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 5641
        },
        {
          "date": "2026-05-12",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 4610
        },
        {
          "date": "2026-05-13",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 10350
        },
        {
          "date": "2026-05-14",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 1067
        },
        {
          "date": "2026-05-15",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 1744
        },
        {
          "date": "2026-05-18",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 2838
        },
        {
          "date": "2026-05-19",
          "close": 1996,
          "ratio": 0.998,
          "volume": 9767
        },
        {
          "date": "2026-05-20",
          "close": 1996,
          "ratio": 0.998,
          "volume": 6500
        },
        {
          "date": "2026-05-21",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 2156
        },
        {
          "date": "2026-05-22",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 2584
        },
        {
          "date": "2026-05-26",
          "close": 2000,
          "ratio": 1.0,
          "volume": 4853
        },
        {
          "date": "2026-05-27",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 5081
        },
        {
          "date": "2026-05-28",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 1022
        },
        {
          "date": "2026-05-29",
          "close": 1998,
          "ratio": 0.999,
          "volume": 23621
        },
        {
          "date": "2026-06-01",
          "close": 1998,
          "ratio": 0.999,
          "volume": 0
        }
      ],
      "events": [
        {
          "date": "2025-12-11",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-11"
        },
        {
          "date": "2028-12-11",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=유진스팩12호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0105P0"
    },
    {
      "id": "0037T0",
      "code": "0037T0",
      "name": "KB제32호스팩",
      "market": "KOSDAQ",
      "isin": "KR70037T0008",
      "sponsor": "KB",
      "ipoPrice": 2000,
      "currentPrice": 2000,
      "change": -10,
      "changePct": -0.5,
      "ratio": 1.0,
      "premiumPct": 0.0,
      "volume": 1103,
      "tradingValue": 2000000,
      "marketCap": 12660000000,
      "estimatedShares": 6330000,
      "listingDate": "2025-07-04",
      "liquidationDate": "2028-07-04",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 764,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.89,
      "annualizedReturn": 3.69,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "KB제32호스팩",
        "fullName": "케이비제32호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-07-04",
        "fiscalMonth": "12월",
        "ceo": "김세준",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0037T0",
        "price": 2000,
        "change": -10,
        "changePct": -0.5,
        "volume": 1103,
        "tradingValue": 2000000,
        "marketCap": 12660000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.096946+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 6241
        },
        {
          "date": "2026-04-17",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 7937
        },
        {
          "date": "2026-04-20",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 11230
        },
        {
          "date": "2026-04-21",
          "close": 2020,
          "ratio": 1.01,
          "volume": 5155
        },
        {
          "date": "2026-04-22",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1489
        },
        {
          "date": "2026-04-23",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 6454
        },
        {
          "date": "2026-04-24",
          "close": 2020,
          "ratio": 1.01,
          "volume": 7831
        },
        {
          "date": "2026-04-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 26212
        },
        {
          "date": "2026-04-28",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1252
        },
        {
          "date": "2026-04-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 842
        },
        {
          "date": "2026-04-30",
          "close": 2010,
          "ratio": 1.005,
          "volume": 585
        },
        {
          "date": "2026-05-04",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 2489
        },
        {
          "date": "2026-05-06",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 20514
        },
        {
          "date": "2026-05-07",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4547
        },
        {
          "date": "2026-05-08",
          "close": 2010,
          "ratio": 1.005,
          "volume": 2563
        },
        {
          "date": "2026-05-11",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 16821
        },
        {
          "date": "2026-05-12",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5830
        },
        {
          "date": "2026-05-13",
          "close": 2010,
          "ratio": 1.005,
          "volume": 7159
        },
        {
          "date": "2026-05-14",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1816
        },
        {
          "date": "2026-05-15",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 7815
        },
        {
          "date": "2026-05-18",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 6749
        },
        {
          "date": "2026-05-19",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 31032
        },
        {
          "date": "2026-05-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 17087
        },
        {
          "date": "2026-05-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 7066
        },
        {
          "date": "2026-05-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 286
        },
        {
          "date": "2026-05-26",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 7152
        },
        {
          "date": "2026-05-27",
          "close": 2000,
          "ratio": 1.0,
          "volume": 9751
        },
        {
          "date": "2026-05-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3644
        },
        {
          "date": "2026-05-29",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5714
        },
        {
          "date": "2026-06-01",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1103
        }
      ],
      "events": [
        {
          "date": "2025-07-04",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-07-04"
        },
        {
          "date": "2028-07-04",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=KB제32호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0037T0"
    },
    {
      "id": "0004Y0",
      "code": "0004Y0",
      "name": "디비금융제14호스팩",
      "market": "KOSDAQ",
      "isin": "KR70004Y0000",
      "sponsor": "디비금융",
      "ipoPrice": 2000,
      "currentPrice": 2000,
      "change": -5,
      "changePct": -0.25,
      "ratio": 1.0,
      "premiumPct": 0.0,
      "volume": 1725,
      "tradingValue": 3000000,
      "marketCap": 10630000000,
      "estimatedShares": 5315000,
      "listingDate": "2025-07-22",
      "liquidationDate": "2028-07-22",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 782,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.89,
      "annualizedReturn": 3.61,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "디비금융제14호스팩",
        "fullName": "디비금융제14호기업인수목적 주식회사",
        "industry": "기타 금융업",
        "mainProduct": "기업인수목적회사",
        "listingDate": "2025-07-22",
        "fiscalMonth": "12월",
        "ceo": "황선국",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0004Y0",
        "price": 2000,
        "change": -5,
        "changePct": -0.25,
        "volume": 1725,
        "tradingValue": 3000000,
        "marketCap": 10630000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.201107+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2050,
          "ratio": 1.025,
          "volume": 3163
        },
        {
          "date": "2026-04-17",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2200
        },
        {
          "date": "2026-04-20",
          "close": 2040,
          "ratio": 1.02,
          "volume": 8865
        },
        {
          "date": "2026-04-21",
          "close": 2040,
          "ratio": 1.02,
          "volume": 644
        },
        {
          "date": "2026-04-22",
          "close": 2040,
          "ratio": 1.02,
          "volume": 3697
        },
        {
          "date": "2026-04-23",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 7568
        },
        {
          "date": "2026-04-24",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 5721
        },
        {
          "date": "2026-04-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 3202
        },
        {
          "date": "2026-04-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 5126
        },
        {
          "date": "2026-04-29",
          "close": 2027,
          "ratio": 1.0135,
          "volume": 12120
        },
        {
          "date": "2026-04-30",
          "close": 2030,
          "ratio": 1.015,
          "volume": 2029
        },
        {
          "date": "2026-05-04",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 24761
        },
        {
          "date": "2026-05-06",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 15413
        },
        {
          "date": "2026-05-07",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 3046
        },
        {
          "date": "2026-05-08",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 615
        },
        {
          "date": "2026-05-11",
          "close": 2020,
          "ratio": 1.01,
          "volume": 11691
        },
        {
          "date": "2026-05-12",
          "close": 2020,
          "ratio": 1.01,
          "volume": 45569
        },
        {
          "date": "2026-05-13",
          "close": 2020,
          "ratio": 1.01,
          "volume": 722
        },
        {
          "date": "2026-05-14",
          "close": 2020,
          "ratio": 1.01,
          "volume": 29153
        },
        {
          "date": "2026-05-15",
          "close": 2007,
          "ratio": 1.0035,
          "volume": 13247
        },
        {
          "date": "2026-05-18",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 10831
        },
        {
          "date": "2026-05-19",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 8451
        },
        {
          "date": "2026-05-20",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 584
        },
        {
          "date": "2026-05-21",
          "close": 2020,
          "ratio": 1.01,
          "volume": 694
        },
        {
          "date": "2026-05-22",
          "close": 2020,
          "ratio": 1.01,
          "volume": 451
        },
        {
          "date": "2026-05-26",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 3618
        },
        {
          "date": "2026-05-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 9599
        },
        {
          "date": "2026-05-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4720
        },
        {
          "date": "2026-05-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 5867
        },
        {
          "date": "2026-06-01",
          "close": 2000,
          "ratio": 1.0,
          "volume": 1725
        }
      ],
      "events": [
        {
          "date": "2025-07-22",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-07-22"
        },
        {
          "date": "2028-07-22",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=디비금융제14호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0004Y0"
    },
    {
      "id": "0097F0",
      "code": "0097F0",
      "name": "미래에셋비전스팩10호",
      "market": "KOSDAQ",
      "isin": "KR70097F0001",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 2000,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0,
      "premiumPct": 0.0,
      "volume": 121,
      "tradingValue": null,
      "marketCap": 13000000000,
      "estimatedShares": 6500000,
      "listingDate": "2025-12-23",
      "liquidationDate": "2028-12-23",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 936,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.89,
      "annualizedReturn": 3.0,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "미래에셋비전스팩10호",
        "fullName": "미래에셋비전기업인수목적10호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-12-23",
        "fiscalMonth": "12월",
        "ceo": "윤태원",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0097F0",
        "price": 2000,
        "change": 0,
        "changePct": 0.0,
        "volume": 121,
        "tradingValue": null,
        "marketCap": 13000000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.225474+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2000,
          "ratio": 1.0,
          "volume": 7991
        },
        {
          "date": "2026-04-17",
          "close": 2010,
          "ratio": 1.005,
          "volume": 138362
        },
        {
          "date": "2026-04-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 32216
        },
        {
          "date": "2026-04-21",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 2940
        },
        {
          "date": "2026-04-22",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 6249
        },
        {
          "date": "2026-04-23",
          "close": 2000,
          "ratio": 1.0,
          "volume": 9602
        },
        {
          "date": "2026-04-24",
          "close": 2000,
          "ratio": 1.0,
          "volume": 19028
        },
        {
          "date": "2026-04-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 10244
        },
        {
          "date": "2026-04-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 59300
        },
        {
          "date": "2026-04-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 9014
        },
        {
          "date": "2026-04-30",
          "close": 1998,
          "ratio": 0.999,
          "volume": 7072
        },
        {
          "date": "2026-05-04",
          "close": 1998,
          "ratio": 0.999,
          "volume": 1330
        },
        {
          "date": "2026-05-06",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 7368
        },
        {
          "date": "2026-05-07",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 3875
        },
        {
          "date": "2026-05-08",
          "close": 2000,
          "ratio": 1.0,
          "volume": 4186
        },
        {
          "date": "2026-05-11",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 40397
        },
        {
          "date": "2026-05-12",
          "close": 1991,
          "ratio": 0.9955,
          "volume": 8417
        },
        {
          "date": "2026-05-13",
          "close": 2000,
          "ratio": 1.0,
          "volume": 34136
        },
        {
          "date": "2026-05-14",
          "close": 1998,
          "ratio": 0.999,
          "volume": 2337
        },
        {
          "date": "2026-05-15",
          "close": 1992,
          "ratio": 0.996,
          "volume": 24858
        },
        {
          "date": "2026-05-18",
          "close": 1993,
          "ratio": 0.9965,
          "volume": 25693
        },
        {
          "date": "2026-05-19",
          "close": 1994,
          "ratio": 0.997,
          "volume": 32314
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 22626
        },
        {
          "date": "2026-05-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 18156
        },
        {
          "date": "2026-05-22",
          "close": 1998,
          "ratio": 0.999,
          "volume": 2847
        },
        {
          "date": "2026-05-26",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 1979
        },
        {
          "date": "2026-05-27",
          "close": 1996,
          "ratio": 0.998,
          "volume": 10266
        },
        {
          "date": "2026-05-28",
          "close": 1998,
          "ratio": 0.999,
          "volume": 7975
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 33102
        },
        {
          "date": "2026-06-01",
          "close": 2000,
          "ratio": 1.0,
          "volume": 121
        }
      ],
      "events": [
        {
          "date": "2025-12-23",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-23"
        },
        {
          "date": "2028-12-23",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩10호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0097F0"
    },
    {
      "id": "0099W0",
      "code": "0099W0",
      "name": "미래에셋비전스팩11호",
      "market": "KOSDAQ",
      "isin": "KR70099W0008",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 2000,
      "change": -5,
      "changePct": -0.25,
      "ratio": 1.0,
      "premiumPct": 0.0,
      "volume": 131,
      "tradingValue": null,
      "marketCap": 14000000000,
      "estimatedShares": 7000000,
      "listingDate": "2025-12-22",
      "liquidationDate": "2028-12-22",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 935,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.89,
      "annualizedReturn": 3.01,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "미래에셋비전스팩11호",
        "fullName": "미래에셋비전기업인수목적11호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-12-22",
        "fiscalMonth": "12월",
        "ceo": "김양태",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0099W0",
        "price": 2000,
        "change": -5,
        "changePct": -0.25,
        "volume": 131,
        "tradingValue": null,
        "marketCap": 14000000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.231847+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2010,
          "ratio": 1.005,
          "volume": 9632
        },
        {
          "date": "2026-04-17",
          "close": 2010,
          "ratio": 1.005,
          "volume": 120006
        },
        {
          "date": "2026-04-20",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 23169
        },
        {
          "date": "2026-04-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 46624
        },
        {
          "date": "2026-04-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3800
        },
        {
          "date": "2026-04-23",
          "close": 2000,
          "ratio": 1.0,
          "volume": 15216
        },
        {
          "date": "2026-04-24",
          "close": 2000,
          "ratio": 1.0,
          "volume": 23326
        },
        {
          "date": "2026-04-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 25575
        },
        {
          "date": "2026-04-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 26689
        },
        {
          "date": "2026-04-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 1316
        },
        {
          "date": "2026-04-30",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 5856
        },
        {
          "date": "2026-05-04",
          "close": 2000,
          "ratio": 1.0,
          "volume": 13950
        },
        {
          "date": "2026-05-06",
          "close": 1996,
          "ratio": 0.998,
          "volume": 19782
        },
        {
          "date": "2026-05-07",
          "close": 2000,
          "ratio": 1.0,
          "volume": 5691
        },
        {
          "date": "2026-05-08",
          "close": 2000,
          "ratio": 1.0,
          "volume": 11676
        },
        {
          "date": "2026-05-11",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 40736
        },
        {
          "date": "2026-05-12",
          "close": 1997,
          "ratio": 0.9985,
          "volume": 12684
        },
        {
          "date": "2026-05-13",
          "close": 1993,
          "ratio": 0.9965,
          "volume": 40224
        },
        {
          "date": "2026-05-14",
          "close": 1994,
          "ratio": 0.997,
          "volume": 5012
        },
        {
          "date": "2026-05-15",
          "close": 1993,
          "ratio": 0.9965,
          "volume": 13859
        },
        {
          "date": "2026-05-18",
          "close": 1994,
          "ratio": 0.997,
          "volume": 22321
        },
        {
          "date": "2026-05-19",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 37763
        },
        {
          "date": "2026-05-20",
          "close": 1996,
          "ratio": 0.998,
          "volume": 65670
        },
        {
          "date": "2026-05-21",
          "close": 1998,
          "ratio": 0.999,
          "volume": 19002
        },
        {
          "date": "2026-05-22",
          "close": 1998,
          "ratio": 0.999,
          "volume": 9970
        },
        {
          "date": "2026-05-26",
          "close": 1996,
          "ratio": 0.998,
          "volume": 8539
        },
        {
          "date": "2026-05-27",
          "close": 1999,
          "ratio": 0.9995,
          "volume": 1099
        },
        {
          "date": "2026-05-28",
          "close": 1995,
          "ratio": 0.9975,
          "volume": 8751
        },
        {
          "date": "2026-05-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 21481
        },
        {
          "date": "2026-06-01",
          "close": 2000,
          "ratio": 1.0,
          "volume": 131
        }
      ],
      "events": [
        {
          "date": "2025-12-22",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-22"
        },
        {
          "date": "2028-12-22",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩11호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0099W0"
    },
    {
      "id": "0044K0",
      "code": "0044K0",
      "name": "삼성스팩10호",
      "market": "KOSDAQ",
      "isin": "KR70044K0008",
      "sponsor": "삼성",
      "ipoPrice": 2000,
      "currentPrice": 2000,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0,
      "premiumPct": 0.0,
      "volume": 666,
      "tradingValue": 1000000,
      "marketCap": 15040000000,
      "estimatedShares": 7520000,
      "listingDate": "2025-08-21",
      "liquidationDate": "2028-08-21",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 812,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.89,
      "annualizedReturn": 3.47,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "삼성스팩10호",
        "fullName": "삼성기업인수목적10호(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-08-21",
        "fiscalMonth": "12월",
        "ceo": "남궁혁",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0044K0",
        "price": 2000,
        "change": 0,
        "changePct": 0.0,
        "volume": 666,
        "tradingValue": 1000000,
        "marketCap": 15040000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.72209+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 6785
        },
        {
          "date": "2026-04-17",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 8283
        },
        {
          "date": "2026-04-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 27813
        },
        {
          "date": "2026-04-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 7340
        },
        {
          "date": "2026-04-22",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 66335
        },
        {
          "date": "2026-04-23",
          "close": 2030,
          "ratio": 1.015,
          "volume": 98372
        },
        {
          "date": "2026-04-24",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1391
        },
        {
          "date": "2026-04-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 11105
        },
        {
          "date": "2026-04-28",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 13441
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 36508
        },
        {
          "date": "2026-04-30",
          "close": 2040,
          "ratio": 1.02,
          "volume": 14562
        },
        {
          "date": "2026-05-04",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 4066
        },
        {
          "date": "2026-05-06",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 24706
        },
        {
          "date": "2026-05-07",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 2853
        },
        {
          "date": "2026-05-08",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 2154
        },
        {
          "date": "2026-05-11",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 31353
        },
        {
          "date": "2026-05-12",
          "close": 2010,
          "ratio": 1.005,
          "volume": 27450
        },
        {
          "date": "2026-05-13",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 58832
        },
        {
          "date": "2026-05-14",
          "close": 2010,
          "ratio": 1.005,
          "volume": 13363
        },
        {
          "date": "2026-05-15",
          "close": 2010,
          "ratio": 1.005,
          "volume": 62854
        },
        {
          "date": "2026-05-18",
          "close": 2010,
          "ratio": 1.005,
          "volume": 24380
        },
        {
          "date": "2026-05-19",
          "close": 2000,
          "ratio": 1.0,
          "volume": 14337
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 73829
        },
        {
          "date": "2026-05-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3454
        },
        {
          "date": "2026-05-22",
          "close": 2000,
          "ratio": 1.0,
          "volume": 7896
        },
        {
          "date": "2026-05-26",
          "close": 2000,
          "ratio": 1.0,
          "volume": 24282
        },
        {
          "date": "2026-05-27",
          "close": 2010,
          "ratio": 1.005,
          "volume": 9650
        },
        {
          "date": "2026-05-28",
          "close": 2000,
          "ratio": 1.0,
          "volume": 86085
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 31978
        },
        {
          "date": "2026-06-01",
          "close": 2000,
          "ratio": 1.0,
          "volume": 666
        }
      ],
      "events": [
        {
          "date": "2025-08-21",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-08-21"
        },
        {
          "date": "2028-08-21",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=삼성스팩10호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0044K0"
    },
    {
      "id": "466690",
      "code": "466690",
      "name": "키움히어로제1호스팩",
      "market": "KOSDAQ",
      "isin": "KR7466690005",
      "sponsor": "키움히어로",
      "ipoPrice": 2000,
      "currentPrice": 2000,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0,
      "premiumPct": 0.0,
      "volume": 15,
      "tradingValue": null,
      "marketCap": 10190000000,
      "estimatedShares": 5095000,
      "listingDate": "2025-12-12",
      "liquidationDate": "2028-12-12",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 925,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.89,
      "annualizedReturn": 3.04,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "키움히어로제1호스팩",
        "fullName": "키움히어로제1호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "다른 회사와 인수합병",
        "listingDate": "2025-12-12",
        "fiscalMonth": "12월",
        "ceo": "고명진",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "466690",
        "price": 2000,
        "change": 0,
        "changePct": 0.0,
        "volume": 15,
        "tradingValue": null,
        "marketCap": 10190000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.846698+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2060,
          "ratio": 1.03,
          "volume": 23566
        },
        {
          "date": "2026-04-17",
          "close": 2040,
          "ratio": 1.02,
          "volume": 20419
        },
        {
          "date": "2026-04-20",
          "close": 2040,
          "ratio": 1.02,
          "volume": 5575
        },
        {
          "date": "2026-04-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1857
        },
        {
          "date": "2026-04-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5175
        },
        {
          "date": "2026-04-23",
          "close": 2030,
          "ratio": 1.015,
          "volume": 116601
        },
        {
          "date": "2026-04-24",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 44324
        },
        {
          "date": "2026-04-27",
          "close": 2020,
          "ratio": 1.01,
          "volume": 31116
        },
        {
          "date": "2026-04-28",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 23886
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 23228
        },
        {
          "date": "2026-04-30",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 3747
        },
        {
          "date": "2026-05-04",
          "close": 2020,
          "ratio": 1.01,
          "volume": 3346
        },
        {
          "date": "2026-05-06",
          "close": 2010,
          "ratio": 1.005,
          "volume": 24500
        },
        {
          "date": "2026-05-07",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4818
        },
        {
          "date": "2026-05-08",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 4304
        },
        {
          "date": "2026-05-11",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 34972
        },
        {
          "date": "2026-05-12",
          "close": 2010,
          "ratio": 1.005,
          "volume": 4893
        },
        {
          "date": "2026-05-13",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 6382
        },
        {
          "date": "2026-05-14",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 21000
        },
        {
          "date": "2026-05-15",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3756
        },
        {
          "date": "2026-05-18",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 15921
        },
        {
          "date": "2026-05-19",
          "close": 2000,
          "ratio": 1.0,
          "volume": 11613
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 15668
        },
        {
          "date": "2026-05-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3080
        },
        {
          "date": "2026-05-22",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4936
        },
        {
          "date": "2026-05-26",
          "close": 2000,
          "ratio": 1.0,
          "volume": 4060
        },
        {
          "date": "2026-05-27",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3626
        },
        {
          "date": "2026-05-28",
          "close": 2010,
          "ratio": 1.005,
          "volume": 2838
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 8294
        },
        {
          "date": "2026-06-01",
          "close": 2000,
          "ratio": 1.0,
          "volume": 15
        }
      ],
      "events": [
        {
          "date": "2025-12-12",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-12"
        },
        {
          "date": "2028-12-12",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=키움히어로제1호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=466690"
    },
    {
      "id": "487360",
      "code": "487360",
      "name": "신한제14호스팩",
      "market": "KOSDAQ",
      "isin": "KR7487360000",
      "sponsor": "신한",
      "ipoPrice": 2000,
      "currentPrice": 2005,
      "change": -25,
      "changePct": -1.23,
      "ratio": 1.0025,
      "premiumPct": 0.25,
      "volume": 250,
      "tradingValue": 1000000,
      "marketCap": 11308200000,
      "estimatedShares": 5640000,
      "listingDate": "2024-12-23",
      "liquidationDate": "2027-12-23",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 570,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.61,
      "annualizedReturn": 4.81,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신한제14호스팩",
        "fullName": "신한제14호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스업",
        "listingDate": "2024-12-23",
        "fiscalMonth": "12월",
        "ceo": "홍승표",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "487360",
        "price": 2005,
        "change": -25,
        "changePct": -1.23,
        "volume": 250,
        "tradingValue": 1000000,
        "marketCap": 11308200000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.51191+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 1573
        },
        {
          "date": "2026-04-17",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 26805
        },
        {
          "date": "2026-04-20",
          "close": 2040,
          "ratio": 1.02,
          "volume": 11275
        },
        {
          "date": "2026-04-21",
          "close": 2040,
          "ratio": 1.02,
          "volume": 38265
        },
        {
          "date": "2026-04-22",
          "close": 2040,
          "ratio": 1.02,
          "volume": 682
        },
        {
          "date": "2026-04-23",
          "close": 2040,
          "ratio": 1.02,
          "volume": 15741
        },
        {
          "date": "2026-04-24",
          "close": 2040,
          "ratio": 1.02,
          "volume": 12584
        },
        {
          "date": "2026-04-27",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2044
        },
        {
          "date": "2026-04-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 16108
        },
        {
          "date": "2026-04-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 6476
        },
        {
          "date": "2026-04-30",
          "close": 2020,
          "ratio": 1.01,
          "volume": 19098
        },
        {
          "date": "2026-05-04",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 7466
        },
        {
          "date": "2026-05-06",
          "close": 2030,
          "ratio": 1.015,
          "volume": 4209
        },
        {
          "date": "2026-05-07",
          "close": 2030,
          "ratio": 1.015,
          "volume": 26
        },
        {
          "date": "2026-05-08",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1046
        },
        {
          "date": "2026-05-11",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 49333
        },
        {
          "date": "2026-05-12",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 17524
        },
        {
          "date": "2026-05-13",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 5148
        },
        {
          "date": "2026-05-14",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 2949
        },
        {
          "date": "2026-05-15",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 18956
        },
        {
          "date": "2026-05-18",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 5852
        },
        {
          "date": "2026-05-19",
          "close": 2020,
          "ratio": 1.01,
          "volume": 31871
        },
        {
          "date": "2026-05-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 23743
        },
        {
          "date": "2026-05-21",
          "close": 2030,
          "ratio": 1.015,
          "volume": 19221
        },
        {
          "date": "2026-05-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 7198
        },
        {
          "date": "2026-05-26",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1616
        },
        {
          "date": "2026-05-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 25080
        },
        {
          "date": "2026-05-28",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6372
        },
        {
          "date": "2026-05-29",
          "close": 2030,
          "ratio": 1.015,
          "volume": 41811
        },
        {
          "date": "2026-06-01",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 250
        }
      ],
      "events": [
        {
          "date": "2024-12-23",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-12-23"
        },
        {
          "date": "2027-12-23",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신한제14호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=487360"
    },
    {
      "id": "496070",
      "code": "496070",
      "name": "신한제16호스팩",
      "market": "KOSDAQ",
      "isin": "KR7496070004",
      "sponsor": "신한",
      "ipoPrice": 2000,
      "currentPrice": 2005,
      "change": 5,
      "changePct": 0.25,
      "ratio": 1.0025,
      "premiumPct": 0.25,
      "volume": 1150,
      "tradingValue": 2000000,
      "marketCap": 11268100000,
      "estimatedShares": 5620000,
      "listingDate": "2025-05-29",
      "liquidationDate": "2028-05-29",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 728,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.62,
      "annualizedReturn": 3.75,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신한제16호스팩",
        "fullName": "신한제16호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기타금융서비스(기업합병)",
        "listingDate": "2025-05-29",
        "fiscalMonth": "12월",
        "ceo": "김종환",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "496070",
        "price": 2005,
        "change": 5,
        "changePct": 0.25,
        "volume": 1150,
        "tradingValue": 2000000,
        "marketCap": 11268100000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.536204+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2030,
          "ratio": 1.015,
          "volume": 2007
        },
        {
          "date": "2026-04-17",
          "close": 2030,
          "ratio": 1.015,
          "volume": 4655
        },
        {
          "date": "2026-04-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 3958
        },
        {
          "date": "2026-04-21",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1606
        },
        {
          "date": "2026-04-22",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2406
        },
        {
          "date": "2026-04-23",
          "close": 2030,
          "ratio": 1.015,
          "volume": 3492
        },
        {
          "date": "2026-04-24",
          "close": 2020,
          "ratio": 1.01,
          "volume": 26599
        },
        {
          "date": "2026-04-27",
          "close": 2020,
          "ratio": 1.01,
          "volume": 7442
        },
        {
          "date": "2026-04-28",
          "close": 2010,
          "ratio": 1.005,
          "volume": 9359
        },
        {
          "date": "2026-04-29",
          "close": 2012,
          "ratio": 1.006,
          "volume": 1786
        },
        {
          "date": "2026-04-30",
          "close": 2010,
          "ratio": 1.005,
          "volume": 2258
        },
        {
          "date": "2026-05-04",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 543
        },
        {
          "date": "2026-05-06",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 3859
        },
        {
          "date": "2026-05-07",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 533
        },
        {
          "date": "2026-05-08",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1682
        },
        {
          "date": "2026-05-11",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 41681
        },
        {
          "date": "2026-05-12",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 20297
        },
        {
          "date": "2026-05-13",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 6601
        },
        {
          "date": "2026-05-14",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 24
        },
        {
          "date": "2026-05-15",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 12
        },
        {
          "date": "2026-05-18",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 789
        },
        {
          "date": "2026-05-19",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 39326
        },
        {
          "date": "2026-05-20",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 17718
        },
        {
          "date": "2026-05-21",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 5471
        },
        {
          "date": "2026-05-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3091
        },
        {
          "date": "2026-05-26",
          "close": 2010,
          "ratio": 1.005,
          "volume": 23862
        },
        {
          "date": "2026-05-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 9762
        },
        {
          "date": "2026-05-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 2730
        },
        {
          "date": "2026-05-29",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3794
        },
        {
          "date": "2026-06-01",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 1150
        }
      ],
      "events": [
        {
          "date": "2025-05-29",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-05-29"
        },
        {
          "date": "2028-05-29",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신한제16호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=496070"
    },
    {
      "id": "493790",
      "code": "493790",
      "name": "유안타제17호스팩",
      "market": "KOSDAQ",
      "isin": "KR7493790000",
      "sponsor": "유안타",
      "ipoPrice": 2000,
      "currentPrice": 2005,
      "change": -20,
      "changePct": -0.99,
      "ratio": 1.0025,
      "premiumPct": 0.25,
      "volume": 336,
      "tradingValue": 1000000,
      "marketCap": 10646550000,
      "estimatedShares": 5310000,
      "listingDate": "2025-01-23",
      "liquidationDate": "2028-01-23",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 601,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.61,
      "annualizedReturn": 4.55,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "유안타제17호스팩",
        "fullName": "유안타제17호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스업",
        "listingDate": "2025-01-23",
        "fiscalMonth": "12월",
        "ceo": "윤원도",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "493790",
        "price": 2005,
        "change": -20,
        "changePct": -0.99,
        "volume": 336,
        "tradingValue": 1000000,
        "marketCap": 10646550000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.784199+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 162
        },
        {
          "date": "2026-04-17",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 650
        },
        {
          "date": "2026-04-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 4070
        },
        {
          "date": "2026-04-21",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 1505
        },
        {
          "date": "2026-04-22",
          "close": 2020,
          "ratio": 1.01,
          "volume": 2194
        },
        {
          "date": "2026-04-23",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 3808
        },
        {
          "date": "2026-04-24",
          "close": 2012,
          "ratio": 1.006,
          "volume": 1351
        },
        {
          "date": "2026-04-27",
          "close": 2010,
          "ratio": 1.005,
          "volume": 219
        },
        {
          "date": "2026-04-28",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3237
        },
        {
          "date": "2026-04-29",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5242
        },
        {
          "date": "2026-04-30",
          "close": 2007,
          "ratio": 1.0035,
          "volume": 115
        },
        {
          "date": "2026-05-04",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1400
        },
        {
          "date": "2026-05-06",
          "close": 2010,
          "ratio": 1.005,
          "volume": 31960
        },
        {
          "date": "2026-05-07",
          "close": 2010,
          "ratio": 1.005,
          "volume": 964
        },
        {
          "date": "2026-05-08",
          "close": 2010,
          "ratio": 1.005,
          "volume": 2097
        },
        {
          "date": "2026-05-11",
          "close": 2007,
          "ratio": 1.0035,
          "volume": 13874
        },
        {
          "date": "2026-05-12",
          "close": 2010,
          "ratio": 1.005,
          "volume": 6713
        },
        {
          "date": "2026-05-13",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3011
        },
        {
          "date": "2026-05-14",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 11260
        },
        {
          "date": "2026-05-15",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 3955
        },
        {
          "date": "2026-05-18",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1153
        },
        {
          "date": "2026-05-19",
          "close": 2010,
          "ratio": 1.005,
          "volume": 4340
        },
        {
          "date": "2026-05-20",
          "close": 2020,
          "ratio": 1.01,
          "volume": 12239
        },
        {
          "date": "2026-05-21",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 13335
        },
        {
          "date": "2026-05-22",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1346
        },
        {
          "date": "2026-05-26",
          "close": 2020,
          "ratio": 1.01,
          "volume": 5048
        },
        {
          "date": "2026-05-27",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 3180
        },
        {
          "date": "2026-05-28",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 19861
        },
        {
          "date": "2026-05-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 5633
        },
        {
          "date": "2026-06-01",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 336
        }
      ],
      "events": [
        {
          "date": "2025-01-23",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-01-23"
        },
        {
          "date": "2028-01-23",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=유안타제17호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=493790"
    },
    {
      "id": "0041L0",
      "code": "0041L0",
      "name": "하나35호스팩",
      "market": "KOSDAQ",
      "isin": "KR70041L0000",
      "sponsor": "하나",
      "ipoPrice": 2000,
      "currentPrice": 2005,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0025,
      "premiumPct": 0.25,
      "volume": 1,
      "tradingValue": null,
      "marketCap": 12090150000,
      "estimatedShares": 6030000,
      "listingDate": "2025-08-06",
      "liquidationDate": "2028-08-06",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 797,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.62,
      "annualizedReturn": 3.42,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "하나35호스팩",
        "fullName": "하나35호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-08-06",
        "fiscalMonth": "12월",
        "ceo": "박정수",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0041L0",
        "price": 2005,
        "change": 0,
        "changePct": 0.0,
        "volume": 1,
        "tradingValue": null,
        "marketCap": 12090150000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.891268+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 11806
        },
        {
          "date": "2026-04-17",
          "close": 2020,
          "ratio": 1.01,
          "volume": 3491
        },
        {
          "date": "2026-04-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 25030
        },
        {
          "date": "2026-04-21",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 1636
        },
        {
          "date": "2026-04-22",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 8268
        },
        {
          "date": "2026-04-23",
          "close": 2010,
          "ratio": 1.005,
          "volume": 106029
        },
        {
          "date": "2026-04-24",
          "close": 2010,
          "ratio": 1.005,
          "volume": 257
        },
        {
          "date": "2026-04-27",
          "close": 2010,
          "ratio": 1.005,
          "volume": 13074
        },
        {
          "date": "2026-04-28",
          "close": 2010,
          "ratio": 1.005,
          "volume": 280
        },
        {
          "date": "2026-04-29",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1974
        },
        {
          "date": "2026-04-30",
          "close": 2010,
          "ratio": 1.005,
          "volume": 2500
        },
        {
          "date": "2026-05-04",
          "close": 2010,
          "ratio": 1.005,
          "volume": 2662
        },
        {
          "date": "2026-05-06",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5331
        },
        {
          "date": "2026-05-07",
          "close": 2010,
          "ratio": 1.005,
          "volume": 3534
        },
        {
          "date": "2026-05-08",
          "close": 2010,
          "ratio": 1.005,
          "volume": 832
        },
        {
          "date": "2026-05-11",
          "close": 2010,
          "ratio": 1.005,
          "volume": 7513
        },
        {
          "date": "2026-05-12",
          "close": 2010,
          "ratio": 1.005,
          "volume": 9340
        },
        {
          "date": "2026-05-13",
          "close": 2010,
          "ratio": 1.005,
          "volume": 81963
        },
        {
          "date": "2026-05-14",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 169
        },
        {
          "date": "2026-05-15",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 5899
        },
        {
          "date": "2026-05-18",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 36251
        },
        {
          "date": "2026-05-19",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 4103
        },
        {
          "date": "2026-05-20",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3451
        },
        {
          "date": "2026-05-21",
          "close": 2000,
          "ratio": 1.0,
          "volume": 4843
        },
        {
          "date": "2026-05-22",
          "close": 2002,
          "ratio": 1.001,
          "volume": 7781
        },
        {
          "date": "2026-05-26",
          "close": 2000,
          "ratio": 1.0,
          "volume": 3249
        },
        {
          "date": "2026-05-27",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 13063
        },
        {
          "date": "2026-05-28",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 559
        },
        {
          "date": "2026-05-29",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 11247
        },
        {
          "date": "2026-06-01",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 1
        }
      ],
      "events": [
        {
          "date": "2025-08-06",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-08-06"
        },
        {
          "date": "2028-08-06",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=하나35호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0041L0"
    },
    {
      "id": "489730",
      "code": "489730",
      "name": "디비금융제13호스팩",
      "market": "KOSDAQ",
      "isin": "KR7489730002",
      "sponsor": "디비금융",
      "ipoPrice": 2000,
      "currentPrice": 2010,
      "change": -15,
      "changePct": -0.74,
      "ratio": 1.005,
      "premiumPct": 0.5,
      "volume": 264,
      "tradingValue": 1000000,
      "marketCap": 12727320000,
      "estimatedShares": 6332000,
      "listingDate": "2024-11-28",
      "liquidationDate": "2027-11-28",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 545,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.34,
      "annualizedReturn": 4.86,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "디비금융제13호스팩",
        "fullName": "디비금융제13호기업인수목적 주식회사",
        "industry": "기타 금융업",
        "mainProduct": "기업인수 및 합병",
        "listingDate": "2024-11-28",
        "fiscalMonth": "12월",
        "ceo": "양준석",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "489730",
        "price": 2010,
        "change": -15,
        "changePct": -0.74,
        "volume": 264,
        "tradingValue": 1000000,
        "marketCap": 12727320000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.20082+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2070,
          "ratio": 1.035,
          "volume": 4012
        },
        {
          "date": "2026-04-17",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 11839
        },
        {
          "date": "2026-04-20",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 426
        },
        {
          "date": "2026-04-21",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 16633
        },
        {
          "date": "2026-04-22",
          "close": 2070,
          "ratio": 1.035,
          "volume": 1266
        },
        {
          "date": "2026-04-23",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 641
        },
        {
          "date": "2026-04-24",
          "close": 2060,
          "ratio": 1.03,
          "volume": 28162
        },
        {
          "date": "2026-04-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 8531
        },
        {
          "date": "2026-04-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 131
        },
        {
          "date": "2026-04-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1873
        },
        {
          "date": "2026-04-30",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 3289
        },
        {
          "date": "2026-05-04",
          "close": 2060,
          "ratio": 1.03,
          "volume": 758
        },
        {
          "date": "2026-05-06",
          "close": 2060,
          "ratio": 1.03,
          "volume": 2761
        },
        {
          "date": "2026-05-07",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 102
        },
        {
          "date": "2026-05-08",
          "close": 2040,
          "ratio": 1.02,
          "volume": 5265
        },
        {
          "date": "2026-05-11",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 21149
        },
        {
          "date": "2026-05-12",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 9061
        },
        {
          "date": "2026-05-13",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2865
        },
        {
          "date": "2026-05-14",
          "close": 2040,
          "ratio": 1.02,
          "volume": 28422
        },
        {
          "date": "2026-05-15",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4862
        },
        {
          "date": "2026-05-18",
          "close": 2040,
          "ratio": 1.02,
          "volume": 7028
        },
        {
          "date": "2026-05-19",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 113636
        },
        {
          "date": "2026-05-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 2191
        },
        {
          "date": "2026-05-21",
          "close": 2040,
          "ratio": 1.02,
          "volume": 8450
        },
        {
          "date": "2026-05-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 90546
        },
        {
          "date": "2026-05-26",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 2384
        },
        {
          "date": "2026-05-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 4041
        },
        {
          "date": "2026-05-28",
          "close": 2020,
          "ratio": 1.01,
          "volume": 3608
        },
        {
          "date": "2026-05-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 16905
        },
        {
          "date": "2026-06-01",
          "close": 2010,
          "ratio": 1.005,
          "volume": 264
        }
      ],
      "events": [
        {
          "date": "2024-11-28",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-11-28"
        },
        {
          "date": "2027-11-28",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=디비금융제13호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=489730"
    },
    {
      "id": "0071M0",
      "code": "0071M0",
      "name": "삼성스팩11호",
      "market": "KOSDAQ",
      "isin": "KR70071M0002",
      "sponsor": "삼성",
      "ipoPrice": 2000,
      "currentPrice": 2010,
      "change": -5,
      "changePct": -0.25,
      "ratio": 1.005,
      "premiumPct": 0.5,
      "volume": 105,
      "tradingValue": null,
      "marketCap": 11577600000,
      "estimatedShares": 5760000,
      "listingDate": "2025-09-30",
      "liquidationDate": "2028-09-30",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 852,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 7.35,
      "annualizedReturn": 3.08,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "삼성스팩11호",
        "fullName": "삼성기업인수목적11호(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-09-30",
        "fiscalMonth": "12월",
        "ceo": "문소연",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0071M0",
        "price": 2010,
        "change": -5,
        "changePct": -0.25,
        "volume": 105,
        "tradingValue": null,
        "marketCap": 11577600000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.428038+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1570
        },
        {
          "date": "2026-04-17",
          "close": 2040,
          "ratio": 1.02,
          "volume": 73431
        },
        {
          "date": "2026-04-20",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 3451
        },
        {
          "date": "2026-04-21",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1698
        },
        {
          "date": "2026-04-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 37312
        },
        {
          "date": "2026-04-23",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 89128
        },
        {
          "date": "2026-04-24",
          "close": 2020,
          "ratio": 1.01,
          "volume": 7872
        },
        {
          "date": "2026-04-27",
          "close": 2010,
          "ratio": 1.005,
          "volume": 868
        },
        {
          "date": "2026-04-28",
          "close": 2010,
          "ratio": 1.005,
          "volume": 5999
        },
        {
          "date": "2026-04-29",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 15090
        },
        {
          "date": "2026-04-30",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 8668
        },
        {
          "date": "2026-05-04",
          "close": 2010,
          "ratio": 1.005,
          "volume": 4087
        },
        {
          "date": "2026-05-06",
          "close": 2020,
          "ratio": 1.01,
          "volume": 35689
        },
        {
          "date": "2026-05-07",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1545
        },
        {
          "date": "2026-05-08",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 2127
        },
        {
          "date": "2026-05-11",
          "close": 2000,
          "ratio": 1.0,
          "volume": 37387
        },
        {
          "date": "2026-05-12",
          "close": 2010,
          "ratio": 1.005,
          "volume": 52025
        },
        {
          "date": "2026-05-13",
          "close": 2010,
          "ratio": 1.005,
          "volume": 10904
        },
        {
          "date": "2026-05-14",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 15604
        },
        {
          "date": "2026-05-15",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 5457
        },
        {
          "date": "2026-05-18",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 1866
        },
        {
          "date": "2026-05-19",
          "close": 2005,
          "ratio": 1.0025,
          "volume": 8393
        },
        {
          "date": "2026-05-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 25013
        },
        {
          "date": "2026-05-21",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1524
        },
        {
          "date": "2026-05-22",
          "close": 2010,
          "ratio": 1.005,
          "volume": 1939
        },
        {
          "date": "2026-05-26",
          "close": 2010,
          "ratio": 1.005,
          "volume": 25145
        },
        {
          "date": "2026-05-27",
          "close": 2010,
          "ratio": 1.005,
          "volume": 2478
        },
        {
          "date": "2026-05-28",
          "close": 2000,
          "ratio": 1.0,
          "volume": 2041
        },
        {
          "date": "2026-05-29",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 15867
        },
        {
          "date": "2026-06-01",
          "close": 2010,
          "ratio": 1.005,
          "volume": 105
        }
      ],
      "events": [
        {
          "date": "2025-09-30",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-09-30"
        },
        {
          "date": "2028-09-30",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=삼성스팩11호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0071M0"
    },
    {
      "id": "0041B0",
      "code": "0041B0",
      "name": "교보18호스팩",
      "market": "KOSDAQ",
      "isin": "KR70041B0002",
      "sponsor": "교보",
      "ipoPrice": 2000,
      "currentPrice": 2020,
      "change": -5,
      "changePct": -0.25,
      "ratio": 1.01,
      "premiumPct": 1.0,
      "volume": 954,
      "tradingValue": 2000000,
      "marketCap": 10180800000,
      "estimatedShares": 5040000,
      "listingDate": "2025-08-14",
      "liquidationDate": "2028-08-14",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 805,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.82,
      "annualizedReturn": 3.04,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "교보18호스팩",
        "fullName": "교보18호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-08-14",
        "fiscalMonth": "12월",
        "ceo": "허명현",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0041B0",
        "price": 2020,
        "change": -5,
        "changePct": -0.25,
        "volume": 954,
        "tradingValue": 2000000,
        "marketCap": 10180800000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.117996+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 7029
        },
        {
          "date": "2026-04-17",
          "close": 2060,
          "ratio": 1.03,
          "volume": 1089
        },
        {
          "date": "2026-04-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 10108
        },
        {
          "date": "2026-04-21",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1448
        },
        {
          "date": "2026-04-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 10763
        },
        {
          "date": "2026-04-23",
          "close": 2040,
          "ratio": 1.02,
          "volume": 9253
        },
        {
          "date": "2026-04-24",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 118
        },
        {
          "date": "2026-04-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 4201
        },
        {
          "date": "2026-04-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 10477
        },
        {
          "date": "2026-04-29",
          "close": 2047,
          "ratio": 1.0235,
          "volume": 32602
        },
        {
          "date": "2026-04-30",
          "close": 2042,
          "ratio": 1.021,
          "volume": 8627
        },
        {
          "date": "2026-05-04",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 19334
        },
        {
          "date": "2026-05-06",
          "close": 2020,
          "ratio": 1.01,
          "volume": 30058
        },
        {
          "date": "2026-05-07",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 9251
        },
        {
          "date": "2026-05-08",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 1787
        },
        {
          "date": "2026-05-11",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 37281
        },
        {
          "date": "2026-05-12",
          "close": 2020,
          "ratio": 1.01,
          "volume": 75196
        },
        {
          "date": "2026-05-13",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 40996
        },
        {
          "date": "2026-05-14",
          "close": 2010,
          "ratio": 1.005,
          "volume": 38750
        },
        {
          "date": "2026-05-15",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 7577
        },
        {
          "date": "2026-05-18",
          "close": 2010,
          "ratio": 1.005,
          "volume": 23877
        },
        {
          "date": "2026-05-19",
          "close": 2010,
          "ratio": 1.005,
          "volume": 135177
        },
        {
          "date": "2026-05-20",
          "close": 2010,
          "ratio": 1.005,
          "volume": 4679
        },
        {
          "date": "2026-05-21",
          "close": 2020,
          "ratio": 1.01,
          "volume": 9095
        },
        {
          "date": "2026-05-22",
          "close": 2030,
          "ratio": 1.015,
          "volume": 8069
        },
        {
          "date": "2026-05-26",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 3387
        },
        {
          "date": "2026-05-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 593
        },
        {
          "date": "2026-05-28",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 2332
        },
        {
          "date": "2026-05-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 388
        },
        {
          "date": "2026-06-01",
          "close": 2020,
          "ratio": 1.01,
          "volume": 954
        }
      ],
      "events": [
        {
          "date": "2025-08-14",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-08-14"
        },
        {
          "date": "2028-08-14",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=교보18호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0041B0"
    },
    {
      "id": "487830",
      "code": "487830",
      "name": "신한제15호스팩",
      "market": "KOSDAQ",
      "isin": "KR7487830002",
      "sponsor": "신한",
      "ipoPrice": 2000,
      "currentPrice": 2020,
      "change": -5,
      "changePct": -0.25,
      "ratio": 1.01,
      "premiumPct": 1.0,
      "volume": 2229,
      "tradingValue": 5000000,
      "marketCap": 8787000000,
      "estimatedShares": 4350000,
      "listingDate": "2024-11-15",
      "liquidationDate": "2027-11-15",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 532,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.81,
      "annualizedReturn": 4.62,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신한제15호스팩",
        "fullName": "신한제15호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스업",
        "listingDate": "2024-11-15",
        "fiscalMonth": "12월",
        "ceo": "연오흠",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "487830",
        "price": 2020,
        "change": -5,
        "changePct": -0.25,
        "volume": 2229,
        "tradingValue": 5000000,
        "marketCap": 8787000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.512519+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 7
        },
        {
          "date": "2026-04-17",
          "close": 2060,
          "ratio": 1.03,
          "volume": 20578
        },
        {
          "date": "2026-04-20",
          "close": 2060,
          "ratio": 1.03,
          "volume": 45
        },
        {
          "date": "2026-04-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 11225
        },
        {
          "date": "2026-04-22",
          "close": 2060,
          "ratio": 1.03,
          "volume": 1
        },
        {
          "date": "2026-04-23",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 975
        },
        {
          "date": "2026-04-24",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 5148
        },
        {
          "date": "2026-04-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 939
        },
        {
          "date": "2026-04-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 705
        },
        {
          "date": "2026-04-29",
          "close": 2060,
          "ratio": 1.03,
          "volume": 651
        },
        {
          "date": "2026-04-30",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 18274
        },
        {
          "date": "2026-05-04",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 544
        },
        {
          "date": "2026-05-06",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1071
        },
        {
          "date": "2026-05-07",
          "close": 2040,
          "ratio": 1.02,
          "volume": 75
        },
        {
          "date": "2026-05-08",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 565
        },
        {
          "date": "2026-05-11",
          "close": 2040,
          "ratio": 1.02,
          "volume": 19523
        },
        {
          "date": "2026-05-12",
          "close": 2050,
          "ratio": 1.025,
          "volume": 15441
        },
        {
          "date": "2026-05-13",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1001
        },
        {
          "date": "2026-05-14",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 4672
        },
        {
          "date": "2026-05-15",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1567
        },
        {
          "date": "2026-05-18",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 40
        },
        {
          "date": "2026-05-19",
          "close": 2040,
          "ratio": 1.02,
          "volume": 5594
        },
        {
          "date": "2026-05-20",
          "close": 2040,
          "ratio": 1.02,
          "volume": 1397
        },
        {
          "date": "2026-05-21",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4207
        },
        {
          "date": "2026-05-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 502
        },
        {
          "date": "2026-05-26",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 552
        },
        {
          "date": "2026-05-27",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1388
        },
        {
          "date": "2026-05-28",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 9200
        },
        {
          "date": "2026-05-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 5375
        },
        {
          "date": "2026-06-01",
          "close": 2020,
          "ratio": 1.01,
          "volume": 2229
        }
      ],
      "events": [
        {
          "date": "2024-11-15",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-11-15"
        },
        {
          "date": "2027-11-15",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신한제15호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=487830"
    },
    {
      "id": "489480",
      "code": "489480",
      "name": "키움제11호스팩",
      "market": "KOSDAQ",
      "isin": "KR7489480004",
      "sponsor": "키움",
      "ipoPrice": 2000,
      "currentPrice": 2020,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.01,
      "premiumPct": 1.0,
      "volume": 6627,
      "tradingValue": 13000000,
      "marketCap": 13332000000,
      "estimatedShares": 6600000,
      "listingDate": "2024-12-11",
      "liquidationDate": "2027-12-11",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 558,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.81,
      "annualizedReturn": 4.4,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "키움제11호스팩",
        "fullName": "키움제11호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업 인수합병",
        "listingDate": "2024-12-11",
        "fiscalMonth": "12월",
        "ceo": "조선희",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "489480",
        "price": 2020,
        "change": 0,
        "changePct": 0.0,
        "volume": 6627,
        "tradingValue": 13000000,
        "marketCap": 13332000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.828879+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 34582
        },
        {
          "date": "2026-04-17",
          "close": 2040,
          "ratio": 1.02,
          "volume": 1089
        },
        {
          "date": "2026-04-20",
          "close": 2040,
          "ratio": 1.02,
          "volume": 21540
        },
        {
          "date": "2026-04-21",
          "close": 2040,
          "ratio": 1.02,
          "volume": 13481
        },
        {
          "date": "2026-04-22",
          "close": 2040,
          "ratio": 1.02,
          "volume": 59
        },
        {
          "date": "2026-04-23",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 27364
        },
        {
          "date": "2026-04-24",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 9219
        },
        {
          "date": "2026-04-27",
          "close": 2040,
          "ratio": 1.02,
          "volume": 33766
        },
        {
          "date": "2026-04-28",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 19521
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 10651
        },
        {
          "date": "2026-04-30",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 11598
        },
        {
          "date": "2026-05-04",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 542
        },
        {
          "date": "2026-05-06",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2586
        },
        {
          "date": "2026-05-07",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 18094
        },
        {
          "date": "2026-05-08",
          "close": 2040,
          "ratio": 1.02,
          "volume": 9607
        },
        {
          "date": "2026-05-11",
          "close": 2030,
          "ratio": 1.015,
          "volume": 80723
        },
        {
          "date": "2026-05-12",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 549
        },
        {
          "date": "2026-05-13",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1167
        },
        {
          "date": "2026-05-14",
          "close": 2020,
          "ratio": 1.01,
          "volume": 31051
        },
        {
          "date": "2026-05-15",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 5995
        },
        {
          "date": "2026-05-18",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 73613
        },
        {
          "date": "2026-05-19",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 13344
        },
        {
          "date": "2026-05-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1633
        },
        {
          "date": "2026-05-21",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 20406
        },
        {
          "date": "2026-05-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 5255
        },
        {
          "date": "2026-05-26",
          "close": 2030,
          "ratio": 1.015,
          "volume": 374
        },
        {
          "date": "2026-05-27",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1531
        },
        {
          "date": "2026-05-28",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 4588
        },
        {
          "date": "2026-05-29",
          "close": 2020,
          "ratio": 1.01,
          "volume": 4517
        },
        {
          "date": "2026-06-01",
          "close": 2020,
          "ratio": 1.01,
          "volume": 6627
        }
      ],
      "events": [
        {
          "date": "2024-12-11",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-12-11"
        },
        {
          "date": "2027-12-11",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=키움제11호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=489480"
    },
    {
      "id": "484130",
      "code": "484130",
      "name": "하나34호스팩",
      "market": "KOSDAQ",
      "isin": "KR7484130000",
      "sponsor": "하나",
      "ipoPrice": 2000,
      "currentPrice": 2020,
      "change": -5,
      "changePct": -0.25,
      "ratio": 1.01,
      "premiumPct": 1.0,
      "volume": 488,
      "tradingValue": 1000000,
      "marketCap": 9130400000,
      "estimatedShares": 4520000,
      "listingDate": "2024-11-19",
      "liquidationDate": "2027-11-19",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 536,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.81,
      "annualizedReturn": 4.59,
      "status": "공모가 근접",
      "badges": [
        "공모가 근접"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "하나34호스팩",
        "fullName": "하나34호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수목적",
        "listingDate": "2024-11-19",
        "fiscalMonth": "12월",
        "ceo": "송하용",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "484130",
        "price": 2020,
        "change": -5,
        "changePct": -0.25,
        "volume": 488,
        "tradingValue": 1000000,
        "marketCap": 9130400000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.888386+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 2326
        },
        {
          "date": "2026-04-17",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5705
        },
        {
          "date": "2026-04-20",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 19278
        },
        {
          "date": "2026-04-21",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 5287
        },
        {
          "date": "2026-04-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 786
        },
        {
          "date": "2026-04-23",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 26
        },
        {
          "date": "2026-04-24",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 6225
        },
        {
          "date": "2026-04-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 6473
        },
        {
          "date": "2026-04-28",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1331
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 4396
        },
        {
          "date": "2026-04-30",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 427
        },
        {
          "date": "2026-05-04",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 979
        },
        {
          "date": "2026-05-06",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4836
        },
        {
          "date": "2026-05-07",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 15749
        },
        {
          "date": "2026-05-08",
          "close": 2020,
          "ratio": 1.01,
          "volume": 647
        },
        {
          "date": "2026-05-11",
          "close": 2020,
          "ratio": 1.01,
          "volume": 925
        },
        {
          "date": "2026-05-12",
          "close": 2050,
          "ratio": 1.025,
          "volume": 10502
        },
        {
          "date": "2026-05-13",
          "close": 2050,
          "ratio": 1.025,
          "volume": 4019
        },
        {
          "date": "2026-05-14",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5539
        },
        {
          "date": "2026-05-15",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1502
        },
        {
          "date": "2026-05-18",
          "close": 2050,
          "ratio": 1.025,
          "volume": 7718
        },
        {
          "date": "2026-05-19",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2183
        },
        {
          "date": "2026-05-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2116
        },
        {
          "date": "2026-05-21",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 3667
        },
        {
          "date": "2026-05-22",
          "close": 2040,
          "ratio": 1.02,
          "volume": 709
        },
        {
          "date": "2026-05-26",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2635
        },
        {
          "date": "2026-05-27",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 4759
        },
        {
          "date": "2026-05-28",
          "close": 2020,
          "ratio": 1.01,
          "volume": 303
        },
        {
          "date": "2026-05-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 1864
        },
        {
          "date": "2026-06-01",
          "close": 2020,
          "ratio": 1.01,
          "volume": 488
        }
      ],
      "events": [
        {
          "date": "2024-11-19",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-11-19"
        },
        {
          "date": "2027-11-19",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=하나34호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=484130"
    },
    {
      "id": "0054V0",
      "code": "0054V0",
      "name": "엔에이치스팩32호",
      "market": "KOSDAQ",
      "isin": "KR70054V0002",
      "sponsor": "엔에이치",
      "ipoPrice": 2000,
      "currentPrice": 2025,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0125,
      "premiumPct": 1.25,
      "volume": 994,
      "tradingValue": 2000000,
      "marketCap": 12588412500,
      "estimatedShares": 6216500,
      "listingDate": "2025-12-05",
      "liquidationDate": "2028-12-05",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 918,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.55,
      "annualizedReturn": 2.56,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "엔에이치스팩32호",
        "fullName": "엔에이치기업인수목적32호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "합병",
        "listingDate": "2025-12-05",
        "fiscalMonth": "12월",
        "ceo": "김수한",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0054V0",
        "price": 2025,
        "change": 0,
        "changePct": 0.0,
        "volume": 994,
        "tradingValue": 2000000,
        "marketCap": 12588412500,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.705482+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 4052
        },
        {
          "date": "2026-04-17",
          "close": 2070,
          "ratio": 1.035,
          "volume": 19803
        },
        {
          "date": "2026-04-20",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 16154
        },
        {
          "date": "2026-04-21",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 9446
        },
        {
          "date": "2026-04-22",
          "close": 2060,
          "ratio": 1.03,
          "volume": 14679
        },
        {
          "date": "2026-04-23",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 6238
        },
        {
          "date": "2026-04-24",
          "close": 2050,
          "ratio": 1.025,
          "volume": 23761
        },
        {
          "date": "2026-04-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 31029
        },
        {
          "date": "2026-04-28",
          "close": 2040,
          "ratio": 1.02,
          "volume": 17887
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1990
        },
        {
          "date": "2026-04-30",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 2391
        },
        {
          "date": "2026-05-04",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4733
        },
        {
          "date": "2026-05-06",
          "close": 2040,
          "ratio": 1.02,
          "volume": 10797
        },
        {
          "date": "2026-05-07",
          "close": 2040,
          "ratio": 1.02,
          "volume": 31994
        },
        {
          "date": "2026-05-08",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 19513
        },
        {
          "date": "2026-05-11",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 49925
        },
        {
          "date": "2026-05-12",
          "close": 2020,
          "ratio": 1.01,
          "volume": 26824
        },
        {
          "date": "2026-05-13",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 16830
        },
        {
          "date": "2026-05-14",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 20647
        },
        {
          "date": "2026-05-15",
          "close": 2030,
          "ratio": 1.015,
          "volume": 15805
        },
        {
          "date": "2026-05-18",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 5561
        },
        {
          "date": "2026-05-19",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 9757
        },
        {
          "date": "2026-05-20",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 7782
        },
        {
          "date": "2026-05-21",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 6988
        },
        {
          "date": "2026-05-22",
          "close": 2030,
          "ratio": 1.015,
          "volume": 3958
        },
        {
          "date": "2026-05-26",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1888
        },
        {
          "date": "2026-05-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 38307
        },
        {
          "date": "2026-05-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 5187
        },
        {
          "date": "2026-05-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 8475
        },
        {
          "date": "2026-06-01",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 994
        }
      ],
      "events": [
        {
          "date": "2025-12-05",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-05"
        },
        {
          "date": "2028-12-05",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=엔에이치스팩32호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0054V0"
    },
    {
      "id": "487720",
      "code": "487720",
      "name": "키움제10호스팩",
      "market": "KOSDAQ",
      "isin": "KR7487720005",
      "sponsor": "키움",
      "ipoPrice": 2000,
      "currentPrice": 2025,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0125,
      "premiumPct": 1.25,
      "volume": null,
      "tradingValue": null,
      "marketCap": 8565750000,
      "estimatedShares": 4230000,
      "listingDate": "2024-12-20",
      "liquidationDate": "2027-12-20",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 567,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.55,
      "annualizedReturn": 4.17,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "키움제10호스팩",
        "fullName": "키움제10호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업 인수합병",
        "listingDate": "2024-12-20",
        "fiscalMonth": "12월",
        "ceo": "김대식",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "487720",
        "price": 2025,
        "change": 0,
        "changePct": 0.0,
        "volume": null,
        "tradingValue": null,
        "marketCap": 8565750000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.830397+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2080,
          "ratio": 1.04,
          "volume": 1
        },
        {
          "date": "2026-04-17",
          "close": 2070,
          "ratio": 1.035,
          "volume": 247
        },
        {
          "date": "2026-04-20",
          "close": 2060,
          "ratio": 1.03,
          "volume": 89
        },
        {
          "date": "2026-04-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 100
        },
        {
          "date": "2026-04-22",
          "close": 2070,
          "ratio": 1.035,
          "volume": 419
        },
        {
          "date": "2026-04-23",
          "close": 2060,
          "ratio": 1.03,
          "volume": 18105
        },
        {
          "date": "2026-04-24",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 13075
        },
        {
          "date": "2026-04-27",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 67937
        },
        {
          "date": "2026-04-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 38120
        },
        {
          "date": "2026-04-29",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6980
        },
        {
          "date": "2026-04-30",
          "close": 2040,
          "ratio": 1.02,
          "volume": 14857
        },
        {
          "date": "2026-05-04",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 5085
        },
        {
          "date": "2026-05-06",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6711
        },
        {
          "date": "2026-05-07",
          "close": 2040,
          "ratio": 1.02,
          "volume": 78
        },
        {
          "date": "2026-05-08",
          "close": 2040,
          "ratio": 1.02,
          "volume": 13303
        },
        {
          "date": "2026-05-11",
          "close": 2030,
          "ratio": 1.015,
          "volume": 46666
        },
        {
          "date": "2026-05-12",
          "close": 2020,
          "ratio": 1.01,
          "volume": 18879
        },
        {
          "date": "2026-05-13",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2502
        },
        {
          "date": "2026-05-14",
          "close": 2040,
          "ratio": 1.02,
          "volume": 7006
        },
        {
          "date": "2026-05-15",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4311
        },
        {
          "date": "2026-05-18",
          "close": 2020,
          "ratio": 1.01,
          "volume": 8335
        },
        {
          "date": "2026-05-19",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 63599
        },
        {
          "date": "2026-05-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 16440
        },
        {
          "date": "2026-05-21",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 385
        },
        {
          "date": "2026-05-22",
          "close": 2020,
          "ratio": 1.01,
          "volume": 14275
        },
        {
          "date": "2026-05-26",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 28823
        },
        {
          "date": "2026-05-27",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 21306
        },
        {
          "date": "2026-05-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 3499
        },
        {
          "date": "2026-05-29",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 2986
        },
        {
          "date": "2026-06-01",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 0
        }
      ],
      "events": [
        {
          "date": "2024-12-20",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-12-20"
        },
        {
          "date": "2027-12-20",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=키움제10호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=487720"
    },
    {
      "id": "477340",
      "code": "477340",
      "name": "에이치엠씨제7호스팩",
      "market": "KOSDAQ",
      "isin": "KR7477340004",
      "sponsor": "에이치엠씨",
      "ipoPrice": 2000,
      "currentPrice": 2030,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.015,
      "premiumPct": 1.5,
      "volume": 200,
      "tradingValue": null,
      "marketCap": 15245300000,
      "estimatedShares": 7510000,
      "listingDate": "2024-06-24",
      "liquidationDate": "2027-06-24",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 388,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.28,
      "annualizedReturn": 5.9,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "에이치엠씨제7호스팩",
        "fullName": "에이치엠씨아이비제7호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기타금융",
        "listingDate": "2024-06-24",
        "fiscalMonth": "12월",
        "ceo": "조한종",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "477340",
        "price": 2030,
        "change": 0,
        "changePct": 0.0,
        "volume": 200,
        "tradingValue": null,
        "marketCap": 15245300000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.614285+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2030,
          "ratio": 1.015,
          "volume": 5512
        },
        {
          "date": "2026-04-17",
          "close": 2030,
          "ratio": 1.015,
          "volume": 24858
        },
        {
          "date": "2026-04-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 800
        },
        {
          "date": "2026-04-21",
          "close": 2030,
          "ratio": 1.015,
          "volume": 11580
        },
        {
          "date": "2026-04-22",
          "close": 2030,
          "ratio": 1.015,
          "volume": 4319
        },
        {
          "date": "2026-04-23",
          "close": 2030,
          "ratio": 1.015,
          "volume": 482
        },
        {
          "date": "2026-04-24",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 4531
        },
        {
          "date": "2026-04-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 113245
        },
        {
          "date": "2026-04-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 15865
        },
        {
          "date": "2026-04-29",
          "close": 2030,
          "ratio": 1.015,
          "volume": 96
        },
        {
          "date": "2026-04-30",
          "close": 2030,
          "ratio": 1.015,
          "volume": 4485
        },
        {
          "date": "2026-05-04",
          "close": 2030,
          "ratio": 1.015,
          "volume": 14391
        },
        {
          "date": "2026-05-06",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 10241
        },
        {
          "date": "2026-05-07",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2469
        },
        {
          "date": "2026-05-08",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 6499
        },
        {
          "date": "2026-05-11",
          "close": 2030,
          "ratio": 1.015,
          "volume": 14912
        },
        {
          "date": "2026-05-12",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 8738
        },
        {
          "date": "2026-05-13",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 6260
        },
        {
          "date": "2026-05-14",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1633
        },
        {
          "date": "2026-05-15",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 52440
        },
        {
          "date": "2026-05-18",
          "close": 2040,
          "ratio": 1.02,
          "volume": 120
        },
        {
          "date": "2026-05-19",
          "close": 2040,
          "ratio": 1.02,
          "volume": 3578
        },
        {
          "date": "2026-05-20",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2737
        },
        {
          "date": "2026-05-21",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1815
        },
        {
          "date": "2026-05-22",
          "close": 2030,
          "ratio": 1.015,
          "volume": 24961
        },
        {
          "date": "2026-05-26",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 15810
        },
        {
          "date": "2026-05-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 5262
        },
        {
          "date": "2026-05-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 377
        },
        {
          "date": "2026-05-29",
          "close": 2030,
          "ratio": 1.015,
          "volume": 12197
        },
        {
          "date": "2026-06-01",
          "close": 2030,
          "ratio": 1.015,
          "volume": 200
        }
      ],
      "events": [
        {
          "date": "2024-06-24",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-06-24"
        },
        {
          "date": "2027-06-24",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=에이치엠씨제7호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=477340"
    },
    {
      "id": "488060",
      "code": "488060",
      "name": "유진스팩11호",
      "market": "KOSDAQ",
      "isin": "KR7488060005",
      "sponsor": "유진",
      "ipoPrice": 2000,
      "currentPrice": 2030,
      "change": -25,
      "changePct": -1.22,
      "ratio": 1.015,
      "premiumPct": 1.5,
      "volume": 1054,
      "tradingValue": 2000000,
      "marketCap": 9581600000,
      "estimatedShares": 4720000,
      "listingDate": "2024-10-31",
      "liquidationDate": "2027-10-31",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 517,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.28,
      "annualizedReturn": 4.4,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "유진스팩11호",
        "fullName": "유진기업인수목적11호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-10-31",
        "fiscalMonth": "12월",
        "ceo": "박홍식",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "488060",
        "price": 2030,
        "change": -25,
        "changePct": -1.22,
        "volume": 1054,
        "tradingValue": 2000000,
        "marketCap": 9581600000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.810242+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5304
        },
        {
          "date": "2026-04-17",
          "close": 2050,
          "ratio": 1.025,
          "volume": 704
        },
        {
          "date": "2026-04-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 7097
        },
        {
          "date": "2026-04-21",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 44325
        },
        {
          "date": "2026-04-22",
          "close": 2040,
          "ratio": 1.02,
          "volume": 27321
        },
        {
          "date": "2026-04-23",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 2366
        },
        {
          "date": "2026-04-24",
          "close": 2040,
          "ratio": 1.02,
          "volume": 18473
        },
        {
          "date": "2026-04-27",
          "close": 2040,
          "ratio": 1.02,
          "volume": 22531
        },
        {
          "date": "2026-04-28",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 462
        },
        {
          "date": "2026-04-29",
          "close": 2070,
          "ratio": 1.035,
          "volume": 22930
        },
        {
          "date": "2026-04-30",
          "close": 2080,
          "ratio": 1.04,
          "volume": 7862
        },
        {
          "date": "2026-05-04",
          "close": 2070,
          "ratio": 1.035,
          "volume": 1000
        },
        {
          "date": "2026-05-06",
          "close": 2060,
          "ratio": 1.03,
          "volume": 525
        },
        {
          "date": "2026-05-07",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5333
        },
        {
          "date": "2026-05-08",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 5296
        },
        {
          "date": "2026-05-11",
          "close": 2060,
          "ratio": 1.03,
          "volume": 21335
        },
        {
          "date": "2026-05-12",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1617
        },
        {
          "date": "2026-05-13",
          "close": 2050,
          "ratio": 1.025,
          "volume": 22400
        },
        {
          "date": "2026-05-14",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 18797
        },
        {
          "date": "2026-05-15",
          "close": 2030,
          "ratio": 1.015,
          "volume": 23522
        },
        {
          "date": "2026-05-18",
          "close": 2030,
          "ratio": 1.015,
          "volume": 11398
        },
        {
          "date": "2026-05-19",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 3591
        },
        {
          "date": "2026-05-20",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 6443
        },
        {
          "date": "2026-05-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 3080
        },
        {
          "date": "2026-05-22",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 62
        },
        {
          "date": "2026-05-26",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1532
        },
        {
          "date": "2026-05-27",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2750
        },
        {
          "date": "2026-05-28",
          "close": 2040,
          "ratio": 1.02,
          "volume": 41
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 32638
        },
        {
          "date": "2026-06-01",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1054
        }
      ],
      "events": [
        {
          "date": "2024-10-31",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-10-31"
        },
        {
          "date": "2027-10-31",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=유진스팩11호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=488060"
    },
    {
      "id": "486630",
      "code": "486630",
      "name": "KB제30호스팩",
      "market": "KOSDAQ",
      "isin": "KR7486630007",
      "sponsor": "KB",
      "ipoPrice": 2000,
      "currentPrice": 2035,
      "change": -20,
      "changePct": -0.97,
      "ratio": 1.0175,
      "premiumPct": 1.75,
      "volume": 2476,
      "tradingValue": 5000000,
      "marketCap": 10805850000,
      "estimatedShares": 5310000,
      "listingDate": "2024-09-25",
      "liquidationDate": "2027-09-25",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 481,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.02,
      "annualizedReturn": 4.54,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "KB제30호스팩",
        "fullName": "케이비제30호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-09-25",
        "fiscalMonth": "12월",
        "ceo": "박홍진",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "486630",
        "price": 2035,
        "change": -20,
        "changePct": -0.97,
        "volume": 2476,
        "tradingValue": 5000000,
        "marketCap": 10805850000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.976753+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2090,
          "ratio": 1.045,
          "volume": 7
        },
        {
          "date": "2026-04-17",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 26204
        },
        {
          "date": "2026-04-20",
          "close": 2090,
          "ratio": 1.045,
          "volume": 2166
        },
        {
          "date": "2026-04-21",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 18821
        },
        {
          "date": "2026-04-22",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 107
        },
        {
          "date": "2026-04-23",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 2853
        },
        {
          "date": "2026-04-24",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 17964
        },
        {
          "date": "2026-04-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 44777
        },
        {
          "date": "2026-04-28",
          "close": 2040,
          "ratio": 1.02,
          "volume": 13349
        },
        {
          "date": "2026-04-29",
          "close": 2060,
          "ratio": 1.03,
          "volume": 20998
        },
        {
          "date": "2026-04-30",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 18211
        },
        {
          "date": "2026-05-04",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 38
        },
        {
          "date": "2026-05-06",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1228
        },
        {
          "date": "2026-05-07",
          "close": 2050,
          "ratio": 1.025,
          "volume": 670
        },
        {
          "date": "2026-05-08",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 342
        },
        {
          "date": "2026-05-11",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 2314
        },
        {
          "date": "2026-05-12",
          "close": 2040,
          "ratio": 1.02,
          "volume": 578
        },
        {
          "date": "2026-05-13",
          "close": 2050,
          "ratio": 1.025,
          "volume": 13087
        },
        {
          "date": "2026-05-14",
          "close": 2060,
          "ratio": 1.03,
          "volume": 5938
        },
        {
          "date": "2026-05-15",
          "close": 2060,
          "ratio": 1.03,
          "volume": 4525
        },
        {
          "date": "2026-05-18",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 25620
        },
        {
          "date": "2026-05-19",
          "close": 2070,
          "ratio": 1.035,
          "volume": 4948
        },
        {
          "date": "2026-05-20",
          "close": 2070,
          "ratio": 1.035,
          "volume": 1394
        },
        {
          "date": "2026-05-21",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 3236
        },
        {
          "date": "2026-05-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 4258
        },
        {
          "date": "2026-05-26",
          "close": 2050,
          "ratio": 1.025,
          "volume": 368
        },
        {
          "date": "2026-05-27",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4229
        },
        {
          "date": "2026-05-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 4205
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 25197
        },
        {
          "date": "2026-06-01",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2469
        }
      ],
      "events": [
        {
          "date": "2024-09-25",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-09-25"
        },
        {
          "date": "2027-09-25",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=KB제30호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=486630"
    },
    {
      "id": "482520",
      "code": "482520",
      "name": "교보16호스팩",
      "market": "KOSDAQ",
      "isin": "KR7482520004",
      "sponsor": "교보",
      "ipoPrice": 2000,
      "currentPrice": 2035,
      "change": -5,
      "changePct": -0.25,
      "ratio": 1.0175,
      "premiumPct": 1.75,
      "volume": 2330,
      "tradingValue": 5000000,
      "marketCap": 12413500000,
      "estimatedShares": 6100000,
      "listingDate": "2024-08-13",
      "liquidationDate": "2027-08-13",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 438,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.02,
      "annualizedReturn": 4.99,
      "status": "합병 신청",
      "badges": [
        "합병 신청"
      ],
      "mergerStatus": "합병 신청",
      "mergerApplicationDisclosure": {
        "date": "2026-05-11 15:04",
        "title": "회사합병 결정",
        "company": "교보16호스팩",
        "submitter": "교보16호기업인수목적",
        "receiptNo": "20260511000408",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260511000408"
      },
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": {
        "date": "2026-04-22 17:34",
        "title": "주권매매거래정지해제(합병결정 철회)",
        "company": "교보16호스팩",
        "submitter": "코스닥시장본부",
        "receiptNo": "20260422000663",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260422000663"
      },
      "mergerDisclosures": [
        {
          "date": "2025-11-28 16:52",
          "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "company": "교보16호스팩",
          "submitter": "코스닥시장본부",
          "receiptNo": "20251128001153",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251128001153",
          "mergerSignal": "applied"
        },
        {
          "date": "2025-11-28 16:52",
          "title": "회사합병 결정",
          "company": "교보16호스팩",
          "submitter": "교보16호기업인수목적",
          "receiptNo": "20251128001144",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251128001144",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-04-22 17:33",
          "title": "기업인수목적회사관련합병취소ㆍ부인사실발생",
          "company": "교보16호스팩",
          "submitter": "교보16호기업인수목적",
          "receiptNo": "20260422000708",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260422000708",
          "mergerSignal": "canceled"
        },
        {
          "date": "2026-04-22 17:34",
          "title": "주권매매거래정지해제(합병결정 철회)",
          "company": "교보16호스팩",
          "submitter": "코스닥시장본부",
          "receiptNo": "20260422000663",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260422000663",
          "mergerSignal": "canceled"
        },
        {
          "date": "2026-04-22 18:01",
          "title": "회사합병 결정",
          "company": "교보16호스팩",
          "submitter": "교보16호기업인수목적",
          "receiptNo": "20260422000787",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260422000787",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-05-11 15:04",
          "title": "회사합병 결정",
          "company": "교보16호스팩",
          "submitter": "교보16호기업인수목적",
          "receiptNo": "20260511000408",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260511000408",
          "mergerSignal": "applied"
        }
      ],
      "kind": {
        "name": "교보16호스팩",
        "fullName": "교보16호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-08-13",
        "fiscalMonth": "12월",
        "ceo": "정시화",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "482520",
        "price": 2035,
        "change": -5,
        "changePct": -0.25,
        "volume": 2330,
        "tradingValue": 5000000,
        "marketCap": 12413500000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.100176+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 0
        },
        {
          "date": "2026-04-17",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 0
        },
        {
          "date": "2026-04-20",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 0
        },
        {
          "date": "2026-04-21",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 0
        },
        {
          "date": "2026-04-22",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 0
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 249565
        },
        {
          "date": "2026-04-24",
          "close": 2050,
          "ratio": 1.025,
          "volume": 49880
        },
        {
          "date": "2026-04-27",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 48472
        },
        {
          "date": "2026-04-28",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 127481
        },
        {
          "date": "2026-04-29",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 23686
        },
        {
          "date": "2026-04-30",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2074
        },
        {
          "date": "2026-05-04",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 8969
        },
        {
          "date": "2026-05-06",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 4624
        },
        {
          "date": "2026-05-07",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 951
        },
        {
          "date": "2026-05-08",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1344
        },
        {
          "date": "2026-05-11",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6902
        },
        {
          "date": "2026-05-12",
          "close": 2040,
          "ratio": 1.02,
          "volume": 11538
        },
        {
          "date": "2026-05-13",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 2629
        },
        {
          "date": "2026-05-14",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 14231
        },
        {
          "date": "2026-05-15",
          "close": 2040,
          "ratio": 1.02,
          "volume": 5228
        },
        {
          "date": "2026-05-18",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 13572
        },
        {
          "date": "2026-05-19",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4450
        },
        {
          "date": "2026-05-20",
          "close": 2040,
          "ratio": 1.02,
          "volume": 10038
        },
        {
          "date": "2026-05-21",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 14974
        },
        {
          "date": "2026-05-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2426
        },
        {
          "date": "2026-05-26",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6940
        },
        {
          "date": "2026-05-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 27235
        },
        {
          "date": "2026-05-28",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1518
        },
        {
          "date": "2026-05-29",
          "close": 2040,
          "ratio": 1.02,
          "volume": 18091
        },
        {
          "date": "2026-06-01",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2330
        }
      ],
      "events": [
        {
          "date": "2024-08-13",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-08-13"
        },
        {
          "date": "2026-04-22 17:34",
          "type": "merger_canceled",
          "label": "합병 철회",
          "detail": "주권매매거래정지해제(합병결정 철회)",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260422000663"
        },
        {
          "date": "2026-05-11 15:04",
          "type": "merger_application",
          "label": "합병 신청",
          "detail": "회사합병 결정",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260511000408"
        },
        {
          "date": "2027-08-13",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=교보16호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=482520"
    },
    {
      "id": "478110",
      "code": "478110",
      "name": "이베스트스팩6호",
      "market": "KOSDAQ",
      "isin": "KR7478110000",
      "sponsor": "이베스트",
      "ipoPrice": 2000,
      "currentPrice": 2035,
      "change": -15,
      "changePct": -0.73,
      "ratio": 1.0175,
      "premiumPct": 1.75,
      "volume": 1305,
      "tradingValue": 3000000,
      "marketCap": 10215700000,
      "estimatedShares": 5020000,
      "listingDate": "2024-07-12",
      "liquidationDate": "2027-07-12",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 406,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 6.02,
      "annualizedReturn": 5.4,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "이베스트스팩6호",
        "fullName": "이베스트기업인수목적6호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수목적 주식회사",
        "listingDate": "2024-07-12",
        "fiscalMonth": "12월",
        "ceo": "박용",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "478110",
        "price": 2035,
        "change": -15,
        "changePct": -0.73,
        "volume": 1305,
        "tradingValue": 3000000,
        "marketCap": 10215700000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.83161+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 339
        },
        {
          "date": "2026-04-17",
          "close": 2030,
          "ratio": 1.015,
          "volume": 2168
        },
        {
          "date": "2026-04-20",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 4
        },
        {
          "date": "2026-04-21",
          "close": 2030,
          "ratio": 1.015,
          "volume": 2757
        },
        {
          "date": "2026-04-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 344
        },
        {
          "date": "2026-04-23",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 18494
        },
        {
          "date": "2026-04-24",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 8131
        },
        {
          "date": "2026-04-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 42794
        },
        {
          "date": "2026-04-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 34
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1490
        },
        {
          "date": "2026-04-30",
          "close": 2030,
          "ratio": 1.015,
          "volume": 3872
        },
        {
          "date": "2026-05-04",
          "close": 2030,
          "ratio": 1.015,
          "volume": 522
        },
        {
          "date": "2026-05-06",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 14232
        },
        {
          "date": "2026-05-07",
          "close": 2030,
          "ratio": 1.015,
          "volume": 4048
        },
        {
          "date": "2026-05-08",
          "close": 2030,
          "ratio": 1.015,
          "volume": 637
        },
        {
          "date": "2026-05-11",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 25171
        },
        {
          "date": "2026-05-12",
          "close": 2030,
          "ratio": 1.015,
          "volume": 6414
        },
        {
          "date": "2026-05-13",
          "close": 2030,
          "ratio": 1.015,
          "volume": 9852
        },
        {
          "date": "2026-05-14",
          "close": 2030,
          "ratio": 1.015,
          "volume": 14
        },
        {
          "date": "2026-05-15",
          "close": 2032,
          "ratio": 1.016,
          "volume": 8252
        },
        {
          "date": "2026-05-18",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 176
        },
        {
          "date": "2026-05-19",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 17447
        },
        {
          "date": "2026-05-20",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 19641
        },
        {
          "date": "2026-05-21",
          "close": 2040,
          "ratio": 1.02,
          "volume": 604
        },
        {
          "date": "2026-05-22",
          "close": 2040,
          "ratio": 1.02,
          "volume": 519
        },
        {
          "date": "2026-05-26",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 315
        },
        {
          "date": "2026-05-27",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 1499
        },
        {
          "date": "2026-05-28",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 226
        },
        {
          "date": "2026-05-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 3226
        },
        {
          "date": "2026-06-01",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1305
        }
      ],
      "events": [
        {
          "date": "2024-07-12",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-07-12"
        },
        {
          "date": "2027-07-12",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=이베스트스팩6호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=478110"
    },
    {
      "id": "477760",
      "code": "477760",
      "name": "DB금융스팩12호",
      "market": "KOSDAQ",
      "isin": "KR7477760003",
      "sponsor": "DB금융",
      "ipoPrice": 2000,
      "currentPrice": 2040,
      "change": -10,
      "changePct": -0.49,
      "ratio": 1.02,
      "premiumPct": 2.0,
      "volume": 2678,
      "tradingValue": 5000000,
      "marketCap": 11913600000,
      "estimatedShares": 5840000,
      "listingDate": null,
      "liquidationDate": null,
      "liquidationDateSource": null,
      "daysToLiquidation": null,
      "trustValuePerShare": 2000.0,
      "liquidationValuePerShare": 2000.0,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -1.96,
      "annualizedReturn": null,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": {
        "date": "2026-02-12 17:19",
        "title": "회사합병 결정",
        "company": "디비금융스팩12호",
        "submitter": "디비금융제12호기업인수목적",
        "receiptNo": "20260212001290",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260212001290"
      },
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": {
        "date": "2026-05-26 17:11",
        "title": "주권매매거래정지해제(합병결정 철회)",
        "company": "디비금융스팩12호",
        "submitter": "코스닥시장본부",
        "receiptNo": "20260526000733",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260526000733"
      },
      "mergerDisclosures": [
        {
          "date": "2026-02-12 17:19",
          "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "company": "디비금융스팩12호",
          "submitter": "코스닥시장본부",
          "receiptNo": "20260212001316",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260212001316",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-02-12 17:19",
          "title": "회사합병 결정",
          "company": "디비금융스팩12호",
          "submitter": "디비금융제12호기업인수목적",
          "receiptNo": "20260212001290",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260212001290",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-05-26 17:07",
          "title": "회사합병 결정(SPAC 합병-철회)",
          "company": "디비금융스팩12호",
          "submitter": "디비금융제12호기업인수목적",
          "receiptNo": "20260526000578",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260526000578",
          "mergerSignal": "canceled"
        },
        {
          "date": "2026-05-26 17:08",
          "title": "기업인수목적회사관련합병취소ㆍ부인사실발생",
          "company": "디비금융스팩12호",
          "submitter": "디비금융제12호기업인수목적",
          "receiptNo": "20260526000703",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260526000703",
          "mergerSignal": "canceled"
        },
        {
          "date": "2026-05-26 17:11",
          "title": "주권매매거래정지해제(합병결정 철회)",
          "company": "디비금융스팩12호",
          "submitter": "코스닥시장본부",
          "receiptNo": "20260526000733",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260526000733",
          "mergerSignal": "canceled"
        }
      ],
      "kind": {},
      "quote": {
        "code": "477760",
        "price": 2040,
        "change": -10,
        "changePct": -0.49,
        "volume": 2678,
        "tradingValue": 5000000,
        "marketCap": 11913600000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.999373+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-17",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-20",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-21",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-22",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-23",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-24",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-27",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-28",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-29",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-04-30",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-04",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-06",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-07",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-08",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-11",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-12",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-13",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-14",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-15",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-18",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-19",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-20",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-21",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-22",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-26",
          "close": 2230,
          "ratio": 1.115,
          "volume": 0
        },
        {
          "date": "2026-05-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 233878
        },
        {
          "date": "2026-05-28",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 112227
        },
        {
          "date": "2026-05-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 94968
        },
        {
          "date": "2026-06-01",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2678
        }
      ],
      "events": [
        {
          "date": "2026-02-12 17:19",
          "type": "merger_application",
          "label": "합병 신청",
          "detail": "회사합병 결정",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260212001290"
        },
        {
          "date": "2026-05-26 17:11",
          "type": "merger_canceled",
          "label": "합병 철회",
          "detail": "주권매매거래정지해제(합병결정 철회)",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260526000733"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=DB금융스팩12호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=477760"
    },
    {
      "id": "492220",
      "code": "492220",
      "name": "KB제31호스팩",
      "market": "KOSDAQ",
      "isin": "KR7492220009",
      "sponsor": "KB",
      "ipoPrice": 2000,
      "currentPrice": 2040,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.02,
      "premiumPct": 2.0,
      "volume": 2,
      "tradingValue": null,
      "marketCap": 12668400000,
      "estimatedShares": 6210000,
      "listingDate": "2024-12-12",
      "liquidationDate": "2027-12-12",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 559,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.76,
      "annualizedReturn": 3.73,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": {
        "date": "2025-04-18 14:04",
        "title": "회사합병 결정(SPAC 소멸합병)",
        "company": "KB제31호스팩",
        "submitter": "케이비제31호기업인수목적",
        "receiptNo": "20250418000599",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250418000599"
      },
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": {
        "date": "2025-07-17 17:01",
        "title": "기업인수목적회사관련합병취소ㆍ부인사실발생",
        "company": "KB제31호스팩",
        "submitter": "케이비제31호기업인수목적",
        "receiptNo": "20250717000481",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250717000481"
      },
      "mergerDisclosures": [
        {
          "date": "2025-04-17 16:59",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "KB제31호스팩",
          "submitter": "케이비제31호기업인수목적",
          "receiptNo": "20250417000783",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250417000783",
          "mergerSignal": "applied"
        },
        {
          "date": "2025-04-17 16:59",
          "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "company": "KB제31호스팩",
          "submitter": "코스닥시장본부",
          "receiptNo": "20250417000791",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250417000791",
          "mergerSignal": "applied"
        },
        {
          "date": "2025-04-18 14:04",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "KB제31호스팩",
          "submitter": "케이비제31호기업인수목적",
          "receiptNo": "20250418000599",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250418000599",
          "mergerSignal": "applied"
        },
        {
          "date": "2025-07-17 17:00",
          "title": "회사합병 결정(SPAC소멸합병-철회)",
          "company": "KB제31호스팩",
          "submitter": "케이비제31호기업인수목적",
          "receiptNo": "20250717000432",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250717000432",
          "mergerSignal": "canceled"
        },
        {
          "date": "2025-07-17 17:01",
          "title": "주권매매거래정지해제(합병결정 철회)",
          "company": "KB제31호스팩",
          "submitter": "코스닥시장본부",
          "receiptNo": "20250717000478",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250717000478",
          "mergerSignal": "canceled"
        },
        {
          "date": "2025-07-17 17:01",
          "title": "기업인수목적회사관련합병취소ㆍ부인사실발생",
          "company": "KB제31호스팩",
          "submitter": "케이비제31호기업인수목적",
          "receiptNo": "20250717000481",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250717000481",
          "mergerSignal": "canceled"
        }
      ],
      "kind": {
        "name": "KB제31호스팩",
        "fullName": "케이비제31호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-12-12",
        "fiscalMonth": "12월",
        "ceo": "김형철",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "492220",
        "price": 2040,
        "change": 0,
        "changePct": 0.0,
        "volume": 2,
        "tradingValue": null,
        "marketCap": 12668400000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.978314+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 619
        },
        {
          "date": "2026-04-17",
          "close": 2070,
          "ratio": 1.035,
          "volume": 63
        },
        {
          "date": "2026-04-20",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 35
        },
        {
          "date": "2026-04-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 175
        },
        {
          "date": "2026-04-22",
          "close": 2060,
          "ratio": 1.03,
          "volume": 7
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5635
        },
        {
          "date": "2026-04-24",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 28147
        },
        {
          "date": "2026-04-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 37899
        },
        {
          "date": "2026-04-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 20663
        },
        {
          "date": "2026-04-29",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 20255
        },
        {
          "date": "2026-04-30",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 6003
        },
        {
          "date": "2026-05-04",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 11947
        },
        {
          "date": "2026-05-06",
          "close": 2030,
          "ratio": 1.015,
          "volume": 6467
        },
        {
          "date": "2026-05-07",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 10
        },
        {
          "date": "2026-05-08",
          "close": 2030,
          "ratio": 1.015,
          "volume": 397
        },
        {
          "date": "2026-05-11",
          "close": 2040,
          "ratio": 1.02,
          "volume": 50573
        },
        {
          "date": "2026-05-12",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 618
        },
        {
          "date": "2026-05-13",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 632
        },
        {
          "date": "2026-05-14",
          "close": 2040,
          "ratio": 1.02,
          "volume": 287
        },
        {
          "date": "2026-05-15",
          "close": 2040,
          "ratio": 1.02,
          "volume": 37872
        },
        {
          "date": "2026-05-18",
          "close": 2070,
          "ratio": 1.035,
          "volume": 80602
        },
        {
          "date": "2026-05-19",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 8551
        },
        {
          "date": "2026-05-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 3929
        },
        {
          "date": "2026-05-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 525
        },
        {
          "date": "2026-05-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 9483
        },
        {
          "date": "2026-05-26",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 10477
        },
        {
          "date": "2026-05-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1188
        },
        {
          "date": "2026-05-28",
          "close": 2040,
          "ratio": 1.02,
          "volume": 57757
        },
        {
          "date": "2026-05-29",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6529
        },
        {
          "date": "2026-06-01",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2
        }
      ],
      "events": [
        {
          "date": "2024-12-12",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-12-12"
        },
        {
          "date": "2025-04-18 14:04",
          "type": "merger_application",
          "label": "합병 신청",
          "detail": "회사합병 결정(SPAC 소멸합병)",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250418000599"
        },
        {
          "date": "2025-07-17 17:01",
          "type": "merger_canceled",
          "label": "합병 철회",
          "detail": "기업인수목적회사관련합병취소ㆍ부인사실발생",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250717000481"
        },
        {
          "date": "2027-12-12",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=KB제31호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=492220"
    },
    {
      "id": "0098T0",
      "code": "0098T0",
      "name": "교보19호스팩",
      "market": "KOSDAQ",
      "isin": "KR70098T0004",
      "sponsor": "교보",
      "ipoPrice": 2000,
      "currentPrice": 2040,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.02,
      "premiumPct": 2.0,
      "volume": null,
      "tradingValue": null,
      "marketCap": 11016000000,
      "estimatedShares": 5400000,
      "listingDate": "2025-12-12",
      "liquidationDate": "2028-12-12",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 925,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.77,
      "annualizedReturn": 2.24,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "교보19호스팩",
        "fullName": "교보19호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수 및 합병",
        "listingDate": "2025-12-12",
        "fiscalMonth": "12월",
        "ceo": "박인영",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0098T0",
        "price": 2040,
        "change": 0,
        "changePct": 0.0,
        "volume": null,
        "tradingValue": null,
        "marketCap": 11016000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.116423+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 874
        },
        {
          "date": "2026-04-17",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 4284
        },
        {
          "date": "2026-04-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 6042
        },
        {
          "date": "2026-04-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 990
        },
        {
          "date": "2026-04-22",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 943
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 3652
        },
        {
          "date": "2026-04-24",
          "close": 2050,
          "ratio": 1.025,
          "volume": 21383
        },
        {
          "date": "2026-04-27",
          "close": 2030,
          "ratio": 1.015,
          "volume": 9842
        },
        {
          "date": "2026-04-28",
          "close": 2030,
          "ratio": 1.015,
          "volume": 5884
        },
        {
          "date": "2026-04-29",
          "close": 2040,
          "ratio": 1.02,
          "volume": 20512
        },
        {
          "date": "2026-04-30",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 6906
        },
        {
          "date": "2026-05-04",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 4417
        },
        {
          "date": "2026-05-06",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 5575
        },
        {
          "date": "2026-05-07",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 4733
        },
        {
          "date": "2026-05-08",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 4275
        },
        {
          "date": "2026-05-11",
          "close": 2040,
          "ratio": 1.02,
          "volume": 30213
        },
        {
          "date": "2026-05-12",
          "close": 2040,
          "ratio": 1.02,
          "volume": 1198
        },
        {
          "date": "2026-05-13",
          "close": 2040,
          "ratio": 1.02,
          "volume": 155
        },
        {
          "date": "2026-05-14",
          "close": 2030,
          "ratio": 1.015,
          "volume": 852
        },
        {
          "date": "2026-05-15",
          "close": 2020,
          "ratio": 1.01,
          "volume": 1925
        },
        {
          "date": "2026-05-18",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 8897
        },
        {
          "date": "2026-05-19",
          "close": 2030,
          "ratio": 1.015,
          "volume": 9786
        },
        {
          "date": "2026-05-20",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 471
        },
        {
          "date": "2026-05-21",
          "close": 2020,
          "ratio": 1.01,
          "volume": 3420
        },
        {
          "date": "2026-05-22",
          "close": 2030,
          "ratio": 1.015,
          "volume": 844
        },
        {
          "date": "2026-05-26",
          "close": 2020,
          "ratio": 1.01,
          "volume": 546
        },
        {
          "date": "2026-05-27",
          "close": 2015,
          "ratio": 1.0075,
          "volume": 7109
        },
        {
          "date": "2026-05-28",
          "close": 2020,
          "ratio": 1.01,
          "volume": 958
        },
        {
          "date": "2026-05-29",
          "close": 2040,
          "ratio": 1.02,
          "volume": 21669
        },
        {
          "date": "2026-06-01",
          "close": 2040,
          "ratio": 1.02,
          "volume": 0
        }
      ],
      "events": [
        {
          "date": "2025-12-12",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-12"
        },
        {
          "date": "2028-12-12",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=교보19호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0098T0"
    },
    {
      "id": "473950",
      "code": "473950",
      "name": "에스케이증권제13호스팩",
      "market": "KOSDAQ",
      "isin": "KR7473950004",
      "sponsor": "에스케이증권",
      "ipoPrice": 2000,
      "currentPrice": 2040,
      "change": -5,
      "changePct": -0.24,
      "ratio": 1.02,
      "premiumPct": 2.0,
      "volume": 8,
      "tradingValue": null,
      "marketCap": 9016800000,
      "estimatedShares": 4420000,
      "listingDate": null,
      "liquidationDate": null,
      "liquidationDateSource": null,
      "daysToLiquidation": null,
      "trustValuePerShare": 2000.0,
      "liquidationValuePerShare": 2000.0,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -1.96,
      "annualizedReturn": null,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {},
      "quote": {
        "code": "473950",
        "price": 2040,
        "change": -5,
        "changePct": -0.24,
        "volume": 8,
        "tradingValue": null,
        "marketCap": 9016800000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.67892+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 3950
        },
        {
          "date": "2026-04-17",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 9524
        },
        {
          "date": "2026-04-20",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 14661
        },
        {
          "date": "2026-04-21",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 10057
        },
        {
          "date": "2026-04-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1036
        },
        {
          "date": "2026-04-23",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 22177
        },
        {
          "date": "2026-04-24",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2589
        },
        {
          "date": "2026-04-27",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 33458
        },
        {
          "date": "2026-04-28",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2948
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 3295
        },
        {
          "date": "2026-04-30",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6414
        },
        {
          "date": "2026-05-04",
          "close": 2030,
          "ratio": 1.015,
          "volume": 5720
        },
        {
          "date": "2026-05-06",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1505
        },
        {
          "date": "2026-05-07",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 2729
        },
        {
          "date": "2026-05-08",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1758
        },
        {
          "date": "2026-05-11",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 340
        },
        {
          "date": "2026-05-12",
          "close": 2030,
          "ratio": 1.015,
          "volume": 3521
        },
        {
          "date": "2026-05-13",
          "close": 2030,
          "ratio": 1.015,
          "volume": 6606
        },
        {
          "date": "2026-05-14",
          "close": 2030,
          "ratio": 1.015,
          "volume": 4368
        },
        {
          "date": "2026-05-15",
          "close": 2030,
          "ratio": 1.015,
          "volume": 2384
        },
        {
          "date": "2026-05-18",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1582
        },
        {
          "date": "2026-05-19",
          "close": 2030,
          "ratio": 1.015,
          "volume": 7921
        },
        {
          "date": "2026-05-20",
          "close": 2030,
          "ratio": 1.015,
          "volume": 8434
        },
        {
          "date": "2026-05-21",
          "close": 2030,
          "ratio": 1.015,
          "volume": 7
        },
        {
          "date": "2026-05-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 8790
        },
        {
          "date": "2026-05-26",
          "close": 2030,
          "ratio": 1.015,
          "volume": 3613
        },
        {
          "date": "2026-05-27",
          "close": 2040,
          "ratio": 1.02,
          "volume": 1429
        },
        {
          "date": "2026-05-28",
          "close": 2040,
          "ratio": 1.02,
          "volume": 18625
        },
        {
          "date": "2026-05-29",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 53210
        },
        {
          "date": "2026-06-01",
          "close": 2040,
          "ratio": 1.02,
          "volume": 8
        }
      ],
      "events": [],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=에스케이증권제13호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=473950"
    },
    {
      "id": "478390",
      "code": "478390",
      "name": "KB제29호스팩",
      "market": "KOSDAQ",
      "isin": "KR7478390008",
      "sponsor": "KB",
      "ipoPrice": 2000,
      "currentPrice": 2045,
      "change": -20,
      "changePct": -0.97,
      "ratio": 1.0225,
      "premiumPct": 2.25,
      "volume": 4244,
      "tradingValue": 9000000,
      "marketCap": 12719900000,
      "estimatedShares": 6220000,
      "listingDate": "2024-06-21",
      "liquidationDate": "2027-06-21",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 385,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.5,
      "annualizedReturn": 5.21,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "KB제29호스팩",
        "fullName": "케이비제29호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-06-21",
        "fiscalMonth": "12월",
        "ceo": "서영화",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "478390",
        "price": 2045,
        "change": -20,
        "changePct": -0.97,
        "volume": 4244,
        "tradingValue": 9000000,
        "marketCap": 12719900000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.972724+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 362
        },
        {
          "date": "2026-04-17",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 319
        },
        {
          "date": "2026-04-20",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 800
        },
        {
          "date": "2026-04-21",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 11318
        },
        {
          "date": "2026-04-22",
          "close": 2070,
          "ratio": 1.035,
          "volume": 44
        },
        {
          "date": "2026-04-23",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 8764
        },
        {
          "date": "2026-04-24",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 11948
        },
        {
          "date": "2026-04-27",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 16381
        },
        {
          "date": "2026-04-28",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 11843
        },
        {
          "date": "2026-04-29",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 30088
        },
        {
          "date": "2026-04-30",
          "close": 2070,
          "ratio": 1.035,
          "volume": 9520
        },
        {
          "date": "2026-05-04",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 2427
        },
        {
          "date": "2026-05-06",
          "close": 2070,
          "ratio": 1.035,
          "volume": 683
        },
        {
          "date": "2026-05-07",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 23189
        },
        {
          "date": "2026-05-08",
          "close": 2050,
          "ratio": 1.025,
          "volume": 4337
        },
        {
          "date": "2026-05-11",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 32969
        },
        {
          "date": "2026-05-12",
          "close": 2060,
          "ratio": 1.03,
          "volume": 5532
        },
        {
          "date": "2026-05-13",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 2040
        },
        {
          "date": "2026-05-14",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 159753
        },
        {
          "date": "2026-05-15",
          "close": 2080,
          "ratio": 1.04,
          "volume": 34202
        },
        {
          "date": "2026-05-18",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 1101
        },
        {
          "date": "2026-05-19",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 3891
        },
        {
          "date": "2026-05-20",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 955
        },
        {
          "date": "2026-05-21",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 1471
        },
        {
          "date": "2026-05-22",
          "close": 2070,
          "ratio": 1.035,
          "volume": 2229
        },
        {
          "date": "2026-05-26",
          "close": 2070,
          "ratio": 1.035,
          "volume": 2697
        },
        {
          "date": "2026-05-27",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 1656
        },
        {
          "date": "2026-05-28",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 8060
        },
        {
          "date": "2026-05-29",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 2360
        },
        {
          "date": "2026-06-01",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 4244
        }
      ],
      "events": [
        {
          "date": "2024-06-21",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-06-21"
        },
        {
          "date": "2027-06-21",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=KB제29호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=478390"
    },
    {
      "id": "477380",
      "code": "477380",
      "name": "미래에셋비전스팩4호",
      "market": "KOSDAQ",
      "isin": "KR7477380000",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 2045,
      "change": -10,
      "changePct": -0.49,
      "ratio": 1.0225,
      "premiumPct": 2.25,
      "volume": 6723,
      "tradingValue": 14000000,
      "marketCap": 16564500000,
      "estimatedShares": 8100000,
      "listingDate": "2024-05-29",
      "liquidationDate": "2027-05-29",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 362,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.5,
      "annualizedReturn": 5.55,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "미래에셋비전스팩4호",
        "fullName": "미래에셋비전기업인수목적4호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수목적회사(기타금융서비스)",
        "listingDate": "2024-05-29",
        "fiscalMonth": "12월",
        "ceo": "김정수",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "477380",
        "price": 2045,
        "change": -10,
        "changePct": -0.49,
        "volume": 6723,
        "tradingValue": 14000000,
        "marketCap": 16564500000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.322432+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2060,
          "ratio": 1.03,
          "volume": 10613
        },
        {
          "date": "2026-04-17",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 9303
        },
        {
          "date": "2026-04-20",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 19628
        },
        {
          "date": "2026-04-21",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 9908
        },
        {
          "date": "2026-04-22",
          "close": 2060,
          "ratio": 1.03,
          "volume": 761
        },
        {
          "date": "2026-04-23",
          "close": 2060,
          "ratio": 1.03,
          "volume": 6691
        },
        {
          "date": "2026-04-24",
          "close": 2060,
          "ratio": 1.03,
          "volume": 2827
        },
        {
          "date": "2026-04-27",
          "close": 2060,
          "ratio": 1.03,
          "volume": 19448
        },
        {
          "date": "2026-04-28",
          "close": 2060,
          "ratio": 1.03,
          "volume": 12928
        },
        {
          "date": "2026-04-29",
          "close": 2060,
          "ratio": 1.03,
          "volume": 20646
        },
        {
          "date": "2026-04-30",
          "close": 2060,
          "ratio": 1.03,
          "volume": 8961
        },
        {
          "date": "2026-05-04",
          "close": 2060,
          "ratio": 1.03,
          "volume": 4026
        },
        {
          "date": "2026-05-06",
          "close": 2060,
          "ratio": 1.03,
          "volume": 2710
        },
        {
          "date": "2026-05-07",
          "close": 2060,
          "ratio": 1.03,
          "volume": 3783
        },
        {
          "date": "2026-05-08",
          "close": 2060,
          "ratio": 1.03,
          "volume": 8894
        },
        {
          "date": "2026-05-11",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 8595
        },
        {
          "date": "2026-05-12",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 6562
        },
        {
          "date": "2026-05-13",
          "close": 2060,
          "ratio": 1.03,
          "volume": 72426
        },
        {
          "date": "2026-05-14",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 19687
        },
        {
          "date": "2026-05-15",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 36644
        },
        {
          "date": "2026-05-18",
          "close": 2060,
          "ratio": 1.03,
          "volume": 29653
        },
        {
          "date": "2026-05-19",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 10248
        },
        {
          "date": "2026-05-20",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 19709
        },
        {
          "date": "2026-05-21",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 26090
        },
        {
          "date": "2026-05-22",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 13587
        },
        {
          "date": "2026-05-26",
          "close": 2060,
          "ratio": 1.03,
          "volume": 16896
        },
        {
          "date": "2026-05-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 15536
        },
        {
          "date": "2026-05-28",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 13817
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 5983
        },
        {
          "date": "2026-06-01",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 6723
        }
      ],
      "events": [
        {
          "date": "2024-05-29",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-05-29"
        },
        {
          "date": "2027-05-29",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩4호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=477380"
    },
    {
      "id": "473000",
      "code": "473000",
      "name": "에스케이증권제12호스팩",
      "market": "KOSDAQ",
      "isin": "KR7473000008",
      "sponsor": "에스케이증권",
      "ipoPrice": 2000,
      "currentPrice": 2045,
      "change": -10,
      "changePct": -0.49,
      "ratio": 1.0225,
      "premiumPct": 2.25,
      "volume": 284,
      "tradingValue": 1000000,
      "marketCap": 6768950000,
      "estimatedShares": 3310000,
      "listingDate": null,
      "liquidationDate": null,
      "liquidationDateSource": null,
      "daysToLiquidation": null,
      "trustValuePerShare": 2000.0,
      "liquidationValuePerShare": 2000.0,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -2.2,
      "annualizedReturn": null,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {},
      "quote": {
        "code": "473000",
        "price": 2045,
        "change": -10,
        "changePct": -0.49,
        "volume": 284,
        "tradingValue": 1000000,
        "marketCap": 6768950000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.584543+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2050,
          "ratio": 1.025,
          "volume": 32
        },
        {
          "date": "2026-04-17",
          "close": 2050,
          "ratio": 1.025,
          "volume": 4
        },
        {
          "date": "2026-04-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 3399
        },
        {
          "date": "2026-04-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 414
        },
        {
          "date": "2026-04-22",
          "close": 2060,
          "ratio": 1.03,
          "volume": 5
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 87
        },
        {
          "date": "2026-04-24",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 509
        },
        {
          "date": "2026-04-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1050
        },
        {
          "date": "2026-04-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1569
        },
        {
          "date": "2026-04-29",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 6477
        },
        {
          "date": "2026-04-30",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 25004
        },
        {
          "date": "2026-05-04",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 2176
        },
        {
          "date": "2026-05-06",
          "close": 2060,
          "ratio": 1.03,
          "volume": 843
        },
        {
          "date": "2026-05-07",
          "close": 2050,
          "ratio": 1.025,
          "volume": 310
        },
        {
          "date": "2026-05-08",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1529
        },
        {
          "date": "2026-05-11",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 1015
        },
        {
          "date": "2026-05-12",
          "close": 2050,
          "ratio": 1.025,
          "volume": 6499
        },
        {
          "date": "2026-05-13",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1001
        },
        {
          "date": "2026-05-14",
          "close": 2050,
          "ratio": 1.025,
          "volume": 12
        },
        {
          "date": "2026-05-15",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 10
        },
        {
          "date": "2026-05-18",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1606
        },
        {
          "date": "2026-05-19",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 9279
        },
        {
          "date": "2026-05-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 7467
        },
        {
          "date": "2026-05-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2189
        },
        {
          "date": "2026-05-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 10661
        },
        {
          "date": "2026-05-26",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1302
        },
        {
          "date": "2026-05-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 672
        },
        {
          "date": "2026-05-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5529
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1620
        },
        {
          "date": "2026-06-01",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 284
        }
      ],
      "events": [],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=에스케이증권제12호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=473000"
    },
    {
      "id": "474490",
      "code": "474490",
      "name": "유안타제16호스팩",
      "market": "KOSDAQ",
      "isin": "KR7474490000",
      "sponsor": "유안타",
      "ipoPrice": 2000,
      "currentPrice": 2045,
      "change": -5,
      "changePct": -0.24,
      "ratio": 1.0225,
      "premiumPct": 2.25,
      "volume": 286,
      "tradingValue": 1000000,
      "marketCap": 11267950000,
      "estimatedShares": 5510000,
      "listingDate": "2024-05-02",
      "liquidationDate": "2027-05-02",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 335,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.5,
      "annualizedReturn": 6.01,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "유안타제16호스팩",
        "fullName": "유안타제16호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스(기업인수목적회사)",
        "listingDate": "2024-05-02",
        "fiscalMonth": "12월",
        "ceo": "박병권",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "474490",
        "price": 2045,
        "change": -5,
        "changePct": -0.24,
        "volume": 286,
        "tradingValue": 1000000,
        "marketCap": 11267950000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.788741+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 8072
        },
        {
          "date": "2026-04-17",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 5581
        },
        {
          "date": "2026-04-20",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 39
        },
        {
          "date": "2026-04-21",
          "close": 2040,
          "ratio": 1.02,
          "volume": 373
        },
        {
          "date": "2026-04-22",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 6668
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 37288
        },
        {
          "date": "2026-04-24",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 23017
        },
        {
          "date": "2026-04-27",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 21273
        },
        {
          "date": "2026-04-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 8177
        },
        {
          "date": "2026-04-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 143969
        },
        {
          "date": "2026-04-30",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 6711
        },
        {
          "date": "2026-05-04",
          "close": 2050,
          "ratio": 1.025,
          "volume": 6992
        },
        {
          "date": "2026-05-06",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5738
        },
        {
          "date": "2026-05-07",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1020
        },
        {
          "date": "2026-05-08",
          "close": 2052,
          "ratio": 1.026,
          "volume": 249
        },
        {
          "date": "2026-05-11",
          "close": 2050,
          "ratio": 1.025,
          "volume": 69543
        },
        {
          "date": "2026-05-12",
          "close": 2040,
          "ratio": 1.02,
          "volume": 24378
        },
        {
          "date": "2026-05-13",
          "close": 2040,
          "ratio": 1.02,
          "volume": 19551
        },
        {
          "date": "2026-05-14",
          "close": 2050,
          "ratio": 1.025,
          "volume": 175
        },
        {
          "date": "2026-05-15",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 13309
        },
        {
          "date": "2026-05-18",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 20585
        },
        {
          "date": "2026-05-19",
          "close": 2050,
          "ratio": 1.025,
          "volume": 17974
        },
        {
          "date": "2026-05-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 3925
        },
        {
          "date": "2026-05-21",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 765
        },
        {
          "date": "2026-05-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 12009
        },
        {
          "date": "2026-05-26",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2699
        },
        {
          "date": "2026-05-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1608
        },
        {
          "date": "2026-05-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2
        },
        {
          "date": "2026-05-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 8172
        },
        {
          "date": "2026-06-01",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 286
        }
      ],
      "events": [
        {
          "date": "2024-05-02",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-05-02"
        },
        {
          "date": "2027-05-02",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=유안타제16호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=474490"
    },
    {
      "id": "498390",
      "code": "498390",
      "name": "한화플러스제5호스팩",
      "market": "KOSDAQ",
      "isin": "KR7498390004",
      "sponsor": "한화플러스",
      "ipoPrice": 2000,
      "currentPrice": 2045,
      "change": -5,
      "changePct": -0.24,
      "ratio": 1.0225,
      "premiumPct": 2.25,
      "volume": 50,
      "tradingValue": null,
      "marketCap": 10143200000,
      "estimatedShares": 4960000,
      "listingDate": "2025-03-20",
      "liquidationDate": "2028-03-20",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 658,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.51,
      "annualizedReturn": 3.02,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "한화플러스제5호스팩",
        "fullName": "한화플러스제5호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "-",
        "listingDate": "2025-03-20",
        "fiscalMonth": "12월",
        "ceo": "김광후",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "498390",
        "price": 2045,
        "change": -5,
        "changePct": -0.24,
        "volume": 50,
        "tradingValue": null,
        "marketCap": 10143200000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.938467+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2030,
          "ratio": 1.015,
          "volume": 6881
        },
        {
          "date": "2026-04-17",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 1058
        },
        {
          "date": "2026-04-20",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 6312
        },
        {
          "date": "2026-04-21",
          "close": 2030,
          "ratio": 1.015,
          "volume": 1667
        },
        {
          "date": "2026-04-22",
          "close": 2030,
          "ratio": 1.015,
          "volume": 7279
        },
        {
          "date": "2026-04-23",
          "close": 2030,
          "ratio": 1.015,
          "volume": 6709
        },
        {
          "date": "2026-04-24",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 11123
        },
        {
          "date": "2026-04-27",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 11917
        },
        {
          "date": "2026-04-28",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 11048
        },
        {
          "date": "2026-04-29",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 22052
        },
        {
          "date": "2026-04-30",
          "close": 2040,
          "ratio": 1.02,
          "volume": 37378
        },
        {
          "date": "2026-05-04",
          "close": 2040,
          "ratio": 1.02,
          "volume": 14717
        },
        {
          "date": "2026-05-06",
          "close": 2040,
          "ratio": 1.02,
          "volume": 12044
        },
        {
          "date": "2026-05-07",
          "close": 2050,
          "ratio": 1.025,
          "volume": 13353
        },
        {
          "date": "2026-05-08",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 12852
        },
        {
          "date": "2026-05-11",
          "close": 2040,
          "ratio": 1.02,
          "volume": 4117
        },
        {
          "date": "2026-05-12",
          "close": 2040,
          "ratio": 1.02,
          "volume": 6697
        },
        {
          "date": "2026-05-13",
          "close": 2060,
          "ratio": 1.03,
          "volume": 41075
        },
        {
          "date": "2026-05-14",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 15709
        },
        {
          "date": "2026-05-15",
          "close": 2030,
          "ratio": 1.015,
          "volume": 51306
        },
        {
          "date": "2026-05-18",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 9324
        },
        {
          "date": "2026-05-19",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 39817
        },
        {
          "date": "2026-05-20",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 1066
        },
        {
          "date": "2026-05-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 13283
        },
        {
          "date": "2026-05-22",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 9337
        },
        {
          "date": "2026-05-26",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 5035
        },
        {
          "date": "2026-05-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 19070
        },
        {
          "date": "2026-05-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 8312
        },
        {
          "date": "2026-05-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 6718
        },
        {
          "date": "2026-06-01",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 50
        }
      ],
      "events": [
        {
          "date": "2025-03-20",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-03-20"
        },
        {
          "date": "2028-03-20",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=한화플러스제5호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=498390"
    },
    {
      "id": "478440",
      "code": "478440",
      "name": "미래에셋비전스팩6호",
      "market": "KOSDAQ",
      "isin": "KR7478440001",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 2050,
      "change": -5,
      "changePct": -0.24,
      "ratio": 1.025,
      "premiumPct": 2.5,
      "volume": 253,
      "tradingValue": 1000000,
      "marketCap": 14206500000,
      "estimatedShares": 6930000,
      "listingDate": "2024-06-24",
      "liquidationDate": "2027-06-24",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 388,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.25,
      "annualizedReturn": 4.93,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "미래에셋비전스팩6호",
        "fullName": "미래에셋비전기업인수목적6호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-06-24",
        "fiscalMonth": "12월",
        "ceo": "정명훈",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "478440",
        "price": 2050,
        "change": -5,
        "changePct": -0.24,
        "volume": 253,
        "tradingValue": 1000000,
        "marketCap": 14206500000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.340538+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5134
        },
        {
          "date": "2026-04-17",
          "close": 2050,
          "ratio": 1.025,
          "volume": 6029
        },
        {
          "date": "2026-04-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 10105
        },
        {
          "date": "2026-04-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1378
        },
        {
          "date": "2026-04-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 138
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2300
        },
        {
          "date": "2026-04-24",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 892
        },
        {
          "date": "2026-04-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 593
        },
        {
          "date": "2026-04-28",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 17172
        },
        {
          "date": "2026-04-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1745
        },
        {
          "date": "2026-04-30",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 2436
        },
        {
          "date": "2026-05-04",
          "close": 2040,
          "ratio": 1.02,
          "volume": 2709
        },
        {
          "date": "2026-05-06",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 2963
        },
        {
          "date": "2026-05-07",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 6671
        },
        {
          "date": "2026-05-08",
          "close": 2040,
          "ratio": 1.02,
          "volume": 8563
        },
        {
          "date": "2026-05-11",
          "close": 2042,
          "ratio": 1.021,
          "volume": 4165
        },
        {
          "date": "2026-05-12",
          "close": 2050,
          "ratio": 1.025,
          "volume": 2944
        },
        {
          "date": "2026-05-13",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 8535
        },
        {
          "date": "2026-05-14",
          "close": 2050,
          "ratio": 1.025,
          "volume": 25616
        },
        {
          "date": "2026-05-15",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 12108
        },
        {
          "date": "2026-05-18",
          "close": 2050,
          "ratio": 1.025,
          "volume": 9565
        },
        {
          "date": "2026-05-19",
          "close": 2052,
          "ratio": 1.026,
          "volume": 5447
        },
        {
          "date": "2026-05-20",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 31117
        },
        {
          "date": "2026-05-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 21184
        },
        {
          "date": "2026-05-22",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 6075
        },
        {
          "date": "2026-05-26",
          "close": 2060,
          "ratio": 1.03,
          "volume": 2822
        },
        {
          "date": "2026-05-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 8856
        },
        {
          "date": "2026-05-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5822
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 16977
        },
        {
          "date": "2026-06-01",
          "close": 2050,
          "ratio": 1.025,
          "volume": 253
        }
      ],
      "events": [
        {
          "date": "2024-06-24",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-06-24"
        },
        {
          "date": "2027-06-24",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩6호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=478440"
    },
    {
      "id": "474660",
      "code": "474660",
      "name": "신한제12호스팩",
      "market": "KOSDAQ",
      "isin": "KR7474660008",
      "sponsor": "신한",
      "ipoPrice": 2000,
      "currentPrice": 2050,
      "change": -5,
      "changePct": -0.24,
      "ratio": 1.025,
      "premiumPct": 2.5,
      "volume": 1334,
      "tradingValue": 3000000,
      "marketCap": 11316000000,
      "estimatedShares": 5520000,
      "listingDate": "2024-04-15",
      "liquidationDate": "2027-04-15",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 318,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.25,
      "annualizedReturn": 6.05,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": {
        "date": "2025-11-26 16:04",
        "title": "회사합병 결정(SPAC 소멸합병)",
        "company": "신한제12호스팩",
        "submitter": "신한제12호기업인수목적",
        "receiptNo": "20251126000467",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251126000467"
      },
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": {
        "date": "2026-03-17 17:58",
        "title": "주권매매거래정지해제(합병결정 철회)",
        "company": "신한제12호스팩",
        "submitter": "코스닥시장본부",
        "receiptNo": "20260317001238",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260317001238"
      },
      "mergerDisclosures": [
        {
          "date": "2025-11-26 16:04",
          "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "company": "신한제12호스팩",
          "submitter": "코스닥시장본부",
          "receiptNo": "20251126000478",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251126000478",
          "mergerSignal": "applied"
        },
        {
          "date": "2025-11-26 16:04",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "신한제12호스팩",
          "submitter": "신한제12호기업인수목적",
          "receiptNo": "20251126000467",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251126000467",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-03-17 17:56",
          "title": "회사합병 결정(SPAC소멸합병-철회)",
          "company": "신한제12호스팩",
          "submitter": "신한제12호기업인수목적",
          "receiptNo": "20260317001186",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260317001186",
          "mergerSignal": "canceled"
        },
        {
          "date": "2026-03-17 17:56",
          "title": "기업인수목적회사관련합병취소ㆍ부인사실발생",
          "company": "신한제12호스팩",
          "submitter": "신한제12호기업인수목적",
          "receiptNo": "20260317001192",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260317001192",
          "mergerSignal": "canceled"
        },
        {
          "date": "2026-03-17 17:58",
          "title": "주권매매거래정지해제(합병결정 철회)",
          "company": "신한제12호스팩",
          "submitter": "코스닥시장본부",
          "receiptNo": "20260317001238",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260317001238",
          "mergerSignal": "canceled"
        }
      ],
      "kind": {
        "name": "신한제12호스팩",
        "fullName": "신한제12호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융서비스(기업인수목적회사)",
        "listingDate": "2024-04-15",
        "fiscalMonth": "12월",
        "ceo": "이동호",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "474660",
        "price": 2050,
        "change": -5,
        "changePct": -0.24,
        "volume": 1334,
        "tradingValue": 3000000,
        "marketCap": 11316000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.455043+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 14757
        },
        {
          "date": "2026-04-17",
          "close": 2050,
          "ratio": 1.025,
          "volume": 10850
        },
        {
          "date": "2026-04-20",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 959
        },
        {
          "date": "2026-04-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 6434
        },
        {
          "date": "2026-04-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 127
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 54976
        },
        {
          "date": "2026-04-24",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1059
        },
        {
          "date": "2026-04-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 5874
        },
        {
          "date": "2026-04-28",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 9905
        },
        {
          "date": "2026-04-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 684
        },
        {
          "date": "2026-04-30",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 7755
        },
        {
          "date": "2026-05-04",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 351
        },
        {
          "date": "2026-05-06",
          "close": 2050,
          "ratio": 1.025,
          "volume": 11681
        },
        {
          "date": "2026-05-07",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 2467
        },
        {
          "date": "2026-05-08",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 11555
        },
        {
          "date": "2026-05-11",
          "close": 2050,
          "ratio": 1.025,
          "volume": 23180
        },
        {
          "date": "2026-05-12",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 20604
        },
        {
          "date": "2026-05-13",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 30197
        },
        {
          "date": "2026-05-14",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 247473
        },
        {
          "date": "2026-05-15",
          "close": 2040,
          "ratio": 1.02,
          "volume": 26724
        },
        {
          "date": "2026-05-18",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 10894
        },
        {
          "date": "2026-05-19",
          "close": 2052,
          "ratio": 1.026,
          "volume": 13456
        },
        {
          "date": "2026-05-20",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 19762
        },
        {
          "date": "2026-05-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1098
        },
        {
          "date": "2026-05-22",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 924
        },
        {
          "date": "2026-05-26",
          "close": 2052,
          "ratio": 1.026,
          "volume": 466
        },
        {
          "date": "2026-05-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 7243
        },
        {
          "date": "2026-05-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 123
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 10330
        },
        {
          "date": "2026-06-01",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1334
        }
      ],
      "events": [
        {
          "date": "2024-04-15",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-04-15"
        },
        {
          "date": "2025-11-26 16:04",
          "type": "merger_application",
          "label": "합병 신청",
          "detail": "회사합병 결정(SPAC 소멸합병)",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251126000467"
        },
        {
          "date": "2026-03-17 17:58",
          "type": "merger_canceled",
          "label": "합병 철회",
          "detail": "주권매매거래정지해제(합병결정 철회)",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260317001238"
        },
        {
          "date": "2027-04-15",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신한제12호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=474660"
    },
    {
      "id": "479880",
      "code": "479880",
      "name": "한국제15호스팩",
      "market": "KOSDAQ",
      "isin": "KR7479880007",
      "sponsor": "한국",
      "ipoPrice": 2000,
      "currentPrice": 2050,
      "change": -5,
      "changePct": -0.24,
      "ratio": 1.025,
      "premiumPct": 2.5,
      "volume": 546,
      "tradingValue": 1000000,
      "marketCap": 14083500000,
      "estimatedShares": 6870000,
      "listingDate": "2024-06-26",
      "liquidationDate": "2027-06-26",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 390,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 5.25,
      "annualizedReturn": 4.9,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "한국제15호스팩",
        "fullName": "한국제15호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-06-26",
        "fiscalMonth": "12월",
        "ceo": "유한",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "479880",
        "price": 2050,
        "change": -5,
        "changePct": -0.24,
        "volume": 546,
        "tradingValue": 1000000,
        "marketCap": 14083500000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.919747+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 1249
        },
        {
          "date": "2026-04-17",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 5423
        },
        {
          "date": "2026-04-20",
          "close": 2050,
          "ratio": 1.025,
          "volume": 242
        },
        {
          "date": "2026-04-21",
          "close": 2050,
          "ratio": 1.025,
          "volume": 7397
        },
        {
          "date": "2026-04-22",
          "close": 2050,
          "ratio": 1.025,
          "volume": 589
        },
        {
          "date": "2026-04-23",
          "close": 2050,
          "ratio": 1.025,
          "volume": 611
        },
        {
          "date": "2026-04-24",
          "close": 2050,
          "ratio": 1.025,
          "volume": 601
        },
        {
          "date": "2026-04-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 6715
        },
        {
          "date": "2026-04-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 25209
        },
        {
          "date": "2026-04-29",
          "close": 2050,
          "ratio": 1.025,
          "volume": 7114
        },
        {
          "date": "2026-04-30",
          "close": 2050,
          "ratio": 1.025,
          "volume": 105
        },
        {
          "date": "2026-05-04",
          "close": 2050,
          "ratio": 1.025,
          "volume": 693
        },
        {
          "date": "2026-05-06",
          "close": 2050,
          "ratio": 1.025,
          "volume": 1428
        },
        {
          "date": "2026-05-07",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 4209
        },
        {
          "date": "2026-05-08",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 21074
        },
        {
          "date": "2026-05-11",
          "close": 2050,
          "ratio": 1.025,
          "volume": 8261
        },
        {
          "date": "2026-05-12",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 31255
        },
        {
          "date": "2026-05-13",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 10962
        },
        {
          "date": "2026-05-14",
          "close": 2060,
          "ratio": 1.03,
          "volume": 16473
        },
        {
          "date": "2026-05-15",
          "close": 2060,
          "ratio": 1.03,
          "volume": 7758
        },
        {
          "date": "2026-05-18",
          "close": 2060,
          "ratio": 1.03,
          "volume": 4614
        },
        {
          "date": "2026-05-19",
          "close": 2060,
          "ratio": 1.03,
          "volume": 3690
        },
        {
          "date": "2026-05-20",
          "close": 2060,
          "ratio": 1.03,
          "volume": 12901
        },
        {
          "date": "2026-05-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 22780
        },
        {
          "date": "2026-05-22",
          "close": 2060,
          "ratio": 1.03,
          "volume": 105
        },
        {
          "date": "2026-05-26",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 463
        },
        {
          "date": "2026-05-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 2247
        },
        {
          "date": "2026-05-28",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 2578
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 2192
        },
        {
          "date": "2026-06-01",
          "close": 2050,
          "ratio": 1.025,
          "volume": 546
        }
      ],
      "events": [
        {
          "date": "2024-06-26",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-06-26"
        },
        {
          "date": "2027-06-26",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=한국제15호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=479880"
    },
    {
      "id": "482680",
      "code": "482680",
      "name": "미래에셋비전스팩7호",
      "market": "KOSDAQ",
      "isin": "KR7482680006",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 2055,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0275,
      "premiumPct": 2.75,
      "volume": null,
      "tradingValue": null,
      "marketCap": 16881825000,
      "estimatedShares": 8215000,
      "listingDate": "2024-09-11",
      "liquidationDate": "2027-09-11",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 467,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 4.99,
      "annualizedReturn": 3.88,
      "status": "합병 신청",
      "badges": [
        "합병 신청",
        "거래정지"
      ],
      "mergerStatus": "합병 신청",
      "mergerApplicationDisclosure": {
        "date": "2026-05-12 17:25",
        "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
        "company": "미래에셋비전스팩7호",
        "submitter": "코스닥시장본부",
        "receiptNo": "20260512000907",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260512000907"
      },
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [
        {
          "date": "2026-05-12 17:25",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "미래에셋비전스팩7호",
          "submitter": "미래에셋비전기업인수목적7호",
          "receiptNo": "20260512000891",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260512000891",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-05-12 17:25",
          "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "company": "미래에셋비전스팩7호",
          "submitter": "코스닥시장본부",
          "receiptNo": "20260512000907",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260512000907",
          "mergerSignal": "applied"
        }
      ],
      "kind": {
        "name": "미래에셋비전스팩7호",
        "fullName": "미래에셋비전기업인수목적7호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-09-11",
        "fiscalMonth": "12월",
        "ceo": "송우영",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "482680",
        "price": 2055,
        "change": 0,
        "changePct": 0.0,
        "volume": null,
        "tradingValue": null,
        "marketCap": 16881825000,
        "marketStatus": "OPEN",
        "tradeStop": true,
        "tradeStopText": "정지.Halted",
        "tradedAt": "2026-06-01T09:29:43.321033+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 8357
        },
        {
          "date": "2026-04-17",
          "close": 2040,
          "ratio": 1.02,
          "volume": 29511
        },
        {
          "date": "2026-04-20",
          "close": 2040,
          "ratio": 1.02,
          "volume": 36413
        },
        {
          "date": "2026-04-21",
          "close": 2030,
          "ratio": 1.015,
          "volume": 9362
        },
        {
          "date": "2026-04-22",
          "close": 2035,
          "ratio": 1.0175,
          "volume": 5824
        },
        {
          "date": "2026-04-23",
          "close": 2030,
          "ratio": 1.015,
          "volume": 15305
        },
        {
          "date": "2026-04-24",
          "close": 2030,
          "ratio": 1.015,
          "volume": 704
        },
        {
          "date": "2026-04-27",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 11538
        },
        {
          "date": "2026-04-28",
          "close": 2025,
          "ratio": 1.0125,
          "volume": 61376
        },
        {
          "date": "2026-04-29",
          "close": 2040,
          "ratio": 1.02,
          "volume": 75805
        },
        {
          "date": "2026-04-30",
          "close": 2030,
          "ratio": 1.015,
          "volume": 18371
        },
        {
          "date": "2026-05-04",
          "close": 2030,
          "ratio": 1.015,
          "volume": 23926
        },
        {
          "date": "2026-05-06",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 73490
        },
        {
          "date": "2026-05-07",
          "close": 2050,
          "ratio": 1.025,
          "volume": 47500
        },
        {
          "date": "2026-05-08",
          "close": 2060,
          "ratio": 1.03,
          "volume": 7142
        },
        {
          "date": "2026-05-11",
          "close": 2060,
          "ratio": 1.03,
          "volume": 26351
        },
        {
          "date": "2026-05-12",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 14740
        },
        {
          "date": "2026-05-13",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-14",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-15",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-18",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-19",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-20",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-21",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-22",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-26",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-27",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-28",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-05-29",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        },
        {
          "date": "2026-06-01",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 0
        }
      ],
      "events": [
        {
          "date": "2024-09-11",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-09-11"
        },
        {
          "date": "2026-05-12 17:25",
          "type": "merger_application",
          "label": "합병 신청",
          "detail": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260512000907"
        },
        {
          "date": "2027-09-11",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩7호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=482680"
    },
    {
      "id": "0091W0",
      "code": "0091W0",
      "name": "신영스팩11호",
      "market": "KOSDAQ",
      "isin": "KR70091W0006",
      "sponsor": "신영",
      "ipoPrice": 2000,
      "currentPrice": 2060,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.03,
      "premiumPct": 3.0,
      "volume": null,
      "tradingValue": null,
      "marketCap": 12500080000,
      "estimatedShares": 6068000,
      "listingDate": "2025-11-24",
      "liquidationDate": "2028-11-24",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 907,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 4.74,
      "annualizedReturn": 1.88,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신영스팩11호",
        "fullName": "신영해피투모로우제11호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-11-24",
        "fiscalMonth": "12월",
        "ceo": "김인한",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0091W0",
        "price": 2060,
        "change": 0,
        "changePct": 0.0,
        "volume": null,
        "tradingValue": null,
        "marketCap": 12500080000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.435282+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 6955
        },
        {
          "date": "2026-04-17",
          "close": 2070,
          "ratio": 1.035,
          "volume": 12979
        },
        {
          "date": "2026-04-20",
          "close": 2070,
          "ratio": 1.035,
          "volume": 52874
        },
        {
          "date": "2026-04-21",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 32437
        },
        {
          "date": "2026-04-22",
          "close": 2080,
          "ratio": 1.04,
          "volume": 11521
        },
        {
          "date": "2026-04-23",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 15819
        },
        {
          "date": "2026-04-24",
          "close": 2080,
          "ratio": 1.04,
          "volume": 21373
        },
        {
          "date": "2026-04-27",
          "close": 2070,
          "ratio": 1.035,
          "volume": 11861
        },
        {
          "date": "2026-04-28",
          "close": 2060,
          "ratio": 1.03,
          "volume": 853
        },
        {
          "date": "2026-04-29",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 24034
        },
        {
          "date": "2026-04-30",
          "close": 2080,
          "ratio": 1.04,
          "volume": 8322
        },
        {
          "date": "2026-05-04",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 14982
        },
        {
          "date": "2026-05-06",
          "close": 2077,
          "ratio": 1.0385,
          "volume": 401
        },
        {
          "date": "2026-05-07",
          "close": 2070,
          "ratio": 1.035,
          "volume": 607
        },
        {
          "date": "2026-05-08",
          "close": 2070,
          "ratio": 1.035,
          "volume": 1310
        },
        {
          "date": "2026-05-11",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 16331
        },
        {
          "date": "2026-05-12",
          "close": 2060,
          "ratio": 1.03,
          "volume": 3010
        },
        {
          "date": "2026-05-13",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 30501
        },
        {
          "date": "2026-05-14",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 10246
        },
        {
          "date": "2026-05-15",
          "close": 2070,
          "ratio": 1.035,
          "volume": 1714
        },
        {
          "date": "2026-05-18",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 878
        },
        {
          "date": "2026-05-19",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 1988
        },
        {
          "date": "2026-05-20",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 5910
        },
        {
          "date": "2026-05-21",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 3209
        },
        {
          "date": "2026-05-22",
          "close": 2062,
          "ratio": 1.031,
          "volume": 2394
        },
        {
          "date": "2026-05-26",
          "close": 2060,
          "ratio": 1.03,
          "volume": 1814
        },
        {
          "date": "2026-05-27",
          "close": 2050,
          "ratio": 1.025,
          "volume": 37541
        },
        {
          "date": "2026-05-28",
          "close": 2045,
          "ratio": 1.0225,
          "volume": 5826
        },
        {
          "date": "2026-05-29",
          "close": 2060,
          "ratio": 1.03,
          "volume": 29640
        },
        {
          "date": "2026-06-01",
          "close": 2060,
          "ratio": 1.03,
          "volume": 0
        }
      ],
      "events": [
        {
          "date": "2025-11-24",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-11-24"
        },
        {
          "date": "2028-11-24",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신영스팩11호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0091W0"
    },
    {
      "id": "469900",
      "code": "469900",
      "name": "하나31호스팩",
      "market": "KOSDAQ",
      "isin": "KR7469900005",
      "sponsor": "하나",
      "ipoPrice": 2000,
      "currentPrice": 2065,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0325,
      "premiumPct": 3.25,
      "volume": 3276,
      "tradingValue": 7000000,
      "marketCap": 11574325000,
      "estimatedShares": 5605000,
      "listingDate": "2024-03-05",
      "liquidationDate": "2027-03-05",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 277,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 4.48,
      "annualizedReturn": 5.95,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "하나31호스팩",
        "fullName": "하나31호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-03-05",
        "fiscalMonth": "12월",
        "ceo": "한규정",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "469900",
        "price": 2065,
        "change": 0,
        "changePct": 0.0,
        "volume": 3276,
        "tradingValue": 7000000,
        "marketCap": 11574325000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.905848+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2060,
          "ratio": 1.03,
          "volume": 815
        },
        {
          "date": "2026-04-17",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 1054
        },
        {
          "date": "2026-04-20",
          "close": 2060,
          "ratio": 1.03,
          "volume": 2407
        },
        {
          "date": "2026-04-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 3932
        },
        {
          "date": "2026-04-22",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 2534
        },
        {
          "date": "2026-04-23",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 20131
        },
        {
          "date": "2026-04-24",
          "close": 2070,
          "ratio": 1.035,
          "volume": 15124
        },
        {
          "date": "2026-04-27",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 4172
        },
        {
          "date": "2026-04-28",
          "close": 2060,
          "ratio": 1.03,
          "volume": 6944
        },
        {
          "date": "2026-04-29",
          "close": 2060,
          "ratio": 1.03,
          "volume": 4318
        },
        {
          "date": "2026-04-30",
          "close": 2060,
          "ratio": 1.03,
          "volume": 4153
        },
        {
          "date": "2026-05-04",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 9498
        },
        {
          "date": "2026-05-06",
          "close": 2060,
          "ratio": 1.03,
          "volume": 3432
        },
        {
          "date": "2026-05-07",
          "close": 2060,
          "ratio": 1.03,
          "volume": 2630
        },
        {
          "date": "2026-05-08",
          "close": 2060,
          "ratio": 1.03,
          "volume": 560
        },
        {
          "date": "2026-05-11",
          "close": 2060,
          "ratio": 1.03,
          "volume": 1229
        },
        {
          "date": "2026-05-12",
          "close": 2060,
          "ratio": 1.03,
          "volume": 6558
        },
        {
          "date": "2026-05-13",
          "close": 2070,
          "ratio": 1.035,
          "volume": 24353
        },
        {
          "date": "2026-05-14",
          "close": 2060,
          "ratio": 1.03,
          "volume": 6062
        },
        {
          "date": "2026-05-15",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 2024
        },
        {
          "date": "2026-05-18",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 14516
        },
        {
          "date": "2026-05-19",
          "close": 2070,
          "ratio": 1.035,
          "volume": 8642
        },
        {
          "date": "2026-05-20",
          "close": 2070,
          "ratio": 1.035,
          "volume": 5205
        },
        {
          "date": "2026-05-21",
          "close": 2070,
          "ratio": 1.035,
          "volume": 6005
        },
        {
          "date": "2026-05-22",
          "close": 2070,
          "ratio": 1.035,
          "volume": 8796
        },
        {
          "date": "2026-05-26",
          "close": 2070,
          "ratio": 1.035,
          "volume": 3412
        },
        {
          "date": "2026-05-27",
          "close": 2070,
          "ratio": 1.035,
          "volume": 5214
        },
        {
          "date": "2026-05-28",
          "close": 2070,
          "ratio": 1.035,
          "volume": 4867
        },
        {
          "date": "2026-05-29",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 42167
        },
        {
          "date": "2026-06-01",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 3276
        }
      ],
      "events": [
        {
          "date": "2024-03-05",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-03-05"
        },
        {
          "date": "2027-03-05",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=하나31호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=469900"
    },
    {
      "id": "489210",
      "code": "489210",
      "name": "교보17호스팩",
      "market": "KOSDAQ",
      "isin": "KR7489210005",
      "sponsor": "교보",
      "ipoPrice": 2000,
      "currentPrice": 2070,
      "change": -45,
      "changePct": -2.13,
      "ratio": 1.035,
      "premiumPct": 3.5,
      "volume": 723,
      "tradingValue": 2000000,
      "marketCap": 10722600000,
      "estimatedShares": 5180000,
      "listingDate": "2024-11-21",
      "liquidationDate": "2027-11-21",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 538,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 4.23,
      "annualizedReturn": 2.85,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "교보17호스팩",
        "fullName": "교보17호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-11-21",
        "fiscalMonth": "12월",
        "ceo": "장정훈",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "489210",
        "price": 2070,
        "change": -45,
        "changePct": -2.13,
        "volume": 723,
        "tradingValue": 2000000,
        "marketCap": 10722600000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.098608+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2120,
          "ratio": 1.06,
          "volume": 103
        },
        {
          "date": "2026-04-17",
          "close": 2110,
          "ratio": 1.055,
          "volume": 31
        },
        {
          "date": "2026-04-20",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 2064
        },
        {
          "date": "2026-04-21",
          "close": 2100,
          "ratio": 1.05,
          "volume": 2150
        },
        {
          "date": "2026-04-22",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 11957
        },
        {
          "date": "2026-04-23",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 21998
        },
        {
          "date": "2026-04-24",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 13653
        },
        {
          "date": "2026-04-27",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 28364
        },
        {
          "date": "2026-04-28",
          "close": 2050,
          "ratio": 1.025,
          "volume": 17764
        },
        {
          "date": "2026-04-29",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 25109
        },
        {
          "date": "2026-04-30",
          "close": 2100,
          "ratio": 1.05,
          "volume": 10640
        },
        {
          "date": "2026-05-04",
          "close": 2100,
          "ratio": 1.05,
          "volume": 12
        },
        {
          "date": "2026-05-06",
          "close": 2100,
          "ratio": 1.05,
          "volume": 749
        },
        {
          "date": "2026-05-07",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 2667
        },
        {
          "date": "2026-05-08",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 2391
        },
        {
          "date": "2026-05-11",
          "close": 2090,
          "ratio": 1.045,
          "volume": 668
        },
        {
          "date": "2026-05-12",
          "close": 2070,
          "ratio": 1.035,
          "volume": 17529
        },
        {
          "date": "2026-05-13",
          "close": 2090,
          "ratio": 1.045,
          "volume": 6654
        },
        {
          "date": "2026-05-14",
          "close": 2080,
          "ratio": 1.04,
          "volume": 6743
        },
        {
          "date": "2026-05-15",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2230
        },
        {
          "date": "2026-05-18",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 1794
        },
        {
          "date": "2026-05-19",
          "close": 2070,
          "ratio": 1.035,
          "volume": 17846
        },
        {
          "date": "2026-05-20",
          "close": 2080,
          "ratio": 1.04,
          "volume": 3351
        },
        {
          "date": "2026-05-21",
          "close": 2080,
          "ratio": 1.04,
          "volume": 655
        },
        {
          "date": "2026-05-22",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 3971
        },
        {
          "date": "2026-05-26",
          "close": 2090,
          "ratio": 1.045,
          "volume": 445
        },
        {
          "date": "2026-05-27",
          "close": 2080,
          "ratio": 1.04,
          "volume": 1581
        },
        {
          "date": "2026-05-28",
          "close": 2080,
          "ratio": 1.04,
          "volume": 1256
        },
        {
          "date": "2026-05-29",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 27486
        },
        {
          "date": "2026-06-01",
          "close": 2070,
          "ratio": 1.035,
          "volume": 711
        }
      ],
      "events": [
        {
          "date": "2024-11-21",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-11-21"
        },
        {
          "date": "2027-11-21",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=교보17호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=489210"
    },
    {
      "id": "477470",
      "code": "477470",
      "name": "미래에셋비전스팩5호",
      "market": "KOSDAQ",
      "isin": "KR7477470009",
      "sponsor": "미래에셋비전",
      "ipoPrice": 2000,
      "currentPrice": 2070,
      "change": 5,
      "changePct": 0.24,
      "ratio": 1.035,
      "premiumPct": 3.5,
      "volume": 324,
      "tradingValue": 1000000,
      "marketCap": 11343600000,
      "estimatedShares": 5480000,
      "listingDate": "2024-06-19",
      "liquidationDate": "2027-06-19",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 383,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 4.23,
      "annualizedReturn": 4.03,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "미래에셋비전스팩5호",
        "fullName": "미래에셋비전기업인수목적5호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-06-19",
        "fiscalMonth": "12월",
        "ceo": "김대호",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "477470",
        "price": 2070,
        "change": 5,
        "changePct": 0.24,
        "volume": 324,
        "tradingValue": 1000000,
        "marketCap": 11343600000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.34289+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2110,
          "ratio": 1.055,
          "volume": 1045
        },
        {
          "date": "2026-04-17",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 274
        },
        {
          "date": "2026-04-20",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 792
        },
        {
          "date": "2026-04-21",
          "close": 2100,
          "ratio": 1.05,
          "volume": 111
        },
        {
          "date": "2026-04-22",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 113
        },
        {
          "date": "2026-04-23",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 6099
        },
        {
          "date": "2026-04-24",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 12086
        },
        {
          "date": "2026-04-27",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 68406
        },
        {
          "date": "2026-04-28",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 5030
        },
        {
          "date": "2026-04-29",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 55007
        },
        {
          "date": "2026-04-30",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 21556
        },
        {
          "date": "2026-05-04",
          "close": 2110,
          "ratio": 1.055,
          "volume": 6608
        },
        {
          "date": "2026-05-06",
          "close": 2100,
          "ratio": 1.05,
          "volume": 742
        },
        {
          "date": "2026-05-07",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 1292
        },
        {
          "date": "2026-05-08",
          "close": 2090,
          "ratio": 1.045,
          "volume": 45
        },
        {
          "date": "2026-05-11",
          "close": 2080,
          "ratio": 1.04,
          "volume": 908
        },
        {
          "date": "2026-05-12",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 20507
        },
        {
          "date": "2026-05-13",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 18074
        },
        {
          "date": "2026-05-14",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 46844
        },
        {
          "date": "2026-05-15",
          "close": 2080,
          "ratio": 1.04,
          "volume": 12813
        },
        {
          "date": "2026-05-18",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 40628
        },
        {
          "date": "2026-05-19",
          "close": 2070,
          "ratio": 1.035,
          "volume": 21317
        },
        {
          "date": "2026-05-20",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 11739
        },
        {
          "date": "2026-05-21",
          "close": 2070,
          "ratio": 1.035,
          "volume": 3443
        },
        {
          "date": "2026-05-22",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 2340
        },
        {
          "date": "2026-05-26",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 3249
        },
        {
          "date": "2026-05-27",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 4698
        },
        {
          "date": "2026-05-28",
          "close": 2070,
          "ratio": 1.035,
          "volume": 8474
        },
        {
          "date": "2026-05-29",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 4564
        },
        {
          "date": "2026-06-01",
          "close": 2070,
          "ratio": 1.035,
          "volume": 324
        }
      ],
      "events": [
        {
          "date": "2024-06-19",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-06-19"
        },
        {
          "date": "2027-06-19",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=미래에셋비전스팩5호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=477470"
    },
    {
      "id": "468760",
      "code": "468760",
      "name": "유진스팩10호",
      "market": "KOSDAQ",
      "isin": "KR7468760004",
      "sponsor": "유진",
      "ipoPrice": 2000,
      "currentPrice": 2070,
      "change": -10,
      "changePct": -0.48,
      "ratio": 1.035,
      "premiumPct": 3.5,
      "volume": 487,
      "tradingValue": 1000000,
      "marketCap": 8776800000,
      "estimatedShares": 4240000,
      "listingDate": "2024-02-29",
      "liquidationDate": "2027-02-28",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 272,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 4.23,
      "annualizedReturn": 5.72,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "유진스팩10호",
        "fullName": "유진기업인수목적10호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-02-29",
        "fiscalMonth": "12월",
        "ceo": "김동진",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "468760",
        "price": 2070,
        "change": -10,
        "changePct": -0.48,
        "volume": 487,
        "tradingValue": 1000000,
        "marketCap": 8776800000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.783708+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 5523
        },
        {
          "date": "2026-04-17",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 21307
        },
        {
          "date": "2026-04-20",
          "close": 2100,
          "ratio": 1.05,
          "volume": 2999
        },
        {
          "date": "2026-04-21",
          "close": 2100,
          "ratio": 1.05,
          "volume": 4861
        },
        {
          "date": "2026-04-22",
          "close": 2100,
          "ratio": 1.05,
          "volume": 536
        },
        {
          "date": "2026-04-23",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 81
        },
        {
          "date": "2026-04-24",
          "close": 2090,
          "ratio": 1.045,
          "volume": 18888
        },
        {
          "date": "2026-04-27",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 1793
        },
        {
          "date": "2026-04-28",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 13319
        },
        {
          "date": "2026-04-29",
          "close": 2080,
          "ratio": 1.04,
          "volume": 22213
        },
        {
          "date": "2026-04-30",
          "close": 2090,
          "ratio": 1.045,
          "volume": 44
        },
        {
          "date": "2026-05-04",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 1129
        },
        {
          "date": "2026-05-06",
          "close": 2100,
          "ratio": 1.05,
          "volume": 6987
        },
        {
          "date": "2026-05-07",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 1059
        },
        {
          "date": "2026-05-08",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 4439
        },
        {
          "date": "2026-05-11",
          "close": 2090,
          "ratio": 1.045,
          "volume": 1328
        },
        {
          "date": "2026-05-12",
          "close": 2090,
          "ratio": 1.045,
          "volume": 22
        },
        {
          "date": "2026-05-13",
          "close": 2080,
          "ratio": 1.04,
          "volume": 23823
        },
        {
          "date": "2026-05-14",
          "close": 2080,
          "ratio": 1.04,
          "volume": 4206
        },
        {
          "date": "2026-05-15",
          "close": 2100,
          "ratio": 1.05,
          "volume": 51413
        },
        {
          "date": "2026-05-18",
          "close": 2100,
          "ratio": 1.05,
          "volume": 220
        },
        {
          "date": "2026-05-19",
          "close": 2090,
          "ratio": 1.045,
          "volume": 54734
        },
        {
          "date": "2026-05-20",
          "close": 2090,
          "ratio": 1.045,
          "volume": 5693
        },
        {
          "date": "2026-05-21",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 8910
        },
        {
          "date": "2026-05-22",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 5904
        },
        {
          "date": "2026-05-26",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2880
        },
        {
          "date": "2026-05-27",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2808
        },
        {
          "date": "2026-05-28",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 3088
        },
        {
          "date": "2026-05-29",
          "close": 2080,
          "ratio": 1.04,
          "volume": 10888
        },
        {
          "date": "2026-06-01",
          "close": 2070,
          "ratio": 1.035,
          "volume": 487
        }
      ],
      "events": [
        {
          "date": "2024-02-29",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-02-29"
        },
        {
          "date": "2027-02-28",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=유진스팩10호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=468760"
    },
    {
      "id": "475250",
      "code": "475250",
      "name": "하나33호스팩",
      "market": "KOSDAQ",
      "isin": "KR7475250007",
      "sponsor": "하나",
      "ipoPrice": 2000,
      "currentPrice": 2070,
      "change": -10,
      "changePct": -0.48,
      "ratio": 1.035,
      "premiumPct": 3.5,
      "volume": 1801,
      "tradingValue": 4000000,
      "marketCap": 7659000000,
      "estimatedShares": 3700000,
      "listingDate": "2024-04-24",
      "liquidationDate": "2027-04-24",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 327,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 4.23,
      "annualizedReturn": 4.73,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "하나33호스팩",
        "fullName": "하나33호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-04-24",
        "fiscalMonth": "12월",
        "ceo": "박태한",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "475250",
        "price": 2070,
        "change": -10,
        "changePct": -0.48,
        "volume": 1801,
        "tradingValue": 4000000,
        "marketCap": 7659000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.88932+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 15
        },
        {
          "date": "2026-04-17",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 1133
        },
        {
          "date": "2026-04-20",
          "close": 2080,
          "ratio": 1.04,
          "volume": 63
        },
        {
          "date": "2026-04-21",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 2550
        },
        {
          "date": "2026-04-22",
          "close": 2080,
          "ratio": 1.04,
          "volume": 146
        },
        {
          "date": "2026-04-23",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2301
        },
        {
          "date": "2026-04-24",
          "close": 2080,
          "ratio": 1.04,
          "volume": 749
        },
        {
          "date": "2026-04-27",
          "close": 2080,
          "ratio": 1.04,
          "volume": 6580
        },
        {
          "date": "2026-04-28",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2708
        },
        {
          "date": "2026-04-29",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 5094
        },
        {
          "date": "2026-04-30",
          "close": 2090,
          "ratio": 1.045,
          "volume": 5962
        },
        {
          "date": "2026-05-04",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 578
        },
        {
          "date": "2026-05-06",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 16581
        },
        {
          "date": "2026-05-07",
          "close": 2080,
          "ratio": 1.04,
          "volume": 1276
        },
        {
          "date": "2026-05-08",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 2536
        },
        {
          "date": "2026-05-11",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 10517
        },
        {
          "date": "2026-05-12",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 498
        },
        {
          "date": "2026-05-13",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 23105
        },
        {
          "date": "2026-05-14",
          "close": 2090,
          "ratio": 1.045,
          "volume": 4520
        },
        {
          "date": "2026-05-15",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 6737
        },
        {
          "date": "2026-05-18",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2182
        },
        {
          "date": "2026-05-19",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2807
        },
        {
          "date": "2026-05-20",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 5677
        },
        {
          "date": "2026-05-21",
          "close": 2080,
          "ratio": 1.04,
          "volume": 1931
        },
        {
          "date": "2026-05-22",
          "close": 2082,
          "ratio": 1.041,
          "volume": 320
        },
        {
          "date": "2026-05-26",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 2795
        },
        {
          "date": "2026-05-27",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 1815
        },
        {
          "date": "2026-05-28",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 5513
        },
        {
          "date": "2026-05-29",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2670
        },
        {
          "date": "2026-06-01",
          "close": 2070,
          "ratio": 1.035,
          "volume": 1801
        }
      ],
      "events": [
        {
          "date": "2024-04-24",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-04-24"
        },
        {
          "date": "2027-04-24",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=하나33호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=475250"
    },
    {
      "id": "472230",
      "code": "472230",
      "name": "에스케이증권제11호스팩",
      "market": "KOSDAQ",
      "isin": "KR7472230002",
      "sponsor": "에스케이증권",
      "ipoPrice": 2000,
      "currentPrice": 2075,
      "change": 5,
      "changePct": 0.24,
      "ratio": 1.0375,
      "premiumPct": 3.75,
      "volume": 969,
      "tradingValue": 2000000,
      "marketCap": 8621625000,
      "estimatedShares": 4155000,
      "listingDate": null,
      "liquidationDate": null,
      "liquidationDateSource": null,
      "daysToLiquidation": null,
      "trustValuePerShare": 2000.0,
      "liquidationValuePerShare": 2000.0,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -3.61,
      "annualizedReturn": null,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {},
      "quote": {
        "code": "472230",
        "price": 2075,
        "change": 5,
        "changePct": 0.24,
        "volume": 969,
        "tradingValue": 2000000,
        "marketCap": 8621625000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.536583+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 507
        },
        {
          "date": "2026-04-17",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 16647
        },
        {
          "date": "2026-04-20",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 14575
        },
        {
          "date": "2026-04-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 278
        },
        {
          "date": "2026-04-22",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 136
        },
        {
          "date": "2026-04-23",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 23418
        },
        {
          "date": "2026-04-24",
          "close": 2070,
          "ratio": 1.035,
          "volume": 1009
        },
        {
          "date": "2026-04-27",
          "close": 2060,
          "ratio": 1.03,
          "volume": 3309
        },
        {
          "date": "2026-04-28",
          "close": 2060,
          "ratio": 1.03,
          "volume": 729
        },
        {
          "date": "2026-04-29",
          "close": 2070,
          "ratio": 1.035,
          "volume": 21187
        },
        {
          "date": "2026-04-30",
          "close": 2060,
          "ratio": 1.03,
          "volume": 1552
        },
        {
          "date": "2026-05-04",
          "close": 2060,
          "ratio": 1.03,
          "volume": 943
        },
        {
          "date": "2026-05-06",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 4574
        },
        {
          "date": "2026-05-07",
          "close": 2070,
          "ratio": 1.035,
          "volume": 7286
        },
        {
          "date": "2026-05-08",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 275
        },
        {
          "date": "2026-05-11",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 3247
        },
        {
          "date": "2026-05-12",
          "close": 2060,
          "ratio": 1.03,
          "volume": 4569
        },
        {
          "date": "2026-05-13",
          "close": 2060,
          "ratio": 1.03,
          "volume": 8638
        },
        {
          "date": "2026-05-14",
          "close": 2060,
          "ratio": 1.03,
          "volume": 24644
        },
        {
          "date": "2026-05-15",
          "close": 2060,
          "ratio": 1.03,
          "volume": 5048
        },
        {
          "date": "2026-05-18",
          "close": 2060,
          "ratio": 1.03,
          "volume": 6707
        },
        {
          "date": "2026-05-19",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 8367
        },
        {
          "date": "2026-05-20",
          "close": 2070,
          "ratio": 1.035,
          "volume": 24085
        },
        {
          "date": "2026-05-21",
          "close": 2070,
          "ratio": 1.035,
          "volume": 3739
        },
        {
          "date": "2026-05-22",
          "close": 2070,
          "ratio": 1.035,
          "volume": 8144
        },
        {
          "date": "2026-05-26",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 1415
        },
        {
          "date": "2026-05-27",
          "close": 2070,
          "ratio": 1.035,
          "volume": 22595
        },
        {
          "date": "2026-05-28",
          "close": 2070,
          "ratio": 1.035,
          "volume": 14839
        },
        {
          "date": "2026-05-29",
          "close": 2070,
          "ratio": 1.035,
          "volume": 5484
        },
        {
          "date": "2026-06-01",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 969
        }
      ],
      "events": [],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=에스케이증권제11호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=472230"
    },
    {
      "id": "473050",
      "code": "473050",
      "name": "유안타제15호스팩",
      "market": "KOSDAQ",
      "isin": "KR7473050003",
      "sponsor": "유안타",
      "ipoPrice": 2000,
      "currentPrice": 2075,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0375,
      "premiumPct": 3.75,
      "volume": 951,
      "tradingValue": 2000000,
      "marketCap": 14545750000,
      "estimatedShares": 7010000,
      "listingDate": "2024-02-29",
      "liquidationDate": "2027-02-28",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 272,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 3.98,
      "annualizedReturn": 5.38,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "유안타제15호스팩",
        "fullName": "유안타제15호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스",
        "listingDate": "2024-02-29",
        "fiscalMonth": "12월",
        "ceo": "구태훈",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "473050",
        "price": 2075,
        "change": 0,
        "changePct": 0.0,
        "volume": 951,
        "tradingValue": 2000000,
        "marketCap": 14545750000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.752351+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2060,
          "ratio": 1.03,
          "volume": 4950
        },
        {
          "date": "2026-04-17",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 6623
        },
        {
          "date": "2026-04-20",
          "close": 2060,
          "ratio": 1.03,
          "volume": 47126
        },
        {
          "date": "2026-04-21",
          "close": 2060,
          "ratio": 1.03,
          "volume": 17943
        },
        {
          "date": "2026-04-22",
          "close": 2060,
          "ratio": 1.03,
          "volume": 32
        },
        {
          "date": "2026-04-23",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 31439
        },
        {
          "date": "2026-04-24",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 5500
        },
        {
          "date": "2026-04-27",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 11628
        },
        {
          "date": "2026-04-28",
          "close": 2062,
          "ratio": 1.031,
          "volume": 6716
        },
        {
          "date": "2026-04-29",
          "close": 2070,
          "ratio": 1.035,
          "volume": 14908
        },
        {
          "date": "2026-04-30",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 18452
        },
        {
          "date": "2026-05-04",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 969
        },
        {
          "date": "2026-05-06",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 6471
        },
        {
          "date": "2026-05-07",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 3964
        },
        {
          "date": "2026-05-08",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 6109
        },
        {
          "date": "2026-05-11",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 3285
        },
        {
          "date": "2026-05-12",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 11291
        },
        {
          "date": "2026-05-13",
          "close": 2055,
          "ratio": 1.0275,
          "volume": 21861
        },
        {
          "date": "2026-05-14",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 12505
        },
        {
          "date": "2026-05-15",
          "close": 2060,
          "ratio": 1.03,
          "volume": 28207
        },
        {
          "date": "2026-05-18",
          "close": 2065,
          "ratio": 1.0325,
          "volume": 18971
        },
        {
          "date": "2026-05-19",
          "close": 2067,
          "ratio": 1.0335,
          "volume": 12195
        },
        {
          "date": "2026-05-20",
          "close": 2070,
          "ratio": 1.035,
          "volume": 22840
        },
        {
          "date": "2026-05-21",
          "close": 2070,
          "ratio": 1.035,
          "volume": 504
        },
        {
          "date": "2026-05-22",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 21009
        },
        {
          "date": "2026-05-26",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 17758
        },
        {
          "date": "2026-05-27",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 5061
        },
        {
          "date": "2026-05-28",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 18282
        },
        {
          "date": "2026-05-29",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 16199
        },
        {
          "date": "2026-06-01",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 951
        }
      ],
      "events": [
        {
          "date": "2024-02-29",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-02-29"
        },
        {
          "date": "2027-02-28",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=유안타제15호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=473050"
    },
    {
      "id": "471050",
      "code": "471050",
      "name": "대신밸런스제17호스팩",
      "market": "KOSDAQ",
      "isin": "KR7471050005",
      "sponsor": "대신밸런스",
      "ipoPrice": 2000,
      "currentPrice": 2090,
      "change": -20,
      "changePct": -0.95,
      "ratio": 1.045,
      "premiumPct": 4.5,
      "volume": 162,
      "tradingValue": null,
      "marketCap": 12665400000,
      "estimatedShares": 6060000,
      "listingDate": "2024-01-24",
      "liquidationDate": "2027-01-24",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 237,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 3.24,
      "annualizedReturn": 5.03,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "대신밸런스제17호스팩",
        "fullName": "대신밸런스제17호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스업",
        "listingDate": "2024-01-24",
        "fiscalMonth": "12월",
        "ceo": "이문수",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "471050",
        "price": 2090,
        "change": -20,
        "changePct": -0.95,
        "volume": 162,
        "tradingValue": null,
        "marketCap": 12665400000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.204851+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 1547
        },
        {
          "date": "2026-04-17",
          "close": 2110,
          "ratio": 1.055,
          "volume": 4262
        },
        {
          "date": "2026-04-20",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 16379
        },
        {
          "date": "2026-04-21",
          "close": 2090,
          "ratio": 1.045,
          "volume": 7666
        },
        {
          "date": "2026-04-22",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 4014
        },
        {
          "date": "2026-04-23",
          "close": 2100,
          "ratio": 1.05,
          "volume": 4054
        },
        {
          "date": "2026-04-24",
          "close": 2090,
          "ratio": 1.045,
          "volume": 4949
        },
        {
          "date": "2026-04-27",
          "close": 2100,
          "ratio": 1.05,
          "volume": 2028
        },
        {
          "date": "2026-04-28",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 3356
        },
        {
          "date": "2026-04-29",
          "close": 2100,
          "ratio": 1.05,
          "volume": 24824
        },
        {
          "date": "2026-04-30",
          "close": 2120,
          "ratio": 1.06,
          "volume": 8406
        },
        {
          "date": "2026-05-04",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 10088
        },
        {
          "date": "2026-05-06",
          "close": 2120,
          "ratio": 1.06,
          "volume": 538
        },
        {
          "date": "2026-05-07",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 25283
        },
        {
          "date": "2026-05-08",
          "close": 2100,
          "ratio": 1.05,
          "volume": 2406
        },
        {
          "date": "2026-05-11",
          "close": 2090,
          "ratio": 1.045,
          "volume": 20860
        },
        {
          "date": "2026-05-12",
          "close": 2090,
          "ratio": 1.045,
          "volume": 20293
        },
        {
          "date": "2026-05-13",
          "close": 2090,
          "ratio": 1.045,
          "volume": 17120
        },
        {
          "date": "2026-05-14",
          "close": 2080,
          "ratio": 1.04,
          "volume": 54219
        },
        {
          "date": "2026-05-15",
          "close": 2080,
          "ratio": 1.04,
          "volume": 82485
        },
        {
          "date": "2026-05-18",
          "close": 2100,
          "ratio": 1.05,
          "volume": 224991
        },
        {
          "date": "2026-05-19",
          "close": 2090,
          "ratio": 1.045,
          "volume": 74682
        },
        {
          "date": "2026-05-20",
          "close": 2100,
          "ratio": 1.05,
          "volume": 4511
        },
        {
          "date": "2026-05-21",
          "close": 2100,
          "ratio": 1.05,
          "volume": 25851
        },
        {
          "date": "2026-05-22",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 20797
        },
        {
          "date": "2026-05-26",
          "close": 2100,
          "ratio": 1.05,
          "volume": 5966
        },
        {
          "date": "2026-05-27",
          "close": 2100,
          "ratio": 1.05,
          "volume": 12196
        },
        {
          "date": "2026-05-28",
          "close": 2100,
          "ratio": 1.05,
          "volume": 19317
        },
        {
          "date": "2026-05-29",
          "close": 2110,
          "ratio": 1.055,
          "volume": 28689
        },
        {
          "date": "2026-06-01",
          "close": 2090,
          "ratio": 1.045,
          "volume": 162
        }
      ],
      "events": [
        {
          "date": "2024-01-24",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-01-24"
        },
        {
          "date": "2027-01-24",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=대신밸런스제17호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=471050"
    },
    {
      "id": "474930",
      "code": "474930",
      "name": "신한제13호스팩",
      "market": "KOSDAQ",
      "isin": "KR7474930005",
      "sponsor": "신한",
      "ipoPrice": 2000,
      "currentPrice": 2095,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0475,
      "premiumPct": 4.75,
      "volume": 1002,
      "tradingValue": 2000000,
      "marketCap": 7583900000,
      "estimatedShares": 3620000,
      "listingDate": "2024-04-22",
      "liquidationDate": "2027-04-22",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 325,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 2.99,
      "annualizedReturn": 3.36,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신한제13호스팩",
        "fullName": "신한제13호기업인수목적주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기타금융서비스(기업합병)",
        "listingDate": "2024-04-22",
        "fiscalMonth": "12월",
        "ceo": "배성환",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "474930",
        "price": 2095,
        "change": 0,
        "changePct": 0.0,
        "volume": 1002,
        "tradingValue": 2000000,
        "marketCap": 7583900000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.462062+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 730
        },
        {
          "date": "2026-04-17",
          "close": 2110,
          "ratio": 1.055,
          "volume": 6331
        },
        {
          "date": "2026-04-20",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 1584
        },
        {
          "date": "2026-04-21",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 2270
        },
        {
          "date": "2026-04-22",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 15
        },
        {
          "date": "2026-04-23",
          "close": 2120,
          "ratio": 1.06,
          "volume": 2676
        },
        {
          "date": "2026-04-24",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 1552
        },
        {
          "date": "2026-04-27",
          "close": 2110,
          "ratio": 1.055,
          "volume": 3741
        },
        {
          "date": "2026-04-28",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 2397
        },
        {
          "date": "2026-04-29",
          "close": 2120,
          "ratio": 1.06,
          "volume": 16017
        },
        {
          "date": "2026-04-30",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 5905
        },
        {
          "date": "2026-05-04",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 1327
        },
        {
          "date": "2026-05-06",
          "close": 2120,
          "ratio": 1.06,
          "volume": 621
        },
        {
          "date": "2026-05-07",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 116
        },
        {
          "date": "2026-05-08",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 519
        },
        {
          "date": "2026-05-11",
          "close": 2110,
          "ratio": 1.055,
          "volume": 2661
        },
        {
          "date": "2026-05-12",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 117
        },
        {
          "date": "2026-05-13",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 21082
        },
        {
          "date": "2026-05-14",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 4909
        },
        {
          "date": "2026-05-15",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 5770
        },
        {
          "date": "2026-05-18",
          "close": 2120,
          "ratio": 1.06,
          "volume": 1204
        },
        {
          "date": "2026-05-19",
          "close": 2100,
          "ratio": 1.05,
          "volume": 2280
        },
        {
          "date": "2026-05-20",
          "close": 2100,
          "ratio": 1.05,
          "volume": 3103
        },
        {
          "date": "2026-05-21",
          "close": 2100,
          "ratio": 1.05,
          "volume": 1596
        },
        {
          "date": "2026-05-22",
          "close": 2110,
          "ratio": 1.055,
          "volume": 694
        },
        {
          "date": "2026-05-26",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 1076
        },
        {
          "date": "2026-05-27",
          "close": 2100,
          "ratio": 1.05,
          "volume": 1888
        },
        {
          "date": "2026-05-28",
          "close": 2110,
          "ratio": 1.055,
          "volume": 3806
        },
        {
          "date": "2026-05-29",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 5425
        },
        {
          "date": "2026-06-01",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 1002
        }
      ],
      "events": [
        {
          "date": "2024-04-22",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-04-22"
        },
        {
          "date": "2027-04-22",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신한제13호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=474930"
    },
    {
      "id": "481890",
      "code": "481890",
      "name": "엔에이치스팩31호",
      "market": "KOSDAQ",
      "isin": "KR7481890002",
      "sponsor": "엔에이치",
      "ipoPrice": 2000,
      "currentPrice": 2095,
      "change": -15,
      "changePct": -0.71,
      "ratio": 1.0475,
      "premiumPct": 4.75,
      "volume": 396,
      "tradingValue": 1000000,
      "marketCap": 13292775000,
      "estimatedShares": 6345000,
      "listingDate": "2024-07-26",
      "liquidationDate": "2027-07-26",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 420,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 2.99,
      "annualizedReturn": 2.59,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "엔에이치스팩31호",
        "fullName": "엔에이치기업인수목적31호(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융지원서비스업",
        "listingDate": "2024-07-26",
        "fiscalMonth": "12월",
        "ceo": "이시형",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "481890",
        "price": 2095,
        "change": -15,
        "changePct": -0.71,
        "volume": 396,
        "tradingValue": 1000000,
        "marketCap": 13292775000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.640626+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 367
        },
        {
          "date": "2026-04-17",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 4276
        },
        {
          "date": "2026-04-20",
          "close": 2100,
          "ratio": 1.05,
          "volume": 646
        },
        {
          "date": "2026-04-21",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 7223
        },
        {
          "date": "2026-04-22",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 48
        },
        {
          "date": "2026-04-23",
          "close": 2110,
          "ratio": 1.055,
          "volume": 1888
        },
        {
          "date": "2026-04-24",
          "close": 2110,
          "ratio": 1.055,
          "volume": 8019
        },
        {
          "date": "2026-04-27",
          "close": 2100,
          "ratio": 1.05,
          "volume": 11904
        },
        {
          "date": "2026-04-28",
          "close": 2090,
          "ratio": 1.045,
          "volume": 1459
        },
        {
          "date": "2026-04-29",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 390
        },
        {
          "date": "2026-04-30",
          "close": 2100,
          "ratio": 1.05,
          "volume": 40
        },
        {
          "date": "2026-05-04",
          "close": 2100,
          "ratio": 1.05,
          "volume": 7541
        },
        {
          "date": "2026-05-06",
          "close": 2100,
          "ratio": 1.05,
          "volume": 20170
        },
        {
          "date": "2026-05-07",
          "close": 2110,
          "ratio": 1.055,
          "volume": 32836
        },
        {
          "date": "2026-05-08",
          "close": 2110,
          "ratio": 1.055,
          "volume": 29005
        },
        {
          "date": "2026-05-11",
          "close": 2120,
          "ratio": 1.06,
          "volume": 11562
        },
        {
          "date": "2026-05-12",
          "close": 2120,
          "ratio": 1.06,
          "volume": 4470
        },
        {
          "date": "2026-05-13",
          "close": 2130,
          "ratio": 1.065,
          "volume": 29064
        },
        {
          "date": "2026-05-14",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 6363
        },
        {
          "date": "2026-05-15",
          "close": 2110,
          "ratio": 1.055,
          "volume": 26986
        },
        {
          "date": "2026-05-18",
          "close": 2110,
          "ratio": 1.055,
          "volume": 4089
        },
        {
          "date": "2026-05-19",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 5351
        },
        {
          "date": "2026-05-20",
          "close": 2110,
          "ratio": 1.055,
          "volume": 3725
        },
        {
          "date": "2026-05-21",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 12107
        },
        {
          "date": "2026-05-22",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 1628
        },
        {
          "date": "2026-05-26",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 2622
        },
        {
          "date": "2026-05-27",
          "close": 2120,
          "ratio": 1.06,
          "volume": 3755
        },
        {
          "date": "2026-05-28",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 5723
        },
        {
          "date": "2026-05-29",
          "close": 2110,
          "ratio": 1.055,
          "volume": 8680
        },
        {
          "date": "2026-06-01",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 396
        }
      ],
      "events": [
        {
          "date": "2024-07-26",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-07-26"
        },
        {
          "date": "2027-07-26",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=엔에이치스팩31호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=481890"
    },
    {
      "id": "469880",
      "code": "469880",
      "name": "하나30호스팩",
      "market": "KOSDAQ",
      "isin": "KR7469880009",
      "sponsor": "하나",
      "ipoPrice": 2000,
      "currentPrice": 2102,
      "change": 2,
      "changePct": 0.1,
      "ratio": 1.051,
      "premiumPct": 5.1,
      "volume": 8579,
      "tradingValue": 18000000,
      "marketCap": 15355110000,
      "estimatedShares": 7305000,
      "listingDate": "2023-12-22",
      "liquidationDate": "2026-12-22",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 204,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 2.65,
      "annualizedReturn": 4.79,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "하나30호스팩",
        "fullName": "하나30호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2023-12-22",
        "fiscalMonth": "12월",
        "ceo": "전신웅",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "469880",
        "price": 2102,
        "change": 2,
        "changePct": 0.1,
        "volume": 8579,
        "tradingValue": 18000000,
        "marketCap": 15355110000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.868812+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2080,
          "ratio": 1.04,
          "volume": 10307
        },
        {
          "date": "2026-04-17",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 2476
        },
        {
          "date": "2026-04-20",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 17315
        },
        {
          "date": "2026-04-21",
          "close": 2080,
          "ratio": 1.04,
          "volume": 8813
        },
        {
          "date": "2026-04-22",
          "close": 2080,
          "ratio": 1.04,
          "volume": 985
        },
        {
          "date": "2026-04-23",
          "close": 2080,
          "ratio": 1.04,
          "volume": 6689
        },
        {
          "date": "2026-04-24",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 8083
        },
        {
          "date": "2026-04-27",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 15810
        },
        {
          "date": "2026-04-28",
          "close": 2075,
          "ratio": 1.0375,
          "volume": 149427
        },
        {
          "date": "2026-04-29",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 21792
        },
        {
          "date": "2026-04-30",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 14713
        },
        {
          "date": "2026-05-04",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 7494
        },
        {
          "date": "2026-05-06",
          "close": 2090,
          "ratio": 1.045,
          "volume": 2637
        },
        {
          "date": "2026-05-07",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 3332
        },
        {
          "date": "2026-05-08",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 1731
        },
        {
          "date": "2026-05-11",
          "close": 2090,
          "ratio": 1.045,
          "volume": 17779
        },
        {
          "date": "2026-05-12",
          "close": 2087,
          "ratio": 1.0435,
          "volume": 6789
        },
        {
          "date": "2026-05-13",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 47626
        },
        {
          "date": "2026-05-14",
          "close": 2090,
          "ratio": 1.045,
          "volume": 5335
        },
        {
          "date": "2026-05-15",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 2764
        },
        {
          "date": "2026-05-18",
          "close": 2092,
          "ratio": 1.046,
          "volume": 19427
        },
        {
          "date": "2026-05-19",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 8167
        },
        {
          "date": "2026-05-20",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 8923
        },
        {
          "date": "2026-05-21",
          "close": 2090,
          "ratio": 1.045,
          "volume": 8765
        },
        {
          "date": "2026-05-22",
          "close": 2090,
          "ratio": 1.045,
          "volume": 8656
        },
        {
          "date": "2026-05-26",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 20443
        },
        {
          "date": "2026-05-27",
          "close": 2100,
          "ratio": 1.05,
          "volume": 26380
        },
        {
          "date": "2026-05-28",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 30162
        },
        {
          "date": "2026-05-29",
          "close": 2100,
          "ratio": 1.05,
          "volume": 79529
        },
        {
          "date": "2026-06-01",
          "close": 2102,
          "ratio": 1.051,
          "volume": 8579
        }
      ],
      "events": [
        {
          "date": "2023-12-22",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2023-12-22"
        },
        {
          "date": "2026-12-22",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=하나30호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=469880"
    },
    {
      "id": "467930",
      "code": "467930",
      "name": "IBKS제23호스팩",
      "market": "KOSDAQ",
      "isin": "KR7467930004",
      "sponsor": "IBKS",
      "ipoPrice": 2000,
      "currentPrice": 2105,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.0525,
      "premiumPct": 5.25,
      "volume": 1203,
      "tradingValue": 3000000,
      "marketCap": 8904150000,
      "estimatedShares": 4230000,
      "listingDate": "2023-12-22",
      "liquidationDate": "2026-12-22",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 204,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 2.5,
      "annualizedReturn": 4.52,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "IBKS제23호스팩",
        "fullName": "아이비케이에스제23호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수 및 합병",
        "listingDate": "2023-12-22",
        "fiscalMonth": "12월",
        "ceo": "최상규",
        "homepage": true,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "467930",
        "price": 2105,
        "change": 0,
        "changePct": 0.0,
        "volume": 1203,
        "tradingValue": 3000000,
        "marketCap": 8904150000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.978255+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2220,
          "ratio": 1.11,
          "volume": 310
        },
        {
          "date": "2026-04-17",
          "close": 2220,
          "ratio": 1.11,
          "volume": 461
        },
        {
          "date": "2026-04-20",
          "close": 2200,
          "ratio": 1.1,
          "volume": 3222
        },
        {
          "date": "2026-04-21",
          "close": 2205,
          "ratio": 1.1025,
          "volume": 11537
        },
        {
          "date": "2026-04-22",
          "close": 2175,
          "ratio": 1.0875,
          "volume": 13232
        },
        {
          "date": "2026-04-23",
          "close": 2175,
          "ratio": 1.0875,
          "volume": 3400
        },
        {
          "date": "2026-04-24",
          "close": 2180,
          "ratio": 1.09,
          "volume": 32167
        },
        {
          "date": "2026-04-27",
          "close": 2180,
          "ratio": 1.09,
          "volume": 11464
        },
        {
          "date": "2026-04-28",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 3874
        },
        {
          "date": "2026-04-29",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 17479
        },
        {
          "date": "2026-04-30",
          "close": 2140,
          "ratio": 1.07,
          "volume": 2805
        },
        {
          "date": "2026-05-04",
          "close": 2160,
          "ratio": 1.08,
          "volume": 1255
        },
        {
          "date": "2026-05-06",
          "close": 2155,
          "ratio": 1.0775,
          "volume": 19191
        },
        {
          "date": "2026-05-07",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 1229
        },
        {
          "date": "2026-05-08",
          "close": 2160,
          "ratio": 1.08,
          "volume": 6703
        },
        {
          "date": "2026-05-11",
          "close": 2160,
          "ratio": 1.08,
          "volume": 11912
        },
        {
          "date": "2026-05-12",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 12425
        },
        {
          "date": "2026-05-13",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 83348
        },
        {
          "date": "2026-05-14",
          "close": 2130,
          "ratio": 1.065,
          "volume": 1415
        },
        {
          "date": "2026-05-15",
          "close": 2110,
          "ratio": 1.055,
          "volume": 37163
        },
        {
          "date": "2026-05-18",
          "close": 2100,
          "ratio": 1.05,
          "volume": 32589
        },
        {
          "date": "2026-05-19",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 8091
        },
        {
          "date": "2026-05-20",
          "close": 2100,
          "ratio": 1.05,
          "volume": 8596
        },
        {
          "date": "2026-05-21",
          "close": 2090,
          "ratio": 1.045,
          "volume": 84634
        },
        {
          "date": "2026-05-22",
          "close": 2100,
          "ratio": 1.05,
          "volume": 105903
        },
        {
          "date": "2026-05-26",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 11712
        },
        {
          "date": "2026-05-27",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 21113
        },
        {
          "date": "2026-05-28",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 1550
        },
        {
          "date": "2026-05-29",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 21116
        },
        {
          "date": "2026-06-01",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 1203
        }
      ],
      "events": [
        {
          "date": "2023-12-22",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2023-12-22"
        },
        {
          "date": "2026-12-22",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=IBKS제23호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=467930"
    },
    {
      "id": "475240",
      "code": "475240",
      "name": "하나32호스팩",
      "market": "KOSDAQ",
      "isin": "KR7475240008",
      "sponsor": "하나",
      "ipoPrice": 2000,
      "currentPrice": 2105,
      "change": 25,
      "changePct": 1.2,
      "ratio": 1.0525,
      "premiumPct": 5.25,
      "volume": 314,
      "tradingValue": 1000000,
      "marketCap": 6736000000,
      "estimatedShares": 3200000,
      "listingDate": "2024-03-27",
      "liquidationDate": "2027-03-27",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 299,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 2.5,
      "annualizedReturn": 3.06,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "하나32호스팩",
        "fullName": "하나32호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-03-27",
        "fiscalMonth": "12월",
        "ceo": "박종찬",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "475240",
        "price": 2105,
        "change": 25,
        "changePct": 1.2,
        "volume": 314,
        "tradingValue": 1000000,
        "marketCap": 6736000000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.904772+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2100,
          "ratio": 1.05,
          "volume": 800
        },
        {
          "date": "2026-04-17",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 703
        },
        {
          "date": "2026-04-20",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 5928
        },
        {
          "date": "2026-04-21",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 4678
        },
        {
          "date": "2026-04-22",
          "close": 2090,
          "ratio": 1.045,
          "volume": 601
        },
        {
          "date": "2026-04-23",
          "close": 2090,
          "ratio": 1.045,
          "volume": 12247
        },
        {
          "date": "2026-04-24",
          "close": 2090,
          "ratio": 1.045,
          "volume": 662
        },
        {
          "date": "2026-04-27",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 7077
        },
        {
          "date": "2026-04-28",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 743
        },
        {
          "date": "2026-04-29",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2612
        },
        {
          "date": "2026-04-30",
          "close": 2080,
          "ratio": 1.04,
          "volume": 2338
        },
        {
          "date": "2026-05-04",
          "close": 2090,
          "ratio": 1.045,
          "volume": 541
        },
        {
          "date": "2026-05-06",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 805
        },
        {
          "date": "2026-05-07",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 3950
        },
        {
          "date": "2026-05-08",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 315
        },
        {
          "date": "2026-05-11",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 174
        },
        {
          "date": "2026-05-12",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 4498
        },
        {
          "date": "2026-05-13",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 20334
        },
        {
          "date": "2026-05-14",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 221
        },
        {
          "date": "2026-05-15",
          "close": 2100,
          "ratio": 1.05,
          "volume": 84
        },
        {
          "date": "2026-05-18",
          "close": 2090,
          "ratio": 1.045,
          "volume": 2227
        },
        {
          "date": "2026-05-19",
          "close": 2100,
          "ratio": 1.05,
          "volume": 2403
        },
        {
          "date": "2026-05-20",
          "close": 2100,
          "ratio": 1.05,
          "volume": 101
        },
        {
          "date": "2026-05-21",
          "close": 2080,
          "ratio": 1.04,
          "volume": 3104
        },
        {
          "date": "2026-05-22",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 543
        },
        {
          "date": "2026-05-26",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 961
        },
        {
          "date": "2026-05-27",
          "close": 2100,
          "ratio": 1.05,
          "volume": 2765
        },
        {
          "date": "2026-05-28",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 10439
        },
        {
          "date": "2026-05-29",
          "close": 2080,
          "ratio": 1.04,
          "volume": 937
        },
        {
          "date": "2026-06-01",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 314
        }
      ],
      "events": [
        {
          "date": "2024-03-27",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-03-27"
        },
        {
          "date": "2027-03-27",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=하나32호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=475240"
    },
    {
      "id": "464680",
      "code": "464680",
      "name": "KB제27호스팩",
      "market": "KOSDAQ",
      "isin": "KR7464680008",
      "sponsor": "KB",
      "ipoPrice": 2000,
      "currentPrice": 2110,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.055,
      "premiumPct": 5.5,
      "volume": 34580,
      "tradingValue": 73000000,
      "marketCap": 27229550000,
      "estimatedShares": 12905000,
      "listingDate": "2023-11-03",
      "liquidationDate": "2026-11-03",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 155,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 2.26,
      "annualizedReturn": 5.41,
      "status": "청산 6개월 이내",
      "badges": [
        "청산 6개월 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "KB제27호스팩",
        "fullName": "케이비제27호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2023-11-03",
        "fiscalMonth": "12월",
        "ceo": "이태영",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "464680",
        "price": 2110,
        "change": 0,
        "changePct": 0.0,
        "volume": 34580,
        "tradingValue": 73000000,
        "marketCap": 27229550000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.971063+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 49021
        },
        {
          "date": "2026-04-17",
          "close": 2080,
          "ratio": 1.04,
          "volume": 15448
        },
        {
          "date": "2026-04-20",
          "close": 2080,
          "ratio": 1.04,
          "volume": 80850
        },
        {
          "date": "2026-04-21",
          "close": 2080,
          "ratio": 1.04,
          "volume": 43432
        },
        {
          "date": "2026-04-22",
          "close": 2080,
          "ratio": 1.04,
          "volume": 117500
        },
        {
          "date": "2026-04-23",
          "close": 2080,
          "ratio": 1.04,
          "volume": 31266
        },
        {
          "date": "2026-04-24",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 159846
        },
        {
          "date": "2026-04-27",
          "close": 2090,
          "ratio": 1.045,
          "volume": 493325
        },
        {
          "date": "2026-04-28",
          "close": 2090,
          "ratio": 1.045,
          "volume": 93568
        },
        {
          "date": "2026-04-29",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 171794
        },
        {
          "date": "2026-04-30",
          "close": 2090,
          "ratio": 1.045,
          "volume": 94489
        },
        {
          "date": "2026-05-04",
          "close": 2090,
          "ratio": 1.045,
          "volume": 86070
        },
        {
          "date": "2026-05-06",
          "close": 2090,
          "ratio": 1.045,
          "volume": 92942
        },
        {
          "date": "2026-05-07",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 12600
        },
        {
          "date": "2026-05-08",
          "close": 2100,
          "ratio": 1.05,
          "volume": 277083
        },
        {
          "date": "2026-05-11",
          "close": 2100,
          "ratio": 1.05,
          "volume": 220886
        },
        {
          "date": "2026-05-12",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 21386
        },
        {
          "date": "2026-05-13",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 125157
        },
        {
          "date": "2026-05-14",
          "close": 2097,
          "ratio": 1.0485,
          "volume": 11996
        },
        {
          "date": "2026-05-15",
          "close": 2100,
          "ratio": 1.05,
          "volume": 130110
        },
        {
          "date": "2026-05-18",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 151333
        },
        {
          "date": "2026-05-19",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 215363
        },
        {
          "date": "2026-05-20",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 122621
        },
        {
          "date": "2026-05-21",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 21722
        },
        {
          "date": "2026-05-22",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 23351
        },
        {
          "date": "2026-05-26",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 11015
        },
        {
          "date": "2026-05-27",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 0
        },
        {
          "date": "2026-05-28",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 339211
        },
        {
          "date": "2026-05-29",
          "close": 2110,
          "ratio": 1.055,
          "volume": 690112
        },
        {
          "date": "2026-06-01",
          "close": 2110,
          "ratio": 1.055,
          "volume": 34580
        }
      ],
      "events": [
        {
          "date": "2023-11-03",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2023-11-03"
        },
        {
          "date": "2026-11-03",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=KB제27호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=464680"
    },
    {
      "id": "464440",
      "code": "464440",
      "name": "한국제13호스팩",
      "market": "KOSDAQ",
      "isin": "KR7464440007",
      "sponsor": "한국",
      "ipoPrice": 2000,
      "currentPrice": 2115,
      "change": 5,
      "changePct": 0.24,
      "ratio": 1.0575,
      "premiumPct": 5.75,
      "volume": 8384,
      "tradingValue": 18000000,
      "marketCap": 9136800000,
      "estimatedShares": 4320000,
      "listingDate": "2023-11-13",
      "liquidationDate": "2026-11-13",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 165,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 2.02,
      "annualizedReturn": 4.52,
      "status": "청산 6개월 이내",
      "badges": [
        "청산 6개월 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "한국제13호스팩",
        "fullName": "한국제13호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2023-11-13",
        "fiscalMonth": "12월",
        "ceo": "김장하",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "464440",
        "price": 2115,
        "change": 5,
        "changePct": 0.24,
        "volume": 8384,
        "tradingValue": 18000000,
        "marketCap": 9136800000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.907243+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 5357
        },
        {
          "date": "2026-04-17",
          "close": 2080,
          "ratio": 1.04,
          "volume": 8908
        },
        {
          "date": "2026-04-20",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 8066
        },
        {
          "date": "2026-04-21",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 50113
        },
        {
          "date": "2026-04-22",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 12
        },
        {
          "date": "2026-04-23",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 1881
        },
        {
          "date": "2026-04-24",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 3549
        },
        {
          "date": "2026-04-27",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 2409
        },
        {
          "date": "2026-04-28",
          "close": 2090,
          "ratio": 1.045,
          "volume": 85592
        },
        {
          "date": "2026-04-29",
          "close": 2090,
          "ratio": 1.045,
          "volume": 30901
        },
        {
          "date": "2026-04-30",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 64951
        },
        {
          "date": "2026-05-04",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 92888
        },
        {
          "date": "2026-05-06",
          "close": 2087,
          "ratio": 1.0435,
          "volume": 46479
        },
        {
          "date": "2026-05-07",
          "close": 2090,
          "ratio": 1.045,
          "volume": 84325
        },
        {
          "date": "2026-05-08",
          "close": 2092,
          "ratio": 1.046,
          "volume": 34090
        },
        {
          "date": "2026-05-11",
          "close": 2090,
          "ratio": 1.045,
          "volume": 26382
        },
        {
          "date": "2026-05-12",
          "close": 2085,
          "ratio": 1.0425,
          "volume": 27765
        },
        {
          "date": "2026-05-13",
          "close": 2090,
          "ratio": 1.045,
          "volume": 80980
        },
        {
          "date": "2026-05-14",
          "close": 2090,
          "ratio": 1.045,
          "volume": 9871
        },
        {
          "date": "2026-05-15",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 57259
        },
        {
          "date": "2026-05-18",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 58809
        },
        {
          "date": "2026-05-19",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 95964
        },
        {
          "date": "2026-05-20",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 26807
        },
        {
          "date": "2026-05-21",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 2076
        },
        {
          "date": "2026-05-22",
          "close": 2110,
          "ratio": 1.055,
          "volume": 4166
        },
        {
          "date": "2026-05-26",
          "close": 2110,
          "ratio": 1.055,
          "volume": 7853
        },
        {
          "date": "2026-05-27",
          "close": 2105,
          "ratio": 1.0525,
          "volume": 48297
        },
        {
          "date": "2026-05-28",
          "close": 2110,
          "ratio": 1.055,
          "volume": 15906
        },
        {
          "date": "2026-05-29",
          "close": 2110,
          "ratio": 1.055,
          "volume": 37664
        },
        {
          "date": "2026-06-01",
          "close": 2115,
          "ratio": 1.0575,
          "volume": 8384
        }
      ],
      "events": [
        {
          "date": "2023-11-13",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2023-11-13"
        },
        {
          "date": "2026-11-13",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=한국제13호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=464440"
    },
    {
      "id": "0099X0",
      "code": "0099X0",
      "name": "IBKS제25호스팩",
      "market": "KOSDAQ",
      "isin": "KR70099X0007",
      "sponsor": "IBKS",
      "ipoPrice": 2000,
      "currentPrice": 2130,
      "change": -15,
      "changePct": -0.7,
      "ratio": 1.065,
      "premiumPct": 6.5,
      "volume": 4,
      "tradingValue": null,
      "marketCap": 12737400000,
      "estimatedShares": 5980000,
      "listingDate": "2025-12-19",
      "liquidationDate": "2028-12-19",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 932,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 1.3,
      "annualizedReturn": 0.51,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "IBKS제25호스팩",
        "fullName": "아이비케이에스제25호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수 및 합병",
        "listingDate": "2025-12-19",
        "fiscalMonth": "12월",
        "ceo": "심기섭",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0099X0",
        "price": 2130,
        "change": -15,
        "changePct": -0.7,
        "volume": 4,
        "tradingValue": null,
        "marketCap": 12737400000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.975315+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2155,
          "ratio": 1.0775,
          "volume": 24328
        },
        {
          "date": "2026-04-17",
          "close": 2160,
          "ratio": 1.08,
          "volume": 7431
        },
        {
          "date": "2026-04-20",
          "close": 2160,
          "ratio": 1.08,
          "volume": 21597
        },
        {
          "date": "2026-04-21",
          "close": 2165,
          "ratio": 1.0825,
          "volume": 296
        },
        {
          "date": "2026-04-22",
          "close": 2165,
          "ratio": 1.0825,
          "volume": 2332
        },
        {
          "date": "2026-04-23",
          "close": 2155,
          "ratio": 1.0775,
          "volume": 9427
        },
        {
          "date": "2026-04-24",
          "close": 2150,
          "ratio": 1.075,
          "volume": 8317
        },
        {
          "date": "2026-04-27",
          "close": 2130,
          "ratio": 1.065,
          "volume": 35600
        },
        {
          "date": "2026-04-28",
          "close": 2120,
          "ratio": 1.06,
          "volume": 40220
        },
        {
          "date": "2026-04-29",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 27224
        },
        {
          "date": "2026-04-30",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 8577
        },
        {
          "date": "2026-05-04",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 48837
        },
        {
          "date": "2026-05-06",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 321
        },
        {
          "date": "2026-05-07",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 2465
        },
        {
          "date": "2026-05-08",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 8989
        },
        {
          "date": "2026-05-11",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 21080
        },
        {
          "date": "2026-05-12",
          "close": 2120,
          "ratio": 1.06,
          "volume": 3005
        },
        {
          "date": "2026-05-13",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 34183
        },
        {
          "date": "2026-05-14",
          "close": 2140,
          "ratio": 1.07,
          "volume": 14639
        },
        {
          "date": "2026-05-15",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 12106
        },
        {
          "date": "2026-05-18",
          "close": 2140,
          "ratio": 1.07,
          "volume": 25359
        },
        {
          "date": "2026-05-19",
          "close": 2130,
          "ratio": 1.065,
          "volume": 5773
        },
        {
          "date": "2026-05-20",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 9397
        },
        {
          "date": "2026-05-21",
          "close": 2130,
          "ratio": 1.065,
          "volume": 34389
        },
        {
          "date": "2026-05-22",
          "close": 2150,
          "ratio": 1.075,
          "volume": 7844
        },
        {
          "date": "2026-05-26",
          "close": 2130,
          "ratio": 1.065,
          "volume": 5895
        },
        {
          "date": "2026-05-27",
          "close": 2130,
          "ratio": 1.065,
          "volume": 3458
        },
        {
          "date": "2026-05-28",
          "close": 2130,
          "ratio": 1.065,
          "volume": 3879
        },
        {
          "date": "2026-05-29",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 25022
        },
        {
          "date": "2026-06-01",
          "close": 2130,
          "ratio": 1.065,
          "volume": 4
        }
      ],
      "events": [
        {
          "date": "2025-12-19",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-19"
        },
        {
          "date": "2028-12-19",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=IBKS제25호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0099X0"
    },
    {
      "id": "482690",
      "code": "482690",
      "name": "대신밸런스제19호스팩",
      "market": "KOSDAQ",
      "isin": "KR7482690005",
      "sponsor": "대신밸런스",
      "ipoPrice": 2000,
      "currentPrice": 2155,
      "change": -15,
      "changePct": -0.69,
      "ratio": 1.0775,
      "premiumPct": 7.75,
      "volume": 112,
      "tradingValue": null,
      "marketCap": 12100325000,
      "estimatedShares": 5615000,
      "listingDate": "2024-11-20",
      "liquidationDate": "2027-11-20",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 537,
      "trustValuePerShare": 2157.57,
      "liquidationValuePerShare": 2157.57,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": 0.12,
      "annualizedReturn": 0.08,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "대신밸런스제19호스팩",
        "fullName": "대신밸런스제19호기업인수목적(주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업 인수 및 합병",
        "listingDate": "2024-11-20",
        "fiscalMonth": "12월",
        "ceo": "임병완",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "482690",
        "price": 2155,
        "change": -15,
        "changePct": -0.69,
        "volume": 112,
        "tradingValue": null,
        "marketCap": 12100325000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.204678+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2140,
          "ratio": 1.07,
          "volume": 104
        },
        {
          "date": "2026-04-17",
          "close": 2140,
          "ratio": 1.07,
          "volume": 6916
        },
        {
          "date": "2026-04-20",
          "close": 2140,
          "ratio": 1.07,
          "volume": 36
        },
        {
          "date": "2026-04-21",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 1591
        },
        {
          "date": "2026-04-22",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 3725
        },
        {
          "date": "2026-04-23",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 13153
        },
        {
          "date": "2026-04-24",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 53143
        },
        {
          "date": "2026-04-27",
          "close": 2095,
          "ratio": 1.0475,
          "volume": 72703
        },
        {
          "date": "2026-04-28",
          "close": 2100,
          "ratio": 1.05,
          "volume": 9610
        },
        {
          "date": "2026-04-29",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 24496
        },
        {
          "date": "2026-04-30",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 7311
        },
        {
          "date": "2026-05-04",
          "close": 2160,
          "ratio": 1.08,
          "volume": 8068
        },
        {
          "date": "2026-05-06",
          "close": 2175,
          "ratio": 1.0875,
          "volume": 12363
        },
        {
          "date": "2026-05-07",
          "close": 2160,
          "ratio": 1.08,
          "volume": 3319
        },
        {
          "date": "2026-05-08",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 4534
        },
        {
          "date": "2026-05-11",
          "close": 2140,
          "ratio": 1.07,
          "volume": 116
        },
        {
          "date": "2026-05-12",
          "close": 2130,
          "ratio": 1.065,
          "volume": 611
        },
        {
          "date": "2026-05-13",
          "close": 2160,
          "ratio": 1.08,
          "volume": 21049
        },
        {
          "date": "2026-05-14",
          "close": 2120,
          "ratio": 1.06,
          "volume": 20011
        },
        {
          "date": "2026-05-15",
          "close": 2150,
          "ratio": 1.075,
          "volume": 70565
        },
        {
          "date": "2026-05-18",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 42247
        },
        {
          "date": "2026-05-19",
          "close": 2130,
          "ratio": 1.065,
          "volume": 2306
        },
        {
          "date": "2026-05-20",
          "close": 2140,
          "ratio": 1.07,
          "volume": 17202
        },
        {
          "date": "2026-05-21",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 2594
        },
        {
          "date": "2026-05-22",
          "close": 2140,
          "ratio": 1.07,
          "volume": 20064
        },
        {
          "date": "2026-05-26",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 4311
        },
        {
          "date": "2026-05-27",
          "close": 2150,
          "ratio": 1.075,
          "volume": 6636
        },
        {
          "date": "2026-05-28",
          "close": 2130,
          "ratio": 1.065,
          "volume": 10404
        },
        {
          "date": "2026-05-29",
          "close": 2170,
          "ratio": 1.085,
          "volume": 30316
        },
        {
          "date": "2026-06-01",
          "close": 2155,
          "ratio": 1.0775,
          "volume": 112
        }
      ],
      "events": [
        {
          "date": "2024-11-20",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-11-20"
        },
        {
          "date": "2027-11-20",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=대신밸런스제19호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=482690"
    },
    {
      "id": "0088D0",
      "code": "0088D0",
      "name": "메리츠제1호스팩",
      "market": "KOSDAQ",
      "isin": "KR70088D0004",
      "sponsor": "메리츠",
      "ipoPrice": 2000,
      "currentPrice": 2170,
      "change": 10,
      "changePct": 0.46,
      "ratio": 1.085,
      "premiumPct": 8.5,
      "volume": 163,
      "tradingValue": null,
      "marketCap": 12575150000,
      "estimatedShares": 5795000,
      "listingDate": "2025-12-15",
      "liquidationDate": "2028-12-15",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 928,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -0.57,
      "annualizedReturn": -0.22,
      "status": "일반",
      "badges": [
        "일반"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "메리츠제1호스팩",
        "fullName": "메리츠제1호기업인수목적 (주)",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2025-12-15",
        "fiscalMonth": "12월",
        "ceo": "이경준",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "0088D0",
        "price": 2170,
        "change": 10,
        "changePct": 0.46,
        "volume": 163,
        "tradingValue": null,
        "marketCap": 12575150000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.203547+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2195,
          "ratio": 1.0975,
          "volume": 27590
        },
        {
          "date": "2026-04-17",
          "close": 2205,
          "ratio": 1.1025,
          "volume": 72266
        },
        {
          "date": "2026-04-20",
          "close": 2200,
          "ratio": 1.1,
          "volume": 85482
        },
        {
          "date": "2026-04-21",
          "close": 2200,
          "ratio": 1.1,
          "volume": 53876
        },
        {
          "date": "2026-04-22",
          "close": 2195,
          "ratio": 1.0975,
          "volume": 21359
        },
        {
          "date": "2026-04-23",
          "close": 2200,
          "ratio": 1.1,
          "volume": 114806
        },
        {
          "date": "2026-04-24",
          "close": 2195,
          "ratio": 1.0975,
          "volume": 25747
        },
        {
          "date": "2026-04-27",
          "close": 2160,
          "ratio": 1.08,
          "volume": 66895
        },
        {
          "date": "2026-04-28",
          "close": 2160,
          "ratio": 1.08,
          "volume": 86443
        },
        {
          "date": "2026-04-29",
          "close": 2160,
          "ratio": 1.08,
          "volume": 40555
        },
        {
          "date": "2026-04-30",
          "close": 2165,
          "ratio": 1.0825,
          "volume": 20215
        },
        {
          "date": "2026-05-04",
          "close": 2180,
          "ratio": 1.09,
          "volume": 18210
        },
        {
          "date": "2026-05-06",
          "close": 2185,
          "ratio": 1.0925,
          "volume": 19750
        },
        {
          "date": "2026-05-07",
          "close": 2185,
          "ratio": 1.0925,
          "volume": 3009
        },
        {
          "date": "2026-05-08",
          "close": 2195,
          "ratio": 1.0975,
          "volume": 3359
        },
        {
          "date": "2026-05-11",
          "close": 2180,
          "ratio": 1.09,
          "volume": 67049
        },
        {
          "date": "2026-05-12",
          "close": 2180,
          "ratio": 1.09,
          "volume": 9858
        },
        {
          "date": "2026-05-13",
          "close": 2220,
          "ratio": 1.11,
          "volume": 29320
        },
        {
          "date": "2026-05-14",
          "close": 2220,
          "ratio": 1.11,
          "volume": 3133
        },
        {
          "date": "2026-05-15",
          "close": 2185,
          "ratio": 1.0925,
          "volume": 7681
        },
        {
          "date": "2026-05-18",
          "close": 2180,
          "ratio": 1.09,
          "volume": 18410
        },
        {
          "date": "2026-05-19",
          "close": 2170,
          "ratio": 1.085,
          "volume": 15629
        },
        {
          "date": "2026-05-20",
          "close": 2165,
          "ratio": 1.0825,
          "volume": 12292
        },
        {
          "date": "2026-05-21",
          "close": 2160,
          "ratio": 1.08,
          "volume": 8036
        },
        {
          "date": "2026-05-22",
          "close": 2150,
          "ratio": 1.075,
          "volume": 9388
        },
        {
          "date": "2026-05-26",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 5591
        },
        {
          "date": "2026-05-27",
          "close": 2140,
          "ratio": 1.07,
          "volume": 16586
        },
        {
          "date": "2026-05-28",
          "close": 2150,
          "ratio": 1.075,
          "volume": 13644
        },
        {
          "date": "2026-05-29",
          "close": 2160,
          "ratio": 1.08,
          "volume": 44430
        },
        {
          "date": "2026-06-01",
          "close": 2170,
          "ratio": 1.085,
          "volume": 163
        }
      ],
      "events": [
        {
          "date": "2025-12-15",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2025-12-15"
        },
        {
          "date": "2028-12-15",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=메리츠제1호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=0088D0"
    },
    {
      "id": "472220",
      "code": "472220",
      "name": "신영스팩10호",
      "market": "KOSDAQ",
      "isin": "KR7472220003",
      "sponsor": "신영",
      "ipoPrice": 2000,
      "currentPrice": 2185,
      "change": -10,
      "changePct": -0.46,
      "ratio": 1.0925,
      "premiumPct": 9.25,
      "volume": 288,
      "tradingValue": 1000000,
      "marketCap": 10247650000,
      "estimatedShares": 4690000,
      "listingDate": "2024-02-06",
      "liquidationDate": "2027-02-06",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 250,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -1.25,
      "annualizedReturn": -1.82,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "신영스팩10호",
        "fullName": "신영해피투모로우제10호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2024-02-06",
        "fiscalMonth": "12월",
        "ceo": "김용국",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "472220",
        "price": 2185,
        "change": -10,
        "changePct": -0.46,
        "volume": 288,
        "tradingValue": 1000000,
        "marketCap": 10247650000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:43.435722+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 5123
        },
        {
          "date": "2026-04-17",
          "close": 2150,
          "ratio": 1.075,
          "volume": 193
        },
        {
          "date": "2026-04-20",
          "close": 2150,
          "ratio": 1.075,
          "volume": 945
        },
        {
          "date": "2026-04-21",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 4486
        },
        {
          "date": "2026-04-22",
          "close": 2140,
          "ratio": 1.07,
          "volume": 2588
        },
        {
          "date": "2026-04-23",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 3829
        },
        {
          "date": "2026-04-24",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 16032
        },
        {
          "date": "2026-04-27",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 34555
        },
        {
          "date": "2026-04-28",
          "close": 2130,
          "ratio": 1.065,
          "volume": 31259
        },
        {
          "date": "2026-04-29",
          "close": 2135,
          "ratio": 1.0675,
          "volume": 516
        },
        {
          "date": "2026-04-30",
          "close": 2140,
          "ratio": 1.07,
          "volume": 393
        },
        {
          "date": "2026-05-04",
          "close": 2140,
          "ratio": 1.07,
          "volume": 2868
        },
        {
          "date": "2026-05-06",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 14642
        },
        {
          "date": "2026-05-07",
          "close": 2120,
          "ratio": 1.06,
          "volume": 363
        },
        {
          "date": "2026-05-08",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 297
        },
        {
          "date": "2026-05-11",
          "close": 2130,
          "ratio": 1.065,
          "volume": 1812
        },
        {
          "date": "2026-05-12",
          "close": 2130,
          "ratio": 1.065,
          "volume": 445
        },
        {
          "date": "2026-05-13",
          "close": 2130,
          "ratio": 1.065,
          "volume": 24250
        },
        {
          "date": "2026-05-14",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 55228
        },
        {
          "date": "2026-05-15",
          "close": 2185,
          "ratio": 1.0925,
          "volume": 33598
        },
        {
          "date": "2026-05-18",
          "close": 2245,
          "ratio": 1.1225,
          "volume": 39208
        },
        {
          "date": "2026-05-19",
          "close": 2210,
          "ratio": 1.105,
          "volume": 34231
        },
        {
          "date": "2026-05-20",
          "close": 2200,
          "ratio": 1.1,
          "volume": 1715
        },
        {
          "date": "2026-05-21",
          "close": 2175,
          "ratio": 1.0875,
          "volume": 9304
        },
        {
          "date": "2026-05-22",
          "close": 2130,
          "ratio": 1.065,
          "volume": 19791
        },
        {
          "date": "2026-05-26",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 274
        },
        {
          "date": "2026-05-27",
          "close": 2130,
          "ratio": 1.065,
          "volume": 2451
        },
        {
          "date": "2026-05-28",
          "close": 2140,
          "ratio": 1.07,
          "volume": 11529
        },
        {
          "date": "2026-05-29",
          "close": 2195,
          "ratio": 1.0975,
          "volume": 32450
        },
        {
          "date": "2026-06-01",
          "close": 2185,
          "ratio": 1.0925,
          "volume": 288
        }
      ],
      "events": [
        {
          "date": "2024-02-06",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-02-06"
        },
        {
          "date": "2027-02-06",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=신영스팩10호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=472220"
    },
    {
      "id": "465320",
      "code": "465320",
      "name": "교보15호스팩",
      "market": "KOSDAQ",
      "isin": "KR7465320000",
      "sponsor": "교보",
      "ipoPrice": 2000,
      "currentPrice": 2335,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.1675,
      "premiumPct": 16.75,
      "volume": null,
      "tradingValue": null,
      "marketCap": 8896350000,
      "estimatedShares": 3810000,
      "listingDate": "2023-12-05",
      "liquidationDate": "2026-12-05",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 187,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -7.59,
      "annualizedReturn": -14.28,
      "status": "합병 신청",
      "badges": [
        "합병 신청",
        "청산 1년 이내",
        "거래정지"
      ],
      "mergerStatus": "합병 신청",
      "mergerApplicationDisclosure": {
        "date": "2026-05-11 15:26",
        "title": "회사합병 결정(SPAC 소멸합병)",
        "company": "교보15호스팩",
        "submitter": "교보15호기업인수목적",
        "receiptNo": "20260511000479",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260511000479"
      },
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [
        {
          "date": "2025-09-11 16:06",
          "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "company": "교보15호스팩",
          "submitter": "코스닥시장본부",
          "receiptNo": "20250911000329",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250911000329",
          "mergerSignal": "applied"
        },
        {
          "date": "2025-09-11 16:06",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "교보15호스팩",
          "submitter": "교보15호기업인수목적",
          "receiptNo": "20250911000306",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20250911000306",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-02-11 14:17",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "교보15호스팩",
          "submitter": "교보15호기업인수목적",
          "receiptNo": "20260211000572",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260211000572",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-03-26 16:19",
          "title": "회사합병 결정",
          "company": "교보15호스팩",
          "submitter": "교보15호기업인수목적",
          "receiptNo": "20260326001865",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260326001865",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-05-11 15:26",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "교보15호스팩",
          "submitter": "교보15호기업인수목적",
          "receiptNo": "20260511000479",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260511000479",
          "mergerSignal": "applied"
        }
      ],
      "kind": {
        "name": "교보15호스팩",
        "fullName": "교보15호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "기업인수합병",
        "listingDate": "2023-12-05",
        "fiscalMonth": "12월",
        "ceo": "김상도",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "465320",
        "price": 2335,
        "change": 0,
        "changePct": 0.0,
        "volume": null,
        "tradingValue": null,
        "marketCap": 8896350000,
        "marketStatus": "OPEN",
        "tradeStop": true,
        "tradeStopText": "정지.Halted",
        "tradedAt": "2026-06-01T09:29:43.100959+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-17",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-20",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-21",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-22",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-23",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-24",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-27",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-28",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-29",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-04-30",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-04",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-06",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-07",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-08",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-11",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-12",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-13",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-14",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-15",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-18",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-19",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-20",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-21",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-22",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-26",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-27",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-28",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-05-29",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        },
        {
          "date": "2026-06-01",
          "close": 2335,
          "ratio": 1.1675,
          "volume": 0
        }
      ],
      "events": [
        {
          "date": "2023-12-05",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2023-12-05"
        },
        {
          "date": "2026-05-11 15:26",
          "type": "merger_application",
          "label": "합병 신청",
          "detail": "회사합병 결정(SPAC 소멸합병)",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260511000479"
        },
        {
          "date": "2026-12-05",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=교보15호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=465320"
    },
    {
      "id": "469480",
      "code": "469480",
      "name": "IBKS제24호스팩",
      "market": "KOSDAQ",
      "isin": "KR7469480008",
      "sponsor": "IBKS",
      "ipoPrice": 2000,
      "currentPrice": 2435,
      "change": -30,
      "changePct": -1.22,
      "ratio": 1.2175,
      "premiumPct": 21.75,
      "volume": 1548,
      "tradingValue": 4000000,
      "marketCap": 10300050000,
      "estimatedShares": 4230000,
      "listingDate": "2024-02-01",
      "liquidationDate": "2027-02-01",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 245,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -11.39,
      "annualizedReturn": -16.48,
      "status": "청산 1년 이내",
      "badges": [
        "청산 1년 이내"
      ],
      "mergerStatus": null,
      "mergerApplicationDisclosure": null,
      "mergerConfirmationDisclosure": null,
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [],
      "kind": {
        "name": "IBKS제24호스팩",
        "fullName": "아이비케이에스제24호기업인수목적 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스업",
        "listingDate": "2024-02-01",
        "fiscalMonth": "12월",
        "ceo": "김강민",
        "homepage": true,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "469480",
        "price": 2435,
        "change": -30,
        "changePct": -1.22,
        "volume": 1548,
        "tradingValue": 4000000,
        "marketCap": 10300050000,
        "marketStatus": "OPEN",
        "tradeStop": false,
        "tradeStopText": "운영.Trading",
        "tradedAt": "2026-06-01T09:29:42.971+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2150,
          "ratio": 1.075,
          "volume": 4210
        },
        {
          "date": "2026-04-17",
          "close": 2140,
          "ratio": 1.07,
          "volume": 676
        },
        {
          "date": "2026-04-20",
          "close": 2175,
          "ratio": 1.0875,
          "volume": 20010
        },
        {
          "date": "2026-04-21",
          "close": 2175,
          "ratio": 1.0875,
          "volume": 36
        },
        {
          "date": "2026-04-22",
          "close": 2170,
          "ratio": 1.085,
          "volume": 13070
        },
        {
          "date": "2026-04-23",
          "close": 2165,
          "ratio": 1.0825,
          "volume": 3574
        },
        {
          "date": "2026-04-24",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 15828
        },
        {
          "date": "2026-04-27",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 13307
        },
        {
          "date": "2026-04-28",
          "close": 2155,
          "ratio": 1.0775,
          "volume": 3937
        },
        {
          "date": "2026-04-29",
          "close": 2140,
          "ratio": 1.07,
          "volume": 7634
        },
        {
          "date": "2026-04-30",
          "close": 2155,
          "ratio": 1.0775,
          "volume": 6882
        },
        {
          "date": "2026-05-04",
          "close": 2140,
          "ratio": 1.07,
          "volume": 6119
        },
        {
          "date": "2026-05-06",
          "close": 2140,
          "ratio": 1.07,
          "volume": 5495
        },
        {
          "date": "2026-05-07",
          "close": 2140,
          "ratio": 1.07,
          "volume": 7310
        },
        {
          "date": "2026-05-08",
          "close": 2125,
          "ratio": 1.0625,
          "volume": 4152
        },
        {
          "date": "2026-05-11",
          "close": 2145,
          "ratio": 1.0725,
          "volume": 2490
        },
        {
          "date": "2026-05-12",
          "close": 2200,
          "ratio": 1.1,
          "volume": 147281
        },
        {
          "date": "2026-05-13",
          "close": 2320,
          "ratio": 1.16,
          "volume": 236738
        },
        {
          "date": "2026-05-14",
          "close": 2455,
          "ratio": 1.2275,
          "volume": 108035
        },
        {
          "date": "2026-05-15",
          "close": 2400,
          "ratio": 1.2,
          "volume": 24050
        },
        {
          "date": "2026-05-18",
          "close": 2370,
          "ratio": 1.185,
          "volume": 82291
        },
        {
          "date": "2026-05-19",
          "close": 2330,
          "ratio": 1.165,
          "volume": 14508
        },
        {
          "date": "2026-05-20",
          "close": 2360,
          "ratio": 1.18,
          "volume": 13835
        },
        {
          "date": "2026-05-21",
          "close": 2465,
          "ratio": 1.2325,
          "volume": 43268
        },
        {
          "date": "2026-05-22",
          "close": 2550,
          "ratio": 1.275,
          "volume": 46479
        },
        {
          "date": "2026-05-26",
          "close": 2505,
          "ratio": 1.2525,
          "volume": 20829
        },
        {
          "date": "2026-05-27",
          "close": 2400,
          "ratio": 1.2,
          "volume": 35957
        },
        {
          "date": "2026-05-28",
          "close": 2470,
          "ratio": 1.235,
          "volume": 45509
        },
        {
          "date": "2026-05-29",
          "close": 2465,
          "ratio": 1.2325,
          "volume": 33648
        },
        {
          "date": "2026-06-01",
          "close": 2435,
          "ratio": 1.2175,
          "volume": 1548
        }
      ],
      "events": [
        {
          "date": "2024-02-01",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2024-02-01"
        },
        {
          "date": "2027-02-01",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=IBKS제24호스팩",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=469480"
    },
    {
      "id": "451700",
      "code": "451700",
      "name": "엔에이치스팩29호",
      "market": "KOSDAQ",
      "isin": "KR7451700009",
      "sponsor": "엔에이치",
      "ipoPrice": 2000,
      "currentPrice": 3440,
      "change": 0,
      "changePct": 0.0,
      "ratio": 1.72,
      "premiumPct": 72.0,
      "volume": null,
      "tradingValue": null,
      "marketCap": 49364000000,
      "estimatedShares": 14350000,
      "listingDate": "2023-06-23",
      "liquidationDate": "2026-06-23",
      "liquidationDateSource": "상장일+36개월 추정",
      "daysToLiquidation": 22,
      "trustValuePerShare": 2157.72,
      "liquidationValuePerShare": 2157.72,
      "liquidationValueSource": "공모예치금+예상 예치이자(KOFR 2.560%)",
      "expectedReturn": -37.28,
      "annualizedReturn": -99.96,
      "status": "합병 확정",
      "badges": [
        "합병 확정",
        "청산 6개월 이내",
        "거래정지"
      ],
      "mergerStatus": "합병 확정",
      "mergerApplicationDisclosure": {
        "date": "2026-05-12 11:25",
        "title": "회사합병 결정(SPAC 소멸합병)",
        "company": "엔에이치스팩29호",
        "submitter": "엔에이치기업인수목적29호",
        "receiptNo": "20260512000316",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260512000316"
      },
      "mergerConfirmationDisclosure": {
        "date": "2026-02-05 17:50",
        "title": "주권매매거래정지해제(상장예비심사결과 통지(승인))",
        "company": "엔에이치스팩29호",
        "submitter": "코스닥시장본부",
        "receiptNo": "20260205001170",
        "source": "KIND 공시검색",
        "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260205001170"
      },
      "mergerCancellationDisclosure": null,
      "mergerDisclosures": [
        {
          "date": "2025-11-14 16:16",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "엔에이치스팩29호",
          "submitter": "엔에이치기업인수목적29호",
          "receiptNo": "20251114002137",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251114002137",
          "mergerSignal": "applied"
        },
        {
          "date": "2025-11-14 16:16",
          "title": "주권매매거래정지(SPAC 합병(예비심사청구대상))",
          "company": "엔에이치스팩29호",
          "submitter": "코스닥시장본부",
          "receiptNo": "20251114002286",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20251114002286",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-02-05 17:50",
          "title": "주권매매거래정지해제(상장예비심사결과 통지(승인))",
          "company": "엔에이치스팩29호",
          "submitter": "코스닥시장본부",
          "receiptNo": "20260205001170",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260205001170",
          "mergerSignal": "confirmed"
        },
        {
          "date": "2026-02-27 15:54",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "엔에이치스팩29호",
          "submitter": "엔에이치기업인수목적29호",
          "receiptNo": "20260227001154",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260227001154",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-03-31 13:04",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "엔에이치스팩29호",
          "submitter": "엔에이치기업인수목적29호",
          "receiptNo": "20260331000846",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260331000846",
          "mergerSignal": "applied"
        },
        {
          "date": "2026-05-12 11:25",
          "title": "회사합병 결정(SPAC 소멸합병)",
          "company": "엔에이치스팩29호",
          "submitter": "엔에이치기업인수목적29호",
          "receiptNo": "20260512000316",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260512000316",
          "mergerSignal": "applied"
        }
      ],
      "kind": {
        "name": "엔에이치스팩29호",
        "fullName": "엔에이치기업인수목적29호 주식회사",
        "industry": "금융 지원 서비스업",
        "mainProduct": "금융 지원 서비스업",
        "listingDate": "2023-06-23",
        "fiscalMonth": "12월",
        "ceo": "박준우",
        "homepage": false,
        "location": "서울특별시",
        "source": "KIND 상장법인목록"
      },
      "quote": {
        "code": "451700",
        "price": 3440,
        "change": 0,
        "changePct": 0.0,
        "volume": null,
        "tradingValue": null,
        "marketCap": 49364000000,
        "marketStatus": "OPEN",
        "tradeStop": true,
        "tradeStopText": "정지.Halted",
        "tradedAt": "2026-06-01T09:29:43.69172+09:00",
        "source": "네이버 증권 실시간"
      },
      "history": [
        {
          "date": "2026-04-16",
          "close": 2540,
          "ratio": 1.27,
          "volume": 254972
        },
        {
          "date": "2026-04-17",
          "close": 2670,
          "ratio": 1.335,
          "volume": 540454
        },
        {
          "date": "2026-04-20",
          "close": 2845,
          "ratio": 1.4225,
          "volume": 937567
        },
        {
          "date": "2026-04-21",
          "close": 2960,
          "ratio": 1.48,
          "volume": 692983
        },
        {
          "date": "2026-04-22",
          "close": 3135,
          "ratio": 1.5675,
          "volume": 576114
        },
        {
          "date": "2026-04-23",
          "close": 3175,
          "ratio": 1.5875,
          "volume": 638733
        },
        {
          "date": "2026-04-24",
          "close": 3225,
          "ratio": 1.6125,
          "volume": 399989
        },
        {
          "date": "2026-04-27",
          "close": 3135,
          "ratio": 1.5675,
          "volume": 473551
        },
        {
          "date": "2026-04-28",
          "close": 3240,
          "ratio": 1.62,
          "volume": 341132
        },
        {
          "date": "2026-04-29",
          "close": 3410,
          "ratio": 1.705,
          "volume": 405602
        },
        {
          "date": "2026-04-30",
          "close": 3400,
          "ratio": 1.7,
          "volume": 413231
        },
        {
          "date": "2026-05-04",
          "close": 3480,
          "ratio": 1.74,
          "volume": 288000
        },
        {
          "date": "2026-05-06",
          "close": 3560,
          "ratio": 1.78,
          "volume": 353565
        },
        {
          "date": "2026-05-07",
          "close": 3585,
          "ratio": 1.7925,
          "volume": 195463
        },
        {
          "date": "2026-05-08",
          "close": 3755,
          "ratio": 1.8775,
          "volume": 387733
        },
        {
          "date": "2026-05-11",
          "close": 3955,
          "ratio": 1.9775,
          "volume": 422157
        },
        {
          "date": "2026-05-12",
          "close": 3895,
          "ratio": 1.9475,
          "volume": 462530
        },
        {
          "date": "2026-05-13",
          "close": 3810,
          "ratio": 1.905,
          "volume": 594447
        },
        {
          "date": "2026-05-14",
          "close": 3830,
          "ratio": 1.915,
          "volume": 411464
        },
        {
          "date": "2026-05-15",
          "close": 3440,
          "ratio": 1.72,
          "volume": 1176369
        },
        {
          "date": "2026-05-18",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-19",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-20",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-21",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-22",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-26",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-27",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-28",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-05-29",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        },
        {
          "date": "2026-06-01",
          "close": 3440,
          "ratio": 1.72,
          "volume": 0
        }
      ],
      "events": [
        {
          "date": "2023-06-23",
          "type": "listing",
          "label": "상장",
          "detail": "KIND 상장일 2023-06-23"
        },
        {
          "date": "2026-02-05 17:50",
          "type": "merger_confirmation",
          "label": "합병 확정",
          "detail": "주권매매거래정지해제(상장예비심사결과 통지(승인))",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260205001170"
        },
        {
          "date": "2026-05-12 11:25",
          "type": "merger_application",
          "label": "합병 신청",
          "detail": "회사합병 결정(SPAC 소멸합병)",
          "source": "KIND 공시검색",
          "url": "https://kind.krx.co.kr/common/disclsviewer.do?method=search&acptno=20260512000316"
        },
        {
          "date": "2026-06-23",
          "type": "liquidation",
          "label": "청산기한",
          "detail": "상장일+36개월 추정"
        }
      ],
      "disclosureUrl": "https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=엔에이치스팩29호",
      "naverUrl": "https://finance.naver.com/item/main.naver?code=451700"
    }
  ],
  "errors": {
    "quote": {},
    "disclosure": {}
  },
  "sourceLinks": {
    "kindCorpList": "https://kind.krx.co.kr/corpgeneral/corpList.do?method=loadInitPage",
    "kindDisclosure": "https://kind.krx.co.kr/disclosure/searchdisclosurebycorp.do?method=searchDisclosureByCorpMain",
    "dartDisclosure": "https://dart.fss.or.kr/dsab007/main.do",
    "krxData": "https://data.krx.co.kr/",
    "naverFinance": "https://finance.naver.com/",
    "openDartGuide": "https://opendart.fss.or.kr/guide/main.do",
    "kofr": "https://www.kofr.kr/main.jsp"
  }
};

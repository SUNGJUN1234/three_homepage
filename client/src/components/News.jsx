import React, { useState } from 'react'

const newsText = [
  {
    title : "채용 공고 - 웹 개발자",
    desc : "안녕하세요? 아래와 같이 웹 개발자 약간명을 채용합니다. 많은 분들의 지원 바랍니다. [제출 서류 및 제출처] [개발직군] [근무처]* 서울 연구소 혹은",
    date : "2024-05-22"
  },
  {
    title : "오픈소스 소프트웨어 통합지원센터(OpenUp), 가이아쓰리디 소개",
    desc : "안녕하세요? 오픈소스 소프트웨어 통합지원센터(OpenUp)에 저희 가이아쓰리디가 공간정보 분야 대표 오픈소스 기업으로 소개되었습니다. 자세한 내용은 https://www.oss.kr/oss_case/show/7e93ae00-3ab2-4d6a-9220-001eecbf176f 에서 확인하실 수 있습니다. 가이아쓰리디는",
    date : "2024-04-29"
  },
  {
    title : "가이아쓰리디, 128차 OGC 총회에서 발표",
    desc : "안녕하세요? 가이아쓰리디는 네델란드 델프트에서 개최된 제128차 OGC총회에서 초대용량 시공간 데이터의 가시화와 관련한 발표를 진행하였습니다. 발표를 통해 디지털트윈 환경에서 초대용량 시공간",
    date : "2024-03-27"
  },
  {
    title : "가이아쓰리디, QGIS 재단 후원",
    desc : "안녕하세요? 가이아쓰리디가 올해도 QGIS재단을 후원합니다. 가이아쓰리디는 대한민국의 오픈소스GIS 전문기업으로 QGIS뿐만 아니라 GeoServer, GDAL, PostGIS 등 다양한 오픈소스GIS 프로젝트를 후원하고 있으며,",
    date : "2024-03-14"
  },
]

const News = () => {

  return (
    <section id="news">
    <div className="news__inner">
        <h2 className="news__title">News <em>최근 뉴스</em></h2>
        <div className="news__desc">
            {newsText.map((news, key) => (
              <div key={key}>
                <span>{key+1}.</span>
                <h3>{news.title}</h3>
                <p>{news.desc}</p>
            </div>
            ))}
        </div>
    </div>
</section>
  )
}

export default News

/**
 * 날짜/시간 필터 유틸리티 Mixin
 * moment.js를 사용한 날짜 포맷팅 필터 제공
 */

import moment from 'moment';

// 날짜 포맷 상수
const FMT_DOT_yyyyMMdd = 'YYYY.MM.DD';
const FMT_DASH_yyyyMMdd = 'YYYY-MM-DD';
const FMT_DOT_yyyyMMdd_hhmiss = 'YYYY.MM.DD HH:mm:ss';
const FMT_DASH_yyyyMMdd_hhmiss = 'YYYY-MM-DD HH:mm:ss';
const FMT_HANGLE_yyyyMMdd = 'YYYY년 M월 D일';
const FMT_HANGLE_yyyyMMdd_dddd_hhmiss = 'YYYY년 M월 D일 dddd HH:mm';

/**
 * 사용 예제:
 * {{data.udtDate | eFmtDate('.')}}
 * {{data.udtDate | eFmtDate()}}
 * {{data.udtDate | eFmtDate('-')}}
 */
export default {
  data() {
    return {

    }
  },
  filters: {
    // 날짜 포맷 (구분자: '.' 또는 '-')
    eFmtDate(value, delimiter) {
      const d = delimiter || '-';
      if (value) {
        let tempValue = value;

        if(tempValue.length >= 10){
          tempValue = tempValue.substring(0,10);
        }

        switch(d){
          case '.':
            return moment(tempValue).format(FMT_DOT_yyyyMMdd);
          case '-':
          default:
            return moment(tempValue).format(FMT_DASH_yyyyMMdd);
        }
      }

      return value;
    },

    // 날짜 시간 포맷 (구분자: '.' 또는 '-')
    eFmtDateTime(value, delimiter) {
      const d = delimiter || '-';
      if (value) {
        switch(d){
          case '.':
            return moment(value).format(FMT_DOT_yyyyMMdd_hhmiss);
          case '-':
          default:
            return moment(value).format(FMT_DASH_yyyyMMdd_hhmiss);
        }
      }

      return value;
    },

    // 한글 날짜 포맷
    eFmtDateHangle(value, fmt) {
      const sFmt = fmt || FMT_HANGLE_yyyyMMdd;
      if (value) {
        return moment(value).format(sFmt);
      }

      return value;
    },

    // 날짜 포맷 (요일 포함)
    eFmtDateFormat(value, fmt) {
      const sFmt = fmt || FMT_HANGLE_yyyyMMdd_dddd_hhmiss;
      if (value) {
        return moment(value).format(sFmt);        
      }

      return value;
    },

    // 요일 반환 (일, 월, 화, ...)
    eFmtDays(value, daysArray){
      if (!value) {
        return value;        
      }

      const daysArr = daysArray || ["일", "월", "화", "수", "목", "금", "토"];
      const date = moment(value).toDate();
      const day = date.getDay();
      return daysArr[day];
    },

    // 날짜 + 요일 반환 (2024.01.01 월요일)
    eFmtDays2(value, daysArray){
      if (!value) {
        return "";
      }

      const daysArr = daysArray || ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
      const date = moment(value).toDate();
      const day = date.getDay();
      const fmtDate = moment(value).format(FMT_DOT_yyyyMMdd);

      return fmtDate + " " + daysArr[day];
    },

    // 오전/오후 표시 추가
    eFmtAmPm(value) {
      if (!value) {
        return "";
      }

      const time = parseInt(value.split(":")[0], 10);
      
      if(time >= 12) {
        return value + " 오후";
      } 
      return value + " 오전";
    }
  },
  methods: {
    
    
  }
}
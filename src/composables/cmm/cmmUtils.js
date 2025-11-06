/**
 * 통합 유틸리티 Mixin
 * 공통 필터, 메서드, API 처리 등을 제공
 */

// TODO: 필요한 파일들이 생성되면 주석 해제
// import device from './device';
// import routerHistory from './routerHistory';
// import { getUserData } from '@/auth/jwt/useJwt';
// import useJwt from '@/auth/jwt/useJwt';
// import { getLoadLogAtLast } from '@/api/log';

import datetimeFilter from './datetimeFilter';
import numberFilter from './numberFilter';
import formatter from './formatter';

// API 기본 URL
const base = process.env.VUE_APP_API_BASE_URL;

export default {
  mixins: [
    // device, // TODO: device mixin 파일 생성 후 주석 해제
    // routerHistory, // TODO: routerHistory mixin 파일 생성 후 주석 해제
    datetimeFilter,
    numberFilter,
    formatter
  ],
  data() {
    return {

    }
  },
  computed: {
    // 로그인 사용자 데이터
    loginUserData(){
      // TODO: getUserData 함수 구현 후 주석 해제
      // return getUserData();
      return null;
    }
  },
  /*
  beforeRouteLeave : function(to, from, next){
    //페이지 이동전 검색 param 저장용
    try{
      const routerName = from.name;
      if(from.matched.length > 0){
        const coms = from.matched[0].components.default;
        const methods = coms.methods;
        if(methods && methods.hasOwnProperty('onBeforeRouter')){
          const fncOnBeforeRouter = methods['onBeforeRouter'];
          fncOnBeforeRouter(routerName);
        }
      }
    }catch(err){
      console.error(err);
    }

    return next();
  },
  */
  filters: {
    // 사용여부 필터 (Y: 사용, N: 미사용)
    useYnName(val){
      return val == "Y" ? "사용" : val == "N" ? "미사용" : "-";
    },

    // 공통코드에서 코드에 해당하는 코드명 출력
    eufGetCodeName(val, codeList, pTraceKey){
      let ret = "-";

      if(!codeList || codeList.length < 1 || !val ){return ret;}

      let traceKey = pTraceKey || 'value';
      const cd = codeList.find((item)=>{
        return item[traceKey] == val;
      });

      if(cd){
        return cd.label;
      }

      return "-";
    },

    // 데이터가 blank일 때 '-'로 처리
    eufBlankToDash(val){
      if(!val){
        return "-";
      }

      return val;
    },
  },
  methods: {
    // 사용자 정보 삭제 (토큰, 사용자 데이터 제거)
    async eumClearLoginInfo(){
      const _vm = this;
      // TODO: useJwt import 후 주석 해제
      // localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      // localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)
      // localStorage.removeItem(useJwt.jwtConfig.storageUserDataKeyName)
      
      // 임시: 직접 키 이름 사용
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    },

    // 로그아웃 처리
    async eumLogout(){
      const _vm = this;

      // TODO: useJwt.logout() 구현 후 주석 해제
      // await useJwt.logout();
      
      // 사용자 정보 삭제
      await _vm.eumClearLoginInfo();
      
      // 로그인 페이지로 이동
      // TODO: ermReplacePage 메서드 구현 또는 router 사용
      // _vm.ermReplacePage({name:'auth-login'});
      if (_vm.$router) {
        _vm.$router.push({name:'auth-login'});
      }
    },

    // 공통코드 목록 => [{label:'text', value:'data'}] 형식으로 변환
    eumConvertToVueSelectOption(rawCommonCodes, pTraceKey){
      let traceKey = pTraceKey || 'code';
      return rawCommonCodes.map(item=>{
        return {label:item.codeName, value:item[traceKey]};
      });
    },

    // Vue-Select 등에서 선택된 값의 value 값을 String으로 반환
    eumGetVSelectValue(selectModel, propName) {
      const pName = propName || 'value';
      if (!selectModel) { return null; }

      if (typeof selectModel === 'object') {
        if (selectModel.hasOwnProperty(pName)) {
          return selectModel[pName];
        }
      }
      return null;
    },

    // 공통코드 List에서 코드를 찾아 Object 반환
    eumGetCodeObject(codeVal, codes){
      if(codeVal && codes && codes.length > 0){
        return codes.find(item=>{
          return item.value == codeVal;
        });
      }

      return null;
    },

    //오류 alert
    async alertError(errorMsg, title){
      const _vm = this;

      let eMsg = '알 수 없는 오류가 발생하였습니다.';
      if(errorMsg instanceof Error){
        const eRes = errorMsg.response;
        if(eRes && eRes.data && eRes.data.returnMessage){
          eMsg = eRes.data.returnMessage;
        }else{
          eMsg = errorMsg.message;
        }
      }else{
        eMsg = errorMsg || eMsg;
      }

      eMsg = eMsg.replace(/\n+/g, '<br/>');

      return await _vm.$swal({
        icon: 'error',
        title : title,
        html : eMsg,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      });
    },

    //성공 alert (자동 꺼짐)
    async alertSuccess(message, title, timer){
      const htmlMessage = (message || '').replace(/\n+/g, '<br/>');

      const _vm = this;
      return await _vm.$swal({
        icon: 'success',
        title: title,
        html: htmlMessage,
        showConfirmButton: false,
        timer: timer || 1500,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      });
    },

    // Info alert (자동 꺼짐)
    /**
     * @param {string} message 메시지
     * @param {string} title 타이틀
     * @param {number} width 너비, default: 400
     * @param {number} timer 타이머, default: 1500
     * @returns {Promise}
     */
    async alertInfo(message, title, width = 400, timer = 1500){
      const htmlMessage = (message || '').replace(/\n+/g, '<br/>');
      const htmlTitle = (title || '').replace(/\n+/g, '<br/>');

      const _vm = this;
      // TODO: $swal 플러그인 설정 확인 필요
      return await _vm.$swal({
        icon: 'info',
        title: htmlTitle,
        html: htmlMessage,
        showConfirmButton: false,
        timer: timer, // 오타 수정: ttimer -> timer
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
        width: `${width}px`
      });
    },

    // 기본 API 오류 처리 (비동기 alert)
    async defaultApiErrorHandler(err){
      const _vm = this;
      let errorMsg = '알 수 없는 오류가 발생했습니다.';
      if(!err.response){
        console.error(err);
        _vm.alertError(errorMsg, '오류');
        return true;
      }

      const { resultCode, resultFailMessage, resultMsg } = err.response.data;
      errorMsg = resultFailMessage || resultMsg || '통신이 원할하지 않습니다.\n잠시 후 다시 시도해 주십시오.';

      if(resultCode != "0000"){
        _vm.alertError(errorMsg, '오류');
        return true;
      }

      return false;
    },

    // 기본 API 오류 처리 (동기 alert)
    async defaultApiErrorHandlerSyncAlert(err){
      const _vm = this;
      let errorMsg = '알 수 없는 오류가 발생했습니다.';
      if(!err.response){
        console.error(err);
        await _vm.alertError(errorMsg, '오류');
        return true;
      }

      const { resultCode, resultFailMessage, resultMsg } = err.response.data;
      errorMsg = resultFailMessage || resultMsg || '통신이 원할하지 않습니다.\n잠시 후 다시 시도해 주십시오.';

      if(resultCode != "0000"){
        await _vm.alertError(errorMsg, '오류');
        return true;
      }

      return false;
    },

    // CamelCase를 SNAKE_CASE로 변환
    eumCamel2under(str){
      if(!str){
        return str;
      }

      return str.replace(/([A-Z])/g, function(arg){
        return "_"+arg.toLowerCase();
      }).toUpperCase();
    },

    // SNAKE_CASE를 camelCase로 변환
    eumUnder2camel(str){
      if(!str){
        return str;
      }

      return str.toLowerCase().replace(/(\_[a-z])/g, function(arg){
        return arg.toUpperCase().replace('_','');
      });
    },

    // 파일 다운로드 경로 생성
    eumFileDownPath(fileId){
      const link = `${base}/file/download.do?fId=${fileId}`;
      return link;
    },

    // 첨부파일 이미지 경로 생성
    eumFileImagePath(fileId, pThumb){
      const thumb = pThumb || "1";
      const link = `${base}/file/image.do?thumb=${thumb}&fId=${fileId}`;
      return link;
    },

    // 첨부파일 이미지 경로 생성 (크기 지정)
    eumFileImagePathWithSize(fileId, pThumb, size){
      const thumb = pThumb || "1";
      let link = `${base}/file/image.do?thumb=${thumb}&fId=${fileId}`;
      if(thumb == "1" && size){
        link += '&size='+size;
      }
      return link;
    },

    // 첨부파일 썸네일 이미지 로드
    async eumFileImageThumb(fileId, size){
      const _vm = this;

      try{
        const downUrl = _vm.eumFileImagePathWithSize(fileId, '1', size);
        // TODO: $http 대신 axios 인스턴스 사용
        const res = await _vm.$http.get(downUrl, {
          responseType: 'blob'
        });

        const lUrl = window.URL.createObjectURL(new Blob([res.data]));
        return lUrl;

      }catch(err){
        console.error(err);
      }
    },

    /**
     * 첨부파일 다운로드
     * @param {*} {param0} {downUrl:첨부파일 다운로드 URL, fileName:저장할 파일명}
     */
    async eumFileDownload({ downUrl, fileName }){
      const _vm = this;

      try{
        const res = await _vm.$http.get(downUrl, {
          responseType: 'blob'
        });

        const lUrl = window.URL.createObjectURL(new Blob([res.data]));
        //console.debug(res);
        const link = document.createElement('a');
        const contentDisposition = res.headers['content-disposition']; // 파일 이름
        let tFileName = 'unknown';
        if (contentDisposition) {
          const [ fileNameMatch ] = contentDisposition.split(';').filter(str => str.includes('filename'));
          if (fileNameMatch){
            [ , tFileName ] = fileNameMatch.split('=');
            tFileName = tFileName.replace(/"/gi, '');
          }
        }else{
          //console.debug(fileName);
          tFileName = fileName || 'unknown';
        }

        link.href = lUrl;
        link.setAttribute('download', `${tFileName}`);
        link.style.cssText = 'display:none';
        document.body.appendChild(link);
        link.click();
        link.remove();

      }catch(err){
        console.error(err);
        const { config, response } = err;
        //console.debug(config);
        //console.debug(response);
        if(response && response.status === 404){
          _vm.alertError('파일을 찾을 수 없습니다.');
        }else{
          _vm.alertError('알 수 없는 오류가 발생했습니다.');
        }

      }
    },

    // 기본 연도 옵션 생성 (현재 연도 기준 ±3년)
    getDefaultYearOptions(isNow){
      let yearOptions = [];
      const d = new Date();

      const startYear = isNow ? d.getFullYear() : d.getFullYear()+1;

      for(let ii=startYear; ii >=d.getFullYear()-3; ii--){
        yearOptions.push({label:ii+"년", value:ii});
      }

      return yearOptions;
    },

    // 기본 월 옵션 생성 (1월~12월)
    getDefaultMonthOptions(){
      let monthOptions = [];

      for(let ii=1; ii<=12; ii++){
        monthOptions.push({label:ii+"월", value:ii});
      }

      return monthOptions;
    },

    // 줄바꿈을 <br /> 태그로 변환
    eumReplaceBr(text){
      if(!text){
        return "";
      }

      return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },

    // 서비스 리스트를 문자열로 조인
    eumServiceListJoin(serviceList, joinChar){
      if(!serviceList || serviceList.length == 0){
        return "-"
      }

      var strArr = [];
      for(let key in serviceList){
        strArr.push(serviceList[key].serviceName);
      }

      if(joinChar){
        return strArr.join(joinChar);
      }

      return strArr.join("<br/>");
    },


    /**
     * 첨부파일 다운로드
     */
    // 응답 객체로부터 파일 다운로드
    eumFileDownloadResponse(res, fileName){
      const _vm = this;

      try{
        const lUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        const contentDisposition = res.headers['content-disposition']; // 파일 이름
        let tFileName = fileName || 'excelData.xls'; // 논리 오류 수정
        if (contentDisposition) {
          const [ fileNameMatch ] = contentDisposition.split(';').filter(str => str.includes('filename'));
          if (fileNameMatch){
            [ , tFileName ] = fileNameMatch.split('=');
            tFileName = tFileName.replace(/"/gi, '');
          }

          if(fileName){
            tFileName = fileName;
          }
        }else{
          tFileName = fileName || 'excelData.xls';
        }

        link.href = lUrl;
        link.setAttribute('download', `${tFileName}`);
        link.style.cssText = 'display:none';
        document.body.appendChild(link);
        link.click();
        link.remove();

      }catch(err){
        console.error(err);
        const { config, response } = err;
        //console.debug(config);
        //console.debug(response);
        if(response && response.status === 404){
          _vm.alertError('파일을 찾을 수 없습니다.');
        }else{
          _vm.alertError('알 수 없는 오류가 발생했습니다.');
        }

      }
    },

    // URL 처리 (외부: 새 창, 내부: 라우터 이동)
    eumLocationUrl(refUrl) {
      const _vm = this;

      if(!refUrl) {
        return refUrl;
      }

      // 외부 URL
      if(refUrl.indexOf("http:") >= 0 || refUrl.indexOf("https:") >= 0){
        window.open(refUrl, '_blank');
        return;
      }

      // 내부 URL
      const routerData = _vm.getUrlRouterData(refUrl);
      // TODO: ermPushPage 메서드 구현 또는 router 사용
      // _vm.ermPushPage(routerData);
      if (_vm.$router) {
        _vm.$router.push(routerData);
      }
    },

    // URL에서 라우터 데이터 추출
    getUrlRouterData(search) {
      const hashes = search.slice(search.indexOf('?') + 1).split('&')
      const params = {}
      hashes.map(hash => {
          const [key, val] = hash.split('=')
          params[key] = decodeURIComponent(val)
      })
      const path = search.split('?')[0];

      const routerData = {
        path: path,
        query: params
      };

      return routerData;
    },

    // API 기본 URL 반환
    eumGetBaseUrl() {
      return base;
    },

    // 일(day) 옵션 생성 (1일~31일)
    getSelectDayOptions() {
      const dayList = [];

      for(let ii = 1; ii < 32; ii++) {
        const dayObj = {};
        dayObj.label = ii + "일";
        dayObj.value = ii;
        dayList.push(dayObj);
      }

      return dayList;
    },

    // 요일 옵션 생성 (일~토)
    getSelectDayOfWeekOptions() {
      const dayOfWeekList = [];

      const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

      let ii = 0;
      for(const day of dayOfWeek) {
        ii++;
        const dayObj = {};
        dayObj.label = day;
        dayObj.value = ii;
        dayOfWeekList.push(dayObj);
      }

      return dayOfWeekList;
    },

    // 배열을 2단, 3단 등으로 변경 (그리드 레이아웃용)
    convertArray(singleArrayObj, paramUnitCnt){
      const _vm = this;

      const unitCnt = paramUnitCnt || 2;

      const retList = [];
      for(let idx=0; idx < singleArrayObj.length; idx++){
        const mod = idx % unitCnt;
        const bigIdx = (idx - mod ) / unitCnt;
        let subList = retList[bigIdx];
        if(!subList){
          subList = [];
          retList.push(subList);
        }
        subList.push(singleArrayObj[idx]);
      }

      return retList;
    },

    // 현재 페이지의 최신 로그를 가져온다
    async eumLoadLastLog(pparam){
      const _vm = this;
      // TODO: currentLogRoute 속성 확인 필요
      const currentRoute = _vm.currentLogRoute || {};
      const param = {
        routerName : currentRoute.name,
        ...pparam
      };
      // TODO: getLoadLogAtLast 함수 구현 후 주석 해제
      // return getLoadLogAtLast(param);
      return null;
    }
  }
}
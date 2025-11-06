/**
 * 포맷터 유틸리티 Mixin
 * 문자열 포맷팅 관련 필터와 메서드 제공
 */

// 최대 글자 수 제한 헬퍼 함수
const formatterMaxLength = function(val, maxLength){
  const ml = maxLength || 50;
  return String(val).substring(0, ml);
};

/**
 * 사용 예제:
 * :formatter="(val)=>{return eufmtMaxLength(val, 10)}"
 * :formatter="eufmtMaxLength30"
 * :formatter="(val)=>{return eufmtToLowerMax(val, 10)}"
 * :formatter="(val)=>{return eufmtToUpperMax(val, 10)}"
 */
export default {
  data() {
    return {

    }
  },
  filters: {
    // 전화번호 하이픈 처리 (02-1234-5678 형식)
    eufmtPhoneDash(val){
      if(!val) {
        return "-";
      }
      const tv = val || "";
      const t1 = tv.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3");
      return t1.replace("--", "-");
    },

    // 사업자번호 하이픈 처리 (123-45-67890 형식)
    eufmtBizNumDash(val){
      if(!val) {
        return "-";
      }
      const tv = val || "";
      const t1 = tv.replace(/[^0-9]/g, "").replace(/(^[0-9]{3})([0-9]+)?([0-9]{5})$/,"$1-$2-$3");
      return t1.replace("--", "-");
    },

    // 줄바꿈을 <br /> 태그로 변환
    eufmtNewLineToBr(val) {
      const tv = val || "";
      return tv.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },

    // 말줄임 처리 (지정된 길이 초과 시 ... 추가)
    eufmtEllipsis(val, maxLength){
      const tv = val || "";
      const ml = maxLength || 100;

      if(tv.length <= ml){
        return tv;
      }
      return tv.substring(0, ml) + '...';
    },

    // 계좌번호 하이픈 처리 (1234-56-78901 형식)
    eufmtBankAccountDash(val){
      if(!val) {
        return "-";
      }
      const tv = val || "";
      const t1 = tv.replace(/(^[0-9|\*]{4})([0-9|\*]+)?([0-9\\*]{5})$/,"$1-$2-$3");
      return t1.replace("--", "-");
    },

    // 카드번호 하이픈 처리 (1234-5678-9012-3456 형식)
    eufmtCardNumDash(val){
      if(!val) {
        return "-";
      }
      const tv = val || "";
      const t1 = tv.replace(/(^[0-9|\*]{4})([0-9|\*]{4})([0-9|\*]{4})([0-9\\*]{2,4})$/,"$1-$2-$3-$4");
      return t1.replace("--", "-");
    },
  },
  methods: {
    // 최대 글자 수 제한
    eufmtMaxLength(val, maxLength){
      return formatterMaxLength(val, maxLength || 50);
    },

    // 최대 글자 수 제한 50자
    eufmtMaxLength50(val){
      return formatterMaxLength(val, 50);
    },

    // 최대 글자 수 제한 30자
    eufmtMaxLength30(val){
      return formatterMaxLength(val, 30);
    },

    // 최대 글자 수 제한 4자
    eufmtMaxLength4(val) {
      return formatterMaxLength(val, 4);
    },

    // 소문자로 변환
    eufmtToLowerCase(val){
      return val.toLowerCase();
    },

    // 대문자로 변환
    eufmtToUpperCase(val){
      return val.toUpperCase();
    },

    // 소문자 변환 후 글자 수 제한
    eufmtToLowerMax(val, maxLength){
      const tv = val.toLowerCase();
      return this.eufmtMaxLength(tv, maxLength);
    },

    // 대문자 변환 후 글자 수 제한
    eufmtToUpperMax(val, maxLength){
      const tv = val.toUpperCase();
      return this.eufmtMaxLength(tv, maxLength);      
    },

    // 바이트 단위 글자 수 제한 (한글 2바이트, 영문/숫자 1바이트)
    eufmtToBtyeMax(val, maxLength){
      if (!val) {
        return "";
      }
      const tv = val || "";
      const ml = maxLength || 50;
      
      let result = "";
      let byteCnt = 0;
      
      for (let i = 0; i < tv.length; i++) {
        const char = tv[i];
        const charByte = (char.charCodeAt(0) > 127) ? 2 : 1;
        
        if (byteCnt + charByte > ml) {
          break;
        }
        
        result += char;
        byteCnt += charByte;
      }
      
      return result;
    },

    // 문자열의 바이트 수 계산 (한글 2바이트, 영문/숫자 1바이트)
    eufGetByteB(pStr) {
      const str = pStr || "";

      let byteCnt = 0;      
      for (let i=0; i<str.length; ++i) {      
        // 기본 한글 2바이트 처리      
        (str.charCodeAt(i) > 127) ? byteCnt += 2 : byteCnt++ ;      
      }
      
      return byteCnt;      
    },

    // 사업자번호 하이픈 처리 (메서드 버전)
    eufmtBizNumDash(val) {
      if (!val) {
        return "-";
      }
      const tv = val || "";
      const t1 = tv.replace(/[^0-9]/g, "").replace(/(^[0-9]{3})([0-9]+)?([0-9]{5})$/, "$1-$2-$3");
      return t1.replace("--", "-");
    },
  }
}
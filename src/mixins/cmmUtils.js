import datetimeFilter from './datetimeFilter';
import numberFilter from './numberFilter';
import formatter from './formatter';

/**
 * 통합 유틸리티 Mixin
 * 날짜, 숫자, 포맷터 관련 필터와 메서드를 통합 제공
 */
export default {
  mixins: [
    datetimeFilter,
    numberFilter,
    formatter
  ],
  data() {
    return {
      
    }
  },
  methods: {
    // TODO: 공통 유틸리티 메서드 추가
    
  }
}


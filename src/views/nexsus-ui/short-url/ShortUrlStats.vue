<template>
  <!-- 통계 페이지 컨테이너 -->
  <div class="statistics-page">
    <div class="content-wrapper">
      
      <!-- 헤더 영역 -->
      <div class="page-header">
        <div class="glass-badge">
          <span>📊</span>
          <span class="badge-text">Analytics Dashboard</span>
        </div>
        <h1 class="page-title">
          Short URL <span class="gradient-text">통계</span>
        </h1>
        <p class="page-subtitle">링크 생성 및 클릭 추이를 한눈에 확인하세요</p>
      </div>

    <!-- 차트 타입 선택 탭 -->
    <!--       
      <div class="glass-card chart-type-selector">
        <button 
          v-for="type in chartTypes" 
          :key="type.value"
          :class="['chart-type-btn', { active: selectedChartType === type.value }]"
          @click="selectedChartType = type.value"
        >
          <span class="type-icon">{{ type.icon }}</span>
          <span>{{ type.label }}</span>
        </button>
      </div> 
    -->

    <!-- 기간 선택 탭 (추이 차트일 때만 표시) -->
      <div v-if="selectedChartType === 'trend'" class="glass-card period-selector">
        <button 
          v-for="period in periods" 
          :key="period.value"
          :class="['period-btn', { active: selectedPeriod === period.value }]"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>

      <!-- 메인 차트 영역 -->
      <div class="glass-card chart-container">
        <div class="chart-header">
          <h3 class="chart-title">{{ chartTitle }}</h3>
          <div v-if="selectedChartType === 'trend'" class="chart-legend">
            <span class="legend-item">
              <span class="legend-dot blue"></span> 생성된 링크
            </span>
            <span class="legend-item">
              <span class="legend-dot red"></span> 클릭수
            </span>
          </div>
        </div>
        
        <div class="chart-body">
          <!-- 데이터 없음 표시 -->
          <div v-if="isNoData" class="no-data-container">
            <span class="no-data-icon">📉</span>
            <p class="no-data-text">데이터가 존재하지 않습니다</p>
          </div>
          

          <!-- 차트/그리드 컨텐츠 -->
          <div v-else class="chart-content">
            <!-- Trend Chart (ECharts) -->
            <div v-show="selectedChartType === 'trend'" ref="trendChart" class="full-size"></div>
            
            <!-- Usage Grid (AG Grid) -->
            <!--
            <ag-grid-vue
                v-if="selectedChartType === 'usage'"
                class="ag-theme-quartz full-size"
                :columnDefs="columnDefs"
                :rowData="usageData"
                :defaultColDef="defaultColDef"
                :animateRows="true"
                @grid-ready="onGridReady"
              >
            </ag-grid-vue>
             -->

            </div>

        </div>
      </div>
        
      <!-- KPI 카드 그리드 (Static) -->
      <div class="kpi-grid">

        <!-- 전체 생성 링크 -->
        <div class="glass-card kpi-card total-links">
          <div class="kpi-icon">🔗</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpiData.totalLinks }}</div>
            <div class="kpi-label">전체 생성 링크</div>
            <div class="kpi-change positive"></div>
          </div>
        </div>

        <!-- 전체 클릭수 -->
        <div class="glass-card kpi-card total-clicks">
          <div class="kpi-icon">👆</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpiData.totalClicks }}</div>
            <div class="kpi-label">전체 클릭수</div>
            <div class="kpi-change positive"></div>
          </div>
        </div>

        <!--오늘 클릭 수 -->
        <div class="glass-card kpi-card today-created">
          <div class="kpi-icon">📅</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpiData.todayClicked }}</div>
            <div class="kpi-label">오늘 클릭수</div>
            <div class="kpi-change positive"></div>
          </div>
        </div>

        <!-- 기간별 클릭수 -->
        <div class="glass-card kpi-card period-clicks">
          <div class="kpi-icon">🖱️</div>
          <div class="kpi-content">
            <div class="kpi-main-row">
              <div class="kpi-value">{{ kpiData.currentClicks }}</div>
              <div class="kpi-total-value">/ {{ kpiData.totalClicks }}</div>
            </div>
            <div class="kpi-label">{{ periodClicksLabel }}</div>
            <div class="kpi-change positive"></div>
          </div>
        </div>

        <!-- 기간별 클릭률 증감률 -->
        <div class="glass-card kpi-card avg-rate">
          <div class="kpi-icon">📈</div>
          <div class="kpi-content">
            <div 
              class="kpi-value" 
              :style="{ color: kpiData.periodClicksChange >= 0 ? '#ff4d4f' : '#1890ff' }"
            >
              {{ kpiData.periodClicksChange >= 0 ? '↑' : '↓' }} {{ Math.abs(kpiData.periodClicksChange).toFixed(2) }}%
            </div>
            <div class="kpi-label">{{ periodDeltaText }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
]);

// import { AgGridVue } from 'ag-grid-vue'
import { getKpiData, getTrendData, getUsageData } from '@/api/nexus-ui/short-url/shortUrl'

// ============================================
// Mock 데이터 (백엔드 연동 전 임시 데이터)
// ============================================


const MOCK_TREND_DATA = {
  day: {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    created: [12, 8, 15, 42, 58, 35, 18],
    clicks: [45, 32, 68, 125, 178, 142, 89]
  },
  week: {
    labels: ['1주차', '2주차', '3주차', '4주차'],
    created: [45, 52, 48, 61, 78, 42, 38],
    clicks: [523, 612, 587, 734, 892, 456, 398]
  },
  month: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    created: [234, 287, 312, 298, 234, 287, 312, 298, 234, 287, 312, 298],
    clicks: [2876, 3421, 3687, 3542, 2876, 3421, 3687, 3542, 2876, 3421, 3687, 3542]
  }
}

export default {
  name: 'ShortUrlStats',
  
  components: {
    // AgGridVue
  },
  
  data: () => ({
    selectedPeriod: 'week',      // 선택된 기간
    selectedChartType: 'trend',  // 선택된 차트 타입 (trend | usage)


    // 차트 타입 옵션
    chartTypes: [
      { label: '추이 분석', value: 'trend', icon: '📈' },
      { label: '사용 현황', value: 'usage', icon: '📊' }
    ],
    
    // 기간 선택 옵션
    periods: [
      { label: '일별', value: 'day' },
      { label: '주별', value: 'week' },
      { label: '월별', value: 'month' },
    ],
    
    // KPI 데이터 (동적 데이터)
    kpiData: {
      totalLinks: 1,              // 전체 생성된 링크 수
      totalClicks: 2,             // 전체 클릭수
      currentClicks: 3,           // 기간별 클릭수
      prevClicks: 4,              // 저번 기간 클릭수
      periodClicksChange: 5,      // 기간별 클릭수 변화량
      avgClickRateChange: 6,      // 평균 클릭률 변화량
      todayClicked: 7             // 오늘 클릭수
    },
    // 추이 차트 데이터 (동적 데이터)
    trendData: {},
    // 사용 현황 차트 데이터 (동적 데이터)
    usageData: {},
    
    /* Chart Instance */
    chartInstance: null,
    resizeHandler: null,  // resize 이벤트 리스너 참조

    /* AG Grid Options */
      
    gridApi: null,
    defaultColDef: {
      sortable: true,
      filter: true,
      flex: 1
    },
    columnDefs: [
      { headerName: 'URL', field: 'name', minWidth: 200 },
      { 
        headerName: '점유율', 
        field: 'value', 
        cellRenderer: params => {
          // 간단한 프로그레스 바 구현
          const width = Math.min(params.value * 4, 100) // 대략적인 스케일링
          return `
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 50px;">${params.value}%</div>
              <div style="flex: 1; height: 6px; background: #f5f5f7; border-radius: 3px; overflow: hidden;">
                <div style="width: ${width}%; height: 100%; background: #0071E3; border-radius: 3px;"></div>
              </div>
            </div>
          `
        }
      }
    ],
    
  }),
  
  computed: {
    // 차트 제목 (차트 타입과 기간에 따라 변경)
    chartTitle() {
      const _vm = this;
      
      if (_vm.selectedChartType === 'usage') {
        return '링크 점유율 분포 (TOP 10)'
      }
      const titles = {
        day: '일별 추이',
        week: '주별 추이 ',
        month: '월별 추이 ',
      }
      return titles[_vm.selectedPeriod] || '추이'
    },

    kpiPeriod() {
      const _vm = this;
      return _vm.periods.find(p => p.value === _vm.selectedPeriod)
    },

    // 기간별 클릭수 레이블 (예: '이번 주 클릭수')
    periodClicksLabel() {
      const _vm = this;
      const labelMap = {
        day: '오늘',
        week: '이번 주',
        month: '이번 달'
      }
      return `${labelMap[_vm.selectedPeriod] || '기간별'} 클릭수`
    },

    // 증감률 절대 변화량 텍스트 (예: '(전주 대비 +78)')
    periodDeltaText() {
      const _vm = this;
      const delta = _vm.kpiData.currentClicks - _vm.kpiData.prevClicks
      const prevPeriodMap = {
        day: '전일',
        week: '전주',
        month: '전월'
      }
      const prevPeriod = prevPeriodMap[_vm.selectedPeriod] || '이전 기간'
      const sign = delta >= 0 ? '+' : ''
      return `${prevPeriod} 대비 ${sign}${delta}`
    },
    
    // 데이터 유무 확인
    isNoData() {
      const _vm = this;

      if (_vm.selectedChartType === 'usage') {
        return !_vm.usageData || _vm.usageData.length === 0
      }
      // Trend Chart - trendData 변수 직접 체크
      return !_vm.trendData
    }
  },
  
  watch: {
    // 기간 변경 시 차트 데이터 재조회 및 업데이트
    async selectedPeriod() {
      const _vm = this;
      // 병렬로 API 호출
      await Promise.all([
        _vm.fetchKpiData(),
        _vm.fetchTrendData()
      ])
      _vm.updateChart()
    },
    // 차트 타입 변경 시 데이터 재조회 및 업데이트
    async selectedChartType() {
      const _vm = this;

      if (_vm.selectedChartType === 'usage') {
        // await _vm.fetchUsageData()
      } else {
        // ECharts가 숨겨져 있었을 수 있으므로 리사이즈 필요
        _vm.$nextTick(() => {
          _vm.chartInstance?.resize()
          _vm.updateChart()
        })
      }
    }
  },
  
  async mounted() {
    const _vm = this;

    await _vm.fetchKpiData()
    await _vm.fetchTrendData()
    // await _vm.fetchUsageData()

    _vm.$nextTick(() => {
      _vm.initChart()
    })

  },
  
  beforeUnmount() {
    // resize 이벤트 리스너 제거 (메모리 누수 방지)
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null
    }
    
    // 차트 인스턴스 정리
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
  },
  
  methods: {
    // 차트 초기화
    initChart() {
      this.chartInstance = echarts.init(this.$refs.trendChart)
      this.updateChart()
      
      // 반응형 처리 - 메모리 누수 방지를 위해 참조 저장
      this.resizeHandler = () => {
        this.chartInstance?.resize()
      }
      window.addEventListener('resize', this.resizeHandler)
    },
    
    // 차트 업데이트
    updateChart() {
      const _vm = this;
      if (!_vm.chartInstance) return
      
      // 차트 타입에 따라 다른 옵션 적용
      _vm.updateLineChart()
    },
    
    // ECharts 옵션 생성 (Vue 반응성 추적 최적화)
    getChartOption() {
      return {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          textStyle: { color: '#1d1d1f' },
          axisPointer: {
            type: 'cross',
            lineStyle: { color: 'rgba(0, 113, 227, 0.3)' }
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#e5e5e5' } },
          axisLabel: { color: '#86868b' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisLabel: { color: '#86868b' },
          splitLine: { lineStyle: { color: '#f5f5f7' } }
        },
        series: [
          {
            name: '생성된 링크',
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: { width: 3, color: '#0071E3' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 113, 227, 0.3)' },
                { offset: 1, color: 'rgba(0, 113, 227, 0.05)' }
              ])
            },
            itemStyle: { color: '#0071E3' }
          },
          {
            name: '총 클릭수',
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: { width: 3, color: '#FF3B30' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 59, 48, 0.3)' },
                { offset: 1, color: 'rgba(255, 59, 48, 0.05)' }
              ])
            },
            itemStyle: { color: '#FF3B30' }
          }
        ]
      }
    },
    
    // 라인 차트 업데이트
    updateLineChart() {
      if (!this.trendData) return
      
      // 매번 새로운 옵션 객체 생성 (Vue 반응성 추적 방지)
      const option = this.getChartOption()
      
      // 데이터 업데이트
      option.xAxis.data = this.trendData.labels
      option.series[0].data = this.trendData.created
      option.series[1].data = this.trendData.clicks
      
      this.chartInstance.setOption(option, true)
    },
    
    // ============================================
    // API 호출 메서드
    // ============================================
    
    // KPI 데이터 조회
    async fetchKpiData() {
      const _vm = this;

      const requestPayload = {
        data: {
          period: _vm.selectedPeriod
        }
      }
      
      try {
        const res = await getKpiData(requestPayload)
        const data = res.data
        console.log('KPI 데이터:', data)
        _vm.kpiData = {
          ...data
        }
      } catch (error) {
        console.warn('KPI 데이터 로드 실패', error)
      }
    },
    
    // 추이 차트 데이터 조회
    async fetchTrendData() {
      const _vm = this;

      const requestPayload = {
        data: {
          period: _vm.selectedPeriod
        }
      }
      
      try {
        const res = await getTrendData(requestPayload)
        const data = res.data
        console.log('추이 데이터:', data)
        _vm.trendData = {
          ...data
        }
        
      } catch (error) {
        console.warn('추이 데이터 로드 실패', error)
      }
    },
    
    // 점유율 데이터 조회
    async fetchUsageData() {
      const _vm = this;
      
      try {
        // const res = await getUsageData(10)
        // this.usageData = res.data
        console.log('점유율 데이터:', res)
      } catch (error) {
        console.warn('점유율 데이터 로드 실패', error)
        _vm.usageData = null
      }
    }
  }
}
</script>

<style scoped>
/* 페이지 레이아웃 */
.statistics-page {
  display: flex;
  justify-content: center;
  padding-top: 80px;
  min-height: 100vh;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 24px 60px;
}

/* 헤더 */
.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.glass-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.badge-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1d1d1f;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #1d1d1f;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(120deg, #0071E3, #00A8FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6e6e73;
  font-weight: 400;
}

/* 글래스 카드 (이름은 유지하되 불투명 최적화) */
.glass-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

/* 차트 타입 선택 */
.chart-type-selector {
  display: flex;
  gap: 12px;
  padding: 8px;
  margin-bottom: 24px;
  justify-content: center;
}

.chart-type-btn {
  flex: 1;
  max-width: 250px;
  padding: 14px 24px;
  border: none;
  background: transparent;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #86868b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.chart-type-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

.chart-type-btn.active {
  background: linear-gradient(120deg, #0071E3, #00A8FF);
  color: white;
}

.type-icon {
  font-size: 1.2rem;
}

/* 기간 선택 */
.period-selector {
  display: flex;
  gap: 8px;
  padding: 8px;
  margin-bottom: 32px;
  justify-content: center;
}

.period-btn {
  flex: 1;
  max-width: 150px;
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #86868b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

.period-btn.active {
  background: #1d1d1f;
  color: white;
}

/* 차트 컨테이너 */
.chart-container {
  padding: 32px;
  margin-bottom: 32px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6e6e73;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.blue {
  background: #0071E3;
}

.legend-dot.red {
  background: #FF3B30;
}

.chart-content,
.full-size {
  width: 100%;
  height: 100%;
}

.chart-body {
  width: 100%;
  height: 400px;
}

/* KPI 카드 그리드 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  contain: content; /* 렌더링 최적화 힌트 */
}

.kpi-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 그라데이션 배경 오버레이 */
.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--card-gradient);
  opacity: 0.12;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.kpi-card:hover::before {
  opacity: 0.2;
}

.kpi-card:hover {
  box-shadow: 0 28px 56px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 카드 내부 요소 z-index */
.kpi-icon,
.kpi-content {
  position: relative;
  z-index: 1;
}

.kpi-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 4px;
}

/* 기간별 클릭수 카드의 메인 로우 (현재 수치 + 전체 수치) */
.kpi-main-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

/* 전체 수치 - 작고 옅게 */
.kpi-total-value {
  font-size: 1rem;
  font-weight: 500;
  color: #b0b0b5;
}


.kpi-label {
  font-size: 0.9rem;
  color: #86868b;
  margin-bottom: 8px;
}

.kpi-change {
  font-size: 0.85rem;
  font-weight: 600;
}

.kpi-change.positive {
  color: #34C759;
}

.kpi-change.negative {
  color: #FF3B30;
}

/* 증감률 절대 변화량 텍스트 (예: (전주 대비 +78)) */
.kpi-delta {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6e6e73;
  margin-top: 4px;
}


/* 애니메이션 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

/* Stagger 애니메이션 */
.stagger-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger-delay);
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

/* 반응형 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .chart-container {
    padding: 20px;
  }
  
  .chart-body {
    height: 300px;
  }
  
  .chart-type-selector,
  .period-selector {
    flex-direction: column;
  }
  
  .chart-type-btn {
    max-width: 100%;
  }
  
  .period-btn {
    max-width: 100%;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

/* KPI 카드 그라데이션 */
.kpi-card.total-links { --card-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.kpi-card.today-created { --card-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.kpi-card.total-clicks { --card-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.kpi-card.period-clicks { --card-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-card.avg-rate { --card-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

/* 데이터 없음 상태 */
.no-data-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #86868b;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16px;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-data-text {
  font-size: 1.1rem;
  font-weight: 500;
}
</style>

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
              <span class="legend-dot" style="background: #0071E3"></span> 생성된 링크
            </span>
            <span class="legend-item">
              <span class="legend-dot" style="background: #FF3B30"></span> 총 클릭수
            </span>
          </div>
        </div>
        <div ref="mainChart" class="chart-body"></div>
      </div>

      <!-- KPI 카드 그리드 (Stagger 애니메이션) -->
      <transition-group name="stagger" tag="div" class="kpi-grid" appear>
        <div 
          v-for="(kpi, index) in kpiData" 
          :key="kpi.label" 
          :class="['glass-card', 'kpi-card', `kpi-card-${index}`]"
          :style="{ '--stagger-delay': `${index * 0.1}s`, '--card-gradient': kpi.gradient }"
          @mousemove="handleCardHover($event, index)"
          @mouseleave="resetCardTilt(index)"
          :ref="el => { if (el) cardRefs[index] = el }"
        >
          <div class="kpi-icon">{{ kpi.icon }}</div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpi.animatedValue }}</div>
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-change" :class="{ positive: kpi.change > 0, negative: kpi.change < 0 }">
              {{ kpi.change > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
            </div>
          </div>
        </div>
      </transition-group>

    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getKpiData, getTrendData, getUsageData } from '@/api/nexus-ui/short-url/shortUrl'

// ============================================
// Mock 데이터 (백엔드 연동 전 임시 데이터)
// ============================================
const MOCK_KPI_DATA = [
  { 
    icon: '🔗', 
    label: '총 링크 수', 
    value: 1234, 
    animatedValue: '0',
    change: 12,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    icon: '📅', 
    label: '오늘 생성', 
    value: 45, 
    animatedValue: '0',
    change: 23,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  { 
    icon: '👆', 
    label: '총 클릭수', 
    value: 12345, 
    animatedValue: '0',
    change: 8,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  { 
    icon: '📈', 
    label: '평균 클릭률', 
    value: 87, 
    animatedValue: '0%',
    change: -3,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

const MOCK_TREND_DATA = {
  day: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    created: [12, 8, 15, 42, 58, 35, 18],
    clicks: [45, 32, 68, 125, 178, 142, 89]
  },
  week: {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    created: [45, 52, 48, 61, 78, 42, 38],
    clicks: [523, 612, 587, 734, 892, 456, 398]
  },
  month: {
    labels: ['1주차', '2주차', '3주차', '4주차'],
    created: [234, 287, 312, 298],
    clicks: [2876, 3421, 3687, 3542]
  }
}

const MOCK_USAGE_DATA = [
  { name: 'google.com/search', value: 25 },
  { name: 'youtube.com/watch', value: 18 },
  { name: 'github.com/repo', value: 15 },
  { name: 'stackoverflow.com/q', value: 12 },
  { name: 'linkedin.com/jobs', value: 10 },
  { name: 'twitter.com/status', value: 8 },
  { name: 'reddit.com/thread', value: 5 },
  { name: 'medium.com/article', value: 4 },
  { name: 'dev.to/post', value: 2 },
  { name: '기타 링크', value: 1 }
]

export default {
  name: 'ShortUrlStats',
  
  data: () => ({
    selectedPeriod: 'week',      // 선택된 기간
    selectedChartType: 'trend',  // 선택된 차트 타입 (trend | usage)
    chartInstance: null,         // ECharts 인스턴스
    
    // 차트 타입 옵션
    chartTypes: [
      { label: '추이 차트', value: 'trend', icon: '📈' },
      { label: '링크 점유율 분포', value: 'usage', icon: '📊' }
    ],
    
    // 기간 선택 옵션
    periods: [
      { label: '일별', value: 'day' },
      { label: '주별', value: 'week' },
      { label: '월별', value: 'month' }
    ],
    
    // 카드 참조 배열 (3D 효과용)
    cardRefs: [],
    
    // KPI 데이터 (동적 데이터)
    kpiData: [],
    
    // 차트 데이터 (동적 데이터)
    trendData: null,
    usageData: null
  }),
  
  computed: {
    // 차트 제목 (차트 타입과 기간에 따라 변경)
    chartTitle() {
      if (this.selectedChartType === 'usage') {
        return '링크 점유율 분포 (TOP 10)'
      }
      const titles = {
        day: '시간대별 추이 (24시간)',
        week: '일별 추이 (최근 7일)',
        month: '주별 추이 (최근 30일)'
      }
      return titles[this.selectedPeriod] || '추이'
    },
    
    // 차트 데이터 (기간에 따라 변경)
    chartData() {
      // API 데이터가 있으면 사용, 없으면 Mock 데이터
      if (this.trendData) {
        return this.trendData
      }
      return MOCK_TREND_DATA[this.selectedPeriod]
    }
  },
  
  watch: {
    // 기간 변경 시 차트 데이터 재조회 및 업데이트
    async selectedPeriod() {
      await this.fetchTrendData()
      this.updateChart()
    },
    // 차트 타입 변경 시 데이터 재조회 및 업데이트
    async selectedChartType() {
      if (this.selectedChartType === 'usage') {
        await this.fetchUsageData()
      }
      this.updateChart()
    }
  },
  
  async mounted() {
    this.initChart()
    await this.fetchAllData()
    this.animateCounters()
  },
  
  beforeUnmount() {
    // 차트 인스턴스 정리
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
  },
  
  methods: {
    // 차트 초기화
    initChart() {
      this.chartInstance = echarts.init(this.$refs.mainChart)
      this.updateChart()
      
      // 반응형 처리
      window.addEventListener('resize', () => {
        this.chartInstance?.resize()
      })
    },
    
    // 차트 업데이트
    updateChart() {
      if (!this.chartInstance) return
      
      // 차트 타입에 따라 다른 옵션 적용
      if (this.selectedChartType === 'usage') {
        this.updateTreemapChart()
      } else {
        this.updateLineChart()
      }
    },
    
    // 라인 차트 업데이트
    updateLineChart() {
      const option = {
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
          data: this.chartData.labels,
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
            data: this.chartData.created,
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
            data: this.chartData.clicks,
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
      
      this.chartInstance.setOption(option, true)
    },
    
    // Treemap 차트 업데이트 (링크 점유율)
    updateTreemapChart() {
      // API 데이터가 있으면 사용, 없으면 Mock 데이터
      const data = this.usageData || MOCK_USAGE_DATA
      const option = {
        tooltip: {
          formatter: (info) => {
            const { name, value } = info
            return `${name}<br/>점유율: ${value}%`
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          textStyle: { color: '#1d1d1f' }
        },
        series: [
          {
            type: 'treemap',
            data: data,
            width: '100%',
            height: '100%',
            roam: false,
            nodeClick: false,
            breadcrumb: { show: false },
            label: {
              show: true,
              formatter: '{b}\n{c}%',
              fontSize: 14,
              color: 'white',
              fontWeight: 600
            },
            upperLabel: { show: false },
            itemStyle: {
              borderColor: 'white',
              borderWidth: 3,
              gapWidth: 3
            },
            levels: [
              {
                itemStyle: {
                  borderColor: 'white',
                  borderWidth: 3,
                  gapWidth: 3
                },
                colorSaturation: [0.35, 0.5],
                color: [
                  '#0071E3', '#00A8FF', '#5AC8FA', '#007AFF',
                  '#5856D6', '#AF52DE', '#FF2D55', '#FF3B30',
                  '#FF9500', '#FFCC00'
                ]
              }
            ],
            visualDimension: 0,
            visualMin: 0,
            visualMax: 25
          }
        ]
      }
      
      this.chartInstance.setOption(option, true)
    },
    
    // 카운터 애니메이션
    animateCounters() {
      this.kpiData.forEach((kpi, index) => {
        const isPercentage = typeof kpi.value === 'number' && kpi.label.includes('클릭률')
        const duration = 1500
        const steps = 60
        const stepValue = kpi.value / steps
        let currentStep = 0
        
        const interval = setInterval(() => {
          currentStep++
          const currentValue = Math.min(stepValue * currentStep, kpi.value)
          
          if (isPercentage) {
            kpi.animatedValue = `${Math.floor(currentValue)}%`
          } else if (kpi.value >= 1000) {
            kpi.animatedValue = Math.floor(currentValue).toLocaleString()
          } else {
            kpi.animatedValue = Math.floor(currentValue).toString()
          }
          
          if (currentStep >= steps) {
            clearInterval(interval)
          }
        }, duration / steps)
      })
    },
    
    // 3D 카드 호버 효과
    handleCardHover(event, index) {
      const card = this.cardRefs[index]
      if (!card) return
      
      const rect = card.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    },
    
    // 카드 틸트 리셋
    resetCardTilt(index) {
      const card = this.cardRefs[index]
      if (!card) return
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    },
    
    // ============================================
    // API 호출 메서드
    // ============================================
    
    // 모든 통계 데이터 조회
    async fetchAllData() {
      await Promise.all([
        this.fetchKpiData(),
        this.fetchTrendData(),
        this.fetchUsageData()
      ])
    },
    
    // KPI 데이터 조회
    async fetchKpiData() {
      try {
        const response = await getKpiData()
        // 백엔드 응답 포맷에 맞춰 데이터 매핑
        // this.kpiData = response.data.map((item, index) => ({
        //   ...item,
        //   animatedValue: '0',
        //   gradient: MOCK_KPI_DATA[index].gradient
        // }))
        console.log('KPI 데이터:', response)
      } catch (error) {
        console.warn('KPI 데이터 로드 실패, Mock 데이터 사용', error)
        this.kpiData = [...MOCK_KPI_DATA]
      }
    },
    
    // 추이 차트 데이터 조회
    async fetchTrendData() {
      try {
        const response = await getTrendData(this.selectedPeriod)
        // this.trendData = response.data
        console.log('추이 데이터:', response)
      } catch (error) {
        console.warn('추이 데이터 로드 실패, Mock 데이터 사용', error)
        this.trendData = null // Mock 데이터 사용
      }
    },
    
    // 점유율 데이터 조회
    async fetchUsageData() {
      try {
        const response = await getUsageData(10)
        // this.usageData = response.data
        console.log('점유율 데이터:', response)
      } catch (error) {
        console.warn('점유율 데이터 로드 실패, Mock 데이터 사용', error)
        this.usageData = null // Mock 데이터 사용
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
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
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

/* 글래스 카드 */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
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

.chart-body {
  width: 100%;
  height: 400px;
}

/* KPI 카드 그리드 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.kpi-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
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
  font-size: 2rem;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 4px;
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
</style>

<template>
  <!-- 통계 페이지 컨테이너 -->
  <div class="statistics-page">
    <div class="content-wrapper fade-in">
      
      <!-- 헤더 영역 -->
      <div class="page-header">

        <div class="row align-items-center mb-4">
          <div class="col">
            <GlassBadge icon="📊" text="Analytics Dashboard" class="m-0" />
          </div>
        </div>

        <div class="row align-items-center mb-4">
          <div class="col">
            <router-link :to="{ name: 'short-url' }" class="router-link">
              <GlassBadge 
              icon="✨" 
              text="← 단축 URL 생성하기"
              class="m-0"
            />
            </router-link>
          </div>
        </div>

        <h1 class="page-title">
          Short URL <span class="gradient-text">통계</span>
        </h1>

        <p class="page-subtitle">링크 생성 및 클릭 추이를 한눈에 확인하세요</p>
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
      <div class="glass-card chart-container slide-up delay-1">
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
          </div>

        </div>
      </div>
        
      <!-- KPI 카드 그리드 -->
      <div class="row g-4 mb-5 slide-up delay-2">
        <!-- 전체 생성 링크 -->
        <div class="col-12 col-md-6 col-lg-4 col-xl">
          <KpiCard 
            icon="🔗" 
            :value="kpiData.totalLinks" 
            label="전체 생성 링크" 
            gradient="total-links" 
          />
        </div>

        <!-- 전체 클릭수 -->
        <div class="col-12 col-md-6 col-lg-4 col-xl">
          <KpiCard 
            icon="👆" 
            :value="kpiData.totalClicks" 
            label="전체 클릭수" 
            gradient="total-clicks" 
          />
        </div>

        <!-- 오늘 클릭수 -->
        <div class="col-12 col-md-6 col-lg-4 col-xl">
          <KpiCard 
            icon="📅" 
            :value="kpiData.todayClicked" 
            label="오늘 클릭수" 
            gradient="today-created" 
          />
        </div>

        <!-- 기간별 클릭수 -->
        <div class="col-12 col-md-6 col-lg-4 col-xl">
          <KpiCard 
            icon="🖱️" 
            :value="kpiData.currentClicks" 
            :subValue="`/ ${kpiData.totalClicks}`"
            :label="periodClicksLabel" 
            gradient="period-clicks" 
          />
        </div>

        <!-- 기간별 클릭률 증감률 -->
        <div class="col-12 col-md-6 col-lg-4 col-xl">
          <KpiCard 
            icon="📈" 
            :value="`${kpiData.periodClicksChange >= 0 ? '↑' : '↓'} ${Math.abs(kpiData.periodClicksChange).toFixed(2)}%`" 
            :label="periodDeltaText" 
            gradient="avg-rate"
            :valueColor="kpiData.periodClicksChange >= 0 ? '#ff4d4f' : '#1890ff'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
])

import { getKpiData, getTrendData } from '@/api/nexus-ui/short-url/shortUrl'
import GlassBadge from '@/components/common/GlassBadge.vue'
import KpiCard from '@/components/common/KpiCard.vue'

// State
const selectedPeriod = ref('week')
const selectedChartType = ref('trend')

// 기간 선택 옵션
const periods = [
  { label: '일별', value: 'day' },
  { label: '주별', value: 'week' },
  { label: '월별', value: 'month' },
]

// KPI 데이터
const kpiData = reactive({
  totalLinks: 1,
  totalClicks: 2,
  currentClicks: 3,
  prevClicks: 4,
  periodClicksChange: 5,
  avgClickRateChange: 6,
  todayClicked: 7
})

// 추이 차트 데이터
const trendData = ref(null)

// Chart Instance
const chartInstance = ref(null)
const resizeHandler = ref(null)
const trendChart = ref(null)

// Computed
const chartTitle = computed(() => {
  if (selectedChartType.value === 'usage') {
    return '링크 점유율 분포 (TOP 10)'
  }
  const titles = {
    day: '일별 추이',
    week: '주별 추이 ',
    month: '월별 추이 ',
  }
  return titles[selectedPeriod.value] || '추이'
})

const kpiPeriod = computed(() => {
  return periods.find(p => p.value === selectedPeriod.value)
})

const periodClicksLabel = computed(() => {
  const labelMap = {
    day: '오늘',
    week: '이번 주',
    month: '이번 달'
  }
  return `${labelMap[selectedPeriod.value] || '기간별'} 클릭수`
})

const periodDeltaText = computed(() => {
  const delta = kpiData.currentClicks - kpiData.prevClicks
  const prevPeriodMap = {
    day: '전일',
    week: '전주',
    month: '전월'
  }
  const prevPeriod = prevPeriodMap[selectedPeriod.value] || '이전 기간'
  const sign = delta >= 0 ? '+' : ''
  return `${prevPeriod} 대비 ${sign}${delta}`
})

const isNoData = computed(() => {
  if (selectedChartType.value === 'usage') {
    return !trendData.value || trendData.value.length === 0
  }
  return !trendData.value
})

// Watchers
watch(selectedPeriod, async () => {
  await Promise.all([
    fetchKpiData(),
    fetchTrendData()
  ])
  updateChart()
})

watch(selectedChartType, async () => {
  if (selectedChartType.value === 'trend') {
    nextTick(() => {
      chartInstance.value?.resize()
      updateChart()
    })
  }
})

// Lifecycle
onMounted(async () => {
  await fetchKpiData()
  await fetchTrendData()

  nextTick(() => {
    initChart()
  })
})

onBeforeUnmount(() => {
  if (resizeHandler.value) {
    window.removeEventListener('resize', resizeHandler.value)
    resizeHandler.value = null
  }
  
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
})

// Methods
const initChart = () => {
  chartInstance.value = echarts.init(trendChart.value)
  updateChart()
  
  resizeHandler.value = () => {
    chartInstance.value?.resize()
  }
  window.addEventListener('resize', resizeHandler.value)
}

const updateChart = () => {
  if (!chartInstance.value) return
  updateLineChart()
}

const getChartOption = () => {
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
}

const updateLineChart = () => {
  if (!trendData.value) return
  
  const option = getChartOption()
  option.xAxis.data = trendData.value.labels
  option.series[0].data = trendData.value.created
  option.series[1].data = trendData.value.clicks
  
  chartInstance.value.setOption(option, true)
}

// API 호출
const fetchKpiData = async () => {
  const requestPayload = {
    data: {
      period: selectedPeriod.value
    }
  }
  
  try {
    const res = await getKpiData(requestPayload)
    const data = res.data
    console.log('KPI 데이터:', data)
    Object.assign(kpiData, data)
  } catch (error) {
    console.warn('KPI 데이터 로드 실패', error)
  }
}

const fetchTrendData = async () => {
  const requestPayload = {
    data: {
      period: selectedPeriod.value
    }
  }
  
  try {
    const res = await getTrendData(requestPayload)
    const data = res.data
    console.log('추이 데이터:', data)
    trendData.value = { ...data }
  } catch (error) {
    console.warn('추이 데이터 로드 실패', error)
  }
}
</script>


<style scoped>
/* 페이지 레이아웃 */
.statistics-page {
  display: flex;
  justify-content: center;
  padding-top: 2.0rem; 
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
  margin-bottom: 24px; /* 48px -> 24px */
}

.page-title {
  font-size: 2rem; /* 3rem -> 2rem */
  font-weight: 800;
  margin: 0 0 12px 0;
  color: #1d1d1f;
  letter-spacing: -1px;
}

.page-subtitle {
  font-size: 0.95rem; /* 1.1rem -> 0.95rem */
  color: #6e6e73;
  font-weight: 400;
}

/* 기간 선택 (버튼 - 변경하지 않음) */
.period-selector {
  display: flex;
  gap: 8px;
  padding: 8px;
  margin-bottom: 24px; /* 32px -> 24px */
  justify-content: center;
}

.period-btn {
  flex: 1;
  max-width: 150px;
  padding: 8px 16px; /* 12px 24px -> 8px 16px */
  border: none;
  background: transparent;
  border-radius: 12px; /* 16px -> 12px */
  font-size: 0.9rem; /* 1rem -> 0.9rem */
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

/* 반응형 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .period-selector {
    flex-direction: column;
  }
  
  .period-btn {
    max-width: 100%;
  }
}
</style>

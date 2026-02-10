<template>
  <div :class="['glass-card', 'kpi-card', gradientClass]">
    <div class="kpi-icon">{{ icon }}</div>
    <div class="kpi-content">
      <!-- 메인 값 + 서브 값 (옵션) -->
      <div v-if="subValue" class="kpi-main-row">
        <div class="kpi-value" :style="valueStyle">{{ value }}</div>
        <div class="kpi-total-value">{{ subValue }}</div>
      </div>
      <div v-else class="kpi-value" :style="valueStyle">{{ value }}</div>
      
      <!-- 레이블 -->
      <div class="kpi-label">{{ label }}</div>
      
      <!-- 변화량 (옵션) -->
      <div v-if="change" :class="['kpi-change', change.type]">
        {{ change.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  gradient: {
    type: String,
    default: ''
  },
  change: {
    type: Object,
    default: null
    // { value: '+12%', type: 'positive' | 'negative' }
  },
  valueColor: {
    type: String,
    default: ''
  }
})

const gradientClass = computed(() => props.gradient || '')
const valueStyle = computed(() => props.valueColor ? { color: props.valueColor } : {})
</script>

<style scoped>
.kpi-card {
  padding: 20px; /* 24px -> 20px */
  display: flex;
  align-items: center;
  gap: 12px; /* 16px -> 12px */
  position: relative;
  overflow: hidden;
}

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

.kpi-icon {
  font-size: 2.2rem; /* 2.5rem -> 2.2rem */
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.kpi-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.kpi-value {
  font-size: 1.3rem;
  font-weight: 750;
  color: var(--color-text, #1d1d1f);
  margin-bottom: 4px;
}

.kpi-main-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.kpi-total-value {
  font-size: 1rem;
  font-weight: 500;
  color: #b0b0b5;
}

.kpi-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #86868b);
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

/* KPI Card Gradient Variants */
.kpi-card.total-links { --card-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.kpi-card.today-created { --card-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.kpi-card.total-clicks { --card-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.kpi-card.period-clicks { --card-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-card.avg-rate { --card-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
</style>

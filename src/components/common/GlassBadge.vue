<template>
  <div :class="['glass-badge', { floating }]">
    <span v-if="icon">{{ icon }}</span>
    <span class="badge-text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'GlassBadge',
  props: {
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    floating: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.glass-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--color-surface, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.glass-badge.floating {
  animation: float 3s ease-in-out infinite;
}

.badge-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text, #1d1d1f);
  text-decoration: none !important;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
</style>

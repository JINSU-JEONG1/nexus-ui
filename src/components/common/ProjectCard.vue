<template>
  <div class="glass-card project-card">
    <div class="card-icon">
      <slot name="icon"></slot>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
    </div>
    <div class="card-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  padding: 32px;
  height: 100%;
  border: none; /* glass-card에서 처리 */
}

.card-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 16px;
  color: var(--color-text);
  margin-bottom: 24px;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.project-card:hover .card-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex: 1;
  margin-bottom: 20px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
}

.card-description {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.card-arrow {
  display: flex;
  align-items: center;
  color: var(--color-text);
  opacity: 0.3;
  transform: translateX(0);
  transition: var(--transition);
  margin-left: auto;
}

.project-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(5px);
}
</style>
<template>
  <div class="short-url-page">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Short URL</h1>
        <p class="page-subtitle">긴 URL을 짧고 간결하게 줄여보세요.</p>
      </div>
      
      <!-- Input Section -->
      <div class="input-container glass-card">
        <div class="input-wrapper">
          <input 
            type="text" 
            class="url-input" 
            v-model="originalUrl"
            placeholder="https://example.com/very/long/url..."
            @keyup.enter="generateShortUrl"
            :disabled="isLoading"
          />
          <button 
            class="generate-btn" 
            :disabled="!originalUrl || isLoading"
            @click="generateShortUrl"
          >
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>단축하기</span>
          </button>
        </div>
      </div>

      <!-- Result Section -->
      <transition name="slide-up">
        <div v-if="shortUrl" class="result-container glass-card">
          <div class="result-header">
            <span class="label">생성된 Short URL</span>
          </div>
          <div class="result-body">
            <div class="short-url-display">
              <a :href="shortUrl" target="_blank" class="short-link">{{ shortUrl }}</a>
            </div>
            <div class="action-buttons">
              <button class="action-btn copy-btn" @click="copyToClipboard">
                <span class="icon">📋</span> 복사
              </button>
              <button class="action-btn go-btn" @click="goToUrl">
                <span class="icon">🚀</span> 이동
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShortUrlPage',
  data: () => ({
    originalUrl: '',
    shortUrl: '',
    isLoading: false
  }),
  methods: {
    async generateShortUrl() {
      if (!this.originalUrl) return
      
      this.isLoading = true
      this.shortUrl = ''
      
      try {
        // 네트워크 딜레이 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // TODO: 실제 API 연동 시 이곳을 수정
        this.shortUrl = `${window.location.origin}/s/${this.generateRandomString()}`
      } catch (error) {
        console.error('Short URL 생성 실패:', error)
        alert('Short URL 생성에 실패했습니다.')
      } finally {
        this.isLoading = false
      }
    },
    async copyToClipboard() {
      if (!this.shortUrl) return
      
      try {
        await navigator.clipboard.writeText(this.shortUrl)
        alert('클립보드에 복사되었습니다!')
      } catch {
        // Fallback
        const textArea = document.createElement("textarea")
        textArea.value = this.shortUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('클립보드에 복사되었습니다!')
      }
    },
    goToUrl() {
      if (this.shortUrl) window.open(this.shortUrl, '_blank')
    },
    generateRandomString: () => Math.random().toString(36).substring(2, 8)
  }
}
</script>

<style scoped>
.short-url-page {
  display: flex;
  justify-content: center;
  padding-top: 80px;
  min-height: 80vh;
}

.content-wrapper {
  width: 100%;
  max-width: 720px;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1d1d1f 0%, #434344 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
}

/* Input Section */
.input-container {
  padding: 8px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  padding: 6px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}

.url-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 16px 20px;
  font-size: 1.1rem;
  color: var(--color-text);
  outline: none;
  min-width: 0;
}

.url-input::placeholder {
  color: #999;
}

.generate-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  opacity: 0.9;
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.generate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Result Section */
.result-container {
  padding: 24px 32px;
}

.result-header {
  margin-bottom: 12px;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.short-url-display {
  flex: 1;
  min-width: 200px;
}

.short-link {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
  text-decoration: none;
  word-break: break-all;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}

.short-link:hover {
  border-color: rgba(0, 113, 227, 0.3);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover {
  background: #f5f5f7;
  transform: translateY(-1px);
}

.action-btn.go-btn {
  background: var(--color-accent); /* Blue */
  color: white;
  border-color: transparent;
}

.action-btn.go-btn:hover {
  background: #0077ED; /* Slightly lighter blue */
}

/* Loading Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsiveness */
@media (max-width: 600px) {
  .page-title {
    font-size: 2.2rem;
  }
  .input-wrapper {
    flex-direction: column;
    padding: 8px;
  }
  .url-input {
    width: 100%;
    margin-bottom: 8px;
    text-align: center;
  }
  .generate-btn {
    width: 100%;
  }
  .result-body {
    flex-direction: column;
    align-items: stretch;
  }
  .short-url-display {
    text-align: center;
    margin-bottom: 16px;
  }
  .action-buttons {
    justify-content: stretch;
  }
  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>

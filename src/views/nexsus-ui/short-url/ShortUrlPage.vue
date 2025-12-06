<template>
  <div class="container-fluid">
    <h1 class="mb-4">Short URL 생성</h1>
    
    <div class="row">
      <div class="col-12 col-lg-8 mx-auto">
        <!-- URL 입력 카드 -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">원본 URL 입력</h5>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                v-model="originalUrl"
                placeholder="https://example.com/very/long/url..."
                @keyup.enter="generateShortUrl"
              />
              <button 
                class="btn btn-primary" 
                type="button"
                @click="generateShortUrl"
                :disabled="!originalUrl || isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? '생성 중...' : '생성' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 결과 카드 -->
        <div class="card shadow-sm" v-if="shortUrl">
          <div class="card-body">
            <h5 class="card-title mb-3">생성된 Short URL</h5>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                :value="shortUrl"
                readonly
                ref="shortUrlInput"
              />
              <button 
                class="btn btn-success" 
                type="button"
                @click="copyToClipboard"
              >
                복사
              </button>
            </div>
            <div class="mt-2">
              <small class="text-muted">원본 URL: {{ originalUrl }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShortUrlPage',
  data() {
    return {
      originalUrl: '',
      shortUrl: '',
      isLoading: false
    }
  },
  methods: {
    async generateShortUrl() {
      if (!this.originalUrl) return
      
      this.isLoading = true
      this.shortUrl = ''
      
      try {
        // TODO: API 호출로 실제 short URL 생성
        // const response = await request({
        //   url: '/api/short-url',
        //   method: 'post',
        //   data: { originalUrl: this.originalUrl }
        // })
        // this.shortUrl = response.data.shortUrl
        
        // 임시: 더미 데이터
        setTimeout(() => {
          this.shortUrl = `${window.location.origin}/s/${this.generateRandomString()}`
          this.isLoading = false
        }, 500)
      } catch (error) {
        console.error('Short URL 생성 실패:', error)
        this.isLoading = false
        alert('Short URL 생성에 실패했습니다.')
      }
    },
    copyToClipboard() {
      if (!this.shortUrl) return
      
      this.$refs.shortUrlInput.select()
      document.execCommand('copy')
      alert('클립보드에 복사되었습니다!')
    },
    generateRandomString() {
      return Math.random().toString(36).substring(2, 8)
    }
  }
}
</script>

<style scoped>
.short-url-page {
  min-height: 100vh;
  background-color: #000000;
  padding: 60px 20px;
  color: #ffffff;
}

.title-section {
  margin-bottom: 60px;
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #ffffff;
  opacity: 0.9;
}

.brand-name {
  color: #ffd700;
  font-weight: bold;
}

.input-section {
  max-width: 800px;
  margin: 0 auto 40px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.url-input {
  flex: 1;
  padding: 16px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  color: #000000;
  outline: none;
}

.url-input::placeholder {
  color: #999999;
}

.shorten-btn {
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #333333;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.shorten-btn:hover:not(:disabled) {
  background-color: #444444;
}

.shorten-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-section {
  max-width: 800px;
  margin: 0 auto;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.result-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.result-input {
  flex: 1;
  padding: 16px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  color: #0066ff;
  outline: none;
  font-weight: 500;
}

.refresh-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: #333333;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.refresh-btn:hover {
  background-color: #444444;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.go-btn {
  background-color: #333333;
  color: #ffffff;
}

.go-btn:hover {
  opacity: 0.8;
}

.copy-btn {
  background-color: #0066ff;
  color: #ffffff;
}

.copy-btn:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.95rem;
  }
  
  .input-wrapper {
    flex-direction: column;
  }
  
  .shorten-btn {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>


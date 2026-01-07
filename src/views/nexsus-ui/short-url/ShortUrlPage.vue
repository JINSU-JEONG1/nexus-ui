<template>
  <div class="container-fluid py-5">
    <div class="row">
      <div class="col-12 col-lg-8 mx-auto">
        <h1 class="mb-4">Short URL 생성</h1>
        
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
                :disabled="isLoading"
              />
              <button 
                class="btn btn-primary" 
                :disabled="!originalUrl || isLoading"
                @click="generateShortUrl"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? '생성 중...' : '생성' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="shortUrl" class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-3">생성된 Short URL</h5>
            <div class="input-group mb-3">
              <input 
                type="text" 
                class="form-control" 
                :value="shortUrl"
                readonly
                ref="shortUrlInput"
              />
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-success flex-fill" @click="copyToClipboard">복사</button>
              <button class="btn btn-primary flex-fill" @click="goToUrl">바로가기</button>
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
        // TODO: API 호출로 실제 short URL 생성
        // const response = await request({
        //   url: '/api/short-url',
        //   method: 'post',
        //   data: { originalUrl: this.originalUrl }
        // })
        // this.shortUrl = response.data.shortUrl
        
        await new Promise(resolve => setTimeout(resolve, 500))
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
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(this.shortUrl)
        } else if (this.$refs.shortUrlInput) {
          this.$refs.shortUrlInput.select()
          document.execCommand('copy')
        }
        alert('클립보드에 복사되었습니다!')
      } catch {
        alert('복사에 실패했습니다.')
      }
    },
    goToUrl() {
      if (this.shortUrl) window.open(this.shortUrl, '_blank')
    },
    generateRandomString: () => Math.random().toString(36).substring(2, 8)
  }
}
</script>


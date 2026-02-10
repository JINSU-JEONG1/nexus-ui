<template>
  <div>
    <!-- 전체 페이지 컨테이너 -->
    <div class="short-url-page">
      <div class="content-wrapper">

        <!-- 헤더 영역: 뱃지 + 타이틀 + 설명 -->
        <div class="page-header fade-in">
          <!-- 뱃지 영역: 부트스트랩 그리드로 위치 조정 -->
          <div class="row align-items-center mb-4">
            <div class="col">
              <GlassBadge icon="✨" text="Free Link Shortener" class="m-0" />
            </div>
          </div>
          <div class="row align-items-center mb-4">
            <div class="col">
              <router-link :to="{ name: 'short-url-statistics' }" class="router-link">
                <GlassBadge 
                  icon="📊" 
                  text="통계 보러가기 →" 
                  class="m-0"
                />
              </router-link>
            </div>
          </div>
        

          <!-- 메인 타이틀 -->
          <h1 class="page-title">
            Short <span class="gradient-text">URL</span>
            <!-- SVG 아이콘 -->
            <svg class="title-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.828 10.172L16.657 7.34315C18.2191 5.78105 18.2191 3.24838 16.657 1.68629C15.0949 0.124194 12.5622 0.124194 11 1.68629L8.17157 4.51472M10.172 13.828L7.34315 16.657C5.78105 18.2191 3.24838 18.2191 1.68629 16.657C0.124194 15.0949 0.124194 12.5622 1.68629 11L45.14 8.17157M7.34315 7.34315L16.657 16.657" stroke="url(#paint0_linear)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="1.68629" y1="1.68629" x2="16.657" y2="16.657" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0071E3"/>
                  <stop offset="1" stop-color="#00A8FF"/>
                </linearGradient>
              </defs>
            </svg>
          </h1>
          
          <p class="page-subtitle">긴 URL을 짧고 간결하게 줄여보세요.</p>
        </div>
        
        <!-- 입력 영역 -->
        <div class="glass-card input-container fade-in">
          <div class="input-wrapper">
            <input 
              type="text" 
              class="url-input" 
              v-model="originUrl"
              placeholder="https://example.com/very/long/url..."
              @keyup.enter="createShortUrl"
              :disabled="isLoading"
            />
            <button 
              class="generate-btn" 
              :disabled="!isValidUrl || isLoading"
              @click="createShortUrl"
            >
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>단축하기</span>
            </button>
          </div>
        </div>

        <!-- 결과 영역 (애니메이션 적용) -->
        <transition name="slide-up">
          <div v-if="shortUrl" class="glass-card result-container fade-in">
            <div class="result-header">
              <span class="label">생성된 Short URL</span>
            </div>
            <div class="result-body">
              <div class="short-url-display">
                <a :href="shortUrl" target="_blank" class="short-link">{{ shortUrl }}</a>
              </div>
              <div class="action-buttons">
                <button class="action-btn" @click="copyToClipboard">
                  📋 복사
                </button>
                <button class="action-btn go-btn" @click="goToUrl">
                  🚀 이동
                </button>
              </div>
            </div>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { createShortUrl as createShortUrlApi } from '@/api/nexus-ui/short-url/shortUrl'
import GlassBadge from '@/components/common/GlassBadge.vue'

const toast = useToast()

// State
const originUrl = ref('')
const shortUrl = ref('')
const isLoading = ref(false)

// Computed
const isValidUrl = computed(() => {
  if (!originUrl.value) return false
  const urlPattern = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
  return urlPattern.test(originUrl.value.trim())
})

// Methods
const createShortUrl = async () => {
  if (!originUrl.value) return
  
  // URL 형식 검증
  if (!isValidUrl.value) {
    toast.error('올바른 URL 형식을 입력해주세요. (예: https://example.com)')
    return
  }

  const requestPayload = {
    data: {
      originUrl: originUrl.value
    }
  }

  console.log("전송 데이터 : ", requestPayload)
  
  try {
    isLoading.value = true
    shortUrl.value = ''
    
    const res = await createShortUrlApi(requestPayload)
    console.log("res : ", res)
    
    shortUrl.value = res.data.shortUrl

  } catch (error) {
    console.error('Short URL 생성 실패:', error)
    toast.error('Short URL 생성에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = async () => {
  if (!shortUrl.value) return
  
  try {
    await navigator.clipboard.writeText(shortUrl.value)
    toast.success('클립보드에 복사되었습니다!')
  } catch {
    // 구형 브라우저 대응
    const textArea = document.createElement("textarea")
    textArea.value = shortUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    toast.success('클립보드에 복사되었습니다!')
  }
}

const goToUrl = () => {
  if (shortUrl.value) window.open(shortUrl.value, '_blank')
}
</script>

<style scoped>
/* ======================
   1. 레이아웃 (Layout)
   ====================== */
.short-url-page {
  display: flex;
  justify-content: center;
  padding-top: 3rem; /* 80px -> 4rem (스케일에 따라 유동적) */
  min-height: 80vh;
}

.content-wrapper {
  width: 100%;
  max-width: 720px;
  padding: 0 24px;
}

/* ======================
   2. 헤더 (Header)
   ====================== */
.page-header {
  text-align: center;
  margin-bottom: 56px;
}


/* 페이지 타이틀 */
.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #1d1d1f;
  letter-spacing: -1.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  width: 42px;
  height: 42px;
  transform: translateY(2px);
}

.page-subtitle {
  font-size: 1.0rem;
  color: #6e6e73;
  font-weight: 400;
}

/* ======================
   3. 입력 영역 (Input)
   ====================== */
.input-container {
  margin-bottom: 32px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 18px;
  padding: 6px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  background: white;
  border-color: rgba(0, 113, 227, 0.3);
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}

.url-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 18px 24px;
  font-size: 1.15rem;
  color: #1d1d1f;
  outline: none;
  min-width: 0;
  font-weight: 500;
}

.url-input::placeholder {
  color: #999;
  font-weight: 400;
}

/* 생성 버튼 (변경하지 않음) */
.generate-btn {
  background: #1d1d1f;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px 32px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 110px;
}

.generate-btn:hover:not(:disabled) {
  transform: scale(1.02);
  background: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.generate-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.generate-btn:disabled {
  background: #e5e5e5;
  color: #999;
  cursor: not-allowed;
}

/* ======================
   4. 결과 영역 (Result)
   ====================== */
.result-container {
  margin-bottom: 32px;
  padding: 32px; /* glass-card 기본 패딩 보완 */
}

.label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.short-url-display {
  flex: 1;
  min-width: 240px;
}

.short-link {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0071E3;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.2s;
}

.short-link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* 액션 버튼 */
.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1d1d1f;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover {
  background: #f5f5f7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.action-btn.go-btn {
  background: #0071E3;
  color: white;
  border-color: transparent;
}

.action-btn.go-btn:hover {
  background: #0077ED;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.2);
}

/* ======================
   
5. 반응형 (Responsive)
   ====================== */
   /* 슬라이드 업 트랜지션 */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
@media (max-width: 600px) {
  .page-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 4px;
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

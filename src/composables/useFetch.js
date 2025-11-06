import { ref } from 'vue'

// 재사용 가능한 API 호출 로직
export function useFetch() {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async (apiCall) => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await apiCall()
    } catch (err) {
      error.value = err
      console.error('Fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    fetchData
  }
}


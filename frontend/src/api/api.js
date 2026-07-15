import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codearena_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If token is invalid/expired, clear it so user is redirected to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('codearena_token')
      localStorage.removeItem('codearena_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

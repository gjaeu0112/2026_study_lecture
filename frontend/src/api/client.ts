import axios from 'axios';

// 개발: Vite proxy(/api) 사용 → 외부 IP로 접속해도 동일 출처로 API 호출
// EC2 운영: nginx가 /api 를 백엔드로 프록시하도록 빌드 (VITE_API_URL=/api)
// 직접 API 호출이 필요할 때만 VITE_API_URL=http://<서버IP>:3000 설정
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(config => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (user && user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;

    
    if (!config.params) {
      config.params = {};
    }//

    
    config.params.tenantId = user.tenantId;
    console.log("Tenant ID ", user.tenantId);
  }
  return config;
});


export default apiClient;

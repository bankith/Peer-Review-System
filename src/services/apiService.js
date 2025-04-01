import axios from 'axios';
import { toast } from 'react-toastify';

class ApiService {
  constructor() {
    const token = this.getToken();
    this.client = axios.create({
      baseURL: '/api', // Adjust this to match your API base URL
      headers: {
        'Content-Type': 'application/json', 
        Authorization: token ? `Bearer ${token}` : '',
      }
    });

    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          this.logout(); // Optionally handle logout or token refresh
        }
        
        const errorMessage = error.response
          ? `${error.response.status} - ${error.response.data.errorMessage || 'An error occurred'}`
          : "A network error occurred. Please try again later.";

        // Display error using toast
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return Promise.reject(error);
      }
    );
  }

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem('token');
    }
    return null;
  }

  saveToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem('token', token);
    }
    this.setAuthHeader(token);
  }

  getUser() {
    if (typeof window !== "undefined") {
      var user = localStorage.getItem('user');
      if(user){
        return JSON.parse(localStorage.getItem('user'))
      }
    }
    return null;
  }

  saveUser(user){
    if (typeof window !== "undefined") {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  setAuthHeader(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem('token');
    }
    this.client.defaults.headers.common['Authorization'] = '';
  }

  login(credentials) {
    return this.client.post('/login', credentials)
      .then(response => {
        const { token } = response.data;
        this.saveToken(token);
        return response;
      });
  }

  logout() {
    this.removeToken();
    // Implement any additional logout logic if needed
  }

  fetchProtectedData() {
    return this.client.get('/protected');
  }
}

export default new ApiService();

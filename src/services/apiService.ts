"use client"

import { UserDto } from '@/dtos/User/UserDto';
import { UserModel } from '@/models/UserModel';
import axios, { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { signOut } from "next-auth/react"

export default class ApiService {
  static #instance: ApiService;
  public static get instance(): ApiService {
      if (!ApiService.#instance) {
          ApiService.#instance = new ApiService();
      }
      return ApiService.#instance;
  }

  public client: AxiosInstance;
  public token: string;

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
          // this.logout(); // Optionally handle logout or token refresh
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
    if(this.token){
      return this.token;    
    }
    if (typeof window !== "undefined") {
      return localStorage.getItem('token');
    }
    return null;
  }

  saveToken(newToken: string) {
    this.token = newToken;    
    this.setAuthHeader(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem('token', newToken);
    }
  }

  getUser() {
    if (typeof window !== "undefined") {
      var user = localStorage.getItem('user');
      if(user){
        return JSON.parse(user)
      }
    }
    return null;
  }

  saveUser(newUser: string){
    if (typeof window !== "undefined") {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  }

  saveUserDTO(newUser: UserDto){
    if (typeof window !== "undefined") {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  }

  setAuthHeader(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.client.defaults.headers['Authorization'] = '';
  }

  logout() {
    this.removeToken();    
    signOut();
  }

  fetchProtectedData() {
    return this.client.get('/protected');
  }
}

 

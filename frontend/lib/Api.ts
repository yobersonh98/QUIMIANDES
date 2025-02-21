
import { BACKEND_URL } from '@/config/envs';
import axios from 'axios';
export const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


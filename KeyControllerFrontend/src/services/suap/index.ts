import axios from 'axios';

export const suapApi = axios.create({
  // baseURL: 'https://suap.ifrn.edu.br/api/v2',
  baseURL: import.meta.env.VITE_API_URL ,
});

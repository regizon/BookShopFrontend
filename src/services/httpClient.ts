import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 1000,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
})

export default instance;
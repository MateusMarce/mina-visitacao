import axios from "axios"

export default axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-type": "application/json",
    'Accept': 'application/json',
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5173/",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  }
});
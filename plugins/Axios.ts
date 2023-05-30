import axios from 'axios';
const Axios = axios.create({
  timeout: 2 * 60 * 1000, //请求超时设置，单位ms
});
export default Axios;

import Axios from "axios";

const axios = Axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://api2.eccmon.site",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default axios;

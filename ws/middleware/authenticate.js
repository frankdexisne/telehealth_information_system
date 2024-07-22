const axios = require("axios");
const API_BASE_URL = "http://127.0.0.1:8000/api";

const authenticate = async (token) => {
  return axios
    .get(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => true)
    .catch((error) => false);
};

module.exports = authenticate;

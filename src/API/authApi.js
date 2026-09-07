import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => {
    return axiosClient.post("/login", data);
  },

  register: (data) => {
    return axiosClient.post("/register", data);
  },

  upgradeSeller: (data) => {
    return axiosClient.post("/upgrade-seller", data);
  },
};

export default authApi;

import axios from "axios";

const REGULAR_API_BASE_URL = "/api/regular";

class RegularService {
  getRegularsByUser(userSeq) {
    return axios.get(`${REGULAR_API_BASE_URL}/list/${userSeq}`);
  }

  getAllRegulars() {
    return axios.get(REGULAR_API_BASE_URL);
  }

  updateRegular(rdSeq, regularDTO) {
    console.log(regularDTO);
    return axios.put(`${REGULAR_API_BASE_URL}/update/${rdSeq}`, regularDTO);
  }

  terminateRegular(rdSeq) {
    return axios.get(`${REGULAR_API_BASE_URL}/delete/${rdSeq}`);
  }

  writeRegular(regularDTO) {
    console.log(regularDTO);
    return axios.post(`${REGULAR_API_BASE_URL}/write`, regularDTO);
  }
}

export default new RegularService();

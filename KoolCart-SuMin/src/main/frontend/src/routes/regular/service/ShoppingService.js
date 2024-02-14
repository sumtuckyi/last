import axios from "axios";

const SHOPPING_API_BASE_URL = "http://i10a101.p.ssafy.io:8000/";

class ShoppingService {
  // 주문 API
  placeOrder(orderData) {
    return axios.post(`${SHOPPING_API_BASE_URL}api4/order/`, orderData);
  }
}

export default new ShoppingService();
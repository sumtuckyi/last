import axios from "axios";
const Default_API_BASE_URL = "/api/message";
//const Default_API_BASE_URL = "http://localhost:8080/message";
// Redux 사용해서 사용자 정보 가져오기

class PrevService{

    getAllAlarms(userId){
        return axios.post(`${Default_API_BASE_URL}/listAll`,{
            "user_seq": userId,
        });
    }

    checkAlarm = (userId, alarmId)=>{
        return axios.post(`${Default_API_BASE_URL}/check`,{
            "user_seq" : userId,
            "ms_seq": alarmId,
        });
    }

    checkAllAlarms(userId){
    return axios.post(`${Default_API_BASE_URL}/checkAll`,{
        "user_seq" : userId,
    });
    }

    

    addDeliveryAlarms(userId, order_seq, dv_status){
        return axios.post(`${Default_API_BASE_URL}/create`,{
            "user_seq" : userId,
            "order_seq" : order_seq,
            "dv_status" : dv_status,
            "mc_seq": 1,
        });
    }

    addRegularAlarms(userId, rd_seq){
        return axios.post(`${Default_API_BASE_URL}/create`,{
            "user_seq" : userId,
            "rd_seq" : rd_seq,
            "mc_seq": 2,
        });
    }

    addInventoryAlarms(userId, ivt_seq){
        return axios.post(`${Default_API_BASE_URL}/create`,{
            "user_seq" : userId,
            "ivt_seq" : ivt_seq,
            "mc_seq": 3,
        });
    }
}

export default new PrevService;
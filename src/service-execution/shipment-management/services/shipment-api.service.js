import http from "../../../shared/services/http-common.js";

export class ShipmentApiService{
    findUserByID(id){
        return http.get(`/moviGestion-iam/users?id=${id}`)
    }
    getAllShipments(){
        return http.get('/moviGestion-cya/shipment')
    }
}
import http from "../../shared/services/http-common.js";



export class HomeApiService {

    getAllActivities() {
        return http.get('/moviGestion-cya/reports')

    }
    getAllCondition() {
        return http.get('/moviGestion-cya/vehicle');
    }
    getAllDeliveries() {
        return http.get('/moviGestion-cya/shipment');
    }
    getAllActivitiesDriver() {
        return http.get('/moviGestion-cya/reports');
    }
    getAllDeliveriesDriver() {
        return http.get('/moviGestion-cya/shipment');
    }
}
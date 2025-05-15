import http from "../../shared/services/http-common.js";

export class HomeApiService {
    getRecentShipments() {
        return http.get("/shipments");
    }

    getVehicles() {
        return http.get("/vehicles");
    }

    getReports() {
        return http.get("/reports");
    }

}

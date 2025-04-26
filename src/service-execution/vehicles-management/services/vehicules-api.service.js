import http from "../../../shared/services/http-common.js";

export class VehiclesApiService{
    getAllVehicles() {
        return http.get('/moviGestion-cya/vehicle');
    }
    getVehicleById(id){
        return http.get(`/moviGestion-cya/vehicle?id=${id}`)
    }
    getUsers(){
        return http.get('/moviGestion-iam/users');
    }

    addVehicle(vehicle){
        return http.post("/moviGestion-cya/vehicle",vehicle);
    }

    deleteVehicle(id){
        return http.delete(`/moviGestion-cya/vehicle/${id}`);
    }

    assignVehicleToCarrier(vehicleId,carrierId){
        return http.put(`/moviGestion-cya/vehicles/${vehicleId}`,{carrierId});
    }

    getVehiclesById1(id){
        return http.get(`/moviGestion-cya/vehicle?id=${id}`)
    }
}
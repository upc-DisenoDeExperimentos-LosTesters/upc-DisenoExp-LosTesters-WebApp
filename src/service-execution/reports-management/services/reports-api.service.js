import http from "../../../shared/services/http-common.js";

export class ReportsApiService{
    findUserByID(id){
        return http.get(`/moviGestion-iam/users?id=${id}`)
    }
    getAllReports() {
        return http.get('/moviGestion-cya/reports')
    }
}
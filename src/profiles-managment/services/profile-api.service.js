import http from "../../shared/services/http-common.js";

export class ProfileApiService {
    getUsers() {
        return http.get('/users');
    }
    createUser(jsonUser) {
        return http.post('/moviGestion-iam/users', jsonUser);
    }
    findUserById(id) {
        return http.get(`/moviGestion-iam/users?id=${id}`);
    }
    updateUser(id, jsonUser) {
        return http.put(`/moviGestion-iam/users?id=${id}`, jsonUser);
    }
}
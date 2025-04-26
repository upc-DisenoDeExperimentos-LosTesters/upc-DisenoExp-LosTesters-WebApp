import http from "../../shared/services/http-common.js";

export class IamApiService{
    createUser(jsonUser){
        return http.post('/moviGestion-iam/users',jsonUser)
    }
    findUserById(id){
        return http.get(`/moviGestion-iam/users?id=${id}`);
    }
    findUserWithEmailAndPassword(email,password){
        return http.get(`/moviGestion-iam/users?email=${email}&password=${password}`)
    }
    findUserWithEmail(email){
        return http.get(`/moviGestion-iam/users?email=${email}`)
    }
}
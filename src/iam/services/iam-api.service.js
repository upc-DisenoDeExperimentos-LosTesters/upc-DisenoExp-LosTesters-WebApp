import http from "../../shared/services/http-common.js";

export class IamApiService {

    // Crear usuario
    createUser(jsonUser) {
        return http.post('/profile', jsonUser);
    }

    // Login de usuario (retorna el JWT)
    login(credentials) {
        return http.post('/profile/login', credentials); // { email, password }
    }

    // Obtener todos los usuarios (requiere token)
    getAllProfiles() {
        return http.get('/profile');
    }

    // Obtener un perfil por ID (requiere token)
    getProfileById(id) {
        return http.get(`/profile/${id}`);
    }

    // Obtener perfil por email (requiere token)
    getProfileByEmail(email) {
        return http.get(`/profile/email/${email}`);
    }
}

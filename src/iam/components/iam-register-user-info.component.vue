<script>
import { IamApiService } from "../services/iam-api.service.js";

export default {
  name: "iam-register-user-info",
  data() {
    return {
      type: this.$route.params.type === "GERENTE" || this.$route.params.type === "TRANSPORTISTA"
        ? this.$route.params.type
        : "",
      name: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      privacityPolicy: false,
      error: false,
      error_msg: "",
      showTerms: false,
      iamApi: new IamApiService()
    };
  },
  created() {
    document.body.style.backgroundColor = '#303841';
  },
  methods: {
    async createdUser() {
      this.error = false;
      await this.errors();
      if (!this.error) {
        let json = {
          name: this.name,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          type: this.type
        };
        this.iamApi.createUser(json).then(() => {
          this.$router.push('/register/successfully');
        });
      }
    },
    async errors() {
      // Validación básica
      if (!this.name || !this.lastName || !this.email || !this.password || !this.passwordConfirmation) {
        this.error = true;
        this.error_msg = "Todos los campos son obligatorios";
        return;
      }
      if (!["GERENTE", "TRANSPORTISTA"].includes(this.type)) {
        this.error = true;
        this.error_msg = "Tipo de usuario inválido";
        return;
      }
      if (!this.privacityPolicy) {
        this.error = true;
        this.error_msg = "Debe aceptar los términos y servicios";
        return;
      }
      if (this.password !== this.passwordConfirmation) {
        this.error = true;
        this.error_msg = "Las contraseñas no coinciden";
        return;
      }
      // Validar email único
      try {
        const data = await this.iamApi.getProfileByEmail(this.email);
        if (data.data && data.data.id) {
          this.error = true;
          this.error_msg = "El email ya está registrado";
        }
      } catch (e) {
        // Si no existe, está bien
      }
    },
    cleanCss() {
      document.body.style.backgroundColor = "";
    },
    openTerms() {
      this.showTerms = true;
    },
    closeTerms() {
      this.showTerms = false;
    }
  }
}
</script>

<template>
  <div class="wrapper fadeInDown">
    <div id="formContent">
      <div class="fadeIn first">
        <img src="../../public/assets/logo.png" id="icon" alt="User Icon" />
      </div>
      <h1>Sign Up</h1>
      <form v-on:submit.prevent="createdUser">
        <div class="input-group">
          <div class="input-half">
            <p class="text-left">Name</p>
            <input type="text" id="name" class="fadeIn second" name="name" v-model="name">
          </div>
          <div class="input-half">
            <p class="text-left">Last Name</p>
            <input type="text" id="lastName" class="fadeIn second" name="lastName" v-model="lastName">
          </div>
        </div>
        <p class="text-left">Email</p>
        <input type="text" id="login" class="fadeIn second" name="login" v-model="email">
        <div class="input-group">
          <div class="input-half">
            <p class="text-left">Password</p>
            <input type="password" id="password" class="fadeIn third" name="password" v-model="password">
          </div>
          <div class="input-half">
            <p class="text-left">Confirm password</p>
            <input type="password" id="passwordConfirmation" class="fadeIn third" name="passwordConfirmation" v-model="passwordConfirmation">
          </div>
        </div>
        <div class="checkbox-group">
          <input type="checkbox" id="Checkbox" name="Checkbox" value="privacityPolicy" v-model="privacityPolicy">
          <label for="Checkbox">
            He leído y acepto los
            <button type="button" class="terms-btn" @click="openTerms">Términos y Servicios</button>
          </label>
        </div>
        <input
            type="submit"
            class="fadeIn fourth"
            value="Sign Up"
            :disabled="!privacityPolicy"
            :class="{ disabled: !privacityPolicy }"
            v-if="!error || error_msg !== 'Debe aceptar los términos y servicios'"
        >
      </form>
      <div class="alert alert-danger" v-if="error">
        {{error_msg}}
      </div>
      <div>
        <p> <i class="pi pi-minus"/> ¿Ya tienes una cuenta? <router-link to="/login"  @click.native="cleanCss"> Inicia sesión</router-link> <i class="pi pi-minus"/> </p>
      </div>
    </div>
  </div>
  <div v-if="showTerms" class="terms-modal">
    <div class="terms-content">
      <h2>Términos y Servicios</h2>
      <ul>
        <li>El usuario es responsable de la veracidad de la información proporcionada.</li>
        <li>Los datos personales serán tratados conforme a la ley de protección de datos.</li>
        <li>No se permite el uso indebido de la plataforma para fines ilícitos.</li>
        <li>La empresa no se responsabiliza por pérdidas causadas por información incorrecta.</li>
        <li>El acceso puede ser revocado en caso de incumplimiento de las normas.</li>
        <li>El usuario acepta recibir notificaciones relacionadas con el servicio.</li>
        <li>La empresa se reserva el derecho de modificar los términos y condiciones.</li>
        <li>El uso de la plataforma implica la aceptación de estos términos.</li>
      </ul>
      <button class="close-btn" @click="closeTerms">Cerrar</button>
    </div>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
/* General */
p{
  font-family: 'Open Sans', sans-serif;
}

a {
  color: #92badd;
  text-decoration: none;
  font-family: 'Open Sans', sans-serif;
}

h1 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
  font-family: 'Open Sans', sans-serif;
}

/* Formulario */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

#formContent {
  border-radius: 10px;
  background: #303841;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  border: 1px solid white;
  text-align: center;
}
.input-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.input-half {
  width: calc(50% - 5px);
}

.checkbox-group {
  margin-top: 20px;
}

/* Campos de entrada */
input[type=text], input[type=password] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: calc(100% - 10px); /* Ajustado para tener un pequeño espacio alrededor */
  border-radius: 5px;
  transition: background-color 0.5s, border-bottom 0.5s;
  font-family: 'Open Sans', sans-serif;
}

input[type=text]:focus, input[type=password]:focus {
  background-color: #92badd;
  border-bottom: 2px solid #F39C12;
  font-family: 'Open Sans', sans-serif;
}

/* Botones */
input[type=submit] {
  background-color: #F39C12;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  border-radius: 5px;
  margin: 5px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Open Sans', sans-serif;
}

input[type=submit]:hover {
  background-color: #92badd;
}

/* Checkbox */
input[type=checkbox] {
  display: none;
}

input[type=checkbox] + label {
  position: relative;
  padding-left: 25px;
  cursor: pointer;
}
input[type=checkbox] + label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 1px;
  width: 17px;
  height: 17px;
  border: 1px solid #F39C12;
  background-color: transparent;
}

input[type=checkbox]:checked + label:before {
  background-color: #F39C12;
}

input[type=checkbox] + label:after {
  content: '\f00c';
  font-family: 'Open Sans', sans-serif;;
  font-weight: 900;
  color: black;
  position: absolute;
  left: 3px;
  top: -1px;
  opacity: 0;
  transition: opacity 0.2s;
}

input[type=checkbox]:checked + label:after {
  opacity: 1;
}

/* Alertas */
.alert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  font-family: 'Open Sans', sans-serif;
}

/* Animaciones */
.fadeInDown {
  animation: fadeInDown 1s both;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Otros */
*:focus {
  outline: none;
}

#icon {
  width: 60%;
}

/* Términos y condiciones */
.terms-btn {
  background: none;
  border: none;
  color: #F39C12;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1em;
  padding: 0;
  margin: 0 2px;
}
.terms-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.terms-content {
  background: #fff;
  color: #222;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  max-width: 400px;
  width: 90vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  text-align: left;
}
.terms-content h2 {
  margin-top: 0;
  color: #F39C12;
}
.terms-content ul {
  margin: 1rem 0 1.5rem 1.2rem;
  padding: 0;
  font-size: 1rem;
}
.close-btn {
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
}
.close-btn:hover {
  background: #303841;
}
</style>

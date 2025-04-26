<script>
import {IamApiService} from "../services/iam-api.service.js";

export default {
  name: "iam-register-user-info",
  data(){
    return{
      type: this.$route.params.type,
      name:"",
      lastName:"",
      email: "",
      password: "",
      privacityPolicy: false,
      passwordConfirmation:"",
      error: false,
      error_msg: "",
      vehicules:[],
      iamApi:new IamApiService()
    }
  },
  created() {
    document.body.style.backgroundColor = '#303841';

  },
  methods: {
    async createdUser() {
      this.error = false; // Reset error flag before validation

      // Run validation checks
      await this.errors();

      // If there are no errors, proceed to create user
      if (!this.error) {
        let json = {
          name: this.name,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          type: this.type,
          vehicules:this.vehicules
        };

        // Create user
        this.iamApi.createUser(json).then((data) => {
          console.log(data);
          this.$router.push('/register/successfully')
        });
      }
    },
    async errors() {
      // Check if email is already registered
      await this.iamApi.findUserWithEmail(this.email).then((data) => {
        const info = data.data;
        if (info[0] !== undefined) {
          this.error = true;
          this.error_msg = "Email already registered";
        }
      });

      // Check if privacy policy is accepted
      if (!this.privacityPolicy) {
        this.error = true;
        this.error_msg = "Accept privacy policy please";
      }

      // Check if passwords match
      if (this.password !== this.passwordConfirmation) {
        this.error = true;
        this.error_msg = "Passwords do not match";
      }
    },
    cleanCss() {
      document.body.style.backgroundColor = "";
    }
  }

}
</script>

<template>
  <div class="wrapper fadeInDown">
    <div id="formContent">
      <!-- Tabs Titles -->
      <div class="fadeIn first">
        <img src="../../public/assets/logo.png" id="icon" alt="User Icon" />
      </div>
      <h1>Sign Up</h1>
      <!-- Login Form -->
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
          <label for="Checkbox">I have read and agree to the Privacy Policy</label>
        </div>

        <input type="submit" class="fadeIn fourth" value="Sign Up">
      </form>

      <!-- Go to Register -->
      <div class="alert alert-danger"  v-if="error">
        {{error_msg}}
      </div>
      <div>
        <p> <i class="pi pi-minus"/> Already have a account? <router-link to="/login"  @click.native="cleanCss"> Log in</router-link> <i class="pi pi-minus"/> </p>
      </div>
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

</style>
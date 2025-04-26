<script>
import {IamApiService} from "../services/iam-api.service.js";

export default {
  name: "iam-login",
  data() {
    return {
      email: "",
      password: "",
      error: false,
      error_msg: "",
      iamApi:new IamApiService()
    }
  },
  created() {
    document.body.style.backgroundColor = '#303841';

  },
  methods:{
    login(){

      this.iamApi.findUserWithEmailAndPassword(this.email,this.password).then(data=>{
        const info = data.data[0];
        if (info === undefined){
          this.error = true; this.error_msg = "Email or Password incorrect"
        }else{
          info.type === "businessman" ? this.$router.push(`/${info.id}/home-businessman-menu`) : this.$router.push(`/${info.id}/home-driver-menu`) ;
        }
      })
    },
    cleanCss() {
      document.body.style.backgroundColor = '';
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
      <h1>Login</h1>
      <!-- Login Form -->
      <form v-on:submit.prevent="login">
        <p class="text-left">Email</p>
        <input type="text" id="login" class="fadeIn second" name="login" v-model="email">
        <p class="text-left">Password</p>
        <input type="password" id="password" class="fadeIn third" name="password" v-model="password">
        <p class="text-right">Forgot password?</p>
        <input type="submit" class="fadeIn fourth" value="Log In">
      </form>

      <!-- Go to Register -->
      <div class="alert alert-danger"  v-if="error">
        {{error_msg}}
      </div>
      <div>
        <p> <i class="pi pi-minus"/> Don´t have a account? <router-link to="/register"  @click.native="cleanCss"> Sign up</router-link> <i class="pi pi-minus"/> </p>
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
input[type=submit]  {
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
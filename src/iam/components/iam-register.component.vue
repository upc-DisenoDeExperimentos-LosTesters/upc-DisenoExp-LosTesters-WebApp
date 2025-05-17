<script>
export default {
  name: "iam-register",
  data() {
    return {
      type: "",
    }
  },
  created() {
    document.body.style.backgroundColor = '#303841';
  },
  methods:{
    cleanCss() {
      document.body.style.backgroundColor = '';
    },
    typeSelection(type){
      this.type = type;
    },
    goToRegisterUserInformation(){
      this.$router.push(`/register/${this.type}`)
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
      <h1>Register as</h1>
      <!-- Botones -->
      <div class="buttons">
        <button class="btn" @click="typeSelection('GERENTE');goToRegisterUserInformation()"> &nbsp <i class="pi pi-user"/> &nbsp Businessman </button>
        <button class="btn" @click="typeSelection('TRANSPORTISTA');goToRegisterUserInformation()"> &nbsp <i class="pi pi-user"/> &nbsp Carrier </button>
      </div>
      <!-- Go to Log in-->
      <div>
        <p> <i class="pi pi-minus"/> Already have a account? <router-link to="/login"  @click.native="cleanCss"> Log in</router-link> <i class="pi pi-minus"/> </p>
      </div>
    </div>
  </div>
</template>




<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

/* General */
p {
  font-family: 'Open Sans', sans-serif;
}

h1 {
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
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

/* Botones */
.buttons {
  margin-top: 40px;
}

.btn {
  background-color: #fff;
  border: none;
  color: #000;
  padding: 15px 0;
  text-align: left;
  text-decoration: none;
  display: block;
  width: calc(100% - 10px);
  font-size: 16px;
  margin: auto auto 40px auto;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Open Sans', sans-serif;

}

.btn:hover {
  background-color: #F39C12;
  color: #fff;
  font-weight: 700;
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
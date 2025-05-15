<script>
import {IamApiService} from "../../iam/services/iam-api.service.js";


export default {
  name: "sidebar",
  data() {
    return {
      name:'',
      lastName:'',
      type:'',
      visible: false,
      hamburgerVisible: window.innerWidth <= 860,
      id: this.$route.params.id,
      api: new IamApiService()
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.api.getProfileById(this.id).then(response => {
      this.type = response.data.type;
      this.name = response.data.name;
      this.lastName = response.data.lastName;
    });

  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods:{
    handleResize() {
      this.hamburgerVisible = window.innerWidth <= 860;
    },
    toggleHamburger(){
      this.hamburgerVisible = !this.hamburgerVisible;
    },
    goToHome(){
      if(this.type === "GERENTE"){
        this.$router.push(`/${this.id}/home-businessman-menu`)
      }else{
        this.$router.push(`/${this.id}/home-driver-menu`)
      }
    },
    goToProfile(){
      this.$router.push(`/${this.id}/userprofile`)
    },
    goToVehicles(){
      if(this.type === "GERENTE"){
        this.$router.push(`/${this.id}/vehicles-businessman`)
      }else{
        this.$router.push(`/${this.id}/vehicles-carrier`)
      }
    },
    goToReports(){
      if(this.type === "GERENTE"){
        this.$router.push(`/${this.id}/report/businessman`)
      }else{
        this.$router.push(`/${this.id}/report/carrier`)
      }
    },
    goToOrganizations(){
      if(this.type === "GERENTE"){
        this.$router.push(`/${this.id}/organization`)
      }else{
        this.$router.push(`/${this.id}/organization/view`)
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      this.$router.push('/login');
    }

  }
}
</script>

<template>
    <pv-sidebar class="p-col-12 p-md-6 p-xl-4" :visible="!hamburgerVisible" :showCloseIcon="false" :showHeader="false" :dismissable="true">
      <pv-button icon="pi pi-times" text rounded aria-label="Cancel" class="close-button" @click="toggleHamburger">
      </pv-button>
      <div class="flex flex-column align-items-left h-full justify-content-around z-">
        <div @click="goToProfile" class="flex justify-content-center align-items-center mr-6 flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
          <img src="https://www.capitalcoahuila.com.mx/wp-content/uploads/2022/11/CARL-e1669117013260.jpeg" id="icon" alt="User Icon" class="custom-image"size=" xlarge" shape="circle">
          <a class="m-2">
            <h2>{{name}}</h2>
            <h2>{{lastName}}</h2>
            <h2>{{type}}</h2>
          </a>
        </div>
        <div>
          <ul class="list-none p-3 m-0">
            <li @click="goToHome">
              <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-home mr-2 text-xl"></i>
                <span class="font-medium text-xl">Home</span>
              </a>
            </li>
            <li @click="goToOrganizations">
              <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-users mr-2 text-xl"></i>
                <span class="font-medium text-xl">Organization</span>
              </a>
            </li>
            <li @click="goToReports">
              <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-chart-bar mr-2 text-xl"></i>
                <span class="font-medium text-xl">Reports</span>
              </a>
            </li>
            <li @click="goToVehicles">
              <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-truck mr-2 text-xl"></i>
                <span class="font-medium text-xl">Vehicles</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <ul class="list-none p-3 m-0">
            <li @click="goToProfile">
              <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-cog mr-2 text-xl"></i>
                <span class="font-medium text-xl">Settings</span>
              </a>
            </li>
            <li @click="logout">
              <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-sign-out mr-2 text-xl"></i>
                <span class="font-medium text-xl">Logout</span>
              </a>
            </li>

          </ul>
        </div>
      </div>
    </pv-sidebar>
  <pv-button class="p-col-12 p-md-auto justify-content-center p-3 m-3 hamburger-button" @click="toggleHamburger">
    <i class="pi pi-bars"></i>
  </pv-button>
</template>

<style>
.p-sidebar-header{
  display:none;
}

.p-sidebar{
  background-color: #303841;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  z-index: 1000;
}

.p-sidebar-mask{
  z-index: 1000 !important;
}

.close-button{
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 1rem;
  margin-right: 1rem;
  z-index: 1002;
}

body{
  background-color: #5D6D7E;
}

.custom-image {
  border-radius: 50%;
}

.mr-6
{
  margin-right: 2px;
}

.custom-image {
  border-radius: 50%;
  margin-left: 0 !important;
}

.hamburger-button {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

@media (min-width: 860px) {
  .hamburger-button {
    display: none;
  }

  .close-button{
    display: none;
  }

  .p-sidebar-mask{
    z-index: 0 !important;
  }
}

</style>
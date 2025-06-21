<script>
import {IamApiService} from "../../iam/services/iam-api.service.js";

export default {
  name: "sidebar",
  data() {
    return {
      name: '',
      lastName: '',
      type: localStorage.getItem('userType') || '',
      isMobile: window.innerWidth <= 860,
      sidebarOpen: window.innerWidth > 860,
      id: localStorage.getItem('userId') || '',
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
      // Opcional: actualiza localStorage si cambia el tipo
      localStorage.setItem('userType', this.type);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 860;
      this.sidebarOpen = !this.isMobile;
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    goToHome() {
      if (this.type === "GERENTE") {
        this.$router.push(`/${this.id}/home-businessman-menu`);
      } else {
        this.$router.push(`/${this.id}/home-driver-menu`);
      }
    },
    goToProfile() {
      this.$router.push(`/${this.id}/userprofile`);
    },
    goToVehicles() {
      if (this.type === "GERENTE") {
        this.$router.push(`/vehicles-businessman`);
      } else {
        this.$router.push(`/${this.id}/vehicles-carrier`);
      }
    },
    goToReports() {
      if (this.type === "GERENTE") {
        this.$router.push(`/${this.id}/report/businessman`);
      } else {
        this.$router.push(`/${this.id}/report/carrier`);
      }
    },
    goToOrganizations() {
      if (this.type === "GERENTE") {
        this.$router.push(`/${this.id}/organization`);
      } else {
        this.$router.push(`/${this.id}/organization/view`);
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
  <div>
    <pv-sidebar
      class="custom-sidebar p-col-12 p-md-6 p-xl-4"
      :visible="sidebarOpen"
      :showCloseIcon="false"
      :showHeader="false"
      :dismissable="isMobile"
      :modal="isMobile"
      position="left"
      :blockScroll="false"
    >
      <pv-button
        icon="pi pi-times"
        text
        rounded
        aria-label="Cancel"
        class="close-button"
        v-if="isMobile"
        @click="toggleSidebar"
      />
      <div class="flex flex-column align-items-left h-full justify-content-around z-">
        <div @click="goToProfile" class="flex justify-content-center align-items-center mr-6 flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
          <img src="https://www.capitalcoahuila.com.mx/wp-content/uploads/2022/11/CARL-e1669117013260.jpeg" id="icon" alt="User Icon" class="custom-image" width="48" height="48" style="object-fit:cover; border-radius:50%;">
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
    <!-- Botón hamburguesa: visible en mobile cuando sidebar está oculta, y en desktop cuando sidebar está oculta -->
    <pv-button
      class="show-sidebar-btn"
      v-if="!sidebarOpen"
      @click="toggleSidebar"
      aria-label="Mostrar menú"
      icon="pi pi-bars"
      text
    />
    <!-- Botón para ocultar sidebar en desktop -->
    <pv-button
      class="hide-sidebar-desktop"
      v-if="!isMobile && sidebarOpen"
      @click="toggleSidebar"
      icon="pi pi-angle-left"
      text
      aria-label="Ocultar menú"
    />
  </div>
</template>

<style>
.p-sidebar {
  background-color: #303841;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  z-index: 1000;
  position: fixed !important;
  left: 0;
  top: 0;
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
}

.p-sidebar-mask {
  z-index: 1000 !important;
  background: rgba(0,0,0,0.5);
}

@media (min-width: 860px) {
  .p-sidebar {
    z-index: 100;
    position: fixed !important;
    left: 0;
    top: 0;
    height: 100vh;
    box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  }
  .p-sidebar-mask {
    background: transparent !important;
    pointer-events: none;
    z-index: 0 !important;
  }
  .close-button {
    display: none !important;
  }
  .hide-sidebar-desktop {
    display: block;
    position: fixed;
    top: 1rem;
    left: 220px;
    z-index: 101;
    background: #F39C12;
    color: #fff;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .show-sidebar-btn {
    display: block !important;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 102;
    background: #F39C12;
    color: #fff;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
}

@media (max-width: 860px) {
  .hide-sidebar-desktop {
    display: none !important;
  }
  .show-sidebar-btn {
    display: block !important;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 102;
    background: #F39C12;
    color: #fff;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .custom-image {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>


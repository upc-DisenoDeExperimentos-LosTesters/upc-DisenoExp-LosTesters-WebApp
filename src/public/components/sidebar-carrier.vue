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
          aria-label="Cancelar"
          class="close-button"
          v-if="isMobile"
          @click="toggleSidebar"
      />

      <div class="flex flex-column align-items-left h-full justify-content-around z-">
        <div
            @click="goToProfile"
            class="flex justify-content-center align-items-center mr-6 cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
        >
 <i class="pi pi-user user-icon" style="font-size: 2.5rem;"></i>

          <a class="m-2">
            <h2>{{ name }}</h2>
            <h2>{{ lastName }}</h2>
          </a>
        </div>

        <div>
          <ul class="list-none p-3 m-0">
            <li @click="goTo(`/${this.id}/home-driver-menu`)">
              <a class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-home mr-2 text-xl"></i>
                <span class="font-medium text-xl">{{ $t('sidebar.home') }}</span>
              </a>
            </li>
            <li @click="goTo(`/${this.id}/report/carrier`)">
              <a class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-chart-bar mr-2 text-xl"></i>
                <span class="font-medium text-xl">{{ $t('sidebar.reports') }}</span>
              </a>
            </li>
            <li @click="goTo(`/${this.id}/shipments-carrier`)">
              <a class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-send mr-2 text-xl"></i>
                <span class="font-medium text-xl">{{ $t('sidebar.shipments') }}</span>
              </a>
            </li>
            <li @click="goTo(`/${this.id}/vehicles-carrier`)">
              <a class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-truck mr-2 text-xl"></i>
                <span class="font-medium text-xl">{{ $t('sidebar.vehicles') }}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <ul class="list-none p-3 m-0">
<!--            <li @click="goToProfile">-->
<!--              <a class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">-->
<!--                <i class="pi pi-cog mr-2 text-xl"></i>-->
<!--                <span class="font-medium text-xl">Settings</span>-->
<!--              </a>-->
<!--            </li>-->
            <li @click="toggleLanguage">
              <a class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-globe mr-2 text-xl"></i>
                <span class="font-medium text-xl">
                {{ $i18n.locale === 'es' ? 'EN' : 'ES' }}
              </span>
              </a>
            </li>

            <li @click="logout">
              <a class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i class="pi pi-sign-out mr-2 text-xl"></i>
                <span class="font-medium text-xl">{{ $t('sidebar.logout') }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </pv-sidebar>

    <!-- Botón hamburguesa -->
    <pv-button
        class="show-sidebar-btn"
        v-if="!sidebarOpen"
        @click="toggleSidebar"
        aria-label="Mostrar menú"
        icon="pi pi-bars"
        text
    />
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



<script>
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "sidebar-carrier",
  data() {
    return {
      name: "",
      lastName: "",
      isMobile: window.innerWidth <= 860,
      sidebarOpen: window.innerWidth > 860,
      api: new IamApiService(),
      id: localStorage.getItem("userId") || "",
      allowedRoutes: [
        "/home-driver-menu",
        "/report/carrier",
        "/shipments-carrier",
        "/vehicles-carrier"
      ]
    };
  },
  computed: {
    shouldShowSidebar() {
      return this.allowedRoutes.some(route => this.$route.path.startsWith(route));
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    const savedLang = localStorage.getItem('lang');
    if (savedLang) this.$i18n.locale = savedLang;

    this.api.getProfileById(this.id).then((res) => {
      this.name = res.data.name;
      this.lastName = res.data.lastName;
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    toggleLanguage() {
      const newLocale = this.$i18n.locale === 'es' ? 'en' : 'es';
      this.$i18n.locale = newLocale;
      localStorage.setItem('lang', newLocale);
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 860;
      this.sidebarOpen = !this.isMobile;
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    goTo(route) {
      this.$router.push(route);
    },
    goToProfile() {
      this.$router.push(`/${this.id}/userprofile`);
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.custom-sidebar {
  background-color: #303841;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  height: 100vh;
  position: fixed;
  z-index: 1000;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.profile .text h3,
.profile .text p {
  margin: 0;
  color: #fff;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 1rem;
  color: #fff;
  cursor: pointer;
  border-radius: 12px;
  transition: background 0.2s;
}

.menu li:hover {
  background-color: #505b65;
}

.toggle-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  background-color: #f39c12;
  color: #fff;
  border-radius: 50%;
  width: 2.7rem;
  height: 2.7rem;
  z-index: 1001;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
}
</style>

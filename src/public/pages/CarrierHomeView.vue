<script>
import SidebarCarrier from "../components/sidebar-carrier.vue";
import HomeDriverComponent from "../../profiles-managment/components/home-driver.component.vue";

export default {
  name: "CarrierHomeView",
  components: {
    SidebarCarrier,
    HomeDriverComponent,
  },
};
</script>

<template>
  <div class="carrier-home">
    <!-- Sidebar fijo o colapsable según pantalla -->
    <sidebar-carrier />

    <!-- Contenido principal -->
    <main class="main-content">
      <home-driver-component />
    </main>
  </div>
</template>

<style scoped>
.carrier-home {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Contenido principal */
.main-content {
  flex: 1;
  padding: 1rem;
  margin-left: 260px; /* deja espacio al sidebar en desktop */
}

@media (max-width: 860px) {
  .main-content {
    margin-left: 0; /* en móvil, el sidebar se oculta y el contenido ocupa todo */
  }
}
</style>

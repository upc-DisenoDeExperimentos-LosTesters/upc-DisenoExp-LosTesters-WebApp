<script>
import SidebarCarrier from "../components/sidebar-carrier.vue";
import homeDriverComponent from "../../profiles-managment/components/home-driver.component.vue";

export default {
  name: "CarrierHomeView", // Cambia si quieres otro nombre
  components: {
    homeDriverComponent,
    SidebarCarrier, // el componente correcto es SidebarCarrier
  },
};
</script>

<template>
  <div class="container">
    <!-- Usa el nombre correcto -->
    <sidebar-carrier />
    <home-driver-component />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
}
</style>

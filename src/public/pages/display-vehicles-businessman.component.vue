<script>
import CyaVehiclesBusinessman from "../../service-execution/vehicles-management/cya-vehicles-businessman.component.vue";
import Sidebar from "../components/sidebar.component.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {CyaVehiclesBusinessman, Sidebar}
})
</script>

<template>
  <div class="container">
    <sidebar></sidebar>
    <cya-vehicles-businessman/>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  align-items: flex-start;
}
</style>
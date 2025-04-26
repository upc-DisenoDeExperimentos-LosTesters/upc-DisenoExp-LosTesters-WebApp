<script>
import {defineComponent} from "vue";
import Sidebar from "../components/sidebar.component.vue";
import CyaVehiclesCarrier from "../../service-execution/vehicles-management/cya-vehicles-carrier.component.vue";


export default defineComponent({
  components: { CyaVehiclesCarrier,Sidebar}
})
</script>

<template>
  <div class="container">
    <sidebar></sidebar>
    <cya-vehicles-carrier/>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  align-items: flex-start;
}
</style>
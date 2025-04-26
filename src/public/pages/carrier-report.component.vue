<script>
import ReportView from "../../service-execution/reports-management/report-view.component.vue";
import ReportDriver from "../../service-execution/reports-management/report-driver.component.vue";
import Sidebar from "../components/sidebar.component.vue";

export default {
  name: "carrier-report",
  components: {ReportDriver, ReportView,Sidebar}
}
</script>

<template>
  <div class="container">
    <sidebar></sidebar>
    <report-driver></report-driver>
  </div>
</template>

<style scoped>

</style>
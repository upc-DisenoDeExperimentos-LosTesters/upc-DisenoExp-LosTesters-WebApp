<script>
import Sidebar from "../components/sidebar.component.vue";
import ReportViewComponent from "../../service-execution/reports-management/report-view.component.vue";
import ReportView from "../../service-execution/reports-management/report-view.component.vue";

export default {
  name: "carrier-report",
  components: {
    ReportView,
    Sidebar,
    ReportViewComponent
  },
}
</script>

<template>
  <div class="container">
    <sidebar></sidebar>
    <report-view></report-view>
  </div>
</template>

<style>
.container{
  display: flex;
}
</style>
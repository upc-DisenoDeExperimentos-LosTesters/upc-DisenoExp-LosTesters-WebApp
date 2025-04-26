<script>
import {ReportsApiService} from "./services/reports-api.service.js";

export default {
  name: "report-view",
  title: "Report View",
  data() {
    return {
      reports: [],
      reportsApi: new ReportsApiService(),
    };
  },
  created() {
    this.getDataReport();
  },
  methods: {
    async getDataReport() {
      const response = await this.reportsApi.getAllReports();
      const reports = response.data;
      for (let report of reports) {
        const userResponse = await this.reportsApi.findUserByID(report['id-user']);
        console.log(userResponse);
        const user = userResponse.data[0];
        report.name = `${user.name} ${user.lastName}`;
      }
      this.reports = reports;
      console.log(this.reports);
    }
  }
}
</script>

<template>
    <div class="container z-1 header container-report-businessman">
      <div class="text-100 font-medium text-xl container-info">
        <h1 class="text-100">Reports</h1>
        <p>Driver report list</p>
      </div>
      <div class="card-container-1">
        <pv-card>
          <template #content>
            <pv-table :value="reports">
              <pv-column field="name" header="Driver’s Name"></pv-column>
              <pv-column field="description" header="Description"></pv-column>
              <pv-column field="dateTime.date" header="Date"></pv-column>
            </pv-table>
          </template>
        </pv-card>
      </div>
    </div>
</template>

<style>

.container-report-businessman{
  display: flex !important;
  align-content: flex-start !important;
  align-items: flex-start !important;
  margin-left: 0;
}
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  margin-left: 11rem;
}

.card-container-1{
  margin-right: 1rem;
}

@media (max-width: 860px){
  .container{
    margin-left: 0;
  }

  .container-info{
    margin-top: 4rem;
    margin-left: 1rem;
  }

  .card-container-1{
    margin-left: 1rem;
  }
}
</style>
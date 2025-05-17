<script>
import {HomeApiService} from "../../profiles-managment/services/home-api.service.js";

export default {
  name: "report-driver",
  title: "Report Driver",
  data(){
    return {
      reports: null,
      report: null,
      reportsApi: new HomeApiService(),
      submitted: false,
      reportDialog: false,
    };
  },
  created(){
    this.getDataReport();
  },
  methods: {
    async getDataReport() {
      const response = await this.reportsApi.getReports();
      const reports = response.data;
      for (let report of reports) {
        const userResponse = await this.reportsApi.findUserByID(report['id-user']);
        console.log(userResponse);
        const user = userResponse.data[0];
        report.name = `${user.name} ${user.lastName}`;
      }
      this.reports = reports;
      console.log(this.reports);
    },
    openNew(){
      this.report = {};
      this.submitted = false;
      this.reportDialog = true;
    },
    hideDialog(){
      this.reportDialog = false;
      this.submitted = false;
    },
    saveReport(){
      if (!this.report.name || !this.report.description) {
        this.submitted = true;
        return;
      }
      this.reportDialog= false;
      this.submitted = true;
    }
  }
}
</script>

<template>
  <div class="flex justify-content-between flex-wrap container">
    <div class="text-900 font-medium text-xl mb-3">
    <h1>Reports</h1>
    <p>Driver report list</p>
    </div>
    <div class="flex align-items-center justify-content-center">
    <pv-button label="New" icon="pi pi-plus" severity="success" class="mr-5" @click="openNew"/>
    </div>
  </div>
  <div class="p-5 card-container">
    <!--CARD-TABLE-->
    <pv-card>
      <template #content>
        <pv-table :value="reports">
          <pv-column field="name" header="Driver’s Name"></pv-column>
          <pv-column field="description" header="Description"></pv-column>
          <pv-column field="dateTime.date" header="Date"></pv-column>
        </pv-table>
      </template>
    </pv-card>
    <!--FIN - CARD - TABLE-->

    <!--REPORT-DIALOG START-->
    <pv-dialog v-model:visible="reportDialog" :style="{width: '450px'}" header="Report Details" :modal="true" class="p-fluid">
      <div class="field">
        <label for="name" class="mr-5">Name</label>
        <input id="name" v-model.trim="report.name" required="true" autofocus :invalid="submitted && !report.name" class="p-inputtext"/>
        <small class="p-error" v-if="submitted && !report.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" v-model="report.description" required="true" rows="3" cols="20" class="p-inputtext" />
        <small class="p-error" v-if="submitted && !report.description">Description is required.</small>
      </div>

      <template #footer>
        <pv-button label="Cancel" icon="pi pi-times" text @click="hideDialog" class="p-button-footer"/>
        <pv-button label="Save" icon="pi pi-check" text @click="saveReport" class="p-button-footer"/>
      </template>
    </pv-dialog>
    <!--REPORT-DIALOG END-->
  </div>
</template>

<style>
.field label {
  font-weight: bold;
  color: #333;
}
.p-inputtext {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
}
.p-button-footer {
  background-color: #ddd;
  color: #333;
  border: none;
}
.card-container {
  align-self: center;
}
</style>
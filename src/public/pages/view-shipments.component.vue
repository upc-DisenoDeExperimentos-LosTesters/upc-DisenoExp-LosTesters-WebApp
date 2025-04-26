<script>
import {ShipmentApiService} from "../../service-execution/shipment-management/services/shipment-api.service.js";

export default {
  name: "organization-shipment",
  data(){
    return {
      shipmentsApi: new ShipmentApiService(),
      shipments: [],
      shipment: [],
      selectedShipment: null,
      shipmentDetailsDialog: false,
    };
  },
  created(){
    this.getDataShipment();
  },
  methods: {
    async getDataShipment(){
      const response = await this.shipmentsApi.getAllShipments();
      const shipments = response.data;
      // Nombre y apellido del conductor por cada shipment
      for (let shipment of shipments) {
        const userResponse = await this.shipmentsApi.findUserByID(shipment['id-user']);
        console.log(userResponse);
        const user = userResponse.data[0];
        shipment.driverName = `${user.name} ${user.lastName}`;
      }
      this.shipments = shipments;
      console.log(this.shipments);

    },
    showShipmentDetails(shipment) {
      this.selectedShipment = shipment;
      this.shipmentDetailsDialog = true;
    },
    hideShipmentDetailsDialog() {
      this.shipmentDetailsDialog = false;
    },
  }
}
</script>

<template>
  <div class="flex align-content-start flex wrap">
    <div class="ml-3">
      <h1>Organization</h1>
      <h3>Click in the list to see details</h3>
    </div>
  </div>
  <div>
    <pv-card>
      <template #content>
        <pv-table :value="shipments" @row-click="showShipmentDetails($event.data)">
          <pv-column field="driverName" header="Driver's Name"></pv-column>
          <pv-column field="destiny" header="Destiny"></pv-column>
          <pv-column field="description" header="Description"></pv-column>
          <pv-column field="dateTime.date" header="Delivery date"></pv-column>
          <pv-column field="dateTime.time" header="Delivery time"></pv-column>
          <pv-column field="status" header="Status"></pv-column>
        </pv-table>
      </template>
    </pv-card>
  </div>
  <pv-dialog v-model:visible="shipmentDetailsDialog" :style="{width: '450px'}" header="Shipment Details" :modal="true" class="p-fluid dialog-style">
    <div v-if="selectedShipment">
      <p>Driver's Name: {{ selectedShipment.driverName }}</p>
      <p>Destiny: {{ selectedShipment.destiny }}</p>
      <p>Description: {{ selectedShipment.description }}</p>
      <p>Delivery date: {{ selectedShipment.dateTime.date }}</p>
      <p>Delivery time: {{ selectedShipment.dateTime.time }}</p>
      <p>Status: {{ selectedShipment.status }}</p>
    </div>
    <template #footer>
      <pv-button label="Close" icon="pi pi-times" text @click="hideShipmentDetailsDialog" class="cancel-button"/>
    </template>
  </pv-dialog>

</template>

<style>

.field input{
  flex-grow: 1;
}

.dialog-style .p-dialog-content {
  background-color: #f5f5f5;
  color: #333;

}
.dialog-style .p-dialog-header {
  background-color: #007bff;
  color: whitesmoke;
}
.dialog-style .cancel-button {
  background-color: #dc3545;
  color: #fff;
}
</style>
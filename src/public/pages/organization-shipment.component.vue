<script>
import {ShipmentApiService} from "../../service-execution/shipment-management/services/shipment-api.service.js";

export default {
  name: "organization-shipment",
  data(){
    return {
      shipmentsApi: new ShipmentApiService(),
      shipments: [],
      shipment: [],
      submitted: false,
      shipmentDialog: false,
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
    newItem() {
      this.shipment = {
        driverName: '',
        destiny: '',
        description: '',
        dateTime: {
          date: '',
          time: '',
        },
        status:'Programmed',
      };
      this.submitted = false;
      this.shipmentDialog = true;
    },
    hideDialog(){
      this.shipmentDialog = false;
      this.submitted = false;
    },
    saveShipment(){
      if (!this.shipment.driverName || !this.shipment.destiny || !this.shipment.description || !this.shipment.dateTime.date || !this.shipment.dateTime.time) {
        this.submitted = true;
        return;
      }
      // Muestra datos en la tabla sin afectar el json
      //let shipmentCopy = {...this.shipment};
      //this.shipments.push(shipmentCopy);

      this.shipmentDialog = false;
      this.submitted = false;
      alert("Se añadió exitosamente");
    }
  }
}
</script>

<template>
  <div class="flex align-content-start flex wrap">
    <div class="ml-3">
      <h1>Organization</h1>
      <h3>Click in the list to see details</h3>
    </div>
      <div class="flex justify-content-end">
        <pv-button class="mr-2" label="Add" icon="pi pi-plus" severity="success" @click="newItem"></pv-button>
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

  <pv-dialog v-model:visible="shipmentDialog" :style="{width: '450px'}" header="Add shipping" :modal="true" class="p-fluid dialog-style">
    <div class="field">
      <p>Driver's Name</p>
      <input id="name" v-model.trim="shipment.driverName" required="true" autofocus :invalid="submitted && !shipment.driverName" class="p-inputtext"/>
      <small class="p-error" v-if="submitted && !shipment.driverName">Name is required.</small>
    </div>
    <div class="field">
      <p>Destiny</p>
      <input id="destiny" v-model.trim="shipment.destiny" required="true" autofocus :invalid="submitted && !shipment.destiny" class="p-inputtext"/>
      <small class="p-error" v-if="submitted && !shipment.destiny">Destiny is required.</small>
    </div>
    <div class="field">
      <p>Description</p>
      <input id="description" v-model.trim="shipment.description" required="true" class="p-inputtext"/>
      <small class="p-error" v-if="submitted && !shipment.description">Description is required.</small>
    </div>
    <div class="field">
      <p>Delivery date</p>
      <pv-calendar v-model.trim="shipment.dateTime.date" dateFormat="yy/mm/dd" class="calendar"/>
      <small class="p-error" v-if="submitted && !shipment.dateTime.date">Date is required.</small>
    </div>
    <div class="field">
      <p>Delivery time</p>
      <pv-calendar id="calendar-timeonly" v-model.trim="shipment.dateTime.time" timeOnly hour-format="hh:mm" class="calendar"/>
      <small class="p-error" v-if="submitted && !shipment.dateTime.time">Time is required.</small>
    </div>
    <div class="field">
      <p>Status</p>
      <input id="status" v-model.trim="shipment.status" disabled placeholder="Programmed" value="Programmed" class="p-inputtext"/>
    </div>

    <template #footer>
      <pv-button label="Cancel" icon="pi pi-times" text @click="hideDialog" class="cancel-button"/>
      <pv-button label="Save" icon="pi pi-check" text @click="saveShipment" class="save-button"/>
    </template>
  </pv-dialog>

</template>

<style>
.field{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}
.field input{
  flex-grow: 1;
}
.calendar{
  width: 100%;
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
.dialog-style .save-button {
  background-color: #28a745;
  color: #fff;
}
</style>
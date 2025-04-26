<script>
import {VehiclesApiService} from "./services/vehicules-api.service.js";
import {IamApiService} from "../../iam/services/iam-api.service.js";

export default {
  name: "cya-vehicles-businessman",
  data() {
    return {
      showAddForm: false,
      showDeleteForm: false,
      deleteVehicleId: '',
      showForm: false,
      vehiclesApi: new VehiclesApiService(),
      iamApi: new IamApiService(),
      user: null,
      vehicles: [],
      id: this.$route.params.id,
      newVehicle: {
        model: '',
        licensePlate: '',
        serialNumber: ''
      }
    };
  },
  created(){
    this.getData(this.id);
  },
  methods: {
    addVehicle() {  
      this.vehiclesApi.addVehicle(this.newVehicle)
          .then(response => {
            this.newVehicle = { model: '', licensePlate: '', serialNumber: '' };
          });
    },
    deleteVehicle() {
      this.vehiclesApi.deleteVehicle(this.deleteVehicleId)
          .then(() => {
            this.deleteVehicleId = '';
          });
    },
    getData(userId) {
      this.iamApi.findUserById(userId)
          .then(userResponse => {
            this.user = userResponse.data[0];
            let vehiclePromises = this.user.vehicles.map(vehicleUser => {
              return this.vehiclesApi.getVehiclesById1(vehicleUser.idVehicle);
            });
            Promise.all(vehiclePromises)
                .then(vehicleResponses => {
                  this.vehicles = vehicleResponses.map(response => response.data[0]);
                });
          });
    }
  },
}
</script>
<template>
  <div class="container container-vehicles-businessman">
    <div>
      <h1 class="title">Vehicles</h1>
      <div class="button-group">
        <pv-button class="p-button" @click="showAddForm = !showAddForm">Add Vehicle</pv-button>
        <pv-button class="p-button" @click="showDeleteForm = !showDeleteForm">Delete Vehicle</pv-button>
      </div>
      <form v-if="showAddForm" @submit.prevent="addVehicle" class="form-card">
        <h2 class="title-card">New Vehicle</h2>
        <label for="model">Model</label>
        <input v-model="newVehicle.model" placeholder="Model" required>
        <label for="licensePlate">License Plate</label>
        <input v-model="newVehicle.licensePlate" placeholder="License Plate" required>
        <label for="serialNumber">Serial Number</label>
        <input v-model="newVehicle.serialNumber" placeholder="Serial Number" required>
        <label for="serialNumber">Id</label>
        <input v-model="newVehicle.id" placeholder="Id" required>
        <pv-button type="submit">Confirm</pv-button>
        <pv-button @click="showAddForm = false">Close</pv-button>
      </form>
      <form v-if="showDeleteForm"  class="form-card">
        <h2 class="title-card">Delete Vehicle</h2>
        <label for="vehicleId">Vehicle ID</label>
        <input v-model="deleteVehicleId" placeholder="Vehicle ID" required>
        <pv-button type="submit" @click="deleteVehicle">Confirm</pv-button>
        <pv-button @click="showDeleteForm = false">Close</pv-button>
      </form>
    </div>
    <div v-for="vehicle in vehicles" :key="vehicle.id">
      <pv-card class="card">
        <template #title>{{vehicle.model}}</template>
        <template #content>
          <p>License Plate: {{vehicle.licensePlate}}</p>
          <p>Serial Number: {{vehicle.serialNumber}}</p>
          <p>Id: {{vehicle.id}}</p>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  flex-direction: column;
  gap: 1rem;
  z-index: 1;
  align-items: flex-start;
}

.title{
  color: #ffffff;
  margin: 2rem;
}
.card{
  background: #ffffff;
  margin-left: 2rem;
  width: 300px;
}

.p-button{
  margin: 0.5rem;
  padding: 1rem;
  border-radius: 5%;
}

.button-group{
  margin-left: 1.5rem;
}

.form-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
  height: 50%;
  width: 40%
}

.form-card input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background: #ffffff;
  color: #0d0d0d;
}

.title-card{
  color: #0d0d0d;
}

@media (max-width: 860px){
  .container{
    margin-top: 3rem !important;
  }

  .container-vehicles-businessman{
    margin-right: 2rem !important;
  }
}

@media (max-width: 375px){
  .container-vehicles-businessman{
    margin-right: 1rem;
  }
  .card{
    width: 250px;
  }
}
</style>
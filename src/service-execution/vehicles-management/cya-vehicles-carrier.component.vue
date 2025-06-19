<script>
import {VehiclesApiService} from "./services/vehicules-api.service.js";

import {IamApiService} from "../../iam/services/iam-api.service.js";

export default {
  name: "cya-vehicles-carrier",
  title: "cya-vehicles-carrier",
  data() {
    return {
      vehiclesApi: new VehiclesApiService(),
      userApi: new IamApiService(),
      vehicles: [],
      idUser: this.$route.params.id,
      idCar:'',
      msmError:''
    };
  },
  created(){

    this.getDataVehicle();

  },
  methods: {
    async getDataVehicle() {
      await this.getInfoUser();
      this.vehiclesApi.getVehicleById(this.idCar).then(response => {
            this.vehicles = response.data;
            console.log(response.data[0]);
      })
    },
    async getInfoUser(){
      await this.userApi.findUserById(this.idUser).then(data=>{
        this.idCar = data.data[0].vehicles[0].idVehicle;
      }).catch(error=>{
        this.msmError=`vehicle not found for you.... Error: ${error}`
      });
    }
  }
}
</script>

<template>
  <div class="cya-vehicles-container">
    <div class="header">
      <h1>Vehicles</h1>
      <h3>You can see your car fleet</h3>
    </div>
    <div class="vehicles-list">
      <div class="vehicle-card" v-for="vehicle of vehicles" :key="vehicle.id">
        <pv-card>
          <template #title>{{ vehicle.model }}</template>
          <template #content>
            <p class="m-0">License Plate: {{ vehicle.licensePlate }}</p>
            <p class="m-0">Serial Number: {{ vehicle.serialNumber }}</p>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cya-vehicles-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1rem;
  box-sizing: border-box;
}

.header {
  margin-bottom: 1rem;
}

.vehicles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.vehicle-card {
  border: 1px solid;
  width: 350px;
  text-align: center;
  background: darkgray;
  z-index: 1;
}
</style>
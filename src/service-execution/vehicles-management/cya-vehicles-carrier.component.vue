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
  <div class="flex align-content-start flex wrap">
    <div class="ml-3">
      <h1>Vehicles</h1>
      <h3>You can see your car fleet</h3>
    </div>
  </div>


  <div class="container" v-for="vehicle of vehicles" v-bind:key="vehicle.id">
    <pv-card>
      <template #title>{{vehicle.model}}</template>
      <template #content>
        <p class="m-0">
          License Plate: {{ vehicle.licensePlate }}
        </p>
        <p class="m-0">
          Serial Number: {{ vehicle.serialNumber }}
        </p>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid;
  width: 350px;
  text-align: center;
  background: darkgray;
  z-index: 1;
}
</style>
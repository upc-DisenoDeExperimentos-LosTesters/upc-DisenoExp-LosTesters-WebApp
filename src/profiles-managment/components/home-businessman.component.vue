<script>
import { HomeApiService } from "../services/home-api.service.js";

export default {
  name: "home-businessman",
  title: "Home",
  data() {
    return {
      activities: [],
      conditions: [],
      deliveries: [],
    };
  },
  created() {
    const apiService = new HomeApiService();
    apiService.getAllActivities().then(response => {
      this.activities = response.data;
    });
    apiService.getAllCondition().then(response => {
      this.conditions = response.data;
    });
    apiService.getAllDeliveries().then(response => {
      this.deliveries = response.data;
    });
  },
}
</script>

<template>
  <div class="p-grid p-dir-col z-1 container justify-content-center align-content-center container-home-businessman">
    <div class="p-col image-title-container">
      <h1>Welcome, Jhon Doe!</h1>
      <img src="../../public/assets/logo.png" id="icon" alt="User Icon" class="img-home">
    </div>
    <div class="p-grid p-dir-col p-col card-container-business justify-content-center">
      <pv-card v-if="activities.length" class="p-sm-12 p-md-12 p-lg-6">
        <template #title>
          <i class="fa fa-list"></i>Today's activities
        </template>
        <template #content>
          <div v-for="activity in activities.slice(0, 3)" :key="activity.id">
            <h3>{{ activity.description }}</h3>
            <p>{{ activity.type }}</p>
            <p>{{ activity.dateTime.date }} - {{ activity.dateTime.time }}</p>
          </div>
        </template>
        <template #footer>
          <pv-button>See More</pv-button>
        </template>
      </pv-card>
      <pv-card v-if="deliveries.length" class="p-sm-12 p-md-12 p-lg-6">
        <template #title>
          <i class="fa fa-truck"></i>Deliveries on the move
        </template>
        <template #content>
          <div v-for="delivery in deliveries.slice(0, 2)" :key="delivery.id">
            <h3>{{ delivery.destiny }}</h3>
            <p>Responsible: {{ delivery.description }}</p>
            <p>Start time: {{ delivery.dateTime.date }}</p>
            <p>Delivery time: {{ delivery.status }}</p>
          </div>
        </template>
        <template #footer>
          <pv-button>See More</pv-button>
        </template>
      </pv-card>
    </div>
    <div class="card-container3">
      <pv-card v-if="conditions.length" class="p-sm-12 p-md-12 p-lg-6">
        <template #title>
          <i class="fa fa-signal"></i>Condition of drivers and vehicles
        </template>
        <template #content>
          <div v-for="condition in conditions.slice(0, 1)" :key="condition.id">
            <p>Model: {{ condition.model }}</p>
            <p>License Plate: {{ condition.licensePlate }}</p>
            <p>Serial Number: {{ condition.serialNumber }}</p>
          </div>
        </template>
        <template #footer>
          <pv-button>See More</pv-button>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style>
.image-title-container{
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.card-container-business{
  display: flex;
  gap: 1rem;
}

.img-home{
  width: 70px;
  height: 70px;
}

h1{
  color: black;
}

@media (max-width: 1024px){
  .card-container-business{
    flex-direction: column !important;
  }
  .card-container3{
    width: 100%;
  }
}

@media (max-width: 860px){
  .container{
    margin-left: 1rem;
    display: flex;
    align-content: center;
  }

  .container-home-businessman{
     margin-left: 1rem !important;
  }

  .card-container pv-card {
    width: 100%;
  }

  .image-title-container {
    margin-top: 4rem;
  }

  .img-home {
    width: 50px;
    height: 50px;
  }

  h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px){
  .container-home-businessman{
    margin-right: 1.5rem;
  }
}

</style>
<script>
import { HomeApiService } from "../services/home-api.service.js";

export default {
  name: "home-driver",
  title: "Home",
  data() {
    return {
      activities: [],
      deliveries: [],
    };
  },
  created() {
    const apiService = new HomeApiService();
    apiService.getAllActivitiesDriver().then(response => {
      this.activities = response.data;
    });

    apiService.getAllDeliveriesDriver().then(response => {
      this.deliveries = response.data;
    });
  },
}
</script>

<template>
  <div class="p-grid p-dir-col z-1 container justify-content-center align-content-center">
    <div class="p-col image-title-container">
      <h1>Welcome, David Doe!</h1>
      <img src="../../public/assets/logo.png" id="icon" alt="User Icon" class="img-home">
    </div>
    <div class="p-grid p-dir-col p-col card-container card-container-home-driver justify-content-center">
      <pv-card v-if="activities.length" class="p-sm-12 p-md-12 p-lg-6">
        <template #title>
          <i class="fa fa-list"></i>Today's activities
        </template>
        <template #content>
          <div v-for="activity in activities" :key="activity.id">
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
          <div v-for="delivery in deliveries" :key="delivery.id">
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
  </div>
</template>

<style>
.card-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;

}

.custom-image {
  width: 80px;
}

@media(max-width: 1024px){
  .card-container-home-driver{
    flex-direction: column;
    width: 95%;
  }
}
</style>
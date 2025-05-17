<script>
import { Card } from 'primevue/card';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    Card
  },
  setup() {
    const vehicles = ref([]);
    const router = useRouter();

    onMounted(async () => {
      // Fetch vehicles data
      vehicles.value = await fetchVehicles();
    });

    const goToVehicleDetail = (vehicleId) => {
      router.push(`/vehicle/${vehicleId}`);
    };

    return {
      vehicles,
      goToVehicleDetail
    };
  }
};
</script>

<template>
  <div class="p-grid">
    <div class="p-col-12 p-md-4" v-for="vehicle in vehicles.slice(0, 3)" :key="vehicle.id">
      <Card @click="goToVehicleDetail(vehicle.id)" class="cursor-pointer">
        <template #title>
          {{ vehicle.model }}
        </template>
        <template #content>
          <p><strong>Placa:</strong> {{ vehicle.licensePlate }}</p>
          <p><strong>Serie:</strong> {{ vehicle.serialNumber }}</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>

</style>
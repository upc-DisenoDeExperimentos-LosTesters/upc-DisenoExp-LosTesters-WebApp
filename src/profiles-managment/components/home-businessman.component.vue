<script>
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "home-businessman",
  data() {
    return {
      name: '',
      lastName: '',
      type: '',
      shipments: [],
      vehicles: [],
      reports: [],
      transporters: [],
      id: this.$route.params.id,
      api: new IamApiService(),
      homeApi: new HomeApiService()
    };
  },
  async created() {
    // Obtener datos del usuario
    this.api.getProfileById(this.id).then(response => {
      this.name = response.data.name;
      this.lastName = response.data.lastName;
      this.type = response.data.type;
    });

    // Llamar a los métodos del servicio correcto
    const [shipmentsRes, vehiclesRes, reportsRes] = await Promise.all([
      this.homeApi.getRecentShipments(),
      this.homeApi.getVehicles(),
      this.homeApi.getReports(),
    ]);

    this.shipments = shipmentsRes.data.slice(0, 5);
    this.vehicles = vehiclesRes.data.slice(0, 5);
    this.reports = reportsRes.data.slice(0, 5);
  }
};
</script>

<template>
  <div class="p-grid p-dir-col z-1 container justify-content-center align-content-center container-home-businessman">
    <div class="p-col image-title-container">
      <h1>Welcome, {{ name }} {{lastName}}!</h1>
      <img src="../../public/assets/logo.png" id="icon" alt="User Icon" class="img-home">
    </div>
    <div class="p-grid p-dir-col p-col card-container-business justify-content-center">
      <pv-card v-if="shipments.length" class="p-card">
        <template #title>
          <i class="pi pi-truck p-mr-2"></i> Últimos Envíos
        </template>
        <template #content>
          <div v-for="s in shipments" :key="s.id" class="shipment-item">
            <p><strong>{{ s.destiny }}</strong> - <span class="status">{{ s.status }}</span></p>
          </div>
        </template>
      </pv-card>


      <pv-card v-if="vehicles.length" class="p-card">
        <template #title>
          <i class="pi pi-car p-mr-2"></i> Vehículos Registrados
        </template>
        <template #content>
          <div v-for="v in vehicles" :key="v.id" class="vehicle-item">
            <p><strong>{{ v.model }}</strong> - <span class="license">{{ v.licensePlate }}</span></p>
          </div>
        </template>
      </pv-card>

      <pv-card v-if="reports.length" class="p-card">
        <template #title>
          <i class="pi pi-file p-mr-2"></i> Reportes Recientes
        </template>
        <template #content>
          <div v-for="r in reports" :key="r.id" class="report-item">
            <p><strong>{{ r.type }}</strong> - <span class="date">{{ new Date(r.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) }}</span></p>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style>
.image-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.card-container-business {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.p-card {
  width: 100%;
  max-width: 400px;
  border: 1px solid #dcdcdc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f9f9f9;
}

.p-card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.p-card-content {
  font-size: 1rem;
  color: #555;
}

.shipment-item, .vehicle-item, .report-item {
  margin-bottom: 0.5rem;
}

.status {
  color: #007ad9;
  font-weight: bold;
}

.license {
  color: #28a745;
  font-weight: bold;
}

.date {
  color: #6c757d;
  font-style: italic;
}

.img-home {
  width: 70px;
  height: 70px;
}

h1 {
  color: antiquewhite;
  font-size: 2rem;
}

@media (max-width: 1024px) {
  .card-container-business {
    flex-direction: column !important;
  }
}

@media (max-width: 860px) {
  .container {
    margin-left: 1rem;
    display: flex;
    align-content: center;
  }

  .container-home-businessman {
    margin-left: 1rem !important;
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

@media (max-width: 600px) {
  .container-home-businessman {
    margin-right: 1.5rem;
  }
}

</style>
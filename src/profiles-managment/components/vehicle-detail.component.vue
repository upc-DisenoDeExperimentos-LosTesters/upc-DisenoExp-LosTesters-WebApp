<script>
import Sidebar from "../../public/components/sidebar.component.vue";
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "vehicle-detail",
  components: { Sidebar },
  data() {
    return {
      vehicle: null,
      loading: true,
      id: this.$route.params.id,
      homeApi: new HomeApiService(),
      iamApi: new IamApiService(),
      propietario: null,
      transportista: null
    };
  },
  async created() {
    try {
      const res = await this.homeApi.getVehicleById(this.id);
      this.vehicle = res.data;

      // Obtener propietario
      if (this.vehicle.idPropietario) {
        try {
          const propRes = await this.iamApi.getProfileById(this.vehicle.idPropietario);
          this.propietario = propRes.data;
        } catch (e) {
          this.propietario = null;
        }
      }

      // Obtener transportista
      if (this.vehicle.idTransportista) {
        try {
          const transRes = await this.iamApi.getProfileById(this.vehicle.idTransportista);
          this.transportista = transRes.data;
        } catch (e) {
          this.transportista = null;
        }
      }
    } finally {
      this.loading = false;
    }
  }
};
</script>

<template>
  <div class="container">
    <sidebar />
    <div class="vehicle-detail-container">
      <div v-if="loading" class="loading">Cargando...</div>
      <div v-else-if="!vehicle" class="no-vehicle">No se encontró el vehículo.</div>
      <div v-else class="vehicle-card">
        <h2 class="vehicle-title">Detalle del Vehículo</h2>
        <div class="vehicle-info">
          <p><span class="label">Modelo:</span> <span class="value">{{ vehicle.model }}</span></p>
          <p><span class="label">Placa:</span> <span class="value">{{ vehicle.licensePlate }}</span></p>
          <p v-if="vehicle.year"><span class="label">Año:</span> <span class="value">{{ vehicle.year }}</span></p>
          <p v-if="vehicle.color"><span class="label">Color:</span> <span class="value">{{ vehicle.color }}</span></p>
          <p v-if="vehicle.serialNumber">
            <span class="label">N° de serie:</span>
            <span class="value">{{ vehicle.serialNumber }}</span>
          </p>
          <p v-if="propietario">
            <span class="label">Propietario:</span>
            <span class="value">{{ propietario.name }} {{ propietario.lastName }}</span>
          </p>
          <p v-if="transportista">
            <span class="label">Transportista:</span>
            <span class="value">{{ transportista.name }} {{ transportista.lastName }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vehicle-detail-container {
  min-height: 100vh;
  background: #181c23;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.loading, .no-vehicle {
  color: #fff;
  text-align: center;
  margin-top: 2rem;
}
.vehicle-card {
  background: #232a34;
  color: #f3f3f3;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 2.5rem 2rem;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.vehicle-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #F39C12;
  font-weight: 700;
  letter-spacing: 1px;
}
.vehicle-info p {
  margin: 0 0 1.1rem 0;
  font-size: 1.1rem;
  display: flex;
  flex-wrap: wrap;
}
.label {
  font-weight: 600;
  color: #f3f3f3;
  margin-right: 0.5rem;
}
.value {
  color: #F39C12;
  font-weight: 500;
  word-break: break-word;
}
@media (max-width: 600px) {
  .vehicle-detail-container {
    padding: 0.5rem;
  }
  .vehicle-card {
    min-width: 0;
    max-width: 100vw;
    padding: 1.2rem 0.5rem;
  }
  .vehicle-title {
    font-size: 1.3rem;
  }
}
</style>

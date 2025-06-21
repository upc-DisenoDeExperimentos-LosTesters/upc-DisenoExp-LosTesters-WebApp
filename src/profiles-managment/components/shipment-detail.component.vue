<script>
import Sidebar from "../../public/components/sidebar.component.vue";
import SidebarCarrier from "../../public/components/sidebar-carrier.vue";
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "shipment-detail",
  components: { Sidebar, SidebarCarrier },
  data() {
    return {
      shipment: null,
      vehicle: null,
      transporter: null,
      id: this.$route.params.id,
      userType: (localStorage.getItem("userType") || "").toUpperCase(),
      homeApi: new HomeApiService(),
      iamApi: new IamApiService()
    };
  },
  computed: {
    sidebarComponent() {
      return this.userType === "TRANSPORTISTA" ? "SidebarCarrier" : "Sidebar";
    }
  },
  async created() {
    // Obtener el envío
    const res = await this.homeApi.getShipmentById(this.id);
    this.shipment = res.data;

    // Obtener datos del vehículo si existen
    if (this.shipment.vehicleId) {
      try {
        const vehicleRes = await this.homeApi.getVehicleById(this.shipment.vehicleId);
        this.vehicle = vehicleRes.data;
      } catch (e) {
        this.vehicle = null;
      }
    }

    // Obtener datos del transportista si existen
    if (this.shipment.transporterId) {
      try {
        const transporterRes = await this.iamApi.getProfileById(this.shipment.transporterId);
        this.transporter = transporterRes.data;
      } catch (e) {
        this.transporter = null;
      }
    }
  }
};
</script>

<template>
  <div class="container">
    <component :is="sidebarComponent" />

    <div class="detail-content-wrapper">
      <div class="shipment-card" v-if="shipment">
        <h2 class="shipment-title">Detalle del Envío</h2>
        <div class="shipment-info">
          <p><span class="label">Destino:</span> <span class="value">{{ shipment.destiny }}</span></p>
          <p><span class="label">Descripción:</span> <span class="value">{{ shipment.description }}</span></p>
          <p><span class="label">Estado:</span> <span class="value">{{ shipment.status }}</span></p>
          <p><span class="label">Fecha de creación:</span> <span class="value">{{ new Date(shipment.createdAt).toLocaleString('es-ES') }}</span></p>
          <template v-if="vehicle">
            <div class="section-title">Vehículo asignado</div>
            <p><span class="label">Modelo:</span> <span class="value">{{ vehicle.model }}</span></p>
            <p><span class="label">Placa:</span> <span class="value">{{ vehicle.licensePlate }}</span></p>
          </template>
          <template v-else-if="shipment.vehicleModel || shipment.vehiclePlate">
            <div class="section-title">Vehículo asignado</div>
            <p><span class="label">Modelo:</span> <span class="value">{{ shipment.vehicleModel }}</span></p>
            <p><span class="label">Placa:</span> <span class="value">{{ shipment.vehiclePlate }}</span></p>
          </template>
          <template v-if="transporter">
            <div class="section-title">Transportista</div>
            <p><span class="label">Nombre:</span> <span class="value">{{ transporter.name }} {{ transporter.lastName }}</span></p>

          </template>
        </div>
      </div>
      <div v-else class="shipment-card loading-card">
        <p>Cargando...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #181c23;
 right: 100vw;
  bottom: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.detail-content-wrapper {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  margin-left: 240px;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}
@media (max-width: 860px) {
  .detail-content-wrapper {
    margin-left: 0 !important;
  }
}

.shipment-card {
  background: #232a34;
  color: #f3f3f3;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 1.5px 4px rgba(0,0,0,0.10);
  padding: 2.5rem 2rem;
  min-width: 0;
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.shipment-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #F39C12;
  font-weight: 700;
  letter-spacing: 1px;
}
.shipment-info p {
  margin: 0 0 1.1rem 0;
  font-size: 1.1rem;
  display: flex;
  flex-wrap: wrap;
}
.section-title {
  margin: 1.2rem 0 0.5rem 0;
  font-weight: 700;
  color: #F39C12;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
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
.loading-card {
  justify-content: center;
  align-items: center;
  min-height: 200px;
  text-align: center;
}

@media (max-width: 900px) {
  .shipment-card {
    max-width: 95vw;
    padding: 1.5rem 0.7rem;
  }
  .detail-content-wrapper {
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
  .detail-content-wrapper {
    padding: 0.5rem;
    min-height: 100vh;
  }
  .shipment-card {
    min-width: 0;
    max-width: 100vw;
    width: 100vw;
    padding: 1.2rem 0.5rem;
    border-radius: 0;
  }
  .shipment-title {
    font-size: 1.3rem;
  }
}
</style>

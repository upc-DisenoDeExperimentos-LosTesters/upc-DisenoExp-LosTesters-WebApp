<script>
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "home-driver",
  data() {
    return {
      name: "",
      lastName: "",
      id: Number(localStorage.getItem("userId")),
      shipments: [],
      vehicles: [],
      reports: [],
      homeApi: new HomeApiService(),
      api: new IamApiService()
    };
  },
  async created() {
    try {
      const profile = await this.api.getProfileById(this.id);
      this.name = profile.data.name;
      this.lastName = profile.data.lastName;

      const [shipmentsRes, vehiclesRes, reportsRes] = await Promise.all([
        this.homeApi.getRecentShipments(),
        this.homeApi.getVehicles(),
        this.homeApi.getReports()
      ]);

      console.log("USER ID:", this.id);
      console.log("Shipments recibidos:", shipmentsRes.data);
      console.log("Vehicles recibidos:", vehiclesRes.data);
      console.log("Reports recibidos:", reportsRes.data);

      this.shipments = shipmentsRes.data
          .filter(s => Number(s.transporterId) === this.id)
          .slice(0, 5);
      this.vehicles = vehiclesRes.data
          .filter(v => Number(v.idTransportista) === this.id)
          .slice(0, 5);
      this.reports = reportsRes.data
          .filter(r => Number(r.userId) === this.id)
          .slice(0, 5);

      console.log("Shipments filtrados:", this.shipments);
      console.log("Vehicles filtrados:", this.vehicles);
      console.log("Reports filtrados:", this.reports);
    } catch (error) {
      console.error("Error cargando datos del home:", error);
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
    },
    goToShipment(id) {
      this.$router.push(`/shipment/${id}`);
    },
    goToVehicle(id) {
      this.$router.push(`/vehicle/${id}`);
    },
    goToReport(id) {
      this.$router.push(`/report/${id}`);
    }
  }
};
</script>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>


<template>
  <div class="container-home-businessman">
    <div class="image-title-container mb-4">
      <h1>{{ t('home.welcome') }}, {{ name }} {{ lastName }}!</h1>
      <img src="../../public/assets/logo.png" class="img-home" />
    </div>

    <div class="card-grid">
      <div class="card-column" v-if="shipments.length">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-truck"></i> {{ t('home.recentShipments') }}
          </template>
          <template #content>
            <div class="horizontal-grid" :class="{ 'scrollable-x': shipments.length > 6 }">
              <div v-for="s in shipments" :key="s.id" class="entry-card grid-entry-card">
                <div class="entry-content">
                  <p><strong>{{ s.destiny }}</strong> — {{ s.status }}</p>
                  <p class="muted">{{ formatDate(s.createdAt) }}</p>
                </div>
                <pv-button text size="small" class="detail-btn" @click="goToShipment(s.id)">
                  {{ t('home.viewDetail') }}
                </pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>

      <div class="card-column" v-if="vehicles.length">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-car"></i> {{ t('home.assignedVehicles') }}
          </template>
          <template #content>
            <div class="horizontal-grid" :class="{ 'scrollable-x': vehicles.length > 6 }">
              <div v-for="v in vehicles" :key="v.id" class="entry-card grid-entry-card">
                <div class="entry-content">
                  <p><strong>{{ v.model }}</strong> — {{ v.licensePlate }}</p>
                </div>
                <pv-button text size="small" class="detail-btn" @click="goToVehicle(v.id)">
                  {{ t('home.viewDetail') }}
                </pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <div class="reports-section" v-if="reports.length">
      <pv-card class="businessman-card reports-card">
        <template #title>
          <i class="pi pi-file"></i> {{ t('home.recentReports') }}
        </template>
        <template #content>
          <div class="reports-carousel">
            <div v-for="r in reports" :key="r.id" class="entry-card report-entry-card">
              <div class="entry-content">
                <p><strong>{{ r.type }}</strong></p>
                <p>{{ r.description }}</p>
                <p class="muted">{{ formatDate(r.createdAt) }}</p>
              </div>
              <pv-button text size="small" class="detail-btn" @click="goToReport(r.id)">
                {{ t('home.viewDetail') }}
              </pv-button>
            </div>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>


<style scoped>
/* Reutilizamos estilos del businessman */
.container-home-businessman {
  position: fixed;
  top: 0;
  left: 320px;
  width: calc(100vw - 240px);
  height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  background: #181c23;
}
.image-title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.img-home {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
  align-items: flex-start;
  margin-top: 2rem;
}
.card-column {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  min-width: 320px;
}
.businessman-card {
  width: 100%;
  max-width: 380px;
  background: #232a34 !important;
  border-radius: 18px !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 1.5px 4px rgba(0,0,0,0.10);
  color: #f3f3f3 !important;
  border: none !important;
  margin: 0 auto;
}
.entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #232a34;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  color: #f3f3f3;
  border: 1px solid #232a34;
}
.entry-content {
  flex: 1;
  min-width: 0;
}
.detail-btn {
  margin-left: 1rem;
  white-space: nowrap;
  background: #F39C12 !important;
  color: #fff !important;
  border-radius: 6px !important;
  font-weight: 500;
}
.detail-btn:hover {
  background: #d35400 !important;
}
.muted {
  color: #b0b6be;
  font-size: 0.875rem;
}
.reports-section {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
}
.reports-card {
  max-width: 100%;
  width: 90vw;
  background: #232a34 !important;
}
.reports-carousel {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #F39C12 #232a34;
}
.report-entry-card {
  min-width: 260px;
  max-width: 320px;
  flex: 0 0 auto;
  background: #232a34;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  color: #f3f3f3;
  border: 1px solid #232a34;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.report-entry-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  background: #252d38;
}
</style>

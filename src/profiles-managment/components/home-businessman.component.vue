<script>
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";
import { useRouter } from "vue-router";

export default {
  name: "home-businessman",
  data() {
    return {
      name: '',
      lastName: '',
      type: '',
      id: this.$route.params.id,
      shipments: [],
      vehicles: [],
      reports: [],
      transporters: [],
      userMap: {},
      loadingShipments: true,
      loadingVehicles: true,
      loadingReports: true,
      loadingUser: true,
      api: new IamApiService(),
      homeApi: new HomeApiService()
    };
  },
  async created() {
    const userRes = await this.api.getProfileById(this.id);
    this.name = userRes.data.name;
    this.lastName = userRes.data.lastName;
    this.type = userRes.data.type;
    this.loadingUser = false;

    const [shipmentsRes, vehiclesRes, reportsRes, usersRes] = await Promise.all([
      this.homeApi.getRecentShipments(),
      this.homeApi.getVehicles(),
      this.homeApi.getReports(),
      this.api.getAllProfiles()
    ]);

    this.shipments = shipmentsRes.data.slice(0, 5);
    this.vehicles = vehiclesRes.data.slice(0, 5);
    this.reports = reportsRes.data.slice(0, 5);
    this.transporters = usersRes.data;
    this.userMap = Object.fromEntries(this.transporters.map(u => [u.id, `${u.name} ${u.lastName}`]));

    this.loadingShipments = false;
    this.loadingVehicles = false;
    this.loadingReports = false;
  },
  methods: {
    getUserName(id) {
      return this.userMap[id] || "Desconocido";
    },
    formatDate(date) {
      return new Date(date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    },
    goToReport(id) {
      this.$router.push(`/report/${id}`);
    },
    goToShipment(id) {
      this.$router.push(`/shipment/${id}`);
    },
    goToVehicle(id) {
      this.$router.push(`/vehicle/${id}`);
    }
  }
};
</script>


<template>
  <div class="container-home-businessman">
    <div class="image-title-container mb-4">
      <h1>¡Bienvenido, {{ name }} {{ lastName }}!</h1>
      <img src="../../public/assets/logo.png" class="img-home" />
    </div>

    <div class="card-grid">
      <div class="card-column">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-truck"></i> Últimos Envíos
          </template>
          <template #content>
            <div v-if="loadingShipments">
              <div class="skeleton-entry" v-for="n in 3" :key="'skeleton-s-' + n"></div>
            </div>
            <div v-else class="horizontal-grid" :class="{ 'scrollable-x': shipments.length > 6 }">
              <div v-for="s in shipments" :key="s.id" class="entry-card grid-entry-card">
                <div class="entry-content">
                  <p><strong>{{ s.destiny }}</strong> — {{ s.status }}</p>
                  <p class="muted">{{ formatDate(s.createdAt) }}</p>
                </div>
                <pv-button text size="small" class="detail-btn" @click="goToShipment(s.id)">Ver Detalle</pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>

      <div class="card-column">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-car"></i> Vehículos Registrados
          </template>
          <template #content>
            <div v-if="loadingVehicles">
              <div class="skeleton-entry" v-for="n in 3" :key="'skeleton-v-' + n"></div>
            </div>
            <div v-else class="horizontal-grid" :class="{ 'scrollable-x': vehicles.length > 6 }">
              <div v-for="v in vehicles" :key="v.id" class="entry-card grid-entry-card">
                <div class="entry-content">
                  <p><strong>{{ v.model }}</strong> — {{ v.licensePlate }}</p>
                </div>
                <pv-button text size="small" class="detail-btn" @click="goToVehicle(v.id)">Ver Detalle</pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <div class="reports-section">
      <pv-card class="businessman-card reports-card">
        <template #title>
          <i class="pi pi-file"></i> Reportes Recientes
        </template>
        <template #content>
          <div v-if="loadingReports">
            <div class="skeleton-entry" v-for="n in 3" :key="'skeleton-r-' + n"></div>
          </div>
          <div v-else class="reports-carousel">
            <div v-for="r in reports" :key="r.id" class="entry-card report-entry-card">
              <div class="entry-content">
                <p><strong>{{ r.type }}</strong></p>
                <p>{{ r.description }}</p>
                <p class="muted">{{ formatDate(r.createdAt) }} — <em>{{ getUserName(r.userId) }}</em></p>
              </div>
              <pv-button text size="small" class="detail-btn" @click="goToReport(r.id)">Ver Detalle</pv-button>
            </div>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>


<style scoped>
.container-home-businessman {
  position: fixed;
  top: 0;
  left: 320px;
  width: calc(100vw - 240px);
  height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  background: #181c23;
  transition: left 0.3s, width 0.3s;
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

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #232a34;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  transition: box-shadow 0.2s, background 0.2s;
  color: #f3f3f3;
  border: 1px solid #232a34;
}

.entry-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  background: #252d38;
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
  transition: background 0.2s;
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

/* Scrollbar estilizado para la sección de reportes */
.reports-carousel::-webkit-scrollbar {
  height: 8px;
}
.reports-carousel::-webkit-scrollbar-thumb {
  background: #F39C12;
  border-radius: 4px;
}
.reports-carousel::-webkit-scrollbar-track {
  background: #232a34;
}

/* Responsive */
@media (max-width: 1100px) {
  .card-grid {
    flex-direction: column;
    align-items: center;
  }
  .card-column {
    max-width: 100%;
    min-width: 0;
  }
  .reports-card {
    width: 100vw;
    max-width: 100vw;
  }
}

@media (max-width: 860px) {
  .container-home-businessman {
    left: 0 !important;
    width: 100vw !important;
    padding-left: 0 !important;
  }
  .reports-card {
    width: 100vw;
    max-width: 100vw;
  }
}

@media (max-width: 600px) {
  .container-home-businessman {
    padding: 0.5rem;
  }
  .image-title-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  .card-column {
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }
  .businessman-card {
    max-width: 100%;
  }
  .entry-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
  }
  .detail-btn {
    margin-left: 0;
    align-self: flex-end;
  }
  .reports-card {
    width: 100vw;
    max-width: 100vw;
  }
  .report-entry-card {
    min-width: 220px;
    max-width: 90vw;
  }


}

.skeleton-entry {
  width: 100%;
  height: 80px;
  background: linear-gradient(90deg, #2c333f 25%, #3d4451 50%, #2c333f 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 12px;
  margin-bottom: 1rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>

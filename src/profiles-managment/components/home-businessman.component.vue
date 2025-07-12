<script>
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
      isDarkMode: true,
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
  mounted() {
    if (!localStorage.getItem("tutorial_shown_businessman")) {
      this.startTutorial();
      localStorage.setItem("tutorial_shown_businessman", "true");
    }
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
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
    },
    startTutorial() {
      driver({
        showProgress: true,
        steps: [
          {
            element: ".theme-toggle-btn",
            popover: {
              title: "Cambiar tema",
              description: "Haz clic aquí para cambiar entre modo claro y oscuro.",
              side: "left"
            }
          },
          {
            element: ".businessman-card:nth-of-type(1)",
            popover: {
              title: "Tus envíos",
              description: "Aquí ves los últimos envíos.",
              side: "top"
            }
          },
          {
            element: ".businessman-card:nth-of-type(2)",
            popover: {
              title: "Tus vehículos",
              description: "Aquí ves los vehículos registrados.",
              side: "top"
            }
          },
          {
            element: ".reports-card",
            popover: {
              title: "Reportes recientes",
              description: "Revisa tus reportes recientes.",
              side: "top"
            }
          }
        ]
      }).drive();
    }
  }
};
</script>



<template>
  <div :class="['container-home-businessman', isDarkMode ? 'dark-theme' : 'light-theme']">
    <div class="top-buttons">
      <button class="theme-toggle-btn" @click="toggleTheme">
        {{ isDarkMode ? 'Modo Claro' : 'Modo Oscuro' }}
      </button>
      <button class="help-btn" @click="startTutorial">?</button>
    </div>

    <div class="image-title-container mb-4">
      <h1>¡Bienvenido, {{ name }} {{ lastName }}!</h1>
      <img src="../../public/assets/logo.png" class="img-home" />
    </div>

    <div class="card-grid">
      <!-- Envíos -->
      <div class="card-column">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-truck"></i> Últimos Envíos
          </template>
          <template #content>
            <div v-if="loadingShipments">
              <div class="skeleton-entry" v-for="n in 3" :key="'skeleton-s-' + n"></div>
            </div>
            <div v-else class="horizontal-grid">
              <div v-for="s in shipments" :key="s.id" class="entry-card">
                <div class="entry-content">
                  <p><strong>{{ s.destiny }}</strong> — {{ s.status }}</p>
                  <p class="muted">{{ formatDate(s.createdAt) }}</p>
                </div>
                <pv-button text size="small" class="detail-btn" @click="goToShipment(s.id)">
                  Ver Detalle
                </pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>

      <!-- Vehículos -->
      <div class="card-column">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-car"></i> Vehículos Registrados
          </template>
          <template #content>
            <div v-if="loadingVehicles">
              <div class="skeleton-entry" v-for="n in 3" :key="'skeleton-v-' + n"></div>
            </div>
            <div v-else class="horizontal-grid">
              <div v-for="v in vehicles" :key="v.id" class="entry-card">
                <div class="entry-content">
                  <p><strong>{{ v.model }}</strong> — {{ v.licensePlate }}</p>
                </div>
                <pv-button text size="small" class="detail-btn" @click="goToVehicle(v.id)">
                  Ver Detalle
                </pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <!-- Reportes -->
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
            <div v-for="r in reports" :key="r.id" class="entry-card">
              <div class="entry-content">
                <p><strong>{{ r.type }}</strong></p>
                <p>{{ r.description }}</p>
                <p class="muted">{{ formatDate(r.createdAt) }} — <em>{{ getUserName(r.userId) }}</em></p>
              </div>
              <pv-button text size="small" class="detail-btn" @click="goToReport(r.id)">
                Ver Detalle
              </pv-button>
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
  transition: background 0.3s, color 0.3s;
}
.dark-theme {
  background: #181c23;
  color: #f3f3f3;
}
.light-theme {
  background: #f3f3f3;
  color: #181c23;
}

.top-buttons {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  z-index: 1000;
}
.theme-toggle-btn,
.help-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.help-btn {
  font-size: 1.1rem;
  padding: 0.4rem 0.7rem;
}

.img-home {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.image-title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
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
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  border: none;
  margin: 0 auto;
  background: #fff;
  color: #000;
}
.dark-theme .businessman-card {
  background: #232a34;
  color: #f3f3f3;
}
.entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  border: 1px solid #ccc;
}
.entry-content {
  flex: 1;
  min-width: 0;
}
.detail-btn {
  margin-left: 1rem;
  white-space: nowrap;
  background: #f39c12;
  color: #fff;
  border-radius: 6px;
  font-weight: 500;
}
.detail-btn:hover {
  background: #d35400;
}
.muted {
  font-size: 0.875rem;
  color: #999;
}
.reports-section {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
}
.reports-card {
  max-width: 100%;
  width: 90vw;
}
.reports-carousel {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}
.skeleton-entry {
  width: 100%;
  height: 80px;
  background: linear-gradient(90deg, #ccc 25%, #ddd 50%, #ccc 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 12px;
  margin-bottom: 1rem;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>

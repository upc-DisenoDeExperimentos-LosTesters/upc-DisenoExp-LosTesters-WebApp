<script>
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
      loadingShipments: true,
      loadingVehicles: true,
      loadingReports: true,
      isDarkMode: true,
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

      this.shipments = shipmentsRes.data
          .filter(s => Number(s.transporterId) === this.id)
          .slice(0, 5);
      this.vehicles = vehiclesRes.data
          .filter(v => Number(v.idTransportista) === this.id)
          .slice(0, 5);
      this.reports = reportsRes.data
          .filter(r => Number(r.userId) === this.id)
          .slice(0, 5);
    } catch (error) {
      console.error("Error cargando datos del home:", error);
    } finally {
      this.loadingShipments = false;
      this.loadingVehicles = false;
      this.loadingReports = false;
    }
  },
  mounted() {
    if (!localStorage.getItem("tutorial_shown")) {
      this.startTutorial();
      localStorage.setItem("tutorial_shown", "true");
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString("es-ES", {
        dateStyle: "short",
        timeStyle: "short"
      });
    },
    goToShipment(id) {
      this.$router.push(`/shipment/${id}`);
    },
    goToVehicle(id) {
      this.$router.push(`/vehicle/${id}`);
    },
    goToReport(id) {
      this.$router.push(`/report/${id}`);
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
              title: this.$t("home.themeTitle"),
              description: this.$t("home.themeDescription"),
              side: "left"
            }
          },
          {
            element: ".businessman-card:nth-of-type(1)",
            popover: {
              title: this.$t("home.shipmentsTitle"),
              description: this.$t("home.shipmentsDescription"),
              side: "top"
            }
          },
          {
            element: ".businessman-card:nth-of-type(2)",
            popover: {
              title: this.$t("home.vehiclesTitle"),
              description: this.$t("home.vehiclesDescription"),
              side: "top"
            }
          },
          {
            element: ".reports-card",
            popover: {
              title: this.$t("home.reportsTitle"),
              description: this.$t("home.reportsDescription"),
              side: "top"
            }
          }
        ]
      }).drive();
    }
  }
};
</script>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>



<template>
  <div :class="['container-home-businessman', isDarkMode ? 'dark-theme' : 'light-theme']">
    <div class="top-buttons">
      <button class="theme-toggle-btn" @click="toggleTheme">
        {{ isDarkMode ? t('home.lightMode') : t('home.darkMode') }}
      </button>
      <button class="help-btn" @click="startTutorial">?</button>
    </div>

    <div class="image-title-container mb-4">
      <h1>{{ t('home.welcome') }}, {{ name }} {{ lastName }}!</h1>
      <img src="../../public/assets/logo.png" class="img-home" />
    </div>

    <div class="card-grid">
      <div class="card-column">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-truck"></i> {{ t('home.recentShipments') }}
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
                  {{ t('home.viewDetail') }}
                </pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>

      <div class="card-column">
        <pv-card class="businessman-card">
          <template #title>
            <i class="pi pi-car"></i> {{ t('home.assignedVehicles') }}
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
                  {{ t('home.viewDetail') }}
                </pv-button>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <div class="reports-section">
      <pv-card class="businessman-card reports-card">
        <template #title>
          <i class="pi pi-file"></i> {{ t('home.recentReports') }}
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

/* Botones de la parte superior */
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

/* Otros estilos */
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



<script>
import Sidebar from "../../public/components/sidebar.component.vue";
import { HomeApiService } from "../services/home-api.service.js";
import http from "../../shared/services/http-common.js";
import SidebarCarrier from "../../public/components/sidebar-carrier.vue";

function containsForbiddenWords(text) {
  const forbiddenWords = [
    "trump", "hitler", "putin", "bin laden", "al qaeda", "isis", "taliban", "nazi", "terrorist", "osama",
    "dictator", "satan", "lucifer", "devil", "fuck", "shit", "bitch", "asshole", "bastard", "nigger",
    "slut", "whore", "rape", "killer", "murderer", "pedo", "pedophile", "pakistan", "iran", "iraq",
    "hamas", "hezbollah", "hitman", "cartel", "mafia", "drugs", "cocaine", "meth", "narco", "gang",
    "fascist", "racist"
  ];
  const lowerText = text.toLowerCase();
  return forbiddenWords.some(word => lowerText.includes(word));
}

export default {
  name: "vehicles-carrier-view",
  components: { SidebarCarrier, Sidebar },
  data() {
    return {
      vehicles: [],
      loading: true,
      showModal: false,
      isEditing: false,
      form: {
        id: null,
        licensePlate: "",
        model: "",
        serialNumber: "",
        idPropietario: "",
        idTransportista: ""
      },
      error: "",
      homeApi: new HomeApiService(),
      userId: Number(localStorage.getItem("userId"))
    };
  },
  computed: {
    filteredVehicles() {
      return this.vehicles.filter(v => v.idTransportista === this.userId);
    }
  },
  async created() {
    await this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      this.loading = true;
      try {
        const res = await this.homeApi.getVehicles();
        this.vehicles = Array.isArray(res.data) ? res.data : [];
      } finally {
        this.loading = false;
      }
    },
    goToVehicleDetail(id) {
      this.$router.push(`/vehicle/${id}`);
    },
    openModal(vehicle = null) {
      this.isEditing = !!vehicle;
      this.form = {
        id: vehicle?.id || null,
        licensePlate: vehicle?.licensePlate || "",
        model: vehicle?.model || "",
        serialNumber: vehicle?.serialNumber || "",
        idPropietario: this.userId,
        idTransportista: this.userId
      };
      this.error = "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async submitVehicle() {
      this.error = "";
      const { licensePlate, model, serialNumber } = this.form;
      if (!licensePlate || !model || !serialNumber) {
        this.error = this.$t('vehicles.errors.incomplete');
        return;
      }
      if (containsForbiddenWords(licensePlate) || containsForbiddenWords(model)) {
        this.error = this.$t('vehicles.errors.forbidden');
        return;
      }
      try {
        if (this.isEditing && this.form.id !== null) {
          await http.put(`/vehicles/${this.form.id}`, this.form);
        } else {
          await http.post("/vehicles", this.form);
        }
        this.showModal = false;
        await this.fetchVehicles();
      } catch (e) {
        this.error = this.$t('vehicles.errors.save');
      }
    },
    async deleteVehicle(id) {
      if (confirm(this.$t('vehicles.confirmDelete'))) {
        try {
          await http.delete(`/vehicles/${id}`);
          await this.fetchVehicles();
        } catch {
          alert(this.$t('vehicles.errors.delete'));
        }
      }
    }
  }
};
</script>


<template>
  <div class="container">
    <sidebar-carrier />
    <div class="vehicle-list-container">
      <div class="header-row">
        <h2 class="title">{{ $t('vehicles.myVehicles') }}</h2>
      </div>

      <div v-if="loading" class="vehicle-grid">
        <div v-for="n in 3" :key="'skeleton-' + n" class="vehicle-card skeleton-card"></div>
      </div>

      <div v-else-if="filteredVehicles.length === 0" class="no-vehicles">
        {{ $t('vehicles.noVehicles') }}
      </div>

      <div v-else class="vehicle-grid">
        <div v-for="v in filteredVehicles" :key="v.id" class="vehicle-card">
          <div class="vehicle-info">
            <p><strong>{{ $t('vehicles.model') }}:</strong> {{ v.model }}</p>
            <p><strong>{{ $t('vehicles.plate') }}:</strong> {{ v.licensePlate }}</p>
            <p><strong>{{ $t('vehicles.serialNumber') }}:</strong> {{ v.serialNumber }}</p>
          </div>
          <div class="vehicle-actions">
            <pv-button class="detail-btn" text size="small" @click="goToVehicleDetail(v.id)"> {{ $t('vehicles.viewDetail') }}</pv-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  background: #181c23;
}

.vehicle-list-container {
  flex: 1 1 0;
  padding: 2rem;
  min-height: 100vh;
  margin-left: 240px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.title {
  color: #F39C12;
  margin: 0;
}

.loading,
.no-vehicles {
  color: #fff;
  text-align: center;
  margin-top: 2rem;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.vehicle-card {
  background: #232a34;
  color: #f3f3f3;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  padding: 1.5rem 1.2rem;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.vehicle-info p {
  margin: 0 0 0.7rem 0;
  font-size: 1.1rem;
}

.detail-btn {
  margin-top: 1rem;
  background: #F39C12 !important;
  color: #fff !important;
  border-radius: 6px !important;
  font-weight: 500;
}

.detail-btn:hover {
  background: #d35400 !important;
}

.vehicle-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Skeleton Card */
.skeleton-card {
  height: 160px;
  background: linear-gradient(90deg, #2f3440 25%, #444b58 50%, #2f3440 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 14px;
  width: 100%;
  max-width: 320px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Responsive */
@media (max-width: 860px) {
  .vehicle-list-container {
    margin-left: 0 !important;
    padding: 1rem;
  }

  .header-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .vehicle-list-container {
    padding: 0.5rem;
  }

  .vehicle-card {
    padding: 1rem 0.5rem;
    max-width: 100vw;
  }

  .skeleton-card {
    max-width: 100vw;
  }
}
</style>


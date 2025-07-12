<script>
import Sidebar from "../../public/components/sidebar.component.vue";
import { HomeApiService } from "../services/home-api.service.js";
import http from "../../shared/services/http-common.js";

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
  name: "vehicle-list",
  components: { Sidebar },
  data() {
    return {
      vehicles: [],
      transportistas: [],
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
      userId: Number(localStorage.getItem("userId")),
      userType: (localStorage.getItem("userType") || "").toUpperCase()
    };
  },
  computed: {
    filteredVehicles() {
      if (this.userType === "GERENTE") {
        return this.vehicles.filter(v => v.idPropietario === this.userId);
      } else if (this.userType === "TRANSPORTISTA") {
        return this.vehicles.filter(v => v.idTransportista === this.userId);
      }
      return [];
    }
  },
  async created() {
    await this.fetchVehicles();
    if (this.userType === "GERENTE") {
      await this.fetchTransportistas();
    }
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
    async fetchTransportistas() {
      try {
        const res = await http.get("/profile/transportistas");
        this.transportistas = res.data;
      } catch {
        this.error = "No se pudo cargar la lista de transportistas.";
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
        idTransportista: this.userType === "TRANSPORTISTA"
            ? this.userId
            : vehicle?.idTransportista || ""
      };
      this.error = "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async submitVehicle() {
      this.error = "";
      const { licensePlate, model, serialNumber, idPropietario, idTransportista } = this.form;
      if (!licensePlate || !model || !serialNumber || !idPropietario || !idTransportista) {
        this.error = "Completa todos los campos.";
        return;
      }
      if (containsForbiddenWords(licensePlate) || containsForbiddenWords(model)) {
        this.error = "El vehículo contiene palabras no permitidas.";
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
        this.error = "Error al guardar el vehículo.";
      }
    },
    async deleteVehicle(id) {
      if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
        try {
          await http.delete(`/vehicles/${id}`);
          await this.fetchVehicles();
        } catch {
          alert("Error al eliminar el vehículo.");
        }
      }
    }
  }
};
</script>

<template>
  <div class="container">
    <sidebar />
    <div class="vehicle-list-container">
      <div class="header-row">
        <h2 class="title">Vehículos Registrados</h2>
        <pv-button class="add-btn" icon="pi pi-plus" label="Agregar Vehículo" @click="openModal" />
      </div>

      <div v-if="loading" class="vehicle-grid">
        <div v-for="n in 3" :key="'skeleton-v-' + n" class="vehicle-card skeleton-card"></div>
      </div>

      <div v-else-if="filteredVehicles.length === 0" class="no-vehicles">
        No hay vehículos registrados.
      </div>

      <div v-else class="vehicle-grid">
        <div v-for="v in filteredVehicles" :key="v.id" class="vehicle-card">
          <div class="vehicle-info">
            <p><strong>Modelo:</strong> {{ v.model }}</p>
            <p><strong>Placa:</strong> {{ v.licensePlate }}</p>
            <p><strong>N° de serie:</strong> {{ v.serialNumber }}</p>
          </div>
          <div class="vehicle-actions">
            <pv-button class="detail-btn" text size="small" @click="goToVehicleDetail(v.id)">Ver Detalle</pv-button>
            <pv-button class="edit-btn" text size="small" @click="openModal(v)">Editar</pv-button>
            <pv-button class="delete-btn" text size="small" @click="deleteVehicle(v.id)">Eliminar</pv-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar vehículo -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Registrar Vehículo</h3>
        <form @submit.prevent="submitVehicle">
          <label>Modelo
            <input v-model="form.model" type="text" required />
          </label>
          <label>Placa
            <input v-model="form.licensePlate" type="text" required />
          </label>
          <label>N° de serie
            <input v-model="form.serialNumber" type="text" required />
          </label>
          <label>ID Propietario
            <input v-model="form.idPropietario" type="number" required readonly />
          </label>
          <label>ID Transportista
            <template v-if="userType === 'GERENTE'">
              <select v-model="form.idTransportista" required>
                <option disabled value="">Selecciona un transportista</option>
                <option v-for="t in transportistas" :key="t.id" :value="t.id">
                  {{ t.name }} {{ t.lastName }}
                </option>
              </select>
            </template>
            <template v-else>
              <input v-model="form.idTransportista" type="number" required readonly />
            </template>
          </label>
          <div class="modal-actions">
            <button type="button" @click="closeModal">Cancelar</button>
            <button type="submit">Registrar</button>
          </div>
          <div v-if="error" class="error">{{ error }}</div>
        </form>
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

.add-btn {
  background: #F39C12 !important;
  color: #fff !important;
  border-radius: 6px !important;
  font-weight: 500;
  border: none;
}

.add-btn:hover {
  background: #d35400 !important;
}

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
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.65);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: #232a34;
  color: #fff;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  min-width: 320px;
  max-width: 95vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-card h3 {
  color: #F39C12;
  margin-bottom: 1rem;
}

.modal-card label {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.7rem;
  font-weight: 500;
}

.modal-card input {
  margin-top: 0.3rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #181c23;
  color: #fff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-actions button[type="button"] {
  background: #444;
}

.modal-actions button:hover {
  background: #d35400;
}

.error {
  color: #ff7675;
  margin-top: 0.5rem;
  font-size: 1rem;
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

  .modal-card {
    min-width: 0;
    padding: 1rem 0.5rem;
  }

  .skeleton-card {
    max-width: 100vw;
  }
}
</style>

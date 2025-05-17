<script>
import Sidebar from "../../public/components/sidebar.component.vue";
import { HomeApiService } from "../services/home-api.service.js";
import http from "../../shared/services/http-common.js";

export default {
  name: "vehicle-list",
  components: { Sidebar },
  data() {
    return {
      vehicles: [],
      loading: true,
      showModal: false,
      form: {
        licensePlate: "",
        model: "",
        serialNumber: "",
        idPropietario: "",
        idTransportista: ""
      },
      error: "",
      homeApi: new HomeApiService(),
      userId: Number(localStorage.getItem('id')),
      userType: (localStorage.getItem('userType') || '').toUpperCase()
    };
  },
  computed: {
    filteredVehicles() {
      // Mostrar todos los vehículos para GERENTE, solo los del transportista para TRANSPORTISTA
      if (this.userType === "GERENTE") {
        return this.vehicles;
      } else if (this.userType === "TRANSPORTISTA") {
        return this.vehicles.filter(v => v.idTransportista === this.userId);
      }
      return [];
    }
  },
  async created() {
    await this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      this.loading = true;
      try {
        // Asegúrate de que el endpoint sea correcto y que getVehicles() devuelva la lista
        const res = await this.homeApi.getVehicles();
        this.vehicles = Array.isArray(res.data) ? res.data : [];
      } finally {
        this.loading = false;
      }
    },
    goToVehicleDetail(id) {
      // Usa la ruta absoluta para evitar conflictos con rutas anidadas
      this.$router.push(`/vehicle/${id}`);
    },
    openModal() {
      this.form = {
        licensePlate: "",
        model: "",
        serialNumber: "",
        idPropietario: this.userId,
        idTransportista: this.userType === "TRANSPORTISTA" ? this.userId : ""
      };
      this.error = "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async submitVehicle() {
      this.error = "";
      if (!this.form.licensePlate || !this.form.model || !this.form.serialNumber || !this.form.idPropietario || !this.form.idTransportista) {
        this.error = "Completa todos los campos.";
        return;
      }
      try {
        await http.post("/vehicle", this.form);
        this.showModal = false;
        await this.fetchVehicles();
      } catch (e) {
        this.error = "Error al registrar el vehículo.";
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
      <div v-if="loading" class="loading">Cargando...</div>
      <div v-else-if="filteredVehicles.length === 0" class="no-vehicles">No hay vehículos registrados.</div>
      <div v-else class="vehicle-grid">
        <div v-for="v in filteredVehicles" :key="v.id" class="vehicle-card">
          <div class="vehicle-info">
            <p><strong>Modelo:</strong> {{ v.model }}</p>
            <p><strong>Placa:</strong> {{ v.licensePlate }}</p>
            <p><strong>N° de serie:</strong> {{ v.serialNumber }}</p>
          </div>
          <pv-button class="detail-btn" text size="small" @click="goToVehicleDetail(v.id)">Ver Detalle</pv-button>
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
            <input v-model="form.idPropietario" type="number" required :readonly="userType==='GERENTE' ? false : true" />
          </label>
          <label>ID Transportista
            <input v-model="form.idTransportista" type="number" required :readonly="userType==='TRANSPORTISTA'" />
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
.loading, .no-vehicles {
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

/* Modal styles */
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
}
</style>

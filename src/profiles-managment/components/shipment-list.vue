<script>
import Sidebar from "../../public/components/sidebar.component.vue";
import http from "../../shared/services/http-common";
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

function containsForbiddenWords(text) {
  const forbiddenWords = [
    "trump", "hitler", "putin", "bin laden", "al qaeda",
    "isis", "taliban", "nazi", "terrorist", "osama",
    "dictator", "satan", "lucifer", "devil", "fuck",
    "shit", "bitch", "asshole", "bastard", "nigger",
    "slut", "whore", "rape", "killer", "murderer",
    "pedo", "pedophile", "pakistan", "iran", "iraq",
    "hamas", "hezbollah", "hitman", "cartel", "mafia",
    "drugs", "cocaine", "meth", "narco", "gang",
    "fascist", "racist"
  ];

  const lowerText = text.toLowerCase();
  return forbiddenWords.some(word => lowerText.includes(word));
}


export default {
  name: "shipment-list",
  components: { Sidebar, Card, Button, Dropdown },
  data() {
    return {
      shipments: [],
      vehicles: [],
      showModal: false,
      form: {
        destiny: "",
        description: "",
        vehicleId: "",
        status: "pendiente",
        userId: Number(localStorage.getItem("userId")),
      },
      error: "",
      userId: Number(localStorage.getItem("userId")),
    };
  },
  computed: {
    myShipments() {
      return this.shipments.filter(s => s.userId === this.userId);
    }
  },
  async created() {
    await this.fetchShipments();
    await this.fetchVehicles();
  },
  methods: {
    async fetchShipments() {
      try {
        const res = await http.get("/shipments");
        this.shipments = res.data;
      } catch {
        this.error = "Error al obtener envíos.";
      }
    },
    async fetchVehicles() {
      try {
        const res = await http.get("/vehicles");
        // 🔧 Filtra por idPropietario (no idTransportista)
        this.vehicles = res.data.filter(v => v.idPropietario === this.userId);
      } catch {
        this.error = "No se pudieron cargar los vehículos disponibles.";
      }
    },
    async updateShipmentStatus(id, newStatus) {
      try {
        await http.patch(`/shipments/${id}/status`, { status: newStatus });
        await this.fetchShipments();
      } catch {
        alert("No se pudo actualizar el estado.");
      }
    },
    openModal() {
      this.form = {
        destiny: "",
        description: "",
        vehicleId: "",
        status: "pendiente",
        userId: this.userId
      };
      this.error = "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async submitShipment() {
      const { destiny, description } = this.form;

      if (!destiny || !description || !this.form.vehicleId) {
        this.error = "Completa todos los campos.";
        return;
      }

      if (containsForbiddenWords(destiny) || containsForbiddenWords(description)) {
        this.error = "Tu texto contiene palabras prohibidas.";
        return;
      }

      try {
        await http.post("/shipments", this.form);
        this.showModal = false;
        await this.fetchShipments();
      } catch {
        this.error = "Error al registrar envío.";
      }
    },
    async deleteShipment(id) {
      if (confirm("¿Eliminar este envío?")) {
        try {
          await http.delete(`/shipments/${id}`);
          await this.fetchShipments();
        } catch {
          alert("No se pudo eliminar el envío.");
        }
      }
    },
    goToDetail(id) {
      this.$router.push(`/shipment/${id}`);
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    }
  }
};
</script>


<template>
  <div class="container">
    <sidebar />
    <div class="content">
      <h2 class="title">Mis Envíos</h2>
      <Button label="Nuevo Envío" icon="pi pi-plus" class="p-button-success" @click="openModal" />

      <div v-if="myShipments.length === 0" class="no-shipments">No tienes envíos registrados.</div>

      <div v-else class="shipments-list">
        <Card v-for="s in myShipments" :key="s.id" class="shipment-card">
          <template #title>Destino: {{ s.destiny }}</template>
          <template #content>
            <p><strong>Descripción:</strong> {{ s.description }}</p>
            <p><strong>Estado:</strong> {{ s.status }}</p>
            <p><strong>Fecha:</strong> {{ formatDate(s.createdAt) }}</p>
            <Button
                label="Detalle"
                class="p-button-info p-button-sm btn-space"
                @click="goToDetail(s.id)"
            />
            <Button
                label="Eliminar"
                class="p-button-danger p-button-sm btn-space"
                @click="deleteShipment(s.id)"
            />
            <Button
                :label="s.status === 'pendiente' ? 'Marcar como Terminado' : 'Marcar como Pendiente'"
                class="p-button-warning p-button-sm btn-space"
                @click="updateShipmentStatus(s.id, s.status === 'pendiente' ? 'terminado' : 'pendiente')"
            />

          </template>
        </Card>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card">
          <h3>Registrar Envío</h3>
          <form @submit.prevent="submitShipment">
            <label>Destino
              <input v-model="form.destiny" required />
            </label>
            <label>Descripción
              <input v-model="form.description" required />
            </label>
            <label>Vehículo
              <select v-model="form.vehicleId" required>
                <option disabled value="">Selecciona un vehículo</option>
                <option v-for="v in vehicles" :key="v.id" :value="v.id">
                  {{ v.model }} - {{ v.licensePlate }}
                </option>
              </select>
            </label>
            <label>Estado
              <select v-model="form.status" required>
                <option value="pendiente">pendiente</option>
                <option value="terminado">terminado</option>
              </select>
            </label>
            <div v-if="error" class="error">{{ error }}</div>
            <div class="modal-actions">
              <button type="submit">Guardar</button>
              <button type="button" @click="closeModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  display: flex;
}

.content {
  flex: 1;
  padding: 2rem;
  margin-left: 240px; /* espacio para sidebar */
}

.title {
  color: #F39C12;
  margin-bottom: 1.5rem;
}

.shipments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipment-card {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-card {
  background: #34495e;
  padding: 2rem;
  border-radius: 8px;
  color: #fff;
  min-width: 320px;
  width: 90%;
  max-width: 500px;
}

.modal-card label {
  display: block;
  margin-top: 1rem;
}

.modal-card input, .modal-card select {
  width: 100%;
  margin-top: 0.3rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.error {
  color: #e74c3c;
  margin-top: 0.5rem;
}
.shipments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

.shipment-card {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  width: calc(50% - 1rem); /* 2 por fila con margen */
  min-width: 320px;
}

.btn-space {
  margin-right: 0.5rem;
  margin-top: 0.5rem;
}


</style>

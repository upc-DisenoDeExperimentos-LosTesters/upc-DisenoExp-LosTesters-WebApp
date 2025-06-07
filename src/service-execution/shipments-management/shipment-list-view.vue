<template>
  <div class="shipment-list-view">
    <Sidebar />
    <div class="content">
      <h1>Mis Envíos</h1>
      <div v-if="loading" class="loading">Cargando...</div>
      <div v-else>
        <div v-if="filteredShipments.length === 0" class="no-shipments">No tienes envíos registrados.</div>
        <div v-else class="shipment-grid">
          <div class="shipment-card" v-for="shipment in filteredShipments" :key="shipment.id">
            <div class="shipment-title">{{ shipment.destiny }}</div>
            <div class="shipment-desc">{{ shipment.description }}</div>
            <div class="shipment-meta">
              <span><strong>Estado:</strong> {{ shipment.status }}</span>
              <span><strong>Fecha:</strong> {{ formatDate(shipment.createdAt) }}</span>
              <span><strong>Vehículo:</strong> {{ shipment.vehicleModel }} ({{ shipment.vehiclePlate }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../../public/components/sidebar.component.vue';
import { HomeApiService } from '../../profiles-managment/services/home-api.service.js';

export default {
  name: "shipment-list-view",
  components: { Sidebar },
  data() {
    return {
      shipments: [],
      loading: true,
      userId: null
    };
  },
  computed: {
    filteredShipments() {
      // Filtra los envíos por el usuario conectado
      return this.shipments.filter(s => String(s.userId) === String(this.userId));
    }
  },
  async created() {
    this.userId = localStorage.getItem("userId");
    const api = new HomeApiService();
    try {
      const res = await api.getRecentShipments();
      // Asegura que siempre sea un array
      if (Array.isArray(res.data)) {
        this.shipments = res.data;
      } else if (res.data && typeof res.data === "object") {
        this.shipments = Object.values(res.data);
      } else {
        this.shipments = [];
      }
    } catch (e) {
      this.shipments = [];
    }
    this.loading = false;
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString('es-ES');
    }
  }
};
</script>

<style scoped>
.shipment-list-view {
  display: flex;
  min-height: 100vh;
  background: #181c23;
}
.content {
  flex: 1;
  padding: 2rem;
  color: #fff;
}
.loading, .no-shipments {
  color: #fff;
  text-align: center;
  margin-top: 2rem;
}
.shipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}
.shipment-card {
  background: #232a34;
  color: #f3f3f3;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.shipment-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #F39C12;
  margin-bottom: 0.5rem;
}
.shipment-desc {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.shipment-meta {
  font-size: 0.95rem;
  color: #b0b6be;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
@media (max-width: 600px) {
  .content {
    padding: 0.5rem;
  }
  .shipment-card {
    padding: 1rem 0.5rem;
    min-width: 0;
    max-width: 100vw;
  }
}
</style>

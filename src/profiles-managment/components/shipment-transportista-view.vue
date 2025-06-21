<script>
import Sidebar from "../../public/components/sidebar.component.vue";
import http from "../../shared/services/http-common";
import Card from 'primevue/card';
import Button from 'primevue/button';
import SidebarCarrier from "../../public/components/sidebar-carrier.vue";

export default {
  name: "shipment-transportista-view",
  components: { SidebarCarrier, Sidebar, Card, Button },
  data() {
    return {
      shipments: [],
      error: "",
      userId: Number(localStorage.getItem("userId")) // este es el TRANSPORTISTA
    };
  },
  computed: {
    assignedShipments() {
      return this.shipments.filter(s => s.transporterId === this.userId);
    }
  },
  async created() {
    await this.fetchShipments();
  },
  methods: {
    async fetchShipments() {
      try {
        const res = await http.get("/shipments");
        this.shipments = Array.isArray(res.data) ? res.data : [];
      } catch {
        this.error = "Error al obtener los envíos.";
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
    <sidebar-carrier />
    <div class="content">
      <h2 class="title">Envíos Asignados</h2>
      <div v-if="assignedShipments.length === 0" class="no-shipments">
        No tienes envíos asignados.
      </div>
      <div v-else class="shipments-list">
        <Card v-for="s in assignedShipments" :key="s.id" class="shipment-card">
          <template #title>Destino: {{ s.destiny }}</template>
          <template #content>
            <p><strong>Descripción:</strong> {{ s.description }}</p>
            <p><strong>Estado:</strong> {{ s.status }}</p>
            <p><strong>Fecha:</strong> {{ formatDate(s.createdAt) }}</p>
            <Button
                label="Ver Detalle"
                class="p-button-info p-button-sm btn-space"
                @click="goToDetail(s.id)"
            />
          </template>
        </Card>
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
  margin-left: 240px;
}

.title {
  color: #F39C12;
  margin-bottom: 1.5rem;
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
  width: calc(50% - 1rem);
  min-width: 320px;
}

.btn-space {
  margin-right: 0.5rem;
  margin-top: 0.5rem;
}

.no-shipments {
  color: #ecf0f1;
  text-align: center;
  margin-top: 2rem;
}
</style>

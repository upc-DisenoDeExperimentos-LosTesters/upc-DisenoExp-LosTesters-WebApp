<script>
import { HomeApiService } from "../../profiles-managment/services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "report-view",
  title: "Report View",
  data() {
    return {
      reports: [],
      allReports: [],
      users: [],
      vehicles: [],
      loading: true,
      selectedUserId: null,
      selectedType: null,
      selectedDate: null,
      homeApi: new HomeApiService(),
      iamApi: new IamApiService(),
      reportTypes: [
        "Dirección incorrecta",
        "Cliente no disponible",
        "Accidente",
        "Problema técnico",
        "Problema con paquete",
        "Infracción vehicular",
        "Otro"
      ]
    };
  },
  async created() {
    try {
      const gerenteId = Number(localStorage.getItem("userId"));
      const [reportsRes, usersRes, vehiclesRes] = await Promise.all([
        this.homeApi.getReports(),
        this.iamApi.getAllProfiles(),
        this.homeApi.getVehicles()
      ]);

      this.allReports = Array.isArray(reportsRes.data) ? reportsRes.data : [];
      this.users = Array.isArray(usersRes.data) ? usersRes.data : [];
      this.vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];

      const validTransporterIds = this.vehicles
          .filter(v => v.idPropietario === gerenteId)
          .map(v => v.idTransportista);

      this.allReports = this.allReports.filter(r => validTransporterIds.includes(r.userId));
      this.reports = [...this.allReports];
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      this.loading = false;
    }
  },
  watch: {
    selectedUserId: "applyFilters",
    selectedType: "applyFilters",
    selectedDate: "applyFilters"
  },
  methods: {
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? `${user.name} ${user.lastName}` : "Desconocido";
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString("es-ES");
    },
    applyFilters() {
      this.reports = this.allReports.filter(report => {
        const matchesUser = !this.selectedUserId || report.userId === this.selectedUserId;
        const matchesType = !this.selectedType || report.type === this.selectedType;
        const matchesDate = !this.selectedDate || new Date(report.createdAt).toDateString() === new Date(this.selectedDate).toDateString();
        return matchesUser && matchesType && matchesDate;
      });
    }
  }
};
</script>

<template>
  <div class="report-view-container">
    <div class="header">
      <h1>Lista de Reportes</h1>
      <p>Todos los reportes registrados por los conductores</p>
    </div>

    <div class="filters">
      <select v-model="selectedUserId">
        <option :value="null">Todos los conductores</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }} {{ user.lastName }}
        </option>
      </select>

      <select v-model="selectedType">
        <option :value="null">Todos los tipos</option>
        <option v-for="type in reportTypes" :key="type" :value="type">{{ type }}</option>
      </select>

      <input type="date" v-model="selectedDate" />
    </div>

    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else>
      <div v-if="reports.length === 0" class="no-reports">No hay reportes registrados.</div>
      <div v-else class="report-grid">
        <div class="report-card" v-for="report in reports" :key="report.id">
          <div class="report-title">{{ report.type }}</div>
          <div class="report-desc">{{ report.description }}</div>
          <div class="report-meta">
            <span><strong>Transportista:</strong> {{ getUserName(report.userId) }}</span>
            <span><strong>Fecha:</strong> {{ formatDate(report.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-view-container {
  padding: 2rem;
  background: #181c23;
  min-height: 100vh;
  color: white;
}
.header {
  margin-bottom: 2rem;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}
.filters select,
.filters input[type="date"] {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.loading, .no-reports {
  text-align: center;
  margin-top: 2rem;
}
.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}
.report-card {
  background: #232a34;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.report-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #F39C12;
}
.report-desc {
  font-size: 1.1rem;
}
.report-meta {
  font-size: 0.95rem;
  color: #b0b6be;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
@media (max-width: 600px) {
  .report-view-container {
    padding: 0.5rem;
  }
  .report-card {
    padding: 1rem 0.5rem;
  }
}
</style>

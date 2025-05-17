<script>
import { HomeApiService } from "../../profiles-managment/services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "report-view",
  title: "Report View",
  data() {
    return {
      reports: [],
      users: [],
      loading: true,
      homeApi: new HomeApiService(),
      iamApi: new IamApiService()
    };
  },
  async created() {
    // Carga reportes y usuarios para mostrar nombre del transportista
    const [reportsRes, usersRes] = await Promise.all([
      this.homeApi.getReports(),
      this.iamApi.getAllProfiles()
    ]);
    this.reports = Array.isArray(reportsRes.data) ? reportsRes.data : [];
    this.users = Array.isArray(usersRes.data) ? usersRes.data : [];
    this.loading = false;
  },
  methods: {
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? `${user.name} ${user.lastName}` : "Desconocido";
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString('es-ES');
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
}
.header {
  margin-bottom: 2rem;
  color: #fff;
}
.loading, .no-reports {
  color: #fff;
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
  color: #f3f3f3;
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
  margin-bottom: 0.5rem;
}
.report-desc {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
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
    min-width: 0;
    max-width: 100vw;
  }
}
</style>

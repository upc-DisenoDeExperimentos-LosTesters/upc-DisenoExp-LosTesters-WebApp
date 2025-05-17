<script>
import { Card } from 'primevue/card';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js"; // Corrige el import aquí

export default {
  components: { Card },
  setup() {
    const reports = ref([]);
    const users = ref([]);
    const router = useRouter();
    const homeApi = new HomeApiService();
    const iamApi = new IamApiService(); // Usa el servicio correcto

    onMounted(async () => {
      // Consumir todos los reportes
      const reportsRes = await homeApi.getReports();
      reports.value = Array.isArray(reportsRes.data) ? reportsRes.data : [];

      // Consumir todos los usuarios (para mostrar nombre del transportista)
      try {
        const usersRes = await iamApi.getAllProfiles();
        users.value = Array.isArray(usersRes.data) ? usersRes.data : [];
      } catch {
        users.value = [];
      }
    });

    const getUserName = (id) => {
      const user = users.value.find(u => u.id === id);
      return user ? `${user.name} ${user.lastName}` : "Desconocido";
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('es-ES');

    const goToReportDetail = (id) => {
      router.push(`/report/${id}`);
    };

    return { reports, getUserName, formatDate, goToReportDetail };
  }
};
</script>

<template>
  <div class="report-list-container">
    <div v-if="reports.length === 0" class="no-reports">No hay reportes registrados.</div>
    <div v-else class="report-grid">
      <div class="report-card" v-for="report in reports" :key="report.id" @click="goToReportDetail(report.id)">
        <div class="report-title">{{ report.type }}</div>
        <div class="report-desc">{{ report.description }}</div>
        <div class="report-meta">
          <span><strong>Transportista:</strong> {{ getUserName(report.userId) }}</span>
          <span><strong>Fecha:</strong> {{ formatDate(report.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-list-container {
  padding: 2rem;
  background: #181c23;
  min-height: 100vh;
}
.no-reports {
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
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.report-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  background: #252d38;
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
  .report-list-container {
    padding: 0.5rem;
  }
  .report-card {
    padding: 1rem 0.5rem;
    min-width: 0;
    max-width: 100vw;
  }
}
</style>

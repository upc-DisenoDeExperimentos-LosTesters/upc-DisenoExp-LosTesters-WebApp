<script>
import { HomeApiService } from "../services/home-api.service.js";
import { IamApiService } from "../../iam/services/iam-api.service.js";

export default {
  name: "report-detail",
  data() {
    return {
      report: null,
      user: null,
      loading: true,
      error: false,
      error_msg: ""
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const api = new HomeApiService();
      const iamApi = new IamApiService();
      const res = await api.getReports();
      const reports = Array.isArray(res.data) ? res.data : [];
      this.report = reports.find(r => String(r.id) === String(id));
      if (this.report) {
        const userRes = await iamApi.getProfileById(this.report.userId);
        this.user = userRes.data;
      }
      this.loading = false;
    } catch (e) {
      this.error = true;
      this.error_msg = "No se pudo cargar el detalle del reporte.";
      this.loading = false;
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    },
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<template>
  <div class="report-detail-container">
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error_msg }}</div>
    <div v-else-if="report" class="report-detail-card">
      <h2>Detalle del Reporte</h2>
      <div class="detail-row">
        <span class="label">Tipo:</span>
        <span>{{ report.type }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Descripción:</span>
        <span>{{ report.description }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Transportista:</span>
        <span>{{ user ? user.name + ' ' + user.lastName : 'Desconocido' }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Fecha:</span>
        <span>{{ formatDate(report.createdAt) }}</span>
      </div>
      <button class="btn-back" @click="goBack">Volver</button>
    </div>
    <div v-else class="error">Reporte no encontrado.</div>
  </div>
</template>

<style scoped>
.report-detail-container {
  min-height: 100vh;
  background: #181c23;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.loading, .error {
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
}
.report-detail-card {
  background: #232a34;
  color: #f3f3f3;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 2.5rem 2rem;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
h2 {
  color: #F39C12;
  margin-bottom: 1.5rem;
  text-align: center;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.08rem;
  border-bottom: 1px solid #353b47;
  padding-bottom: 0.5rem;
}
.label {
  color: #b0b6be;
  font-weight: 600;
  min-width: 110px;
}
.btn-back {
  margin-top: 2rem;
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-back:hover {
  background: #d35400;
}
@media (max-width: 600px) {
  .report-detail-card {
    padding: 1.2rem 0.5rem;
    min-width: 0;
    max-width: 98vw;
  }
}
</style>

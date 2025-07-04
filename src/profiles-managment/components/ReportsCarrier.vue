<script>
import { HomeApiService } from "../services/home-api.service.js";
import SidebarCarrier from "../../public/components/sidebar-carrier.vue";

export default {
  name: "CarrierReportsView",
  components: {
    SidebarCarrier
  },
  data() {
    return {
      type: null,
      description: "",
      reports: [],
      userId: Number(localStorage.getItem("userId")),
      reportTypes: [
        "Dirección incorrecta",
        "Cliente no disponible",
        "Accidente",
        "Problema técnico",
        "Problema con paquete",
        "Infracción vehicular",
        "Otro"
      ],
      reportsApi: new HomeApiService()
    };
  },
  async created() {
    await this.loadReports();
  },
  methods: {
    async loadReports() {
      try {
        const response = await this.reportsApi.getReports();
        this.reports = response.data.filter(r => r.userId === this.userId);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      }
    },
    containsForbiddenWords(text) {
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
    },
    async submitReport() {
      if (this.containsForbiddenWords(this.description)) {
        alert("Tu descripción contiene palabras prohibidas. Por favor edítala.");
        return;
      }

      try {
        const payload = {
          type: this.type,
          description: this.description,
        };
        await this.reportsApi.createReport(payload);
        this.type = null;
        this.description = "";
        await this.loadReports();
      } catch (error) {
        console.error("Error al enviar reporte:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
    }

  }
};
</script>

<template>
  <div class="carrier-report-container">
    <SidebarCarrier />

    <div class="main-content">
      <h2>Mis Reportes</h2>

      <pv-card class="form-card">
        <template #title>
          <i class="pi pi-plus-circle"></i> Nuevo Reporte
        </template>
        <template #content>
          <div class="form-group">
            <label for="type">Tipo de Reporte</label>
            <pv-dropdown
                v-model="type"
                :options="reportTypes"
                placeholder="Selecciona tipo"
                class="dropdown-full"
            />
          </div>

          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea
                v-model="description"
                class="description-area"
                rows="4"
                placeholder="Describe el incidente..."
            ></textarea>
          </div>

          <pv-button
              icon="pi pi-send"
              label="Enviar"
              class="p-button-warning"
              @click="submitReport"
              :disabled="!type || !description"
          />
        </template>
      </pv-card>

      <h3>Reportes Enviados</h3>
      <div class="reports-list">
        <pv-card
            v-for="report in reports"
            :key="report.id"
            class="report-card"
        >
          <template #title>
            {{ report.type }}
          </template>
          <template #content>
            <p>{{ report.description }}</p>
            <small class="muted">{{ formatDate(report.createdAt) }}</small>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carrier-report-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #181c23;
}

.main-content {
  margin-left: 320px;
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
  color: #fff;
}

.form-card {
  background: #232a34;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: #ccc;
  margin-bottom: 0.5rem;
}

.dropdown-full {
  width: 100%;
}

.description-area {
  width: 100%;
  border-radius: 8px;
  padding: 1rem;
  resize: vertical;
}

.reports-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.report-card {
  background: #232a34;
  color: #f3f3f3;
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 360px;
}

.muted {
  color: #aaa;
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
  .report-card {
    max-width: 100%;
  }
}
</style>

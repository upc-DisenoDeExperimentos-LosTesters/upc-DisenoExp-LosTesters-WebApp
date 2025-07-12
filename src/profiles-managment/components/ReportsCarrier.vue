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
      loadingReports: true,
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
  computed: {
    translatedTypes() {
      return this.reportTypes.map(type => ({
        label: this.$t(`reports.types.${type}`),
        value: type
      }));
    }
  },
  async created() {
    await this.loadReports();
  },
  methods: {
    async loadReports() {
      this.loadingReports = true;
      try {
        const response = await this.reportsApi.getReports();
        this.reports = response.data.filter(r => r.userId === this.userId);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      } finally {
        this.loadingReports = false;
      }
    },
    containsForbiddenWords(text) {
      const forbiddenWords = [/* lista censurada */];
      return forbiddenWords.some(word => text.toLowerCase().includes(word));
    },
    async submitReport() {
      if (this.containsForbiddenWords(this.description)) {
        alert(this.$t('reports.alert.forbiddenWords'));
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
      return new Date(date).toLocaleString("es-ES", {
        dateStyle: "short",
        timeStyle: "short"
      });
    }
  }
};
</script>

<template>
  <div class="carrier-report-container">
    <SidebarCarrier />

    <div class="main-content">
      <h2>{{ $t('reports.myReports') }}</h2>

      <pv-card class="form-card">
        <template #title>
          <i class="pi pi-plus-circle"></i> {{ $t('reports.newReport') }}
        </template>
        <template #content>
          <div class="form-group">
            <label for="type">{{ $t('reports.reportType') }}</label>
            <pv-dropdown
                v-model="type"
                :options="translatedTypes"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('reports.selectType')"
                class="dropdown-full"
            />
          </div>

          <div class="form-group">
            <label for="description">{{ $t('reports.description') }}</label>
            <textarea
                v-model="description"
                class="description-area"
                rows="4"
                :placeholder="$t('reports.descriptionPlaceholder')"
            ></textarea>
          </div>

          <pv-button
              icon="pi pi-send"
              :label="$t('reports.send')"
              class="p-button-warning"
              @click="submitReport"
              :disabled="!type || !description"
          />
        </template>
      </pv-card>

      <h3>{{ $t('reports.sentReports') }}</h3>

      <div class="reports-list">
        <template v-if="loadingReports">
          <div class="report-card report-skeleton" v-for="n in 3" :key="'skeleton-r-' + n"></div>
        </template>
        <template v-else>
          <template v-if="reports.length">
            <pv-card
                v-for="report in reports"
                :key="report.id"
                class="report-card"
            >
              <template #title>
                {{ $t(`reports.types.${report.type}`) }}
              </template>
              <template #content>
                <p>{{ report.description }}</p>
                <small class="muted">{{ formatDate(report.createdAt) }}</small>
              </template>
            </pv-card>
          </template>
          <template v-else>
            <div class="no-reports-message">
              {{ $t('reports.emptyMessage') }}
            </div>
          </template>
        </template>
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

.report-skeleton {
  height: 120px;
  background: linear-gradient(90deg, #2f3440 25%, #444b58 50%, #2f3440 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 12px;
  padding: 1rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

</style>

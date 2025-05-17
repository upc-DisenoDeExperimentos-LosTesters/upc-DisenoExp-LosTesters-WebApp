<script>
import { Card } from 'primevue/card';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: { Card },
  setup() {
    const reports = ref([]);
    const users = ref([]);
    const router = useRouter();

    onMounted(async () => {
      reports.value = await fetchReports();
      users.value = await fetchUsers();
    });

    const getUserName = (id) => {
      const user = users.value.find(u => u.id === id);
      return user ? `${user.name} ${user.lastName}` : "Desconocido";
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

    const goToReportDetail = (id) => {
      router.push(`/report/${id}`);
    };

    return { reports, getUserName, formatDate, goToReportDetail };
  }
};
</script>

<template>
  <div class="p-grid">
    <div class="p-col-12 p-md-4" v-for="report in reports.slice(0, 3)" :key="report.id">
      <Card @click="goToReportDetail(report.id)" class="cursor-pointer">
        <template #title>
          {{ report.type }}
        </template>
        <template #content>
          <p>{{ report.description }}</p>
          <p><strong>Transportista:</strong> {{ getUserName(report.userId) }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(report.createdAt) }}</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>

</style>
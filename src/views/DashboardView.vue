<template>
  <div class="dashboard-container">
    <h1>Welcome to the Dashboard!</h1>
    <p>You have successfully logged in.</p>
    <el-button type="danger" @click="handleLogout">Logout</el-button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  text-align: center;
}
</style>
<template>
  <div class="optimize-view">
    <PageHeader
      title="V7 Optimization"
      description="Optimize trading strategies using advanced algorithms"
    />

    <el-card>
      <div class="coming-soon">
        <div class="coming-soon-icon">🚧</div>
        <h2>Under Construction</h2>
        <p>The V7 Optimization module is currently under development.</p>
        <p>This feature will include:</p>
        <ul>
          <li>Parameter optimization using genetic algorithms</li>
          <li>Grid search and random search methods</li>
          <li>Multi-objective optimization</li>
          <li>Performance comparison and analysis</li>
          <li>Best parameter recommendations</li>
        </ul>
        <el-button type="primary" @click="$router.push('/backtest')">
          Go to Backtests
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>

<style scoped lang="scss">
.optimize-view {
  .coming-soon {
    text-align: center;
    padding: 60px 40px;

    .coming-soon-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    h2 {
      color: #303133;
      margin-bottom: 16px;
    }

    p {
      color: #606266;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    ul {
      text-align: left;
      max-width: 400px;
      margin: 0 auto 32px;
      color: #606266;
      line-height: 1.8;

      li {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
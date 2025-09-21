<template>
  <div class="run-view">
    <PageHeader
      title="V7 Run"
      description="Execute live trading strategies"
    />

    <el-card>
      <div class="coming-soon">
        <div class="coming-soon-icon">🏃</div>
        <h2>Live Trading Module</h2>
        <p>The V7 Run module is currently under development.</p>
        <p>This feature will include:</p>
        <ul>
          <li>Real-time trading execution</li>
          <li>Portfolio management and monitoring</li>
          <li>Risk management and stop-loss</li>
          <li>Live performance tracking</li>
          <li>Emergency stop functionality</li>
          <li>Trading logs and audit trails</li>
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
.run-view {
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
<template>
  <div class="run-view">
    <PageHeader
      :title="t('run.title')"
      :description="t('run.description')"
    />

    <el-card class="coming-soon-card">
      <div class="coming-soon">
        <div class="coming-soon-icon">
          <!-- SVG icon for live trading/run -->
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            <path d="M5 12l-2 3h4l-1 5 4-6H6l1-5z" opacity="0.5"/>
          </svg>
        </div>
        <h2>{{ t('run.liveTrading') }}</h2>
        <p class="intro-description">{{ t('run.development') }}</p>
        <div class="features-section">
          <p class="features-title">{{ t('run.features') }}</p>
          <div class="features-grid">
            <div class="feature-item">
              <el-icon><Monitor /></el-icon>
              <span>{{ t('run.features.realTimeTrading') }}</span>
            </div>
            <div class="feature-item">
              <el-icon><PieChart /></el-icon>
              <span>{{ t('run.features.portfolioManagement') }}</span>
            </div>
            <div class="feature-item">
              <el-icon><Lock /></el-icon>
              <span>{{ t('run.features.riskManagement') }}</span>
            </div>
            <div class="feature-item">
              <el-icon><TrendCharts /></el-icon>
              <span>{{ t('run.features.performanceTracking') }}</span>
            </div>
            <div class="feature-item">
              <el-icon><WarningFilled /></el-icon>
              <span>{{ t('run.features.emergencyStop') }}</span>
            </div>
            <div class="feature-item">
              <el-icon><Document /></el-icon>
              <span>{{ t('run.features.tradingLogs') }}</span>
            </div>
          </div>
        </div>
        <el-button type="primary" class="action-button" @click="$router.push('/backtest')">
          {{ t('run.goBacktests') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import {
  Monitor,
  PieChart,
  Lock,
  TrendCharts,
  WarningFilled,
  Document
} from '@element-plus/icons-vue'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.run-view {
  .coming-soon-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f2f5;
    overflow: hidden;
  }

  .coming-soon {
    text-align: center;
    padding: 60px 40px;
    max-width: 800px;
    margin: 0 auto;

    .coming-soon-icon {
      margin-bottom: 32px;
      color: #409eff;
      svg {
        width: 120px;
        height: 120px;
      }
    }

    h2 {
      color: #303133;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .intro-description {
      color: #606266;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .features-section {
      margin-bottom: 48px;
      
      .features-title {
        color: #303133;
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 24px;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      text-align: left;
      
      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background-color: #fafbfc;
        border-radius: 8px;
        border: 1px solid #f0f2f5;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          border-color: #e4e7ed;
        }

        .el-icon {
          font-size: 24px;
          color: #409eff;
        }

        span {
          color: #303133;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .action-button {
      padding: 12px 32px;
      font-size: 16px;
      border-radius: 8px;
    }
  }
}

// Responsive styles
@media (max-width: 768px) {
  .run-view {
    .coming-soon {
      padding: 40px 20px;

      .coming-soon-icon svg {
        width: 80px;
        height: 80px;
      }

      h2 {
        font-size: 24px;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
}
</style>
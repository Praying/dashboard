<template>
  <div class="optimize-view">
    <PageHeader
      :title="t('optimize.title')"
      :description="t('optimize.description')"
    />

    <el-card>
      <div class="coming-soon">
        <div class="coming-soon-icon">
          <el-icon size="80"><Tools /></el-icon>
        </div>
        <h2>{{ t('optimize.underConstruction') }}</h2>
        <p>{{ t('optimize.development') }}</p>
        <div class="feature-grid">
          <div class="feature-item">
            <el-icon class="feature-icon"><Connection /></el-icon>
            <span>{{ t('optimize.features.geneticAlgorithms') }}</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><Grid /></el-icon>
            <span>{{ t('optimize.features.gridSearch') }}</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><Aim /></el-icon>
            <span>{{ t('optimize.features.multiObjective') }}</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><DataLine /></el-icon>
            <span>{{ t('optimize.features.performanceComparison') }}</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><MagicStick /></el-icon>
            <span>{{ t('optimize.features.parameterRecommendations') }}</span>
          </div>
        </div>
        <el-button type="primary" @click="$router.push('/backtest')">
          {{ t('optimize.goBacktests') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import {
  Tools,
  Connection,
  Grid,
  Aim,
  DataLine,
  MagicStick
} from '@element-plus/icons-vue'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.optimize-view {
  .el-card {
    border-radius: 8px;
    border: 1px solid #f0f2f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .coming-soon {
    text-align: center;
    padding: 60px 40px;

    .coming-soon-icon {
      margin-bottom: 24px;
      color: #409eff;
    }

    h2 {
      color: #303133;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    p {
      color: #606266;
      font-size: 16px;
      margin-bottom: 40px;
      line-height: 1.6;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      max-width: 800px;
      margin: 0 auto 40px;
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      border-radius: 8px;
      background: #fafbfc;
      border: 1px solid #f0f2f5;
      transition: all 0.3s ease;

      &:hover {
        background: #f5f7fa;
        border-color: #dcdfe6;
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      .feature-icon {
        font-size: 32px;
        color: #409eff;
      }

      span {
        font-size: 14px;
        color: #606266;
        text-align: center;
      }
    }

    .el-button {
      margin-top: 16px;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
      }
    }
  }
}

// Responsive styles
@media (max-width: 768px) {
  .optimize-view {
    .coming-soon {
      padding: 40px 20px;

      .feature-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
}
</style>
<template>
  <div class="dashboard">
    <!-- 顶部导航 -->
    <ScreenHeader :overview="data.overview" />

    <!-- 主体三列布局 -->
    <div class="dashboard-body">
      <!-- 左列：设备状态 + OEE -->
      <div class="col-left">
        <DeviceStatus :devices="data.devices" class="flex-1" />
        <OeeGauge :oee="data.overview.oee" :yield-rate="data.overview.yieldRate" class="flex-1" />
      </div>

      <!-- 中列：3D车间 + 产量趋势 -->
      <div class="col-center">
        <Workshop3D :devices="data.devices" class="flex-2" />
        <ProductionTrend :production="data.production" class="flex-1" />
      </div>

      <!-- 右列：质量雷达 + 缺陷柱状 + 告警列表 -->
      <div class="col-right">
        <QualityRadar :quality="data.quality" class="flex-1" />
        <DefectBar :defects="data.defects" class="flex-1" />
        <AlertList :alerts="data.alerts" class="flex-1" />
      </div>
    </div>

    <!-- 告警弹窗 -->
    <AlertModal :alert="currentAlert" @close="currentAlert = null" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AlertItem } from './types'
import { useScreenAdapter } from './composables/useScreenAdapter'
import { useMockData } from './composables/useMockData'
import { playAlertSound } from './utils/audioAlert'
import ScreenHeader from './components/ScreenHeader.vue'
import DeviceStatus from './components/DeviceStatus.vue'
import OeeGauge from './components/OeeGauge.vue'
import Workshop3D from './components/Workshop3D.vue'
import ProductionTrend from './components/ProductionTrend.vue'
import QualityRadar from './components/QualityRadar.vue'
import DefectBar from './components/DefectBar.vue'
import AlertList from './components/AlertList.vue'
import AlertModal from './components/AlertModal.vue'

useScreenAdapter(1920, 1080)

const currentAlert = ref<AlertItem | null>(null)

const { data } = useMockData((alert: AlertItem) => {
  currentAlert.value = alert
  playAlertSound(alert.level)
})
</script>

<style scoped>
.dashboard {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  background: var(--bg-deep);
}

.dashboard-body {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 0 12px 12px;
  overflow: hidden;
}

.col-left {
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.col-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.col-right {
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
</style>

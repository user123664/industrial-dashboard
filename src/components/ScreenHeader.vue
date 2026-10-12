<template>
  <div class="header">
    <!-- 左侧装饰 -->
    <div class="header-side left">
      <span class="metric-item">
        <span class="metric-label">设备在线</span>
        <span class="num-green num-orange">{{ overview.deviceOnline }}</span>
        <span class="metric-label">/ {{ overview.deviceTotal }}</span>
      </span>
      <span class="metric-item">
        <span class="metric-label">告警</span>
        <span :class="['num-orange', overview.alertCount > 0 ? 'num-red' : 'num-green']">
          {{ overview.alertCount }}
        </span>
      </span>
    </div>

    <!-- 中央标题 -->
    <div class="header-center">
      <div class="title-bg"></div>
      <h1 class="title">智能制造产线监控大屏</h1>
      <div class="subtitle">INDUSTRIAL PRODUCTION LINE MONITORING SYSTEM</div>
    </div>

    <!-- 右侧时钟 + 指标 -->
    <div class="header-side right">
      <span class="metric-item">
        <span class="metric-label">总产量</span>
        <span class="num-orange">{{ overview.totalOutput }}</span>
        <span class="metric-label">件</span>
      </span>
      <span class="metric-item">
        <span class="metric-label">良率</span>
        <span class="num-green num-orange">{{ overview.yieldRate }}%</span>
      </span>
      <span class="clock">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { OverviewMetrics } from '../types'

const props = defineProps<{ overview: OverviewMetrics }>()

const currentTime = ref('')
let timer: number

function updateClock() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
  currentTime.value = `${y}-${m}-${d} 周${week} ${h}:${mi}:${s}`
}

onMounted(() => {
  updateClock()
  timer = window.setInterval(updateClock, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: relative;
  background: linear-gradient(180deg, rgba(255, 107, 0, 0.08) 0%, transparent 100%);
  border-bottom: 1px solid var(--border-color);
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--orange), transparent);
}

.header-center {
  text-align: center;
  position: relative;
}

.title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  background: linear-gradient(180deg, #FFFFFF 30%, var(--orange) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 2px;
  margin-top: 2px;
}

.header-side {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 400px;
}

.header-side.right {
  justify-content: flex-end;
}

.metric-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.num-orange {
  font-size: 22px;
}

.clock {
  font-size: 16px;
  color: var(--orange-light);
  font-family: 'DIN', 'Arial', monospace;
  font-weight: 600;
  min-width: 220px;
  text-align: right;
}
</style>

<template>
  <div class="panel device-panel">
    <div class="corner-tl"></div><div class="corner-tr"></div>
    <div class="corner-bl"></div><div class="corner-br"></div>
    <div class="panel-header">
      <span class="panel-title">设备运行状态</span>
      <span class="panel-count">共 {{ devices.length }} 台</span>
    </div>
    <div class="panel-body">
      <div class="device-list">
        <div
          v-for="d in devices"
          :key="d.id"
          class="device-card"
          :class="d.status"
        >
          <div class="device-top">
            <div class="device-name-row">
              <span class="status-dot" :class="d.status"></span>
              <span class="device-name">{{ d.name }}</span>
            </div>
            <span class="device-id">{{ d.id }}</span>
          </div>
          <div class="device-metrics">
            <div class="metric">
              <span class="m-label">温度</span>
              <span class="m-value" :class="d.temperature > 70 ? 'num-red' : ''">
                {{ d.temperature }}°C
              </span>
            </div>
            <div class="metric">
              <span class="m-label">转速</span>
              <span class="m-value">{{ d.speed }} rpm</span>
            </div>
            <div class="metric">
              <span class="m-label">产量</span>
              <span class="m-value num-orange">{{ d.output }}</span>
            </div>
            <div class="metric">
              <span class="m-label">利用率</span>
              <div class="util-bar">
                <div class="util-fill" :style="{ width: d.utilization + '%' }"></div>
                <span class="util-text">{{ d.utilization }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Device } from '../types'
defineProps<{ devices: Device[] }>()
</script>

<style scoped>
.device-panel { display: flex; flex-direction: column; }
.panel-count { font-size: 12px; color: var(--text-muted); margin-left: auto; }

.device-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: auto;
}

.device-card {
  background: var(--bg-panel-light);
  border-left: 3px solid var(--text-muted);
  border-radius: 4px;
  padding: 12px;
  transition: all 0.3s;
}
.device-card.running { border-left-color: var(--status-running); }
.device-card.idle { border-left-color: var(--status-idle); }
.device-card.warning { border-left-color: var(--status-warning); }
.device-card.error {
  border-left-color: var(--status-error);
  background: rgba(255, 51, 51, 0.05);
}

.device-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.device-name-row { display: flex; align-items: center; gap: 8px; }
.device-name { font-size: 14px; color: var(--text-primary); font-weight: 500; }
.device-id { font-size: 11px; color: var(--text-muted); font-family: monospace; }

.device-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
}
.metric { display: flex; align-items: center; gap: 6px; }
.m-label { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.m-value { font-size: 14px; color: var(--text-secondary); font-family: 'DIN', monospace; }

.util-bar {
  flex: 1;
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 7px;
  position: relative;
  overflow: hidden;
}
.util-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--orange), var(--orange-light));
  border-radius: 7px;
  transition: width 0.5s ease;
}
.util-text {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: var(--text-primary);
  z-index: 1;
}
</style>

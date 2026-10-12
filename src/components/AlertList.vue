<template>
  <div class="panel">
    <div class="corner-tl"></div><div class="corner-tr"></div>
    <div class="corner-bl"></div><div class="corner-br"></div>
    <div class="panel-header">
      <span class="panel-title">实时告警通知</span>
      <span v-if="alerts.length" class="alert-count blink">{{ alerts.length }}</span>
    </div>
    <div class="panel-body">
      <div class="alert-list">
        <TransitionGroup name="alert">
          <div
            v-for="a in alerts"
            :key="a.id"
            class="alert-item"
            :class="a.level"
          >
            <div class="alert-icon">
              <span class="status-dot" :class="a.level"></span>
            </div>
            <div class="alert-content">
              <div class="alert-top">
                <span class="alert-device">{{ a.deviceName }}</span>
                <span class="alert-time">{{ a.timestamp }}</span>
              </div>
              <div class="alert-msg">
                <span :class="a.level === 'error' ? 'num-red' : 'num-yellow'">
                  [{{ a.level === 'error' ? '故障' : '预警' }}]
                </span>
                {{ a.message }}
              </div>
            </div>
          </div>
        </TransitionGroup>
        <div v-if="alerts.length === 0" class="no-alert">
          <span>所有设备运行正常</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlertItem } from '../types'
defineProps<{ alerts: AlertItem[] }>()
</script>

<style scoped>
.alert-count {
  margin-left: auto;
  padding: 2px 10px;
  background: rgba(255, 51, 51, 0.15);
  border: 1px solid var(--status-error);
  border-radius: 10px;
  font-size: 12px;
  color: var(--status-error);
  font-weight: 600;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: var(--bg-panel-light);
  border-radius: 4px;
  border-left: 3px solid var(--text-muted);
}
.alert-item.warning { border-left-color: var(--status-warning); background: rgba(255, 154, 0, 0.05); }
.alert-item.error { border-left-color: var(--status-error); background: rgba(255, 51, 51, 0.05); }

.alert-icon { padding-top: 2px; }
.alert-content { flex: 1; }
.alert-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.alert-device { font-size: 13px; color: var(--text-primary); font-weight: 500; }
.alert-time { font-size: 11px; color: var(--text-muted); font-family: monospace; }
.alert-msg { font-size: 12px; color: var(--text-secondary); }

.no-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--status-running);
  font-size: 14px;
}

.alert-enter-active { transition: all 0.4s ease; }
.alert-enter-from { opacity: 0; transform: translateX(20px); }
.alert-leave-active { transition: all 0.3s ease; }
.alert-leave-to { opacity: 0; transform: translateX(-20px); }
</style>

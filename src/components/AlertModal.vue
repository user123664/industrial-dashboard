<template>
  <Transition name="modal">
    <div v-if="alert" class="modal-overlay" @click="$emit('close')">
      <div class="modal-box" :class="alert.level" @click.stop>
        <div class="modal-header">
          <div class="modal-title-row">
            <span class="modal-icon" :class="alert.level">
              <span class="status-dot blink" :class="alert.level"></span>
            </span>
            <span class="modal-title">
              {{ alert.level === 'error' ? '设备故障告警' : '设备预警通知' }}
            </span>
          </div>
          <button class="modal-close" @click="$emit('close')">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-info-row">
            <span class="info-label">设备名称</span>
            <span class="info-value">{{ alert.deviceName }}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">设备编号</span>
            <span class="info-value mono">{{ alert.deviceId }}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">告警内容</span>
            <span class="info-value" :class="alert.level === 'error' ? 'num-red' : 'num-yellow'">
              {{ alert.message }}
            </span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">告警时间</span>
            <span class="info-value mono">{{ alert.timestamp }}</span>
          </div>
          <div class="modal-info-row">
            <span class="info-label">告警等级</span>
            <span class="info-value">
              <span class="level-badge" :class="alert.level">
                {{ alert.level === 'error' ? '紧急' : '一般' }}
              </span>
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-confirm" @click="$emit('close')">确认</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { AlertItem } from '../types'
defineProps<{ alert: AlertItem | null }>()
defineEmits<{ close: [] }>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  width: 420px;
  background: var(--bg-panel);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}
.modal-box.error { border-color: var(--status-error); box-shadow: 0 0 40px rgba(255, 51, 51, 0.3); }
.modal-box.warning { border-color: var(--status-warning); box-shadow: 0 0 40px rgba(255, 154, 0, 0.2); }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(90deg, rgba(255, 107, 0, 0.05), transparent);
}
.modal-title-row { display: flex; align-items: center; gap: 10px; }
.modal-title { font-size: 16px; font-weight: 600; color: var(--orange); }
.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 22px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
.modal-close:hover { color: var(--text-primary); }

.modal-body { padding: 20px; }
.modal-info-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.info-label { width: 80px; font-size: 13px; color: var(--text-muted); }
.info-value { font-size: 14px; color: var(--text-primary); }
.info-value.mono { font-family: 'DIN', monospace; }
.level-badge {
  padding: 2px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}
.level-badge.error { background: rgba(255, 51, 51, 0.15); color: var(--status-error); border: 1px solid var(--status-error); }
.level-badge.warning { background: rgba(255, 154, 0, 0.15); color: var(--status-warning); border: 1px solid var(--status-warning); }

.modal-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
}
.btn-confirm {
  padding: 8px 28px;
  background: var(--orange);
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-confirm:hover { opacity: 0.85; }

.modal-enter-active { transition: all 0.3s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .modal-box { transform: scale(0.9) translateY(-20px); }
.modal-leave-active { transition: all 0.2s ease; }
.modal-leave-to { opacity: 0; }
.modal-leave-to .modal-box { transform: scale(0.95); }
</style>

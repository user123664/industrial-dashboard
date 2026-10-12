import { ref, onMounted, onUnmounted } from 'vue'
import type { DashboardData, Device, AlertItem } from '../types'
import {
  generateDashboardData,
  generateDevices,
  generateAlerts,
  generateProduction,
  generateQuality,
  generateDefects,
  generateOverview
} from '../utils/mockData'

/**
 * 模拟实时数据推送：每 10 秒更新设备指标，每 30 秒追加产量数据点，
 * 当出现 warning/error 设备时触发告警回调（30秒内最多弹一次）
 */
export function useMockData(onAlert?: (alert: AlertItem) => void) {
  const data = ref<DashboardData>(generateDashboardData())
  let timer10: number
  let timer30: number
  let lastAlertTime = 0

  function tickDevices() {
    const newDevices: Device[] = data.value.devices.map((d) => {
      const status = d.status
      const temp = clamp(d.temperature + rand(-3, 3, 1), 25, 95)
      const speed = status === 'error' ? 0 : clamp(d.speed + rand(-200, 200), 400, 4000)
      const output = status === 'error' ? d.output : clamp(d.output + rand(-15, 15), 50, 600)
      const util = status === 'running' ? clamp(d.utilization + rand(-3, 3, 1), 60, 99) : d.utilization
      return { ...d, temperature: temp, speed, output, utilization: util }
    })

    // 低概率切换设备状态
    if (Math.random() < 0.08) {
      const idx = Math.floor(Math.random() * newDevices.length)
      const r = Math.random()
      newDevices[idx].status = r < 0.5 ? 'warning' : r < 0.8 ? 'running' : 'error'
      if (newDevices[idx].status === 'error') newDevices[idx].speed = 0
    }

    const newAlerts = generateAlerts(newDevices)
    const newOverview = generateOverview(newDevices, newAlerts)
    data.value = { ...data.value, devices: newDevices, alerts: newAlerts, overview: newOverview }

    // 触发告警回调（30秒内最多弹一次）
    if (onAlert) {
      const now = Date.now()
      if (now - lastAlertTime > 30000) {
        const errorAlert = newAlerts.find((a) => a.level === 'error')
        const target = errorAlert || newAlerts.find((a) => a.level === 'warning')
        if (target && (target.level === 'error' || Math.random() < 0.3)) {
          onAlert(target)
          lastAlertTime = now
        }
      }
    }
  }

  function tickProduction() {
    const newPoint = generateProduction().slice(-1)[0]
    const updated = [...data.value.production.slice(1), newPoint]
    const newQuality = generateQuality()
    const newDefects = generateDefects()
    data.value = {
      ...data.value,
      production: updated,
      quality: newQuality,
      defects: newDefects
    }
  }

  onMounted(() => {
    timer10 = window.setInterval(tickDevices, 10000)
    timer30 = window.setInterval(tickProduction, 30000)
  })

  onUnmounted(() => {
    clearInterval(timer10)
    clearInterval(timer30)
  })

  return { data }
}

function rand(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min
  return parseFloat(val.toFixed(decimals))
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

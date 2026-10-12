import type {
  Device,
  DeviceStatus,
  AlertItem,
  ProductionPoint,
  QualityData,
  DefectItem,
  OverviewMetrics,
  DashboardData
} from '../types'

const DEVICE_NAMES = [
  'CNC加工中心-01',
  '自动化装配线-02',
  '焊接机器人-03',
  '智能检测站-04'
]

function rand(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min
  return parseFloat(val.toFixed(decimals))
}

function pickStatus(): DeviceStatus {
  const r = Math.random()
  if (r < 0.65) return 'running'
  if (r < 0.8) return 'idle'
  if (r < 0.93) return 'warning'
  return 'error'
}

export function generateDevices(): Device[] {
  return DEVICE_NAMES.map((name, i) => {
    const status = pickStatus()
    return {
      id: `D${String(i + 1).padStart(2, '0')}`,
      name,
      status,
      temperature: rand(35, 85, 1),
      speed: status === 'error' ? 0 : rand(800, 3600),
      output: rand(120, 500),
      utilization: status === 'running' ? rand(75, 98, 1) : status === 'idle' ? rand(0, 30, 1) : rand(30, 70, 1)
    }
  })
}

export function generateAlerts(devices: Device[]): AlertItem[] {
  const alerts: AlertItem[] = []
  const messages = {
    warning: ['温度偏高', '振动异常', '润滑不足', '能耗超限'],
    error: ['设备停机', '急停触发', '通讯中断', '故障代码 E-204']
  }
  devices.forEach((d) => {
    if (d.status === 'warning') {
      alerts.push({
        id: `A${Date.now()}_${d.id}`,
        deviceId: d.id,
        deviceName: d.name,
        level: 'warning',
        message: messages.warning[Math.floor(Math.random() * messages.warning.length)],
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      })
    } else if (d.status === 'error') {
      alerts.push({
        id: `A${Date.now()}_${d.id}`,
        deviceId: d.id,
        deviceName: d.name,
        level: 'error',
        message: messages.error[Math.floor(Math.random() * messages.error.length)],
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      })
    }
  })
  return alerts
}

export function generateProduction(): ProductionPoint[] {
  const now = new Date()
  const points: ProductionPoint[] = []
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5 * 60 * 1000)
    const hh = String(t.getHours()).padStart(2, '0')
    const mm = String(t.getMinutes()).padStart(2, '0')
    points.push({
      time: `${hh}:${mm}`,
      planned: rand(200, 260),
      actual: rand(150, 250)
    })
  }
  return points
}

export function generateQuality(): QualityData {
  return {
    indicators: ['合格率', '一次通过率', '稳定性', '效率', '安全性', '良品率'],
    values: [rand(90, 99, 1), rand(80, 95, 1), rand(75, 92, 1), rand(70, 90, 1), rand(85, 98, 1), rand(88, 99, 1)],
    targets: [98, 92, 88, 85, 95, 96]
  }
}

export function generateDefects(): DefectItem[] {
  return [
    { type: '尺寸偏差', count: rand(3, 15) },
    { type: '表面划痕', count: rand(2, 12) },
    { type: '装配缺件', count: rand(1, 8) },
    { type: '焊接缺陷', count: rand(1, 10) },
    { type: '功能异常', count: rand(0, 6) }
  ]
}

export function generateOverview(devices: Device[], alerts: AlertItem[]): OverviewMetrics {
  const totalOutput = devices.reduce((sum, d) => sum + d.output, 0)
  const running = devices.filter((d) => d.status === 'running').length
  const yieldRate = rand(92, 99, 1)
  const oee = rand(65, 88, 1)
  return {
    totalOutput,
    yieldRate,
    oee,
    alertCount: alerts.length,
    deviceOnline: running,
    deviceTotal: devices.length
  }
}

export function generateDashboardData(): DashboardData {
  const devices = generateDevices()
  const alerts = generateAlerts(devices)
  const production = generateProduction()
  const quality = generateQuality()
  const defects = generateDefects()
  const overview = generateOverview(devices, alerts)
  return { devices, alerts, production, quality, defects, overview }
}

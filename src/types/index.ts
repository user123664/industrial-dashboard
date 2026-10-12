export type DeviceStatus = 'running' | 'idle' | 'warning' | 'error'

export interface Device {
  id: string
  name: string
  status: DeviceStatus
  temperature: number
  speed: number
  output: number
  utilization: number
}

export interface AlertItem {
  id: string
  deviceId: string
  deviceName: string
  level: 'warning' | 'error'
  message: string
  timestamp: string
}

export interface ProductionPoint {
  time: string
  planned: number
  actual: number
}

export interface QualityData {
  indicators: string[]
  values: number[]
  targets: number[]
}

export interface DefectItem {
  type: string
  count: number
}

export interface OverviewMetrics {
  totalOutput: number
  yieldRate: number
  oee: number
  alertCount: number
  deviceOnline: number
  deviceTotal: number
}

export interface DashboardData {
  devices: Device[]
  alerts: AlertItem[]
  production: ProductionPoint[]
  quality: QualityData
  defects: DefectItem[]
  overview: OverviewMetrics
}

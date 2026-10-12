<template>
  <div class="panel">
    <div class="corner-tl"></div><div class="corner-tr"></div>
    <div class="corner-bl"></div><div class="corner-br"></div>
    <div class="panel-header">
      <span class="panel-title">产线实时产量趋势</span>
      <span class="panel-unit">单位：件</span>
    </div>
    <div class="panel-body">
      <div ref="chartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import type { ProductionPoint } from '../types'

const props = defineProps<{ production: ProductionPoint[] }>()
const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

function renderChart() {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)

  chart.setOption({
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(20,20,20,0.9)', borderColor: '#FF6B00', textStyle: { color: '#fff' } },
    legend: {
      data: ['计划产量', '实际产量'],
      right: 10,
      top: 5,
      textStyle: { color: '#aaa', fontSize: 12 }
    },
    grid: { top: 40, left: 50, right: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: props.production.map(p => p.time),
      axisLabel: { color: '#888', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#888', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [
      {
        name: '计划产量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: 'rgba(255,107,0,0.4)', width: 2, type: 'dashed' },
        itemStyle: { color: 'rgba(255,107,0,0.4)' },
        areaStyle: { color: 'rgba(255,107,0,0.03)' },
        data: props.production.map(p => p.planned)
      },
      {
        name: '实际产量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#FF6B00', width: 3 },
        itemStyle: { color: '#FF6B00', borderColor: '#fff', borderWidth: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255,107,0,0.25)' },
            { offset: 1, color: 'rgba(255,107,0,0.01)' }
          ])
        },
        data: props.production.map(p => p.actual)
      }
    ]
  })
}

watch(() => props.production, renderChart, { deep: true })

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})
function resize() { chart?.resize() }
</script>

<style scoped>
.chart { width: 100%; height: 100%; min-height: 180px; }
.panel-unit { font-size: 12px; color: var(--text-muted); margin-left: auto; }
</style>

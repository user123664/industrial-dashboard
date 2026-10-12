<template>
  <div class="panel">
    <div class="corner-tl"></div><div class="corner-tr"></div>
    <div class="corner-bl"></div><div class="corner-br"></div>
    <div class="panel-header">
      <span class="panel-title">质量分析雷达</span>
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
import type { QualityData } from '../types'

const props = defineProps<{ quality: QualityData }>()
const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

function renderChart() {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)

  chart.setOption({
    tooltip: { backgroundColor: 'rgba(20,20,20,0.9)', borderColor: '#FF6B00', textStyle: { color: '#fff' } },
    legend: {
      data: ['实际', '目标'],
      right: 10,
      top: 5,
      textStyle: { color: '#aaa', fontSize: 12 }
    },
    radar: {
      center: ['50%', '55%'],
      radius: '65%',
      splitNumber: 4,
      axisName: { color: '#999', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(255,255,255,0.02)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      indicator: props.quality.indicators.map(name => ({ name, max: 100 }))
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#FF6B00', width: 2 },
        itemStyle: { color: '#FF6B00' },
        areaStyle: { color: 'rgba(255,107,0,0.15)' },
        data: [{ value: props.quality.values, name: '实际' }]
      },
      {
        type: 'radar',
        symbol: 'none',
        lineStyle: { color: '#00FF88', width: 1.5, type: 'dashed' },
        itemStyle: { color: '#00FF88' },
        areaStyle: { color: 'transparent' },
        data: [{ value: props.quality.targets, name: '目标' }]
      }
    ]
  })
}

watch(() => props.quality, renderChart, { deep: true })

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
</style>

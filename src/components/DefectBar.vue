<template>
  <div class="panel">
    <div class="corner-tl"></div><div class="corner-tr"></div>
    <div class="corner-bl"></div><div class="corner-br"></div>
    <div class="panel-header">
      <span class="panel-title">缺陷类型分布</span>
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
import type { DefectItem } from '../types'

const props = defineProps<{ defects: DefectItem[] }>()
const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

function renderChart() {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)

  const data = props.defects
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(20,20,20,0.9)', borderColor: '#FF6B00', textStyle: { color: '#fff' } },
    grid: { top: 20, left: 40, right: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.type),
      axisLabel: { color: '#888', fontSize: 11, rotate: 0 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#888', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [
      {
        type: 'bar',
        barWidth: '40%',
        data: data.map((d, i) => ({
          value: d.count,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: i === 0 ? '#FF6B00' : 'rgba(255,107,0,0.7)' },
              { offset: 1, color: 'rgba(255,107,0,0.1)' }
            ]),
            borderRadius: [3, 3, 0, 0]
          }
        })),
        label: {
          show: true,
          position: 'top',
          color: '#FF6B00',
          fontSize: 12,
          fontWeight: 600
        }
      }
    ]
  })
}

watch(() => props.defects, renderChart, { deep: true })

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

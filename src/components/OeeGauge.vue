<template>
  <div class="panel">
    <div class="corner-tl"></div><div class="corner-tr"></div>
    <div class="corner-bl"></div><div class="corner-br"></div>
    <div class="panel-header">
      <span class="panel-title">OEE 综合效率</span>
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

const props = defineProps<{ oee: number; yieldRate: number }>()
const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

function renderChart() {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)

  chart.setOption({
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '80%',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        progress: {
          show: true,
          width: 14,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#FF3333' },
              { offset: 0.5, color: '#FFD700' },
              { offset: 1, color: '#00FF88' }
            ])
          }
        },
        axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(255,255,255,0.08)']] } },
        pointer: { width: 4, length: '60%', itemStyle: { color: '#FF6B00' } },
        anchor: { show: true, size: 8, itemStyle: { color: '#FF6B00' } },
        axisTick: { show: false },
        splitLine: { length: 8, lineStyle: { color: 'rgba(255,255,255,0.15)' } },
        axisLabel: { color: '#666', fontSize: 10, distance: 4 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#FF6B00',
          fontSize: 28,
          fontWeight: 700,
          offsetCenter: [0, '20%']
        },
        title: {
          offsetCenter: [0, '45%'],
          color: '#888',
          fontSize: 12
        },
        data: [{ value: props.oee, name: 'OEE' }]
      },
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '55%',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        progress: {
          show: true,
          width: 8,
          itemStyle: { color: '#00FF88' }
        },
        axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(255,255,255,0.05)']] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          formatter: '良率 {value}%',
          color: '#00FF88',
          fontSize: 13,
          offsetCenter: [0, '70%']
        },
        data: [{ value: props.yieldRate }]
      }
    ]
  })
}

watch(() => [props.oee, props.yieldRate], renderChart)

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
.chart { width: 100%; height: 100%; min-height: 200px; }
</style>

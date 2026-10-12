<template>
  <div class="panel workshop-panel">
    <div class="corner-tl"></div><div class="corner-tr"></div>
    <div class="corner-bl"></div><div class="corner-br"></div>
    <div class="panel-header">
      <span class="panel-title">3D 车间布局</span>
      <span class="legend">
        <span class="legend-item"><i class="dot running"></i>运行</span>
        <span class="legend-item"><i class="dot idle"></i>待机</span>
        <span class="legend-item"><i class="dot warning"></i>预警</span>
        <span class="legend-item"><i class="dot error"></i>故障</span>
      </span>
    </div>
    <div class="panel-body">
      <div ref="containerRef" class="canvas-container"></div>
      <div class="device-labels">
        <div
          v-for="(d, i) in devices"
          :key="d.id"
          class="label-3d"
          :class="d.status"
          :style="labelPositions[i]"
        >
          <span class="l3d-name">{{ d.name }}</span>
          <span class="l3d-status">{{ statusText(d.status) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import type { Device, DeviceStatus } from '../types'

const props = defineProps<{ devices: Device[] }>()
const containerRef = ref<HTMLElement>()
const labelPositions = ref<Record<string, string>[]>([])

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let machineMeshes: THREE.Mesh[] = []

const statusColors: Record<DeviceStatus, number> = {
  running: 0x00ff88,
  idle: 0xffd700,
  warning: 0xff9a00,
  error: 0xff3333
}

function statusText(s: DeviceStatus) {
  return { running: '运行中', idle: '待机', warning: '预警', error: '故障' }[s]
}

function init3D() {
  if (!containerRef.value) return
  const w = containerRef.value.clientWidth
  const h = containerRef.value.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0d0d0d)
  scene.fog = new THREE.Fog(0x0d0d0d, 30, 80)

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200)
  camera.position.set(18, 20, 18)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // 灯光
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)
  const dirLight = new THREE.DirectionalLight(0xff8844, 0.6)
  dirLight.position.set(10, 20, 10)
  scene.add(dirLight)
  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3)
  fillLight.position.set(-10, 10, -10)
  scene.add(fillLight)

  // 地面
  const floorGeo = new THREE.PlaneGeometry(28, 28)
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.4 })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  // 地面网格线
  const grid = new THREE.GridHelper(28, 14, 0xff6b00, 0x333333)
  grid.position.y = 0.01
  ;(grid.material as THREE.Material).opacity = 0.3
  ;(grid.material as THREE.Material).transparent = true
  scene.add(grid)

  // 车间外墙
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.15, side: THREE.DoubleSide })
  const wallH = 6
  const wall1 = new THREE.Mesh(new THREE.BoxGeometry(28, wallH, 0.2), wallMat)
  wall1.position.set(0, wallH / 2, -14)
  scene.add(wall1)
  const wall2 = wall1.clone()
  wall2.position.set(0, wallH / 2, 14)
  scene.add(wall2)
  const wall3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, wallH, 28), wallMat)
  wall3.position.set(-14, wallH / 2, 0)
  scene.add(wall3)
  const wall4 = wall3.clone()
  wall4.position.set(14, wallH / 2, 0)
  scene.add(wall4)

  // 设备方块
  machineMeshes = []
  const positions = [
    { x: -8, z: -6 },
    { x: 8, z: -6 },
    { x: -8, z: 6 },
    { x: 8, z: 6 }
  ]
  props.devices.forEach((d, i) => {
    const pos = positions[i % positions.length]
    const geo = new THREE.BoxGeometry(4, 3, 4)
    const mat = new THREE.MeshStandardMaterial({
      color: statusColors[d.status],
      metalness: 0.6,
      roughness: 0.3,
      emissive: statusColors[d.status],
      emissiveIntensity: d.status === 'error' ? 0.5 : d.status === 'warning' ? 0.3 : 0.1
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(pos.x, 1.5, pos.z)
    scene.add(mesh)
    machineMeshes.push(mesh)

    // 设备底座
    const baseGeo = new THREE.BoxGeometry(4.5, 0.3, 4.5)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 })
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.set(pos.x, 0.15, pos.z)
    scene.add(base)

    // 传送带连接
    if (i < props.devices.length - 1) {
      const nextPos = positions[(i + 1) % positions.length]
      const beltGeo = new THREE.BoxGeometry(
        Math.abs(nextPos.x - pos.x) || 0.5,
        0.3,
        Math.abs(nextPos.z - pos.z) || 0.5
      )
      const beltMat = new THREE.MeshStandardMaterial({ color: 0x553311, metalness: 0.5 })
      const belt = new THREE.Mesh(beltGeo, beltMat)
      belt.position.set(
        (pos.x + nextPos.x) / 2,
        0.15,
        (pos.z + nextPos.z) / 2
      )
      scene.add(belt)
    }

    // 更新标签位置
    const screenPos = projectToScreen(mesh.position.clone().add(new THREE.Vector3(0, 2.5, 0)))
    labelPositions.value[i] = {
      left: `${screenPos.x}px`,
      top: `${screenPos.y}px`
    }
  })

  animate()
}

function projectToScreen(pos: THREE.Vector3): { x: number; y: number } {
  if (!containerRef.value) return { x: 0, y: 0 }
  const vec = pos.clone().project(camera)
  const w = containerRef.value.clientWidth
  const h = containerRef.value.clientHeight
  return {
    x: (vec.x * 0.5 + 0.5) * w,
    y: (-vec.y * 0.5 + 0.5) * h
  }
}

function updateLabels() {
  if (!containerRef.value) return
  const positions = [
    { x: -8, z: -6 }, { x: 8, z: -6 }, { x: -8, z: 6 }, { x: 8, z: 6 }
  ]
  props.devices.forEach((_, i) => {
    const pos = positions[i % positions.length]
    const screenPos = projectToScreen(new THREE.Vector3(pos.x, 4, pos.z))
    labelPositions.value[i] = {
      left: `${screenPos.x}px`,
      top: `${screenPos.y}px`
    }
  })
}

let angle = 0
function animate() {
  animationId = requestAnimationFrame(animate)
  angle += 0.002

  // 相机缓慢旋转
  camera.position.x = Math.cos(angle) * 22
  camera.position.z = Math.sin(angle) * 22
  camera.position.y = 18
  camera.lookAt(0, 1, 0)

  // 设备微微浮动
  machineMeshes.forEach((mesh, i) => {
    mesh.position.y = 1.5 + Math.sin(angle * 3 + i) * 0.05
  })

  updateLabels()
  renderer.render(scene, camera)
}

function updateDeviceColors() {
  props.devices.forEach((d, i) => {
    if (machineMeshes[i]) {
      const mat = machineMeshes[i].material as THREE.MeshStandardMaterial
      mat.color.setHex(statusColors[d.status])
      mat.emissive.setHex(statusColors[d.status])
      mat.emissiveIntensity = d.status === 'error' ? 0.5 : d.status === 'warning' ? 0.3 : 0.1
    }
  })
}

watch(() => props.devices, updateDeviceColors, { deep: true })

function onResize() {
  if (!containerRef.value || !camera || !renderer) return
  const w = containerRef.value.clientWidth
  const h = containerRef.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

onMounted(() => {
  init3D()
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
  if (renderer?.domElement && containerRef.value) {
    containerRef.value.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.workshop-panel { position: relative; }
.canvas-container {
  width: 100%;
  height: 100%;
  min-height: 280px;
}
.device-labels {
  position: absolute;
  top: 42px;
  left: 0;
  width: 100%;
  height: calc(100% - 42px);
  pointer-events: none;
}
.label-3d {
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 8px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.label-3d.running { border-color: var(--status-running); }
.label-3d.idle { border-color: var(--status-idle); }
.label-3d.warning { border-color: var(--status-warning); }
.label-3d.error { border-color: var(--status-error); }
.l3d-name { font-size: 12px; color: var(--text-primary); }
.l3d-status { font-size: 11px; color: var(--text-muted); }
.legend {
  display: flex;
  gap: 12px;
  margin-left: auto;
}
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-secondary); }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot.running { background: var(--status-running); }
.dot.idle { background: var(--status-idle); }
.dot.warning { background: var(--status-warning); }
.dot.error { background: var(--status-error); }
</style>

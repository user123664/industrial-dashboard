import { onMounted, onUnmounted } from 'vue'

/**
 * 大屏自适应：基于 1920x1080 设计稿，通过 CSS transform scale 自适应任意分辨率
 */
export function useScreenAdapter(designWidth = 1920, designHeight = 1080) {
  let scale = 1

  function updateScale() {
    const sw = window.innerWidth
    const sh = window.innerHeight
    const scaleX = sw / designWidth
    const scaleY = sh / designHeight
    scale = Math.min(scaleX, scaleY)
    const root = document.getElementById('app')
    if (root) {
      root.style.transform = `scale(${scale})`
      root.style.transformOrigin = 'top left'
      root.style.width = `${designWidth}px`
      root.style.height = `${designHeight}px`
    }
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateScale)
  })

  return { scale, updateScale }
}

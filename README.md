# 智能制造产线监控可视化大屏

基于 Vue 3 + TypeScript + Three.js + ECharts 的工业生产线监控大屏项目。

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3 + TypeScript + Vite |
| 3D | Three.js (WebGL) |
| 图表 | ECharts 5 |
| 音效 | Web Audio API |
| 样式 | CSS 变量 + 工业橙黑风 |

## 功能模块

- **顶部导航栏**：实时时钟、总产量/良率/告警数/设备在线数全局指标
- **设备运行状态**：4台设备实时监控（温度/转速/产量/利用率），状态颜色编码
- **OEE 综合效率**：双仪表盘（OEE + 良率），渐变色进度
- **3D 车间布局**：Three.js 构建车间建筑 + 设备方块 + 传送带，相机自动旋转巡游，设备状态实时变色
- **产量趋势**：计划产量 vs 实际产量折线图，渐变面积填充
- **质量雷达**：6维度质量指标 vs 目标值对比
- **缺陷分布**：5类缺陷柱状图
- **实时告警**：告警列表 + 弹窗通知 + Web Audio 告警音效（故障三声急促高音，预警两声柔和提示音）
- **大屏自适应**：基于 1920x1080 设计稿，CSS transform scale 自适应任意分辨率

## 项目结构

```
industrial-dashboard/
├── src/
│   ├── components/
│   │   ├── ScreenHeader.vue      # 顶部导航栏
│   │   ├── DeviceStatus.vue      # 设备状态列表
│   │   ├── OeeGauge.vue          # OEE 仪表盘
│   │   ├── Workshop3D.vue        # Three.js 3D 车间
│   │   ├── ProductionTrend.vue   # 产量趋势折线图
│   │   ├── QualityRadar.vue     # 质量雷达图
│   │   ├── DefectBar.vue         # 缺陷柱状图
│   │   ├── AlertList.vue         # 告警列表
│   │   └── AlertModal.vue        # 告警弹窗
│   ├── composables/
│   │   ├── useScreenAdapter.ts   # 大屏自适应
│   │   └── useMockData.ts        # 实时数据模拟
│   ├── utils/
│   │   ├── audioAlert.ts         # Web Audio 告警音效
│   │   └── mockData.ts           # Mock 数据生成
│   ├── types/index.ts             # 类型定义
│   ├── assets/styles/main.css    # 全局工业橙黑风样式
│   ├── App.vue                   # 主布局
│   └── main.ts                   # 入口
├── preview/index.html            # 单文件预览版（打开即用）
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 快速开始

### 方式一：工程化运行

```bash
npm install
npm run dev
```

### 方式二：预览版（无需安装）

直接用浏览器打开 `preview/index.html` 即可。
<img width="2588" height="1452" alt="屏幕截图 2026-10-12 091856" src="https://github.com/user-attachments/assets/f9123026-aa10-4c00-87c3-6e736a59ca24" />



## 简历描述参考

> **智能制造产线监控可视化大屏** | 个人项目
>
> - 基于 Vue 3 + TypeScript + Vite 搭建工业监控大屏，实现 1920px~4K 多分辨率 CSS scale 自适应
> - 封装 ECharts 图表组件库（仪表盘/折线/雷达/柱状），支持数据实时刷新与渐变动画
> - 使用 Three.js 构建 3D 车间布局模型，含设备方块/传送带/外墙结构，相机自动旋转巡游，设备状态实时变色映射
> - 通过 Web Audio API 实现告警音效（故障三声急促高音/预警两声柔和提示），结合弹窗通知实现多级告警
> - 模拟 WebSocket 定时推送（5s 设备数据 + 15s 产量数据），实现全局数据联动更新

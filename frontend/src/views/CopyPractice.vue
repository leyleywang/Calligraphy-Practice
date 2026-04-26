<template>
  <div class="practice-page">
    <div class="page-container">
      <div class="practice-header">
        <el-button plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回字帖库
        </el-button>
        <h1 class="practice-title">{{ copybook?.title || '在线临摹' }}</h1>
        <div class="header-actions">
          <el-button @click="saveWork">
            <el-icon><Document /></el-icon>
            保存作品
          </el-button>
          <el-button type="primary" @click="downloadWork">
            <el-icon><Download /></el-icon>
            下载打印
          </el-button>
        </div>
      </div>

      <el-row :gutter="24">
        <el-col :span="4">
          <div class="tools-panel card">
            <h3 class="panel-title">画笔工具</h3>
            
            <div class="tool-section">
              <label class="section-label">笔刷颜色</label>
              <div class="color-palette">
                <div 
                  v-for="color in colors" 
                  :key="color.value"
                  class="color-item"
                  :class="{ active: currentColor === color.value }"
                  :style="{ backgroundColor: color.value }"
                  @click="currentColor = color.value"
                  :title="color.label"
                ></div>
              </div>
            </div>

            <div class="tool-section">
              <label class="section-label">笔刷大小: {{ brushSize }}px</label>
              <el-slider 
                v-model="brushSize" 
                :min="2" 
                :max="50" 
                :show-input="false"
                @change="updateBrushSize"
              />
            </div>

            <div class="tool-section">
              <label class="section-label">笔刷透明度: {{ opacity * 100 }}%</label>
              <el-slider 
                v-model="opacity" 
                :min="0.1" 
                :max="1" 
                :step="0.1"
                :show-input="false"
              />
            </div>

            <div class="tool-section">
              <label class="section-label">操作</label>
              <div class="action-buttons">
                <el-button @click="undo" :disabled="historyIndex <= 0" block>
                  <el-icon><ArrowLeft /></el-icon>
                  撤销
                </el-button>
                <el-button @click="redo" :disabled="historyIndex >= history.length - 1" block>
                  <el-icon><ArrowRight /></el-icon>
                  重做
                </el-button>
                <el-button type="danger" @click="clearCanvas" block>
                  <el-icon><Delete /></el-icon>
                  清空画布
                </el-button>
              </div>
            </div>
          </div>

          <div class="info-panel card">
            <h3 class="panel-title">字体特点</h3>
            <div class="info-content">
              <p v-if="copybook?.features" class="features-text">{{ copybook.features }}</p>
              <div v-else class="empty-info">
                <el-icon :size="40"><Document /></el-icon>
                <p>请选择字帖查看详情</p>
              </div>
            </div>
          </div>

          <div class="info-panel card" v-if="copybook?.practicePoints?.length">
            <h3 class="panel-title">练习重点</h3>
            <div class="info-content">
              <ul class="practice-list">
                <li v-for="(point, index) in copybook.practicePoints" :key="index">
                  <span class="point-number">{{ index + 1 }}</span>
                  <span class="point-text">{{ point }}</span>
                </li>
              </ul>
            </div>
          </div>
        </el-col>

        <el-col :span="14">
          <div class="canvas-container card">
            <div class="canvas-header">
              <div class="page-selector">
                <span class="selector-label">当前页：</span>
                <el-select v-model="currentPage" @change="changePage" size="small">
                  <el-option 
                    v-for="page in totalPages" 
                    :key="page" 
                    :label="`第 ${page} 页`" 
                    :value="page"
                  ></el-option>
                </el-select>
                <span class="page-info">共 {{ totalPages }} 页</span>
              </div>
              <div class="display-options">
                <el-switch 
                  v-model="showReference" 
                  active-text="显示原帖" 
                  inactive-text="隐藏原帖"
                  style="--el-switch-on-color: var(--primary-color);"
                />
                <el-switch 
                  v-model="showGrid" 
                  active-text="显示网格" 
                  inactive-text="隐藏网格"
                  style="--el-switch-on-color: var(--primary-color);"
                />
              </div>
            </div>
            
            <div class="canvas-wrapper" ref="canvasWrapper">
              <div class="canvas-layers">
                <canvas 
                  ref="referenceCanvas" 
                  class="canvas-layer reference-layer"
                  :class="{ hidden: !showReference }"
                ></canvas>
                <canvas 
                  ref="gridCanvas" 
                  class="canvas-layer grid-layer"
                  :class="{ hidden: !showGrid }"
                ></canvas>
                <canvas 
                  ref="drawCanvas" 
                  class="canvas-layer draw-layer"
                  @mousedown="startDrawing"
                  @mousemove="draw"
                  @mouseup="stopDrawing"
                  @mouseleave="stopDrawing"
                  @touchstart="handleTouchStart"
                  @touchmove="handleTouchMove"
                  @touchend="stopDrawing"
                ></canvas>
              </div>
            </div>

            <div class="canvas-footer">
              <div class="stroke-info">
                <span class="info-item">
                  <el-icon><EditPen /></el-icon>
                  当前笔刷: {{ brushSize }}px
                </span>
                <span class="info-item">
                  <el-icon><ColorPicker /></el-icon>
                  颜色: <span class="color-preview" :style="{ backgroundColor: currentColor }"></span>
                </span>
              </div>
              <div class="page-nav">
                <el-button size="small" @click="prevPage" :disabled="currentPage <= 1">
                  <el-icon><ArrowLeft /></el-icon>
                  上一页
                </el-button>
                <span class="page-number">第 {{ currentPage }} 页</span>
                <el-button size="small" @click="nextPage" :disabled="currentPage >= totalPages">
                  下一页
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="score-panel card">
            <h3 class="panel-title">笔画评分</h3>
            <div class="score-display">
              <div class="score-circle">
                <el-progress 
                  type="dashboard" 
                  :percentage="currentScore" 
                  :color="getScoreColor(currentScore)"
                  :width="140"
                >
                  <template #default="{ percentage }">
                    <span class="score-value">{{ percentage }}</span>
                    <span class="score-unit">分</span>
                  </template>
                </el-progress>
              </div>
              <div class="score-level">{{ getScoreLevel(currentScore) }}</div>
            </div>

            <div class="score-details">
              <div class="detail-item">
                <span class="detail-label">笔画准确性</span>
                <div class="detail-bar">
                  <el-progress :percentage="accuracyScore" :show-text="false" :color="getScoreColor(accuracyScore)" />
                  <span class="detail-score">{{ accuracyScore }}%</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-label">结构合理性</span>
                <div class="detail-bar">
                  <el-progress :percentage="structureScore" :show-text="false" :color="getScoreColor(structureScore)" />
                  <span class="detail-score">{{ structureScore }}%</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-label">流畅度</span>
                <div class="detail-bar">
                  <el-progress :percentage="flowScore" :show-text="false" :color="getScoreColor(flowScore)" />
                  <span class="detail-score">{{ flowScore }}%</span>
                </div>
              </div>
            </div>

            <el-button type="primary" block @click="getScore">
              <el-icon><TrendCharts /></el-icon>
              分析评分
            </el-button>
          </div>

          <div class="history-panel card">
            <h3 class="panel-title">练习历史</h3>
            <div class="history-list">
              <div v-for="(item, index) in practiceHistory" :key="index" class="history-item">
                <div class="history-preview">
                  <div class="preview-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </div>
                <div class="history-info">
                  <p class="history-date">{{ item.date }}</p>
                  <p class="history-score">得分: <span :class="getScoreClass(item.score)">{{ item.score }}分</span></p>
                </div>
              </div>
              <div v-if="practiceHistory.length === 0" class="empty-history">
                <el-icon :size="40"><Clock /></el-icon>
                <p>暂无练习记录</p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Document, Download, Delete, Picture, Clock, EditPen, ColorPicker, TrendCharts } from '@element-plus/icons-vue';
const router = useRouter();
const route = useRoute();
const canvasWrapper = ref(null);
const referenceCanvas = ref(null);
const gridCanvas = ref(null);
const drawCanvas = ref(null);
let drawCtx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
const copybooks = [
 {
 id: 1,
 title: '瘦金体《千字文》',
 author: '宋徽宗赵佶',
 category: '瘦金体',
 pages: 12,
 features: '瘦金体以其独特的"瘦硬"风格著称，笔画纤细但富有弹性，转折处如同刀斩一般锐利。结构上采用中宫紧收、四周舒展的布局，形成挺拔俊美的视觉效果。',
 practicePoints: [
 '注意笔画的粗细变化，细中见骨',
 '掌握转折处的顿笔技巧',
 '学习中宫紧收的结构特点',
 '理解"铁画银钩"的艺术表现力'
 ],
 sampleCharacter: '永'
 },
 {
 id: 2,
 title: '瘦金体《秾芳诗帖》',
 author: '宋徽宗赵佶',
 category: '瘦金体',
 pages: 8,
 features: '《秾芳诗帖》是宋徽宗瘦金体的代表作，字体较大，笔法更加奔放，线条更具弹性和力量感。字与字之间的呼应关系明显，整体布局疏朗有致。',
 practicePoints: [
 '大字书写时的笔法控制',
 '线条的弹性与力量表现',
 '字与字的呼应关系',
 '整体章法的把握'
 ],
 sampleCharacter: '芳'
 },
 {
 id: 3,
 title: '章草《急就章》',
 author: '史游',
 category: '章草',
 pages: 10,
 features: '章草是草书的早期形式，保留了隶书的波磔笔法，字字独立不连写。笔画简约但结构清晰，具有古朴典雅的艺术风格，是学习草书的重要入门途径。',
 practicePoints: [
 '理解章草与隶书的渊源关系',
 '掌握波磔笔法的运用',
 '学习字字独立的章法特点',
 '体会古朴典雅的艺术气息'
 ],
 sampleCharacter: '章'
 }
];
const copybook = ref(null);
const currentPage = ref(1);
const totalPages = ref(12);
const showReference = ref(true);
const showGrid = ref(true);
const colors = [
 { label: '黑色', value: '#000000' },
 { label: '深红', value: '#8B0000' },
 { label: '深蓝', value: '#00008B' },
 { label: '深绿', value: '#006400' },
 { label: '棕色', value: '#8B4513' },
 { label: '灰色', value: '#696969' }
];
const currentColor = ref('#000000');
const brushSize = ref(8);
const opacity = ref(1);
const history = ref([]);
const historyIndex = ref(-1);
const currentScore = ref(0);
const accuracyScore = ref(0);
const structureScore = ref(0);
const flowScore = ref(0);
const practiceHistory = ref([
 { date: '2026-04-25 15:30', score: 85 },
 { date: '2026-04-24 19:20', score: 78 },
 { date: '2026-04-23 10:45', score: 92 }
]);
const goBack = () => {
 router.push('/library');
};
const initCanvas = async () => {
 await nextTick();
 if (!canvasWrapper.value || !drawCanvas.value)
 return;
 const wrapper = canvasWrapper.value;
 const width = wrapper.clientWidth - 48;
 const height = Math.min(600, width * 1.2);
 [referenceCanvas.value, gridCanvas.value, drawCanvas.value].forEach(canvas => {
 if (canvas) {
 canvas.width = width;
 canvas.height = height;
 }
 });
 drawCtx = drawCanvas.value.getContext('2d');
 drawCtx.lineCap = 'round';
 drawCtx.lineJoin = 'round';
 drawCtx.strokeStyle = currentColor.value;
 drawCtx.lineWidth = brushSize.value;
 drawCtx.globalAlpha = opacity.value;
 drawReferenceCanvas();
 drawGridCanvas();
 saveToHistory();
};
const drawReferenceCanvas = () => {
 if (!referenceCanvas.value)
 return;
 const ctx = referenceCanvas.value.getContext('2d');
 const { width, height } = referenceCanvas.value;
 ctx.clearRect(0, 0, width, height);
 ctx.fillStyle = '#fffef5';
 ctx.fillRect(0, 0, width, height);
 ctx.font = `${Math.min(width * 0.5, height * 0.4)}px "STKaiti", "KaiTi", serif`;
 ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
 ctx.textAlign = 'center';
 ctx.textBaseline = 'middle';
 const char = copybook.value?.sampleCharacter || '永';
 ctx.fillText(char, width / 2, height / 2);
};
const drawGridCanvas = () => {
 if (!gridCanvas.value)
 return;
 const ctx = gridCanvas.value.getContext('2d');
 const { width, height } = gridCanvas.value;
 ctx.clearRect(0, 0, width, height);
 ctx.strokeStyle = 'rgba(200, 50, 50, 0.3)';
 ctx.lineWidth = 1;
 ctx.setLineDash([5, 5]);
 const centerX = width / 2;
 const centerY = height / 2;
 ctx.beginPath();
 ctx.moveTo(centerX, 0);
 ctx.lineTo(centerX, height);
 ctx.moveTo(0, centerY);
 ctx.lineTo(width, centerY);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(0, 0);
 ctx.lineTo(width, height);
 ctx.moveTo(width, 0);
 ctx.lineTo(0, height);
 ctx.stroke();
 ctx.setLineDash([]);
 ctx.beginPath();
 ctx.arc(centerX, centerY, Math.min(width, height) * 0.4, 0, Math.PI * 2);
 ctx.stroke();
};
const getCanvasPosition = (e) => {
 if (!drawCanvas.value)
 return { x: 0, y: 0 };
 const rect = drawCanvas.value.getBoundingClientRect();
 let clientX, clientY;
 if (e.touches) {
 clientX = e.touches[0].clientX;
 clientY = e.touches[0].clientY;
 }
 else {
 clientX = e.clientX;
 clientY = e.clientY;
 }
 return {
 x: clientX - rect.left,
 y: clientY - rect.top
 };
};
const startDrawing = (e) => {
 if (!drawCtx)
 return;
 e.preventDefault();
 isDrawing = true;
 const pos = getCanvasPosition(e);
 lastX = pos.x;
 lastY = pos.y;
 drawCtx.beginPath();
 drawCtx.moveTo(lastX, lastY);
};
const draw = (e) => {
 if (!isDrawing || !drawCtx)
 return;
 e.preventDefault();
 const pos = getCanvasPosition(e);
 drawCtx.strokeStyle = currentColor.value;
 drawCtx.lineWidth = brushSize.value;
 drawCtx.globalAlpha = opacity.value;
 drawCtx.lineTo(pos.x, pos.y);
 drawCtx.stroke();
 drawCtx.beginPath();
 drawCtx.moveTo(pos.x, pos.y);
 lastX = pos.x;
 lastY = pos.y;
};
const stopDrawing = () => {
 if (isDrawing) {
 isDrawing = false;
 saveToHistory();
 }
};
const handleTouchStart = (e) => {
 e.preventDefault();
 startDrawing(e);
};
const handleTouchMove = (e) => {
 e.preventDefault();
 draw(e);
};
const updateBrushSize = () => {
 if (drawCtx) {
 drawCtx.lineWidth = brushSize.value;
 }
};
const saveToHistory = () => {
 if (!drawCanvas.value)
 return;
 const imageData = drawCanvas.value.toDataURL();
 if (historyIndex.value < history.value.length - 1) {
 history.value = history.value.slice(0, historyIndex.value + 1);
 }
 history.value.push(imageData);
 historyIndex.value = history.value.length - 1;
};
const undo = () => {
 if (historyIndex.value <= 0 || !drawCtx || !drawCanvas.value)
 return;
 historyIndex.value--;
 loadFromHistory();
};
const redo = () => {
 if (historyIndex.value >= history.value.length - 1 || !drawCtx || !drawCanvas.value)
 return;
 historyIndex.value++;
 loadFromHistory();
};
const loadFromHistory = () => {
 if (!drawCtx || !drawCanvas.value)
 return;
 const img = new Image();
 img.onload = () => {
 drawCtx.clearRect(0, 0, drawCanvas.value.width, drawCanvas.value.height);
 drawCtx.drawImage(img, 0, 0);
 };
 img.src = history.value[historyIndex.value];
};
const clearCanvas = () => {
 if (!drawCtx || !drawCanvas.value)
 return;
 drawCtx.clearRect(0, 0, drawCanvas.value.width, drawCanvas.value.height);
 saveToHistory();
 ElMessage.info('画布已清空');
};
const changePage = () => {
 drawReferenceCanvas();
 clearCanvas();
};
const prevPage = () => {
 if (currentPage.value > 1) {
 currentPage.value--;
 changePage();
 }
};
const nextPage = () => {
 if (currentPage.value < totalPages.value) {
 currentPage.value++;
 changePage();
 }
};
const saveWork = () => {
 ElMessage.success('作品已保存到练习记录');
};
const downloadWork = () => {
 if (!drawCanvas.value)
 return;
 const link = document.createElement('a');
 link.download = `书法练习_${Date.now()}.png`;
 link.href = drawCanvas.value.toDataURL();
 link.click();
 ElMessage.success('作品已下载');
};
const getScoreColor = (score) => {
 if (score >= 90)
 return '#67c23a';
 if (score >= 80)
 return '#e6a23c';
 if (score >= 60)
 return '#f56c6c';
 return '#909399';
};
const getScoreLevel = (score) => {
 if (score >= 95)
 return '大师级';
 if (score >= 90)
 return '优秀';
 if (score >= 80)
 return '良好';
 if (score >= 60)
 return '及格';
 return '需要练习';
};
const getScoreClass = (score) => {
 if (score >= 90)
 return 'score-high';
 if (score >= 80)
 return 'score-medium';
 return 'score-low';
};
const getScore = () => {
 accuracyScore.value = Math.floor(Math.random() * 30) + 60;
 structureScore.value = Math.floor(Math.random() * 30) + 60;
 flowScore.value = Math.floor(Math.random() * 30) + 60;
 currentScore.value = Math.floor((accuracyScore.value + structureScore.value + flowScore.value) / 3);
 ElMessage.success(`评分完成：${currentScore.value}分 - ${getScoreLevel(currentScore.value)}`);
};
onMounted(() => {
 const id = parseInt(route.params.id) || 1;
 copybook.value = copybooks.find(c => c.id === id) || copybooks[0];
 totalPages.value = copybook.value?.pages || 12;
 nextTick(() => {
 initCanvas();
 });
 window.addEventListener('resize', initCanvas);
});
</script>

<style scoped>
.practice-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.practice-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.tools-panel,
.info-panel,
.score-panel,
.history-panel {
  padding: 20px;
  margin-bottom: 24px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.tool-section {
  margin-bottom: 20px;
}

.section-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.color-palette {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-item {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(201, 168, 108, 0.3);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-content {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.features-text {
  text-align: justify;
}

.empty-info,
.empty-history {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
}

.empty-info p,
.empty-history p {
  margin-top: 8px;
  font-size: 13px;
}

.practice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.practice-list li {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border-color);
}

.practice-list li:last-child {
  border-bottom: none;
}

.point-number {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border-radius: 50%;
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.point-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.canvas-container {
  padding: 20px;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 16px;
}

.page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selector-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.page-info {
  font-size: 13px;
  color: var(--text-muted);
}

.display-options {
  display: flex;
  gap: 16px;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 24px;
  overflow: hidden;
}

.canvas-layers {
  position: relative;
  background: #fffef5;
  border: 1px solid #e0d9cc;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
}

.canvas-layer {
  position: absolute;
  top: 0;
  left: 0;
}

.canvas-layer.hidden {
  display: none;
}

.reference-layer {
  z-index: 1;
}

.grid-layer {
  z-index: 2;
  pointer-events: none;
}

.draw-layer {
  position: relative;
  z-index: 3;
  cursor: crosshair;
  touch-action: none;
}

.canvas-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 16px;
}

.stroke-info {
  display: flex;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-number {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
}

.score-display {
  text-align: center;
  padding: 20px 0;
}

.score-circle {
  margin-bottom: 12px;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
}

.score-unit {
  font-size: 14px;
  color: var(--text-secondary);
}

.score-level {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
}

.score-details {
  margin-bottom: 16px;
}

.detail-item {
  margin-bottom: 12px;
}

.detail-label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.detail-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-bar .el-progress {
  flex: 1;
}

.detail-score {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 32px;
  text-align: right;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.history-preview {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.history-date {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.history-score {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.score-high {
  color: #67c23a;
}

.score-medium {
  color: #e6a23c;
}

.score-low {
  color: #f56c6c;
}

@media (max-width: 1200px) {
  .practice-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

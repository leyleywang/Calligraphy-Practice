<template>
  <div class="library-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">字帖库</h1>
        <p class="page-desc">专注小众书法字体，高清电子字帖，解决字帖难寻问题</p>
      </div>

      <div class="category-section">
        <el-tabs v-model="activeCategory" type="card">
          <el-tab-pane 
            v-for="category in categories" 
            :key="category.value" 
            :label="category.label" 
            :name="category.value"
          >
            <div class="category-info">
              <p class="category-desc">{{ category.description }}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="filter-bar">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索字帖名称、作者..." 
          style="width: 300px;"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div class="filter-tags">
          <span class="filter-label">难度：</span>
          <el-tag 
            v-for="diff in difficultyLevels" 
            :key="diff.value"
            :type="activeDifficulty === diff.value ? '' : 'info'"
            effect="plain"
            class="diff-tag"
            @click="activeDifficulty = diff.value"
            :class="{ active: activeDifficulty === diff.value }"
          >
            {{ diff.label }}
          </el-tag>
        </div>
      </div>

      <el-row :gutter="24">
        <el-col :xs="12" :sm="8" :md="8" :lg="6" v-for="copybook in filteredCopybooks" :key="copybook.id">
          <div class="copybook-card card">
            <div class="copybook-image">
              <img :src="copybook.image" :alt="copybook.title" />
              <div class="copybook-overlay">
                <div class="overlay-actions">
                  <el-button type="primary" size="small" @click="startPractice(copybook.id)">
                    <el-icon><EditPen /></el-icon>
                    开始临摹
                  </el-button>
                </div>
              </div>
              <div class="difficulty-badge" :class="copybook.difficulty">
                {{ getDifficultyLabel(copybook.difficulty) }}
              </div>
            </div>
            <div class="copybook-info">
              <h3 class="copybook-title">{{ copybook.title }}</h3>
              <p class="copybook-author">{{ copybook.author }}</p>
              <div class="copybook-features">
                <el-tag size="small" type="warning">{{ copybook.category }}</el-tag>
                <span class="page-count">共 {{ copybook.pages }} 页</span>
              </div>
              <div class="copybook-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ copybook.views }} 浏览
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ copybook.likes }} 收藏
                </span>
              </div>
              <div class="copybook-actions">
                <el-button size="small" type="primary" plain @click="startPractice(copybook.id)">
                  <el-icon><EditPen /></el-icon>
                  在线临摹
                </el-button>
                <el-button size="small" @click="downloadCopybook(copybook)">
                  <el-icon><Download /></el-icon>
                  下载打印
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog 
      v-model="showDetail" 
      :title="selectedCopybook?.title" 
      width="800px"
      :show-close="true"
    >
      <div v-if="selectedCopybook" class="copybook-detail">
        <el-row :gutter="24">
          <el-col :span="10">
            <el-image 
              :src="selectedCopybook.image" 
              style="width: 100%; border-radius: 8px;"
              fit="cover"
            />
          </el-col>
          <el-col :span="14">
            <h3 class="detail-title">{{ selectedCopybook.title }}</h3>
            <p class="detail-author">作者：{{ selectedCopybook.author }}</p>
            <div class="detail-tags">
              <el-tag type="warning">{{ selectedCopybook.category }}</el-tag>
              <el-tag :type="selectedCopybook.difficulty === 'beginner' ? 'success' : selectedCopybook.difficulty === 'intermediate' ? 'warning' : 'danger'">
                {{ getDifficultyLabel(selectedCopybook.difficulty) }}
              </el-tag>
              <el-tag>共 {{ selectedCopybook.pages }} 页</el-tag>
            </div>
            
            <div class="detail-section">
              <h4 class="section-subtitle">字体特点</h4>
              <p class="section-content">{{ selectedCopybook.features }}</p>
            </div>
            
            <div class="detail-section">
              <h4 class="section-subtitle">练习重点</h4>
              <ul class="section-list">
                <li v-for="(point, index) in selectedCopybook.practicePoints" :key="index">
                  <el-icon><Check /></el-icon>
                  {{ point }}
                </li>
              </ul>
            </div>
            
            <div class="detail-actions">
              <el-button type="primary" size="large" @click="startPractice(selectedCopybook.id)">
                <el-icon><EditPen /></el-icon>
                开始临摹
              </el-button>
              <el-button size="large" @click="downloadCopybook(selectedCopybook)">
                <el-icon><Download /></el-icon>
                下载打印
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, 
  EditPen, 
  Download, 
  View, 
  Star,
  Check
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const categories = [
  { value: 'all', label: '全部', description: '浏览所有小众书法字帖' },
  { value: '瘦金体', label: '瘦金体', description: '宋徽宗赵佶创立，笔画瘦硬、转折锐利、结构舒展，具有强烈的艺术个性' },
  { value: '章草', label: '章草', description: '早期草书的一种，保留隶书波磔，笔画简约，字字独立，古朴典雅' },
  { value: '魏碑', label: '魏碑', description: '南北朝时期石刻书法，方笔斩截、气势雄强，是楷书发展的重要阶段' },
  { value: '其他', label: '其他', description: '金文、甲骨文、鸟虫篆等小众书法字体' }
]

const difficultyLevels = [
  { label: '全部', value: 'all' },
  { label: '入门', value: 'beginner' },
  { label: '进阶', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

const activeCategory = ref('all')
const activeDifficulty = ref('all')
const searchKeyword = ref('')
const showDetail = ref(false)
const selectedCopybook = ref(null)

const copybooks = ref([
  {
    id: 1,
    title: '瘦金体《千字文》',
    author: '宋徽宗赵佶',
    category: '瘦金体',
    difficulty: 'intermediate',
    pages: 12,
    views: 12580,
    likes: 3245,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shoujin%20style%20Chinese%20calligraphy%20Thousand%20Character%20Classic%20Huizong%20elegant%20thin%20strokes&image_size=square',
    features: '瘦金体以其独特的"瘦硬"风格著称，笔画纤细但富有弹性，转折处如同刀斩一般锐利。结构上采用中宫紧收、四周舒展的布局，形成挺拔俊美的视觉效果。',
    practicePoints: [
      '注意笔画的粗细变化，细中见骨',
      '掌握转折处的顿笔技巧',
      '学习中宫紧收的结构特点',
      '理解"铁画银钩"的艺术表现力'
    ]
  },
  {
    id: 2,
    title: '瘦金体《秾芳诗帖》',
    author: '宋徽宗赵佶',
    category: '瘦金体',
    difficulty: 'advanced',
    pages: 8,
    views: 8960,
    likes: 2187,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nongfang%20Poem%20Shoujin%20style%20Huizong%20calligraphy%20artistic%20elegant%20Chinese%20characters&image_size=square',
    features: '《秾芳诗帖》是宋徽宗瘦金体的代表作，字体较大，笔法更加奔放，线条更具弹性和力量感。字与字之间的呼应关系明显，整体布局疏朗有致。',
    practicePoints: [
      '大字书写时的笔法控制',
      '线条的弹性与力量表现',
      '字与字的呼应关系',
      '整体章法的把握'
    ]
  },
  {
    id: 3,
    title: '章草《急就章》',
    author: '史游',
    category: '章草',
    difficulty: 'beginner',
    pages: 10,
    views: 7820,
    likes: 1856,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangcao%20Jijiuzhang%20ancient%20Chinese%20cursive%20calligraphy%20bamboo%20slip%20style&image_size=square',
    features: '章草是草书的早期形式，保留了隶书的波磔笔法，字字独立不连写。笔画简约但结构清晰，具有古朴典雅的艺术风格，是学习草书的重要入门途径。',
    practicePoints: [
      '理解章草与隶书的渊源关系',
      '掌握波磔笔法的运用',
      '学习字字独立的章法特点',
      '体会古朴典雅的艺术气息'
    ]
  },
  {
    id: 4,
    title: '章草《月仪帖》',
    author: '索靖',
    category: '章草',
    difficulty: 'intermediate',
    pages: 6,
    views: 6540,
    likes: 1523,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yueyi%20Zhangcao%20Suojing%20style%20ancient%20Chinese%20cursive%20calligraphy%20elegant&image_size=square',
    features: '索靖的章草被誉为"银钩虿尾"，笔画流畅有力，结构精妙。《月仪帖》以书信形式呈现，内容按十二月排列，章法严谨，是章草艺术的精品。',
    practicePoints: [
      '学习"银钩虿尾"的笔法特点',
      '掌握流畅的笔画衔接',
      '理解章法的节奏感',
      '体会书信体的书写特点'
    ]
  },
  {
    id: 5,
    title: '魏碑《张猛龙碑》',
    author: '佚名',
    category: '魏碑',
    difficulty: 'intermediate',
    pages: 15,
    views: 9870,
    likes: 2654,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangmenglong%20Bei%20Weibei%20stone%20tablet%20calligraphy%20bold%20powerful%20Chinese%20characters&image_size=square',
    features: '《张猛龙碑》被誉为"魏碑第一"，笔法刚劲雄健，方笔斩截，结构险峻。整体风格既有北方石刻的粗犷豪放，又有南方书法的精致典雅，是魏碑书法的典范之作。',
    practicePoints: [
      '掌握方笔斩截的笔法',
      '学习险峻而不失稳重的结构',
      '理解刚柔相济的艺术特点',
      '体会石刻书法的金石气息'
    ]
  },
  {
    id: 6,
    title: '魏碑《龙门二十品》',
    author: '佚名',
    category: '魏碑',
    difficulty: 'advanced',
    pages: 20,
    views: 8320,
    likes: 2145,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Longmen%20Twenty%20Articles%20Weibei%20stone%20carving%20calligraphy%20powerful%20ancient&image_size=square',
    features: '《龙门二十品》是龙门石窟中最具代表性的造像题记，风格多样，或雄强、或秀逸、或古朴。是研究魏碑书法演变的重要资料，展现了北魏时期书法艺术的丰富多彩。',
    practicePoints: [
      '欣赏多种风格的魏碑书法',
      '学习不同造像记的笔法特点',
      '理解书法风格的多样性',
      '体会石刻书法的历史感'
    ]
  },
  {
    id: 7,
    title: '瘦金体《神霄玉清万寿宫诏》',
    author: '宋徽宗赵佶',
    category: '瘦金体',
    difficulty: 'intermediate',
    pages: 9,
    views: 5420,
    likes: 1234,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shenxiao%20Yuhua%20Wanshou%20Gongzhao%20Shoujin%20style%20imperial%20edict%20calligraphy&image_size=square',
    features: '此碑是宋徽宗瘦金体在碑刻中的体现，笔法更加规整，结构端庄。展现了瘦金体从墨迹到碑刻的艺术转化，是学习瘦金体碑版书法的重要范本。',
    practicePoints: [
      '理解碑刻与墨迹的差异',
      '学习更加规整的笔法',
      '掌握碑版书法的特点',
      '体会皇家书法的端庄气质'
    ]
  },
  {
    id: 8,
    title: '章草《出师颂》',
    author: '索靖',
    category: '章草',
    difficulty: 'intermediate',
    pages: 5,
    views: 7230,
    likes: 1678,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ChuShiSong%20Zhangcao%20Suojing%20ancient%20Chinese%20cursive%20calligraphy%20military%20text&image_size=square',
    features: '《出师颂》是章草的经典之作，内容描述出师征战的场景，书法气势磅礴，笔画遒劲有力。索靖的"银钩虿尾"笔法在此作中得到充分展现，是章草艺术的巅峰之作。',
    practicePoints: [
      '学习气势磅礴的章法',
      '掌握遒劲有力的笔法',
      '理解内容与形式的统一',
      '体会军事题材的书法表现'
    ]
  }
])

const getDifficultyLabel = (difficulty) => {
  const map = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return map[difficulty] || difficulty
}

const filteredCopybooks = computed(() => {
  let result = copybooks.value
  
  if (activeCategory.value !== 'all') {
    result = result.filter(c => c.category === activeCategory.value)
  }
  
  if (activeDifficulty.value !== 'all') {
    result = result.filter(c => c.difficulty === activeDifficulty.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(c => 
      c.title.toLowerCase().includes(keyword) || 
      c.author.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

const startPractice = (id) => {
  router.push(`/library/practice/${id}`)
}

const downloadCopybook = (copybook) => {
  ElMessage.success(`正在下载《${copybook.title}》字帖...`)
}

const viewDetail = (copybook) => {
  selectedCopybook.value = copybook
  showDetail.value = true
}
</script>

<style scoped>
.library-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  padding: 40px 0;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 12px;
}

.page-desc {
  font-size: 15px;
  color: var(--text-secondary);
}

.category-section {
  margin-bottom: 32px;
}

.category-info {
  padding: 16px 0;
}

.category-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color) !important;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color) !important;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: var(--border-color) !important;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.diff-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.diff-tag:hover {
  transform: translateY(-1px);
}

.diff-tag.active {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.copybook-card {
  margin-bottom: 24px;
  overflow: hidden;
}

.copybook-image {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: #f0f0f0;
}

.copybook-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.copybook-card:hover .copybook-image img {
  transform: scale(1.05);
}

.copybook-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.copybook-card:hover .copybook-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 12px;
}

.difficulty-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.difficulty-badge.beginner {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.difficulty-badge.intermediate {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
}

.difficulty-badge.advanced {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
}

.copybook-info {
  padding: 16px;
}

.copybook-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copybook-author {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.copybook-features {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.page-count {
  font-size: 12px;
  color: var(--text-muted);
}

.copybook-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.copybook-actions {
  display: flex;
  gap: 8px;
}

.copybook-actions .el-button {
  flex: 1;
}

.copybook-detail {
  padding: 8px 0;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
}

.detail-author {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.detail-section {
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.section-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.section-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  padding: 6px 0;
}

.section-list li .el-icon {
  color: var(--primary-color);
}

.detail-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-title {
    font-size: 24px;
  }
}
</style>

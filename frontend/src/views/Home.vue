<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">探索书法艺术之美</h1>
        <p class="hero-subtitle">专注于小众书法字体，传承经典，创新练习</p>
        <div class="hero-features">
          <div class="feature-item">
            <el-icon :size="28"><Collection /></el-icon>
            <span>高清字帖库</span>
          </div>
          <div class="feature-item">
            <el-icon :size="28"><EditPen /></el-icon>
            <span>在线临摹</span>
          </div>
          <div class="feature-item">
            <el-icon :size="28"><VideoCamera /></el-icon>
            <span>名师指导</span>
          </div>
          <div class="feature-item">
            <el-icon :size="28"><Share /></el-icon>
            <span>社区交流</span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-container">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">用户作品分享</h2>
          <div class="filter-tabs">
            <el-button-group>
              <el-button 
                v-for="tag in filterTags" 
                :key="tag.value"
                :type="activeTag === tag.value ? 'primary' : 'default'"
                @click="activeTag = tag.value"
                :plain="activeTag !== tag.value"
              >
                {{ tag.label }}
              </el-button>
            </el-button-group>
          </div>
        </div>

        <el-row :gutter="24">
          <el-col :xs="12" :sm="8" :md="6" :lg="6" v-for="work in filteredWorks" :key="work.id">
            <div class="work-card card" @click="viewWork(work.id)">
              <div class="work-image">
                <img :src="work.image" :alt="work.title" />
                <div class="work-overlay">
                  <el-icon :size="32"><View /></el-icon>
                  <span>查看详情</span>
                </div>
              </div>
              <div class="work-info">
                <h3 class="work-title">{{ work.title }}</h3>
                <div class="work-meta">
                  <div class="author">
                    <div class="avatar">{{ work.author.charAt(0) }}</div>
                    <span class="author-name">{{ work.author }}</span>
                  </div>
                  <div class="work-stats">
                    <span class="stat-item">
                      <el-icon><ChatDotRound /></el-icon>
                      {{ work.comments }}
                    </span>
                    <span class="stat-item">
                      <el-icon><Star /></el-icon>
                      {{ work.likes }}
                    </span>
                  </div>
                </div>
                <div class="work-tags">
                  <span class="tag" v-for="tag in work.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="load-more" v-if="hasMore">
          <el-button type="primary" plain @click="loadMore">加载更多</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Collection, 
  EditPen, 
  VideoCamera, 
  Share,
  View,
  ChatDotRound,
  Star
} from '@element-plus/icons-vue'

const router = useRouter()

const filterTags = [
  { label: '全部', value: 'all' },
  { label: '瘦金体', value: '瘦金体' },
  { label: '章草', value: '章草' },
  { label: '魏碑', value: '魏碑' },
  { label: '其他', value: '其他' }
]

const activeTag = ref('all')

const works = ref([
  {
    id: 1,
    title: '瘦金体《千字文》节选',
    author: '墨韵书生',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20calligraphy%20Shoujin%20style%20elegant%20thin%20strokes%20artistic%20writing&image_size=square',
    comments: 24,
    likes: 156,
    tags: ['瘦金体', '千字文']
  },
  {
    id: 2,
    title: '章草《急就章》临摹',
    author: '古风墨客',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangcao%20calligraphy%20ancient%20Chinese%20cursive%20style%20brush%20writing&image_size=square',
    comments: 18,
    likes: 89,
    tags: ['章草', '急就章']
  },
  {
    id: 3,
    title: '魏碑《张猛龙碑》',
    author: '碑学探索者',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Weibei%20stone%20tablet%20calligraphy%20bold%20powerful%20Chinese%20characters&image_size=square',
    comments: 32,
    likes: 203,
    tags: ['魏碑', '张猛龙碑']
  },
  {
    id: 4,
    title: '瘦金体五言联',
    author: '徽宗遗风',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shoujin%20style%20Chinese%20couplet%20calligraphy%20elegant%20artwork&image_size=square',
    comments: 15,
    likes: 112,
    tags: ['瘦金体', '对联']
  },
  {
    id: 5,
    title: '章草《出师颂》',
    author: '汉简爱好者',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangcao%20ChuShiSong%20ancient%20Chinese%20calligraphy%20bamboo%20slip%20style&image_size=square',
    comments: 28,
    likes: 167,
    tags: ['章草', '出师颂']
  },
  {
    id: 6,
    title: '魏碑《龙门二十品》',
    author: '石刻艺术',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Longmen%20Twenty%20Articles%20Weibei%20stone%20carving%20calligraphy%20powerful&image_size=square',
    comments: 45,
    likes: 234,
    tags: ['魏碑', '龙门造像']
  },
  {
    id: 7,
    title: '瘦金体《秾芳诗帖》',
    author: '瘦金传人',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nongfang%20Poem%20Shoujin%20style%20Huizong%20calligraphy%20elegant%20thin%20strokes&image_size=square',
    comments: 56,
    likes: 312,
    tags: ['瘦金体', '秾芳诗']
  },
  {
    id: 8,
    title: '章草《月仪帖》',
    author: '索靖后人',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yueyi%20Zhangcao%20Suojing%20style%20ancient%20Chinese%20cursive%20calligraphy&image_size=square',
    comments: 22,
    likes: 98,
    tags: ['章草', '月仪帖']
  }
])

const filteredWorks = computed(() => {
  if (activeTag.value === 'all') return works.value
  return works.value.filter(w => w.tags.includes(activeTag.value))
})

const hasMore = ref(true)

const viewWork = (id) => {
  router.push(`/work/${id}`)
}

const loadMore = () => {
  console.log('Loading more works...')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 60px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8d5b7' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  color: #e8d5b7;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 18px;
  color: #b8b8d1;
  margin-bottom: 40px;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #e8d5b7;
  padding: 20px 32px;
  background: rgba(232, 213, 183, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(232, 213, 183, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(232, 213, 183, 0.1);
  transform: translateY(-4px);
}

.feature-item .el-icon {
  color: #c9a86c;
}

.content-section {
  padding: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.work-card {
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 24px;
}

.work-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f0f0f0;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.work-card:hover .work-image img {
  transform: scale(1.05);
}

.work-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.work-card:hover .work-overlay {
  opacity: 1;
}

.work-info {
  padding: 16px;
}

.work-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.work-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 13px;
  color: var(--text-secondary);
}

.work-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.work-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.load-more {
  text-align: center;
  padding: 32px 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 14px;
  }
  
  .hero-features {
    gap: 16px;
  }
  
  .feature-item {
    padding: 12px 20px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

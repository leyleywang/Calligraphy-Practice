<template>
  <div class="profile-page">
    <div class="page-container">
      <div class="profile-header card">
        <div class="profile-info">
          <el-avatar :size="80" class="user-avatar">
            用
          </el-avatar>
          <div class="user-basic">
            <h2 class="user-name">书法爱好者</h2>
            <p class="user-level">
              <el-tag type="warning" size="small">中级学员</el-tag>
              <span class="user-id">ID: 10086</span>
            </p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-value">156</span>
                <span class="stat-label">练习天数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">32</span>
                <span class="stat-label">完成作品</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">12</span>
                <span class="stat-label">获得点评</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">5</span>
                <span class="stat-label">关注老师</span>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <el-button type="primary">
            <el-icon><Edit /></el-icon>
            编辑资料
          </el-button>
          <el-button>
            <el-icon><Setting /></el-icon>
            设置
          </el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="profile-tabs">
        <el-tab-pane label="练习记录" name="records">
          <div class="records-section">
            <div class="section-header">
              <h3 class="section-title">最近练习</h3>
              <el-button text type="primary" @click="viewAllRecords">
                查看全部
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            
            <div class="timeline-wrapper">
              <el-timeline>
                <el-timeline-item
                  v-for="(record, index) in practiceRecords"
                  :key="index"
                  :timestamp="record.date"
                  placement="top"
                  :type="record.type"
                  :icon="record.icon"
                >
                  <div class="record-card card">
                    <div class="record-image" v-if="record.image">
                      <img :src="record.image" :alt="record.title" />
                    </div>
                    <div class="record-content">
                      <h4 class="record-title">{{ record.title }}</h4>
                      <div class="record-meta">
                        <el-tag size="small" :type="record.score >= 80 ? 'success' : record.score >= 60 ? 'warning' : 'danger'">
                          得分: {{ record.score }}分
                        </el-tag>
                        <span class="record-duration">练习时长: {{ record.duration }}</span>
                      </div>
                      <div class="record-tags" v-if="record.tags">
                        <span class="tag" v-for="tag in record.tags" :key="tag">{{ tag }}</span>
                      </div>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="临摹作品" name="works">
          <div class="works-section">
            <div class="section-header">
              <h3 class="section-title">我的作品</h3>
              <el-button type="primary" @click="uploadWork">
                <el-icon><Upload /></el-icon>
                上传作品
              </el-button>
            </div>

            <el-row :gutter="24">
              <el-col :xs="12" :sm="8" :md="6" :lg="6" v-for="work in userWorks" :key="work.id">
                <div class="work-card card">
                  <div class="work-image">
                    <img :src="work.image" :alt="work.title" />
                    <div class="work-overlay">
                      <el-button-group>
                        <el-button size="small" type="primary" @click="viewWork(work)">
                          <el-icon><View /></el-icon>
                        </el-button>
                        <el-button size="small" type="primary" @click="shareWork(work)">
                          <el-icon><Share /></el-icon>
                        </el-button>
                        <el-button size="small" type="danger" @click="deleteWork(work)">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div class="work-info">
                    <h4 class="work-title">{{ work.title }}</h4>
                    <div class="work-meta">
                      <span class="work-date">{{ work.date }}</span>
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
                    <div class="work-actions">
                      <el-button size="small" text type="primary" @click="getFeedback(work)">
                        获取老师点评
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="练习计划" name="plans">
          <div class="plans-section">
            <div class="plan-card card">
              <div class="plan-header">
                <h3 class="plan-title">当前练习计划</h3>
                <el-button type="primary" size="small" @click="editPlan">
                  <el-icon><Edit /></el-icon>
                  编辑计划
                </el-button>
              </div>
              
              <div class="plan-content">
                <div class="plan-info">
                  <div class="info-item">
                    <span class="info-label">目标字体</span>
                    <span class="info-value">瘦金体</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">练习时长</span>
                    <span class="info-value">30分钟/天</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">开始日期</span>
                    <span class="info-value">2026-04-01</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">预计完成</span>
                    <span class="info-value">2026-06-30</span>
                  </div>
                </div>
                
                <div class="progress-section">
                  <h4 class="progress-title">练习进度</h4>
                  <el-progress :percentage="65" :stroke-width="16">
                    <template #default="{ percentage }">
                      <span class="percentage-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                  <div class="progress-stats">
                    <span class="stat">已完成 39 天</span>
                    <span class="stat">剩余 21 天</span>
                  </div>
                </div>
                
                <div class="weekly-progress">
                  <h4 class="progress-title">本周练习</h4>
                  <div class="week-days">
                    <div 
                      v-for="(day, index) in weekDays" 
                      :key="index"
                      class="day-item"
                      :class="{ completed: day.completed, today: day.isToday }"
                    >
                      <div class="day-icon">
                        <el-icon v-if="day.completed"><Check /></el-icon>
                        <span v-else-if="day.isToday">今</span>
                        <span v-else>{{ day.day }}</span>
                      </div>
                      <span class="day-name">{{ day.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="plan-card card">
              <div class="plan-header">
                <h3 class="plan-title">进步跟踪</h3>
              </div>
              
              <div class="progress-chart">
                <div class="chart-placeholder">
                  <el-icon :size="64" color="var(--primary-color)"><TrendCharts /></el-icon>
                  <p>成绩趋势图</p>
                </div>
                <div class="score-history">
                  <div class="score-item" v-for="(score, index) in scoreHistory" :key="index">
                    <span class="score-date">{{ score.date }}</span>
                    <el-progress 
                      :percentage="score.score" 
                      :stroke-width="8"
                      :color="score.score >= 80 ? '#67c23a' : score.score >= 60 ? '#e6a23c' : '#f56c6c'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="交流分享" name="community">
          <div class="community-section">
            <div class="section-header">
              <h3 class="section-title">我的分享</h3>
              <el-button type="primary" @click="createPost">
                <el-icon><EditPen /></el-icon>
                发布分享
              </el-button>
            </div>

            <div class="posts-list">
              <div class="post-card card" v-for="(post, index) in myPosts" :key="index">
                <div class="post-header">
                  <el-avatar :size="40">用</el-avatar>
                  <div class="post-info">
                    <span class="post-author">书法爱好者</span>
                    <span class="post-date">{{ post.date }}</span>
                  </div>
                  <el-dropdown>
                    <el-icon><MoreFilled /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="editPost(post)">编辑</el-dropdown-item>
                        <el-dropdown-item @click="deletePost(post)" divided>删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <div class="post-content">
                  <p>{{ post.content }}</p>
                  <div class="post-images" v-if="post.images?.length">
                    <el-image 
                      v-for="(img, idx) in post.images" 
                      :key="idx"
                      :src="img"
                      :preview-src-list="post.images"
                      fit="cover"
                      class="post-image"
                    />
                  </div>
                </div>
                <div class="post-tags" v-if="post.tags?.length">
                  <span class="tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
                </div>
                <div class="post-actions">
                  <span class="action-item">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ post.comments }} 评论
                  </span>
                  <span class="action-item">
                    <el-icon><Star /></el-icon>
                    {{ post.likes }} 点赞
                  </span>
                  <span class="action-item">
                    <el-icon><Share /></el-icon>
                    分享
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog v-model="showUploadDialog" title="上传练习作业" width="600px">
      <el-upload
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        accept="image/*"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 JPG、PNG 格式，单张图片不超过 10MB
          </div>
        </template>
      </el-upload>
      
      <div class="upload-form" style="margin-top: 20px;">
        <el-form label-width="80px">
          <el-form-item label="作品标题">
            <el-input v-model="uploadForm.title" placeholder="请输入作品标题" />
          </el-form-item>
          <el-form-item label="练习字体">
            <el-select v-model="uploadForm.font" placeholder="请选择">
              <el-option label="瘦金体" value="瘦金体" />
              <el-option label="章草" value="章草" />
              <el-option label="魏碑" value="魏碑" />
            </el-select>
          </el-form-item>
          <el-form-item label="作品描述">
            <el-input
              v-model="uploadForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入作品描述（选填）"
            />
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              v-model="uploadForm.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选择或输入标签"
              style="width: 100%;"
            >
              <el-option label="瘦金体" value="瘦金体" />
              <el-option label="千字文" value="千字文" />
              <el-option label="临摹" value="临摹" />
              <el-option label="创作" value="创作" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showUploadDialog = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">提交获取点评</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Edit,
  Setting,
  ArrowRight,
  Upload,
  View,
  Share,
  Delete,
  Check,
  TrendCharts,
  EditPen,
  MoreFilled,
  ChatDotRound,
  Star,
  UploadFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('records')
const showUploadDialog = ref(false)

const uploadForm = ref({
  title: '',
  font: '',
  description: '',
  tags: []
})

const practiceRecords = ref([
  {
    date: '2026-04-26 19:30',
    title: '瘦金体《千字文》"天地玄黄"临摹',
    score: 85,
    duration: '45分钟',
    type: 'success',
    icon: Edit,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20calligraphy%20Shoujin%20style%20practice%20elegant%20thin%20strokes&image_size=square',
    tags: ['瘦金体', '千字文', '临摹']
  },
  {
    date: '2026-04-25 15:20',
    title: '章草《急就章》练习',
    score: 72,
    duration: '35分钟',
    type: 'warning',
    icon: Edit,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangcao%20calligraphy%20ancient%20style%20practice%20works&image_size=square',
    tags: ['章草', '急就章']
  },
  {
    date: '2026-04-24 20:00',
    title: '魏碑《张猛龙碑》"张猛龙"三字临写',
    score: 91,
    duration: '60分钟',
    type: 'success',
    icon: Edit,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Weibei%20Zhangmenglong%20Bei%20bold%20calligraphy%20practice&image_size=square',
    tags: ['魏碑', '张猛龙碑']
  }
])

const userWorks = ref([
  {
    id: 1,
    title: '瘦金体《千字文》节选',
    date: '2026-04-20',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shoujin%20style%20Chinese%20calligraphy%20Thousand%20Character%20Classic%20artwork&image_size=square',
    comments: 12,
    likes: 86,
    hasFeedback: true
  },
  {
    id: 2,
    title: '章草《月仪帖》临摹',
    date: '2026-04-15',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yueyi%20Zhangcao%20Suojing%20style%20calligraphy%20copy&image_size=square',
    comments: 8,
    likes: 52,
    hasFeedback: false
  },
  {
    id: 3,
    title: '魏碑《龙门二十品》选临',
    date: '2026-04-10',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Longmen%20Weibei%20stone%20carving%20style%20calligraphy%20work&image_size=square',
    comments: 15,
    likes: 98,
    hasFeedback: true
  },
  {
    id: 4,
    title: '瘦金体五言联创作',
    date: '2026-04-05',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shoujin%20style%20Chinese%20couplet%20calligraphy%20artwork&image_size=square',
    comments: 23,
    likes: 134,
    hasFeedback: true
  }
])

const weekDays = ref([
  { day: '一', name: '周一', completed: true },
  { day: '二', name: '周二', completed: true },
  { day: '三', name: '周三', completed: true },
  { day: '四', name: '周四', completed: true },
  { day: '五', name: '周五', completed: false, isToday: true },
  { day: '六', name: '周六', completed: false },
  { day: '日', name: '周日', completed: false }
])

const scoreHistory = ref([
  { date: '4月20日', score: 75 },
  { date: '4月22日', score: 78 },
  { date: '4月24日', score: 82 },
  { date: '4月26日', score: 85 }
])

const myPosts = ref([
  {
    date: '2026-04-25 14:30',
    content: '今天练习瘦金体，感觉对铁画银钩的理解又深了一些。分享一下今天的练习成果，欢迎各位书友批评指正！',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shoujin%20style%20Chinese%20calligraphy%20practice%20work%20elegant&image_size=square'
    ],
    tags: ['瘦金体', '练习分享', '铁画银钩'],
    comments: 24,
    likes: 86
  },
  {
    date: '2026-04-20 10:15',
    content: '魏碑的方笔确实有力量感，最近在临《张猛龙碑》，分享一些心得：方笔要斩截，结构要险峻，但整体要稳。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Weibei%20Zhangmenglong%20Bei%20bold%20calligraphy%20practice%20work&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Weibei%20stone%20carving%20style%20calligraphy%20detail&image_size=square'
    ],
    tags: ['魏碑', '张猛龙碑', '方笔'],
    comments: 45,
    likes: 156
  }
])

const handleFileChange = (file) => {
  console.log('File selected:', file)
}

const viewAllRecords = () => {
  ElMessage.info('查看全部练习记录')
}

const uploadWork = () => {
  showUploadDialog.value = true
}

const viewWork = (work) => {
  router.push(`/work/${work.id}`)
}

const shareWork = (work) => {
  ElMessage.success('作品已分享到社区')
}

const deleteWork = async (work) => {
  try {
    await ElMessageBox.confirm('确定要删除这个作品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const index = userWorks.value.findIndex(w => w.id === work.id)
    if (index > -1) {
      userWorks.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

const getFeedback = (work) => {
  ElMessage.info(`正在为您预约老师点评《${work.title}》...`)
}

const editPlan = () => {
  ElMessage.info('编辑练习计划')
}

const createPost = () => {
  ElMessage.info('发布新分享')
}

const editPost = (post) => {
  ElMessage.info('编辑分享')
}

const deletePost = async (post) => {
  try {
    await ElMessageBox.confirm('确定要删除这条分享吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const index = myPosts.value.indexOf(post)
    if (index > -1) {
      myPosts.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

const submitUpload = () => {
  if (!uploadForm.value.title) {
    ElMessage.warning('请输入作品标题')
    return
  }
  ElMessage.success('作品已提交，等待老师点评...')
  showUploadDialog.value = false
  uploadForm.value = { title: '', font: '', description: '', tags: [] }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

.profile-header {
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.profile-info {
  display: flex;
  gap: 24px;
}

.user-avatar {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  font-size: 32px;
}

.user-basic {
  flex: 1;
}

.user-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
}

.user-level {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-id {
  font-size: 12px;
  color: var(--text-muted);
}

.user-stats {
  display: flex;
  gap: 32px;
}

.user-stats .stat-item {
  text-align: center;
}

.user-stats .stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.user-stats .stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-tabs {
  margin-bottom: 24px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color) !important;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color) !important;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.timeline-wrapper {
  padding: 20px 0;
}

.record-card {
  padding: 16px;
  display: flex;
  gap: 16px;
}

.record-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.record-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.record-content {
  flex: 1;
}

.record-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.record-duration {
  font-size: 12px;
  color: var(--text-muted);
}

.record-tags {
  display: flex;
  gap: 6px;
}

.work-card {
  margin-bottom: 24px;
  overflow: hidden;
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
  align-items: center;
  justify-content: center;
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
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
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

.work-date {
  font-size: 12px;
  color: var(--text-muted);
}

.work-stats {
  display: flex;
  gap: 12px;
}

.work-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.work-actions {
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}

.plan-card {
  padding: 24px;
  margin-bottom: 24px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.plan-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.plan-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px dashed var(--border-color);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--text-muted);
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
}

.progress-section,
.weekly-progress {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px dashed var(--border-color);
}

.progress-section:last-child,
.weekly-progress:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.progress-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
}

.percentage-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.progress-stats .stat {
  font-size: 13px;
  color: var(--text-secondary);
}

.week-days {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.day-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.day-item.completed {
  background: rgba(103, 194, 58, 0.1);
}

.day-item.today {
  background: rgba(201, 168, 108, 0.15);
  border: 1px solid var(--primary-color);
}

.day-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.day-item.completed .day-icon {
  background: #67c23a;
  color: white;
}

.day-item.today .day-icon {
  background: var(--primary-color);
  color: white;
}

.day-name {
  font-size: 12px;
  color: var(--text-muted);
}

.progress-chart {
  display: flex;
  gap: 24px;
}

.chart-placeholder {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.chart-placeholder p {
  margin-top: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.score-history {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-item .score-date {
  width: 60px;
  font-size: 13px;
  color: var(--text-secondary);
}

.score-item .el-progress {
  flex: 1;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  padding: 20px;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.post-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.post-author {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.post-date {
  font-size: 12px;
  color: var(--text-muted);
}

.post-content p {
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.8;
  margin-bottom: 12px;
}

.post-images {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.post-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
}

.post-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.post-actions {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px dashed var(--border-color);
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-item:hover {
  color: var(--primary-color);
}

.upload-form {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
  }
  
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .profile-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .plan-info {
    grid-template-columns: 1fr;
  }
  
  .progress-chart {
    flex-direction: column;
  }
  
  .chart-placeholder {
    width: 100%;
  }
}
</style>

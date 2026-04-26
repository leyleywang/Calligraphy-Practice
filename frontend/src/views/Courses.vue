<template>
  <div class="courses-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">指导课程</h1>
        <p class="page-desc">对接擅长小众书法的专业老师，提供短视频教学、一对一在线指导</p>
      </div>

      <el-tabs v-model="activeTab" class="course-tabs">
        <el-tab-pane label="视频课程" name="videos">
          <div class="video-section">
            <el-row :gutter="24">
              <el-col :xs="12" :sm="8" :md="8" :lg="6" v-for="course in videoCourses" :key="course.id">
                <div class="course-card card" @click="viewCourse(course)">
                  <div class="course-thumbnail">
                    <img :src="course.thumbnail" :alt="course.title" />
                    <div class="play-overlay">
                      <el-icon :size="48"><VideoPlay /></el-icon>
                    </div>
                    <div class="course-duration">{{ course.duration }}</div>
                    <div class="course-level" :class="course.level">{{ getLevelLabel(course.level) }}</div>
                  </div>
                  <div class="course-info">
                    <h3 class="course-title">{{ course.title }}</h3>
                    <div class="course-meta">
                      <div class="teacher-info">
                        <el-avatar :size="24" :src="course.teacher.avatar">
                          {{ course.teacher.name.charAt(0) }}
                        </el-avatar>
                        <span class="teacher-name">{{ course.teacher.name }}</span>
                        <el-tag size="small" type="warning">{{ course.teacher.title }}</el-tag>
                      </div>
                    </div>
                    <div class="course-stats">
                      <span class="stat-item">
                        <el-icon><View /></el-icon>
                        {{ course.views }} 播放
                      </span>
                      <span class="stat-item">
                        <el-icon><Star /></el-icon>
                        {{ course.rating }} 评分
                      </span>
                      <span class="stat-item">
                        <el-icon><Collection /></el-icon>
                        {{ course.lessons }} 课时
                      </span>
                    </div>
                    <div class="course-price">
                      <span v-if="course.price > 0" class="price">
                        <span class="price-symbol">¥</span>
                        <span class="price-value">{{ course.price }}</span>
                      </span>
                      <span v-else class="free-tag">免费</span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="名师指导" name="tutors">
          <div class="tutors-section">
            <el-row :gutter="24">
              <el-col :xs="12" :sm="8" :md="8" :lg="8" v-for="tutor in tutors" :key="tutor.id">
                <div class="tutor-card card">
                  <div class="tutor-header">
                    <el-avatar :size="80" :src="tutor.avatar">
                      {{ tutor.name.charAt(0) }}
                    </el-avatar>
                    <div class="tutor-basic">
                      <h3 class="tutor-name">{{ tutor.name }}</h3>
                      <p class="tutor-title">{{ tutor.title }}</p>
                      <div class="tutor-specialties">
                        <el-tag v-for="spec in tutor.specialties" :key="spec" size="small" effect="plain">
                          {{ spec }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                  <div class="tutor-intro">
                    <p>{{ tutor.intro }}</p>
                  </div>
                  <div class="tutor-stats">
                    <div class="stat">
                      <span class="stat-value">{{ tutor.students }}</span>
                      <span class="stat-label">学员数</span>
                    </div>
                    <div class="stat">
                      <span class="stat-value">{{ tutor.courses }}</span>
                      <span class="stat-label">课程数</span>
                    </div>
                    <div class="stat">
                      <span class="stat-value">{{ tutor.rating }}</span>
                      <span class="stat-label">评分</span>
                    </div>
                  </div>
                  <div class="tutor-actions">
                    <el-button type="primary" block @click="contactTutor(tutor)">
                      <el-icon><ChatDotRound /></el-icon>
                      预约指导
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="一对一指导" name="one-on-one">
          <div class="one-on-one-section">
            <div class="section-intro">
              <el-empty description="一对一在线指导功能正在开发中，敬请期待...">
                <template #image>
                  <el-icon :size="80" color="var(--primary-color)"><VideoCamera /></el-icon>
                </template>
              </el-empty>
            </div>
            
            <div class="feature-cards">
              <el-row :gutter="24">
                <el-col :span="8" v-for="feature in oneOnOneFeatures" :key="feature.id">
                  <div class="feature-card card">
                    <el-icon :size="48" :color="var(--primary-color)">
                      <component :is="feature.icon" />
                    </el-icon>
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-desc">{{ feature.description }}</p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog 
        v-model="showCourseDialog" 
        :title="selectedCourse?.title" 
        width="900px"
        class="course-dialog"
      >
        <div v-if="selectedCourse" class="course-detail">
          <div class="video-player">
            <div class="video-placeholder">
              <el-icon :size="80" color="rgba(255,255,255,0.8)"><VideoPlay /></el-icon>
              <p>点击播放视频</p>
            </div>
          </div>
          
          <div class="course-detail-info">
            <h2 class="detail-title">{{ selectedCourse.title }}</h2>
            <div class="detail-meta">
              <div class="teacher-info">
                <el-avatar :size="40" :src="selectedCourse.teacher.avatar">
                  {{ selectedCourse.teacher.name.charAt(0) }}
                </el-avatar>
                <div>
                  <p class="teacher-name">{{ selectedCourse.teacher.name }}</p>
                  <p class="teacher-title">{{ selectedCourse.teacher.title }}</p>
                </div>
              </div>
              <div class="detail-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ selectedCourse.views }} 播放
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ selectedCourse.rating }} 评分
                </span>
              </div>
            </div>
            
            <div class="detail-description">
              <h4 class="section-subtitle">课程简介</h4>
              <p>{{ selectedCourse.description }}</p>
            </div>
            
            <div class="detail-outline">
              <h4 class="section-subtitle">课程大纲</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(lesson, index) in selectedCourse.outline"
                  :key="index"
                  :timestamp="lesson.duration"
                  placement="top"
                >
                  <div class="lesson-item">
                    <span class="lesson-number">第 {{ index + 1 }} 课</span>
                    <span class="lesson-title">{{ lesson.title }}</span>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
        <template #footer>
          <el-button type="primary" size="large">
            <el-icon><ShoppingCart /></el-icon>
            {{ selectedCourse?.price > 0 ? `购买课程 ¥${selectedCourse?.price}` : '免费学习' }}
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  VideoPlay,
  View,
  Star,
  Collection,
  ChatDotRound,
  VideoCamera,
  TrendCharts,
  Edit,
  User,
  ShoppingCart
} from '@element-plus/icons-vue'

const activeTab = ref('videos')
const showCourseDialog = ref(false)
const selectedCourse = ref(null)

const videoCourses = ref([
  {
    id: 1,
    title: '瘦金体入门到精通',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20calligraphy%20Shoujin%20style%20teaching%20video%20thumbnail%20elegant&image_size=square',
    duration: '12:35',
    level: 'beginner',
    views: 12580,
    rating: 4.9,
    lessons: 24,
    price: 199,
    description: '本课程从瘦金体的基本笔法入手，循序渐进地讲解瘦金体的结构特点、章法布局，帮助学员掌握这一独特的书法艺术。',
    teacher: {
      name: '宋徽宗传人',
      title: '瘦金体专家',
      avatar: ''
    },
    outline: [
      { title: '瘦金体简介与工具准备', duration: '15:30' },
      { title: '基本笔法：横、竖、撇、捺', duration: '20:15' },
      { title: '转折与顿笔技巧', duration: '18:45' },
      { title: '结构特点：中宫紧收', duration: '22:30' },
      { title: '常用字练习（一）', duration: '25:00' }
    ]
  },
  {
    id: 2,
    title: '章草笔法详解',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangcao%20calligraphy%20ancient%20style%20teaching%20video%20thumbnail&image_size=square',
    duration: '18:42',
    level: 'intermediate',
    views: 8960,
    rating: 4.8,
    lessons: 18,
    price: 159,
    description: '深入讲解章草的波磔笔法、字字独立的特点，结合经典碑帖进行实战练习。',
    teacher: {
      name: '索靖后人',
      title: '章草传承人',
      avatar: ''
    },
    outline: [
      { title: '章草的历史渊源', duration: '18:00' },
      { title: '波磔笔法详解', duration: '25:30' },
      { title: '字字独立的章法', duration: '20:15' },
      { title: '《急就章》临摹（一）', duration: '28:00' }
    ]
  },
  {
    id: 3,
    title: '魏碑方笔技法',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Weibei%20stone%20tablet%20calligraphy%20bold%20style%20teaching%20thumbnail&image_size=square',
    duration: '22:15',
    level: 'advanced',
    views: 6540,
    rating: 4.9,
    lessons: 20,
    price: 229,
    description: '从《张猛龙碑》《龙门二十品》等经典碑帖入手，讲解魏碑方笔斩截、气势雄强的艺术特点。',
    teacher: {
      name: '碑学大师',
      title: '魏碑研究专家',
      avatar: ''
    },
    outline: [
      { title: '魏碑艺术概论', duration: '20:00' },
      { title: '方笔斩截技法', duration: '28:30' },
      { title: '《张猛龙碑》解析', duration: '30:15' },
      { title: '龙门造像记临摹', duration: '25:00' }
    ]
  },
  {
    id: 4,
    title: '瘦金体《秾芳诗帖》精讲',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nongfang%20Poem%20Shoujin%20style%20Huizong%20calligraphy%20teaching%20thumbnail&image_size=square',
    duration: '25:30',
    level: 'intermediate',
    views: 9870,
    rating: 4.8,
    lessons: 12,
    price: 0,
    description: '免费课程！详细讲解宋徽宗《秾芳诗帖》的笔法特点、结构布局，是学习瘦金体大字的绝佳范本。',
    teacher: {
      name: '徽宗遗风',
      title: '瘦金体讲师',
      avatar: ''
    },
    outline: [
      { title: '《秾芳诗帖》艺术特色', duration: '15:00' },
      { title: '大字笔法解析', duration: '22:30' },
      { title: '章法布局详解', duration: '18:45' },
      { title: '临摹示范（一）', duration: '25:00' }
    ]
  },
  {
    id: 5,
    title: '章草《月仪帖》临摹',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yueyi%20Zhangcao%20Suojing%20style%20ancient%20calligraphy%20teaching%20thumbnail&image_size=square',
    duration: '19:45',
    level: 'intermediate',
    views: 7230,
    rating: 4.7,
    lessons: 16,
    price: 169,
    description: '以索靖《月仪帖》为范本，讲解章草的"银钩虿尾"笔法特点，书信体章法布局。',
    teacher: {
      name: '章草名家',
      title: '章草讲师',
      avatar: ''
    },
    outline: [
      { title: '《月仪帖》背景介绍', duration: '12:00' },
      { title: '银钩虿尾笔法', duration: '24:30' },
      { title: '书信体章法', duration: '20:15' },
      { title: '通临示范', duration: '28:00' }
    ]
  },
  {
    id: 6,
    title: '魏碑《龙门二十品》精选',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Longmen%20Twenty%20Articles%20Weibei%20stone%20carving%20teaching%20thumbnail&image_size=square',
    duration: '28:20',
    level: 'advanced',
    views: 5420,
    rating: 4.9,
    lessons: 22,
    price: 259,
    description: '精选龙门石窟最具代表性的造像题记，讲解魏碑书法风格的多样性，从雄强到秀逸的艺术演变。',
    teacher: {
      name: '石窟学者',
      title: '魏碑研究员',
      avatar: ''
    },
    outline: [
      { title: '龙门造像记概述', duration: '18:00' },
      { title: '《始平公造像记》解析', duration: '26:30' },
      { title: '《杨大眼造像记》技法', duration: '24:15' },
      { title: '风格对比与演变', duration: '22:00' }
    ]
  }
])

const tutors = ref([
  {
    id: 1,
    name: '王瘦金',
    title: '瘦金体传承人',
    avatar: '',
    specialties: ['瘦金体', '宋徽宗', '大字书法'],
    intro: '从事瘦金体研究与教学三十余年，著有《瘦金体技法详解》等多部著作，学员遍布海内外。',
    students: 5280,
    courses: 12,
    rating: 4.9
  },
  {
    id: 2,
    name: '张章草',
    title: '章草研究专家',
    avatar: '',
    specialties: ['章草', '索靖', '汉简'],
    intro: '中国书法家协会会员，专攻章草研究二十余年，对索靖《月仪帖》、史游《急就章》有深入研究。',
    students: 3860,
    courses: 8,
    rating: 4.8
  },
  {
    id: 3,
    name: '李魏碑',
    title: '魏碑资深讲师',
    avatar: '',
    specialties: ['魏碑', '龙门造像', '张猛龙碑'],
    intro: '北京大学书法研究所研究员，专注魏碑书法研究与教学，出版《魏碑艺术论》等学术专著。',
    students: 4120,
    courses: 10,
    rating: 4.9
  }
])

const oneOnOneFeatures = ref([
  {
    id: 1,
    icon: VideoCamera,
    title: '视频连线指导',
    description: '通过视频连线，老师实时观察您的书写姿势、笔法运用，即时纠正错误动作。'
  },
  {
    id: 2,
    icon: Edit,
    title: '实时笔画评分',
    description: '内置智能评分系统，对您的每一笔书写进行实时评分，帮助精准改进。'
  },
  {
    id: 3,
    icon: User,
    title: '个性化学习计划',
    description: '根据您的基础和目标，老师制定专属学习计划，跟踪练习进度，确保高效进步。'
  }
])

const getLevelLabel = (level) => {
  const map = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return map[level] || level
}

const viewCourse = (course) => {
  selectedCourse.value = course
  showCourseDialog.value = true
}

const contactTutor = (tutor) => {
  ElMessage.info(`正在为您预约${tutor.name}老师的指导时间...`)
}
</script>

<style scoped>
.courses-page {
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

.course-tabs {
  margin-bottom: 24px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color) !important;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color) !important;
}

.video-section,
.tutors-section {
  padding: 20px 0;
}

.course-card {
  margin-bottom: 24px;
  cursor: pointer;
  overflow: hidden;
}

.course-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #f0f0f0;
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card:hover .course-thumbnail img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.course-card:hover .play-overlay {
  opacity: 1;
}

.course-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.course-level {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.course-level.beginner {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.course-level.intermediate {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
}

.course-level.advanced {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
}

.course-info {
  padding: 16px;
}

.course-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  margin-bottom: 12px;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.teacher-name {
  font-size: 13px;
  color: var(--text-secondary);
}

.course-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.course-price {
  display: flex;
  align-items: center;
}

.price {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 12px;
  color: var(--primary-color);
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.free-tag {
  font-size: 16px;
  font-weight: 700;
  color: #67c23a;
}

.tutor-card {
  padding: 20px;
  margin-bottom: 24px;
}

.tutor-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.tutor-basic {
  flex: 1;
}

.tutor-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 4px;
}

.tutor-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.tutor-specialties {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tutor-intro {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--border-color);
}

.tutor-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.tutor-stats .stat {
  text-align: center;
}

.tutor-stats .stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.tutor-stats .stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.one-on-one-section {
  padding: 40px 0;
}

.section-intro {
  margin-bottom: 40px;
}

.feature-cards {
  padding: 20px 0;
}

.feature-card {
  padding: 32px 24px;
  text-align: center;
}

.feature-card .el-icon {
  margin-bottom: 16px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.course-detail {
  padding: 8px 0;
}

.video-player {
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.video-placeholder p {
  margin-top: 12px;
  font-size: 16px;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 16px;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 16px;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.teacher-title {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.detail-stats {
  display: flex;
  gap: 20px;
}

.detail-description,
.detail-outline {
  margin-bottom: 24px;
}

.section-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.detail-description p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.lesson-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.lesson-number {
  font-size: 12px;
  color: var(--text-muted);
}

.lesson-title {
  font-size: 14px;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .tutor-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .tutor-specialties {
    justify-content: center;
  }
  
  .detail-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

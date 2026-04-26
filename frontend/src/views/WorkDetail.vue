<template>
  <div class="work-detail-page">
    <div class="page-container">
      <div class="back-nav">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <div class="work-main card">
            <div class="work-image-section">
              <el-image
                :src="work?.image"
                :zoom-rate="1.2"
                :preview-src-list="[work?.image]"
                fit="contain"
                class="work-image"
              />
              <div class="image-actions">
                <el-button-group>
                  <el-button @click="zoomIn">
                    <el-icon><ZoomIn /></el-icon>
                  </el-button>
                  <el-button @click="zoomOut">
                    <el-icon><ZoomOut /></el-icon>
                  </el-button>
                  <el-button @click="downloadWork">
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                </el-button-group>
              </div>
            </div>
            
            <div class="work-info-section">
              <div class="work-header">
                <h1 class="work-title">{{ work?.title }}</h1>
                <div class="work-tags">
                  <span class="tag" v-for="tag in work?.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
              
              <div class="work-meta">
                <div class="author-info">
                  <el-avatar :size="48" :src="work?.author?.avatar">
                    {{ work?.author?.name?.charAt(0) }}
                  </el-avatar>
                  <div class="author-details">
                    <span class="author-name">{{ work?.author?.name }}</span>
                    <span class="publish-time">发布于 {{ work?.publishTime }}</span>
                  </div>
                  <el-button type="primary" size="small" class="follow-btn">
                    <el-icon><Plus /></el-icon>
                    关注
                  </el-button>
                </div>
                
                <div class="work-stats">
                  <span class="stat-item" @click="scrollToComments">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ work?.comments }} 评论
                  </span>
                  <span class="stat-item">
                    <el-icon><View /></el-icon>
                    {{ work?.views }} 浏览
                  </span>
                  <span class="stat-item">
                    <el-icon><Star /></el-icon>
                    {{ work?.likes }} 点赞
                  </span>
                </div>
              </div>
              
              <div class="work-description">
                <h3 class="section-subtitle">作品说明</h3>
                <p>{{ work?.description }}</p>
              </div>
              
              <div class="work-actions">
                <el-button type="primary" size="large" @click="likeWork">
                  <el-icon><Star /></el-icon>
                  点赞
                </el-button>
                <el-button size="large" @click="collectWork">
                  <el-icon><Collection /></el-icon>
                  收藏
                </el-button>
                <el-button size="large" @click="shareWork">
                  <el-icon><Share /></el-icon>
                  分享
                </el-button>
              </div>
            </div>
          </div>

          <div class="comments-section card" ref="commentsSection">
            <div class="section-header">
              <h3 class="section-title">评论 ({{ comments.length }})</h3>
            </div>
            
            <div class="comment-input">
              <el-avatar :size="36">用</el-avatar>
              <div class="input-wrapper">
                <el-input
                  v-model="commentContent"
                  type="textarea"
                  :rows="2"
                  placeholder="写下你的评论..."
                  maxlength="500"
                  show-word-limit
                />
                <div class="input-actions">
                  <el-button type="primary" :disabled="!commentContent.trim()" @click="submitComment">
                    发布评论
                  </el-button>
                </div>
              </div>
            </div>
            
            <div class="comments-list">
              <div class="comment-item" v-for="comment in comments" :key="comment.id">
                <el-avatar :size="40" :src="comment.avatar">
                  {{ comment.author.charAt(0) }}
                </el-avatar>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                  <div class="comment-actions">
                    <span class="action-item" @click="likeComment(comment)">
                      <el-icon><ThumbUp /></el-icon>
                      {{ comment.likes }}
                    </span>
                    <span class="action-item">
                      <el-icon><ChatDotRound /></el-icon>
                      回复
                    </span>
                  </div>
                  
                  <div class="replies" v-if="comment.replies?.length">
                    <div class="reply-item" v-for="reply in comment.replies" :key="reply.id">
                      <el-avatar :size="28" :src="reply.avatar">
                        {{ reply.author.charAt(0) }}
                      </el-avatar>
                      <div class="reply-content">
                        <span class="reply-author">{{ reply.author }}</span>
                        <span class="reply-text">{{ reply.content }}</span>
                        <span class="reply-time">{{ reply.time }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="sidebar">
            <div class="sidebar-card card">
              <h3 class="sidebar-title">推荐作品</h3>
              <div class="recommend-list">
                <div class="recommend-item" v-for="item in recommendWorks" :key="item.id" @click="viewWork(item.id)">
                  <img :src="item.image" :alt="item.title" class="recommend-image" />
                  <div class="recommend-info">
                    <h4 class="recommend-title">{{ item.title }}</h4>
                    <span class="recommend-author">{{ item.author }}</span>
                    <div class="recommend-stats">
                      <span><el-icon><View /></el-icon> {{ item.views }}</span>
                      <span><el-icon><Star /></el-icon> {{ item.likes }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sidebar-card card">
              <h3 class="sidebar-title">热门标签</h3>
              <div class="hot-tags">
                <el-tag
                  v-for="tag in hotTags"
                  :key="tag"
                  effect="plain"
                  class="tag-item"
                  @click="searchByTag(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>

            <div class="sidebar-card card">
              <h3 class="sidebar-title">相关字帖</h3>
              <div class="related-copybooks">
                <div class="copybook-item" v-for="copybook in relatedCopybooks" :key="copybook.id">
                  <img :src="copybook.image" :alt="copybook.title" class="copybook-image" />
                  <div class="copybook-info">
                    <h4 class="copybook-title">{{ copybook.title }}</h4>
                    <span class="copybook-author">{{ copybook.author }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Download,
  Plus,
  ChatDotRound,
  View,
  Star,
  Collection,
  Share,
  ThumbUp
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const commentsSection = ref(null)
const commentContent = ref('')

const work = ref({
  id: 1,
  title: '瘦金体《千字文》"天地玄黄"四字精临',
  tags: ['瘦金体', '千字文', '临摹', '铁画银钩'],
  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shoujin%20style%20Chinese%20calligraphy%20Thousand%20Character%20Classic%20TianDiXuanHuang%20elegant%20artwork&image_size=square',
  description: '这是我练习瘦金体三个月的成果，特别临摹了《千字文》开篇的"天地玄黄"四个字。瘦金体的特点在于"瘦"而有"骨"，每一笔都要体现出力量感。特别注意了转折处的顿笔技巧，以及结构上的中宫紧收、四周舒展。欢迎各位书友多多交流，共同进步！',
  author: {
    name: '墨韵书生',
    avatar: ''
  },
  publishTime: '2026-04-25 14:30',
  comments: 24,
  views: 12580,
  likes: 856
})

const comments = ref([
  {
    id: 1,
    author: '徽宗遗风',
    avatar: '',
    time: '2天前',
    content: '写得非常棒！尤其是"玄"字的宝盖头，转折处很有力道，体现了瘦金体的铁画银钩特点。建议可以再注意一下"黄"字下部的结构，中宫可以再收紧一些。',
    likes: 12,
    replies: [
      {
        id: 11,
        author: '墨韵书生',
        avatar: '',
        time: '2天前',
        content: '感谢指点！确实"黄"字是我这几个字里最不满意的，中宫的处理确实需要再下功夫。'
      }
    ]
  },
  {
    id: 2,
    author: '瘦金传人',
    avatar: '',
    time: '3天前',
    content: '笔法很扎实，线条有弹性。可以尝试写得再"瘦"一些，瘦金体的精髓就是"瘦硬通神"。另外，建议可以在起笔和收笔处多体会"顿笔"的力度变化。',
    likes: 8,
    replies: []
  },
  {
    id: 3,
    author: '书法爱好者',
    avatar: '',
    time: '5天前',
    content: '初学瘦金体，请问楼主用的是什么笔？狼毫还是兼毫？',
    likes: 3,
    replies: [
      {
        id: 31,
        author: '墨韵书生',
        avatar: '',
        time: '5天前',
        content: '我用的是兼毫笔，硬度适中，比较好控制。刚开始练习可以用硬一点的笔，更容易体会瘦金体的特点。'
      }
    ]
  }
])

const recommendWorks = ref([
  {
    id: 2,
    title: '章草《急就章》临摹',
    author: '古风墨客',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangcao%20Jijiuzhang%20ancient%20Chinese%20cursive%20calligraphy%20artwork&image_size=square',
    views: 8960,
    likes: 523
  },
  {
    id: 3,
    title: '魏碑《张猛龙碑》选临',
    author: '碑学探索者',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zhangmenglong%20Bei%20Weibei%20stone%20tablet%20calligraphy%20bold%20artwork&image_size=square',
    views: 9870,
    likes: 654
  },
  {
    id: 4,
    title: '瘦金体《秾芳诗帖》节临',
    author: '瘦金传人',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nongfang%20Poem%20Shoujin%20style%20Huizong%20calligraphy%20artwork&image_size=square',
    views: 7230,
    likes: 432
  }
])

const hotTags = ref([
  '瘦金体', '章草', '魏碑', '千字文', '张猛龙碑',
  '临摹', '创作', '铁画银钩', '银钩虿尾', '方笔'
])

const relatedCopybooks = ref([
  {
    id: 1,
    title: '瘦金体《千字文》',
    author: '宋徽宗赵佶',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shoujin%20style%20Chinese%20calligraphy%20Thousand%20Character%20Classic%20elegant&image_size=square'
  },
  {
    id: 2,
    title: '瘦金体《秾芳诗帖》',
    author: '宋徽宗赵佶',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nongfang%20Poem%20Shoujin%20style%20Huizong%20calligraphy%20elegant&image_size=square'
  }
])

const goBack = () => {
  router.back()
}

const zoomIn = () => {
  ElMessage.info('点击图片可放大查看')
}

const zoomOut = () => {
  ElMessage.info('点击图片可放大查看')
}

const downloadWork = () => {
  ElMessage.success('正在下载作品...')
}

const likeWork = () => {
  work.value.likes++
  ElMessage.success('点赞成功！')
}

const collectWork = () => {
  ElMessage.success('收藏成功！')
}

const shareWork = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

const submitComment = () => {
  if (!commentContent.value.trim()) return
  
  const newComment = {
    id: Date.now(),
    author: '书法爱好者',
    avatar: '',
    time: '刚刚',
    content: commentContent.value,
    likes: 0,
    replies: []
  }
  
  comments.value.unshift(newComment)
  commentContent.value = ''
  ElMessage.success('评论发布成功！')
}

const likeComment = (comment) => {
  comment.likes++
  ElMessage.success('点赞成功！')
}

const scrollToComments = () => {
  commentsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const viewWork = (id) => {
  router.push(`/work/${id}`)
}

const searchByTag = (tag) => {
  ElMessage.info(`搜索标签: ${tag}`)
}

onMounted(() => {
  const id = route.params.id
  console.log('Work ID:', id)
})
</script>

<style scoped>
.work-detail-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

.back-nav {
  margin-bottom: 20px;
}

.work-main {
  padding: 24px;
  margin-bottom: 24px;
}

.work-image-section {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px dashed var(--border-color);
}

.work-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.image-actions {
  margin-top: 16px;
}

.work-header {
  margin-bottom: 16px;
}

.work-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 12px;
  line-height: 1.4;
}

.work-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.work-meta {
  margin-bottom: 24px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.author-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
}

.publish-time {
  font-size: 12px;
  color: var(--text-muted);
}

.follow-btn {
  margin-left: 12px;
}

.work-stats {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.work-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.work-stats .stat-item:hover {
  color: var(--primary-color);
}

.work-description {
  margin-bottom: 24px;
}

.section-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.work-description p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.work-actions {
  display: flex;
  gap: 16px;
}

.comments-section {
  padding: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 20px;
}

.comment-input {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.input-wrapper {
  flex: 1;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.comment-time {
  font-size: 12px;
  color: var(--text-muted);
}

.comment-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-actions .action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.comment-actions .action-item:hover {
  color: var(--primary-color);
}

.replies {
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid var(--border-color);
}

.reply-item {
  display: flex;
  gap: 8px;
  padding: 8px 0;
}

.reply-content {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
}

.reply-author {
  font-weight: 600;
  color: var(--text-color);
  margin-right: 4px;
}

.reply-time {
  margin-left: 8px;
  color: var(--text-muted);
  font-size: 12px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  padding: 20px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommend-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.recommend-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.recommend-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recommend-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-author {
  font-size: 12px;
  color: var(--text-secondary);
}

.recommend-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.recommend-stats span {
  display: flex;
  align-items: center;
  gap: 2px;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item:hover {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.related-copybooks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.copybook-item {
  display: flex;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.copybook-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.copybook-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.copybook-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.copybook-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.copybook-author {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .work-actions {
    flex-wrap: wrap;
  }
  
  .work-actions .el-button {
    flex: 1;
  }
  
  .author-info {
    flex-wrap: wrap;
  }
  
  .follow-btn {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
  }
  
  .work-stats {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .comment-input {
    flex-direction: column;
  }
}
</style>

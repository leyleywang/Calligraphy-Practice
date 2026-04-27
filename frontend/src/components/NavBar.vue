<template>
  <header class="nav-header">
    <div class="nav-container">
      <div class="nav-logo" @click="goHome">
        <span class="logo-text">书法练习</span>
      </div>
      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          active-class="active"
        >
          <el-icon v-if="item.icon" class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="nav-actions">
        <el-button type="primary" class="login-btn">登录</el-button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Home, 
  Collection, 
  VideoCamera, 
  User 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/library', label: '字帖库', icon: Collection },
  { path: '/courses', label: '指导课程', icon: VideoCamera },
  { path: '/profile', label: '我的', icon: User }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-logo:hover {
  background: rgba(255, 255, 255, 0.05);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #e8d5b7;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: #b8b8d1;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  color: #e8d5b7;
  background: rgba(232, 213, 183, 0.1);
  transform: translateY(-1px);
}

.nav-item.active {
  color: #e8d5b7;
  background: linear-gradient(135deg, rgba(232, 213, 183, 0.15) 0%, rgba(232, 213, 183, 0.05) 100%);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: linear-gradient(90deg, #e8d5b7, #c9a86c);
  border-radius: 2px;
}

.nav-icon {
  font-size: 18px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn {
  background: linear-gradient(135deg, #e8d5b7 0%, #c9a86c 100%);
  border: none;
  color: #1a1a2e;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 213, 183, 0.3);
}
</style>

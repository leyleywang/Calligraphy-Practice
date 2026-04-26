import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CalligraphyLibrary from '../views/CalligraphyLibrary.vue'
import Courses from '../views/Courses.vue'
import Profile from '../views/Profile.vue'
import WorkDetail from '../views/WorkDetail.vue'
import CopyPractice from '../views/CopyPractice.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/library',
    name: 'CalligraphyLibrary',
    component: CalligraphyLibrary,
    meta: { title: '字帖库' }
  },
  {
    path: '/library/practice/:id',
    name: 'CopyPractice',
    component: CopyPractice,
    meta: { title: '在线临摹' }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
    meta: { title: '指导课程' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '我的' }
  },
  {
    path: '/work/:id',
    name: 'WorkDetail',
    component: WorkDetail,
    meta: { title: '作品详情' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 书法练习` : '书法练习'
  next()
})

export default router

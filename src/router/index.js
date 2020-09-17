import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '@/views/Index/Index'
import PlayLists from '@/views/PlayLists/PlayLists'
import PlayMusic from '@/views/PlayMusic/PlayMusic'
import PlayMV from '@/views/PlayMV/PlayMV'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: '/playlists/:playlistsId',
    name: 'PlayLists',
    component: PlayLists
  },
  {
    path: '/playmusic/:musicId',
    name: 'PlayMusic',
    component: PlayMusic
  },
  {
    path: '/playmv/:mvID',
    name: 'PlayMV',
    component: PlayMV
  }
]

const router = new VueRouter({
  routes
})

export default router

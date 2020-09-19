import Vue from 'vue'
import VueRouter from 'vue-router'

// import Index from '@/views/Index/Index'
const Index = () => import(/* webpackChunkName: "index" */ '@/views/Index/Index')
// import PlayLists from '@/views/PlayLists/PlayLists'
const PlayLists = () => import(/* webpackChunkName: "index" */ '@/views/PlayLists/PlayLists')
// import PlayMusic from '@/views/PlayMusic/PlayMusic'
const PlayMusic = () => import(/* webpackChunkName: "index" */ '@/views/PlayMusic/PlayMusic')
// import PlayMV from '@/views/PlayMV/PlayMV'
const PlayMV = () => import(/* webpackChunkName: "index" */ '@/views/PlayMV/PlayMV')
// import Search from '@/views/Search/Search'
const Search = () => import(/* webpackChunkName: "index" */ '@/views/Search/Search')

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
  },
  {
    path: '/search/:keyword',
    name: 'Search',
    component: Search
  }
]

const router = new VueRouter({
  routes
})

export default router

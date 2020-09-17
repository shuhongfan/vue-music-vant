import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    flag: -1,
    musicId: '',
    MVid: '',
    playLists: []
  },
  mutations: {
    setFlag (state, bool) {
      state.flag = bool
    },
    setMusicID (state, id) {
      state.musicId = id
    },
    setMVID (state, id) {
      state.MVid = id
    },
    setPlayLists (state, playList) {
      state.playLists = state.playLists.concat(playList)
    },
    cleanMusicID (state, id) {
      state.musicId = ''
    },
    clearMVID (state, id) {
      state.MVid = ''
    },
    clearPlayLists (state, playLists) {
      state.playLists = ''
    }
  },
  actions: {
  },
  modules: {
  }
})

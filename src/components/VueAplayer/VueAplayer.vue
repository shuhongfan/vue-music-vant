<template>
  <aplayer
    :autoplay='true'
    ref="player"
    :showLrc="true"
    :float="true"
    :mutex="true"
    :controls="true"
    :listFolded="true"
    repeat="repeat-one"
    :list="playLists"
    :music="{
        title: this.songName,
        artist: this.songArtist,
        src: this.musicUrl,
        pic: this.songPicUrl,
        lrc: this.Lyric
      }"
  />
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import aplayer from 'vue-aplayer'
export default {
  name: 'Aplayer',
  data () {
    return {
      musicUrl: '',
      songName: '',
      songPicUrl: '',
      songArtist: '',
      Lyric: ''
    }
  },
  components: {
    aplayer
  },
  computed: {
    ...mapState(['musicId', 'playLists', 'flag'])
  },
  watch: {
    '$store.state.musicId': function (val) {
      if (val) {
        this.init()
      }
    },
    '$store.state.flag': function (val) {
      console.log(val)
      if (val === 0) {
        this.play()
      } else {
        this.pause()
      }
    }
  },
  methods: {
    ...mapMutations(['setPlayLists', 'setFlag', 'cleanMusicID']),
    async init () {
      await this.getMusic()
      await this.getSongDetail()
      await this.getLyric()
      await setTimeout(() => {
        console.log(this.playLists.findIndex(item => item.title === this.songName))
        if (this.playLists.findIndex(item => item.title === this.songName) === -1) {
          this.setPlayLists({
            title: this.songName,
            artist: this.songArtist,
            src: this.musicUrl,
            pic: this.songPicUrl,
            lrc: this.Lyric
          })
        }
      }, 1000)
      await setTimeout(() => {
        this.play()
      }, 1200)
    },
    async getMusic () {
      const result = await this.axios.get('/song/url', {
        params: {
          id: this.musicId
        }
      })
      console.log(result)
      this.musicUrl = result.data.data[0].url
    },
    async getSongDetail () {
      const result = await this.axios.get('/song/detail', {
        params: {
          ids: this.musicId
        }
      })
      console.log(result)
      this.songName = result.data.songs[0].name
      this.songPicUrl = result.data.songs[0].al.picUrl
      this.songArtist = result.data.songs[0].ar[0].name
    },
    async getLyric () {
      const result = await this.axios.get('/lyric', {
        params: {
          id: this.musicId
        }
      })
      console.log(result)
      this.Lyric = result.data.lrc.lyric
    },
    play () {
      this.$refs.player.play()
    },
    pause () {
      this.$refs.player.pause()
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <video-player  class="vjs-custom-skin"
                 ref="videoPlayer"
                 @pause="onPlayerPause($event)"
                 :options="playerOptions"
                 :playsinline="true">
  </video-player>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  name: 'VueVideoPlayer',
  data () {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: this.MVUrl // url地址
        }],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true // 全屏按钮
        }
      },
      MVUrl: ''
    }
  },
  components: {
    videoPlayer
  },
  computed: {
    ...mapState(['MVid', 'flag']),
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  created () {
    this.getMVUrl()
  },
  watch: {
    '$store.state.MVid': function (val) {
      console.log(val)
      this.getMVUrl()
    },
    '$store.state.flag': function (val) {
      console.log(val)
      if (val === 1) {
        this.PlayerPlay()
      } else {
        this.PlayerPause()
      }
    }
  },
  methods: {
    ...mapMutations(['setFlag']),
    async getMVUrl () {
      const result = await this.axios.get('/mv/url', {
        params: {
          id: this.MVid
        }
      })
      console.log(result)
      this.MVUrl = result.data.data.url
      this.playerOptions.sources[0].src = this.MVUrl
    },
    PlayerPlay () {
      this.$refs.videoPlayer.player.play()
    },
    PlayerPause () {
      this.$refs.videoPlayer.player.pause()
    },
    onPlayerPause (player) {
      console.log('player pause!', player)
      this.setFlag(-1)
    }
  }
}
</script>

<style scoped lang="less">

</style>

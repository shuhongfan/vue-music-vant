<template>
  <div class="box" :style="{background: `url(${songPicUrl})`}">
    <van-nav-bar
      :title="songName + '  ' + songArtist"
      left-text="返回"
      left-arrow
      placeholder
      @click-left="onClickLeft"
    />
    <!-- 居中 -->
    <van-row type="flex" justify="center">
      <van-col span="6">
        <div class="player_con" :class="{playing:flag===0}" @click="aplayerPause" :key="flag">
          <img src="./images/player_bar.png" class="play_bar" />
          <!-- 黑胶碟片 -->
          <img src="./images/disc.png" class="disc autoRotate" />
          <img v-if="!songPicUrl" src="./images/cover.png" class="cover autoRotate" />
          <img v-if="songPicUrl" :src="songPicUrl" class="cover autoRotate" />
          <transition name="van-fade">
            <van-icon name="play-circle" v-if="flag===0" class="play-icon"/>
          </transition>
          <transition name="van-fade">
            <van-icon name="pause-circle" v-if="flag===-1" class="pause-icon"/>
          </transition>
        </div>
      </van-col>
    </van-row>
    <div class="songDetail">
      <p>{{ songName }}</p>
      <p>{{ songArtist }}</p>
    </div>
    <van-row>
      <van-col span="8" offset="8">
        <van-button type="info" round icon="down">下载歌曲</van-button>
      </van-col>
    </van-row>
    <div class="comments" v-if="hotComments[0]">
      <h4>热门评论</h4>
      <div v-for="item in hotComments" :key="item.id">
        <div>
          <img :src="item.user.avatarUrl" alt="">
        </div>
        <div>
          <div class="top">
            <h5>{{item.user.nickname}}</h5>
            <p>{{item.time | dateformat}}</p>
          </div>
          <p>{{item.content}}</p>
          <div v-if="item.beReplied[0]" class="beReplied">
            <p>
              <van-tag type="primary">{{item.beReplied[0].user.nickname}}</van-tag>
              {{item.beReplied[0].content}}
            </p>
          </div>
        </div>
      </div>
      <van-pagination
        @change="currentPageChange"
        v-model="currentPage"
        :total-items="total"
        :show-page-size="3"
        force-ellipses
      />
    </div>
    <Aplayer
      :autoplay='true'
      v-if="musicUrl"
      ref="player"
      :showLrc="true"
      :float="true"
      :mutex="true"
      :controls="true"
      :list="playLists"
      repeat="repeat-all"
      :music="{
            title: this.songName,
            artist: this.songArtist,
            src: this.musicUrl,
            pic: this.songPicUrl,
            lrc: this.Lyric
          }"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Aplayer from 'vue-aplayer'
export default {
  name: 'PlayMusic',
  data () {
    return {
      musicUrl: '',
      songName: '',
      songPicUrl: '',
      songArtist: '',
      Lyric: '',
      hotComments: [],
      total: 0,
      currentPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapState(['musicId', 'playLists', 'flag'])
  },
  watch: {
    '$store.state.musicId': function (val) {
      console.log(val)
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
  mounted () {
    this.init()
  },
  components: {
    Aplayer
  },
  methods: {
    ...mapMutations(['setPlayLists', 'setFlag', 'cleanMusicID', 'setMusicID']),
    async init () {
      await this.setMusicID(this.$route.params.musicId)
      await this.getMusic()
      await this.getSongDetail()
      await this.getLyric()
      await this.getSongComment()
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
        this.setFlag(0)
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
    async getSongComment () {
      const result = await this.axios.get('/comment/hot', {
        params: {
          id: this.musicId,
          type: 0,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit
        }
      })
      console.log(result)
      this.hotComments = result.data.hotComments
      this.total = result.data.total
    },
    play () {
      this.setFlag(0)
      setTimeout(() => {
        this.$refs.player.play()
      }, 100)
    },
    pause () {
      this.setFlag(-1)
      this.$refs.player.pause()
    },
    onClickLeft () {
      this.$toast('返回')
      this.$router.go(-1)
    },
    aplayerPause () {
      if (this.flag === -1) {
        this.play()
      } else {
        this.pause()
      }
    },
    currentPageChange () {
      this.getSongComment()
    }
  }
}
</script>

<style scoped lang="less">
.box{
  padding-bottom: 150px;
}
.van-col{
  position: relative;
}
.player_con {
  height: 20vw;
  position: absolute;
  left: -10vw;
}
.disc {
  position: absolute;
  left: -3rem;
  top: 3.5rem;
  z-index: 9;
}
.cover {
  position: absolute;
  left: 0rem;
  top: 7rem;
  width: 9rem;
  height: 9rem;
  border-radius: 5rem;
  z-index: 8;
}
.play_bar {
  position: absolute;
  left: 0rem;
  top: -1rem;
  z-index: 10;
  transform: rotate(-25deg);
  transform-origin: 12px 12px;
  transition: 1s;
}
@keyframes Rotate {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(360deg);
  }
}
/* 旋转的类名 */
.autoRotate {
  animation-name: Rotate;
  animation-iteration-count: infinite;
  animation-play-state: paused;
  animation-timing-function: linear;
  animation-duration: 5s;
}
/* 是否正在播放 */
.player_con.playing .disc,
.player_con.playing .cover {
  animation-play-state: running;
}
.play-icon, .pause-icon{
  position: absolute;
  left:2.5rem;
  top: 9rem;
  color: white;
  font-size: 5rem;
  z-index: 9999;
}
/* 播放杆 转回去 */
.player_con.playing .play_bar {
  transform: rotate(0);
}
.songDetail{
  margin-top: 21rem;
  p{
    width: 93.333vw;
    margin: 0 auto .667vw;
    line-height: 7.467vw;
    font-size: 5.333vw;
    font-weight: 600;
    color: #fff;
    text-align: center;
  }
  p:last-child{
    font-size: 3.2vw;
  }
}
.van-button{
  width: 100%;
  margin-top: 50px;
  margin-bottom: 10px;
}
.comments{
  padding: 10px;
  position: relative;
  div{
    background-color: #fafafa;
    margin: 5px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    div:first-child{
      flex: 1;
      align-items: center;
    }
    div:last-child{
      flex: 6;
      display: flex;
      flex-direction: column;
      .top{
        justify-content: space-between;
      }
      .beReplied{
        background-color: #e6e5e6;
      }
      h5{
        margin: 10px;
      }
      p{
        font-size: 10px;
        line-height: 18px;
        margin-left: 10px;
      }
    }
    img{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      padding-right: 10px;
    }
  }
}
.aplayer{
  width: 100%;
  position: fixed;
  bottom: 0;
}
</style>

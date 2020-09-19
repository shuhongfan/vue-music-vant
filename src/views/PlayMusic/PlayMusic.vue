<template>
  <div class="box" :style="{background: `url(${songPicUrl})`}">
    <van-nav-bar
      :title="songName + '  ' + songArtist"
      left-text="返回"
      right-text="首页"
      left-arrow
      placeholder
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <!-- 居中 -->
    <van-row type="flex" justify="center">
      <van-col span="6">
        <div class="player_con playing" :class="{playing:flag===0}" :key="flag">
          <img src="./images/player_bar.png" class="play_bar" />
          <!-- 黑胶碟片 -->
          <img src="./images/disc.png" class="disc autoRotate" />
          <img v-if="!songPicUrl" src="./images/cover.png" class="cover autoRotate" />
          <img v-if="songPicUrl" :src="songPicUrl" class="cover autoRotate" />
        </div>
      </van-col>
    </van-row>
    <div class="songDetail">
      <p>{{ songName }}</p>
      <p>{{ songArtist }}</p>
    </div>
    <van-row>
      <van-col span="8" offset="8">
        <van-button @click="playMusic" type="info" round icon="music-o">播放歌曲</van-button>
        <van-button v-if="MVID" @click="playMv" type="info" round icon="play-circle-o">播放MV</van-button>
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
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'PlayMusic',
  data () {
    return {
      songName: '',
      songPicUrl: '',
      songArtist: '',
      hotComments: [],
      total: 0,
      currentPage: 1,
      limit: 10,
      MVID: ''
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
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations(['setPlayLists', 'setFlag', 'cleanMusicID', 'setMusicID', 'setMVID']),
    async init () {
      await this.setMusicID(this.$route.params.musicId)
      await this.setFlag(0)
      await this.getSongDetail()
      await this.getSongComment()
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
      this.MVID = result.data.songs[0].mv
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
    onClickLeft () {
      this.$toast('返回')
      this.$router.go(-1)
    },
    onClickRight () {
      this.$toast('返回首页')
      this.$router.push('/')
    },
    currentPageChange () {
      this.getSongComment()
    },
    playMusic () {
      this.setFlag(0)
      this.setMusicID(this.$route.params.musicId)
    },
    playMv () {
      this.setFlag(1)
      this.setMVID(this.MVID)
      this.$router.push('/playmv/' + this.MVID)
    }
  }
}
</script>

<style scoped lang="less">
.box{
  padding-bottom: 50px;
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
  margin-top: 30px;
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
</style>

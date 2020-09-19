<template>
  <div>
    <van-nav-bar
      :title="PlayLists.name"
      left-text="返回"
      right-text="首页"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="header" :style="{background: `url(${PlayLists.coverImgUrl})`}">
      <img class="coverImg" :src="PlayLists.coverImgUrl" alt="">
      <div class="header-content">
        <h3>{{PlayLists.name}}</h3>
        <p>
          <img :src="PlayLists.creator.avatarUrl" alt="">
          <span>{{PlayLists.creator.nickname}}</span>
        </p>
      </div>
    </div>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="歌单简介" name="1">
        {{PlayLists.description}}
      </van-collapse-item>
    </van-collapse>
    <van-panel
      @click="goPlayMusic(music.id)"
      v-for="(music, index) in PlayLists.tracks"
      :key="music.id"
      :title="(index + 1)+ ' ' + music.name"
      :desc="music.ar&&music.ar[0].name">
      <van-icon name="play-circle" />
    </van-panel>
    <div class="comments" v-if="hotComment[0]">
      <h4>精彩评论</h4>
      <div v-for="item in hotComment" :key="item.id">
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
    </div>
    <div class="comments" v-if="comments[0]">
      <h4>热门评论</h4>
      <div v-for="item in comments" :key="item.id">
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
        :total-items="commentsTotal"
        :show-page-size="3"
        force-ellipses
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'PlayLists',
  data () {
    return {
      activeNames: ['1'],
      playlistsId: this.$route.params.playlistsId,
      PlayLists: {},
      MusicId: '',
      type: 2,
      hotLimit: 10,
      hotCurrentPage: 1,
      hotComment: [],
      hotCount: 0,
      limit: 10,
      currentPage: 1,
      commentsTotal: 0,
      comments: []
    }
  },
  watch: {
    '$route.params.playlistsId': function (val) {
      if (val) {
        this.playlistsId = val
      }
    }
  },
  mounted () {
    this.getPlayLists()
    this.getHotComments()
    this.getLatestComments()
  },
  methods: {
    ...mapMutations(['setMusicID']),
    async getPlayLists () {
      const result = await this.axios.get('/playlist/detail', {
        params: {
          id: this.playlistsId
        }
      })
      console.log(result)
      this.PlayLists = result.data.playlist
    },
    async getHotComments () {
      const result = await this.axios.get('/comment/hot', {
        params: {
          id: this.playlistsId,
          type: this.type,
          limit: this.hotLimit,
          offset: (this.hotCurrentPage - 1) * this.hotLimit
        }
      })
      console.log(result)
      this.hotComment = result.data.hotComments
      this.hotCount = result.data.total
    },
    async getLatestComments () {
      const result = await this.axios.get('/comment/playlist', {
        params: {
          id: this.playlistsId,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit
        }
      })
      console.log(result)
      this.commentsTotal = result.data.total
      this.comments = result.data.comments
    },
    onClickLeft () {
      this.$toast('返回')
      this.$router.go(-1)
    },
    onClickRight () {
      this.$toast('返回首页')
      this.$router.push('/')
    },
    goPlayMusic (id) {
      this.MusicId = id
      this.setMusicID(this.MusicId)
      this.$router.push('/playmusic/' + this.MusicId)
    },
    currentPageChange () {
      this.getLatestComments()
    }
  }
}
</script>

<style scoped lang="less">
.header{
  display: flex;
  justify-content: space-around;
  padding: 10px;
  .coverImg{
    width: 150px;
    height: 150px;
  }
  .header-content{
    padding: 10px;
    img{
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    p{
      display: flex;
      align-items: center;
      padding: 5px;
      span{
        margin-left: 10px;
      }
    }
  }
}
/deep/ .van-cell__title{
  font-size: 16px;
  font-weight: bold;
}
/deep/ .van-panel__content{
  float: right;
  padding: 20px;
  margin-top: -70px;
  i{
    font-size: 30px;
  }
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

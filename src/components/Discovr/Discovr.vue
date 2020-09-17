<template>
  <div>
    <!--    轮播-->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in banners" :key="index">
        <van-image width="100%" :src="item.pic" />
      </van-swipe-item>
    </van-swipe>
    <div class="card">
      <h4>推荐歌单</h4>
      <van-grid :column-num="3">
        <van-grid-item v-for="item in Recommend" :key="item.id" @click="goPlayLists(item.id)">
          <van-image :src="item.picUrl" />
          <p>{{ item.name }}</p>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="card">
      <h4>最新音乐</h4>
      <van-grid :column-num="3">
        <van-grid-item v-for="item in LatestMusic" :key="item.id" @click="goPlayMusic(item.id)">
          <van-image :src="item.picUrl" />
          <p>{{ item.name }}</p>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="card">
      <h4>推荐MV</h4>
      <van-grid :column-num="3">
        <van-grid-item v-for="item in RecommendedMV" :key="item.id" @click="goMVs(item.id)">
          <van-image :src="item.picUrl" />
          <p>{{ item.name }}</p>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Discovr',
  data () {
    return {
      banners: [],
      Recommend: [],
      LatestMusic: [],
      RecommendedMV: [],
      playListId: 0,
      MusicId: 0,
      MVId: 0
    }
  },
  mounted () {
    this.getBanner()
    this.getRecommend()
    this.getLatestMusic()
    this.getRecommendedMV()
  },
  methods: {
    ...mapMutations(['setMusicID', 'setMVID']),
    async getBanner () {
      const result = await this.axios.get('/banner', {
        params: {
          type: 1
        }
      })
      console.log(result)
      this.banners = result.data.banners
    },
    async getRecommend () {
      const result = await this.axios.get('personalized', {
        params: {
          limit: 9
        }
      })
      console.log(result)
      this.Recommend = result.data.result
    },
    async getLatestMusic () {
      const result = await this.axios.get('/personalized/newsong')
      console.log(result)
      const res = result.data.result.slice(0, 9)
      console.log(res)
      this.LatestMusic = res
    },
    async getRecommendedMV () {
      const result = await this.axios.get('/personalized/mv')
      const res = result.data.result.slice(0, 3)
      console.log(res)
      this.RecommendedMV = res
    },
    goPlayLists (id) {
      this.playListId = id
      this.$router.push('/playlists/' + this.playListId)
    },
    goPlayMusic (id) {
      this.MusicId = id
      this.setMusicID(this.MusicId)
      this.$router.push('/playmusic/' + this.MusicId)
    },
    goMVs (id) {
      this.MVId = id
      this.setMVID(this.MVId)
      this.$router.push('/playmv/' + this.MVId)
    }
  }
}
</script>

<style scoped lang="less">
.card{
  padding: 5px;
  h4{
    margin-bottom: 0;
    padding-left: 1rem;
  }
  p{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: .9rem;
  }
}
</style>

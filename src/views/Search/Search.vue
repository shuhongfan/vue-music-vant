<template>
  <div>
    <NavBar></NavBar>
<!--    搜索框-->
    <div class="searchBOX">
      <img class="bg" src="../../assets/img/searchBg.png" alt="">
      <van-search
        v-model="keyWords"
        show-action
        shape="round"
        placeholder="请输入音乐/歌单/MV/歌手"
        @search="onSearch"
      />
    </div>
<!--    热门搜搜-->
    <div v-show="!songsList[0]" class="hotSearch">
      <h4>热门搜索</h4>
      <van-tag
        @click="goSearch(tag.first)"
        type="primary"
        v-for="(tag, index) in HotSearchLists"
        :key="index"
        round >{{ tag.first }}</van-tag>
    </div>
    <div v-show="songsList[0]">
      <van-tabs v-model="type" @change="TabChange">
        <van-tab v-for="item in types" :key="item.id" :title="item.title" :name="item.id">
          <div class="card">
            <h4 v-if="type===1">歌曲</h4>
            <h4 v-if="type===1000">歌单</h4>
            <h4 v-if="type===1004">MV</h4>
            <van-grid :column-num="3" v-if="type===1">
              <van-grid-item v-for="item in songsList" :key="item.id" @click="goPlayMusic(item.id)">
                <van-image :src="item.artists[0].img1v1Url" />
                <p>{{ item.name }}</p>
              </van-grid-item>
            </van-grid>
            <van-grid :column-num="3" v-if="type===1000">
              <van-grid-item v-for="item in playLists" :key="item.id" @click="goPlayLists(item.id)">
                <van-image :src="item.coverImgUrl" />
                <p>{{ item.name }}</p>
              </van-grid-item>
            </van-grid>
            <van-grid :column-num="3" v-if="type===1004">
              <van-grid-item v-for="item in mvLists" :key="item.id" @click="goMVs(item.id)">
                <van-image :src="item.cover" />
                <p>{{ item.name }}</p>
              </van-grid-item>
            </van-grid>
          </div>
        </van-tab>
      </van-tabs>
      <van-pagination
        @change="currentPageChange"
        v-model="currentPage"
        :total-items="type===1?songsCount:type===1000?playListCount:mvListsCount"
        :show-page-size="3"
        force-ellipses
      />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar'
import { mapMutations } from 'vuex'
export default {
  name: 'Search',
  data () {
    return {
      keyWords: this.$route.params.keyword,
      limit: 21,
      type: 1,
      types: [
        { title: '歌曲', id: 1 },
        { title: '歌单', id: 1000 },
        { title: 'MV', id: 1004 }
      ],
      currentPage: 1,
      songsList: [],
      songsCount: 0,
      playLists: [],
      playListCount: 0,
      mvLists: [],
      mvListsCount: 0,
      HotSearchLists: []
    }
  },
  components: {
    NavBar
  },
  watch: {
    keyWords: function (val) {
      if (val === '' || val === null) {
        this.songsList = []
      }
    },
    '$route.params.keyword': function (val) {
      if (val) {
        this.keyWords = val
      }
    }
  },
  mounted () {
    this.getSearch()
    this.getHotSearch()
  },
  methods: {
    ...mapMutations(['setMusicID', 'setMVID']),
    async getSearch () {
      const result = await this.axios.get('/search', {
        params: {
          keywords: this.keyWords,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit,
          type: this.type
        }
      })
      console.log(result)
      if (this.type === 1) {
        this.songsList = result.data.result.songs
        this.songsCount = result.data.result.songCount
      } else if (this.type === 1000) {
        this.playLists = result.data.result.playlists
        this.playListCount = result.data.result.playlistCount
      } else if (this.type === 1004) {
        this.mvLists = result.data.result.mvs
        this.mvListsCount = result.data.result.mvCount
      }
    },
    async getHotSearch () {
      const result = await this.axios.get('/search/hot')
      console.log(result)
      this.HotSearchLists = result.data.result.hots
    },
    onSearch (val) {
      this.$toast(val)
      this.getSearch()
    },
    TabChange () {
      this.currentPage = 1
      this.getSearch()
    },
    goSearch (val) {
      this.$toast(val)
      this.keyWords = val
      this.getSearch()
    },
    currentPageChange () {
      this.getSearch()
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
.searchBOX{
  position: relative;
  .bg{
    width: 100%;
  }
  .van-search{
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    background-color: transparent;
    /deep/ .van-search__action{
     display: none;
    }
  }
}
.hotSearch{
  padding: 2vw;
  .van-tag{
    margin: 2vw;
    font-size: 2vw;
    padding: 2vw;
  }
}
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

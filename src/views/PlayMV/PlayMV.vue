<template>
  <div>
    <van-nav-bar
      :title="MVDetail.name + '  ' + MVDetail.artists[0].name"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <VueVideoPlayer></VueVideoPlayer>
    <van-collapse v-model="activeNames">
      <van-collapse-item :title="MVDetail.name" name="1">
        <div class="header">
          <img class="coverImg" :src="MVDetail.cover" alt="">
          <div class="header-content">
            <h3>{{MVDetail.name}}</h3>
            <p>
              <span>{{MVDetail.artists[0].name}}</span>
            </p>
          </div>
        </div>
        <p>{{MVDetail.desc}}</p>
      </van-collapse-item>
      <van-collapse-item :title="artistsDetail.name" name="2">
        <div class="artistsDetail">
          <img :src="artistsDetail.picUrl" alt="">
          <p>{{artistsDetail.briefDesc}}</p>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div class="card">
      <h4>相关MV</h4>
      <van-grid :column-num="3">
        <van-grid-item v-for="item in SimiMV" :key="item.id" @click="goMVs(item.id)">
          <van-image :src="item.cover" />
          <p>{{ item.name }}</p>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="comments" v-if="hotComments[0]">
      <h4>精彩评论</h4>
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
    </div>
    <div class="comments" v-if="MVComments[0]">
      <h4>热门评论</h4>
      <div v-for="item in MVComments" :key="item.id">
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
import { mapMutations, mapState } from 'vuex'
import VueVideoPlayer from '@/components/VueVideoPlayer/VueVideoPlayer'
export default {
  name: 'PlayMV',
  data () {
    return {
      mvID: this.$route.params.mvID,
      PlayMVLists: [],
      MVDetail: {},
      activeNames: ['1'],
      artistsId: '',
      artistsDetail: {},
      SimiMV: [],
      currentPage: 1,
      MVComments: [],
      total: 0,
      limit: 10,
      hotComments: []
    }
  },
  computed: {
    ...mapState(['mvID'])
  },
  components: {
    VueVideoPlayer
  },
  watch: {
    '$route.params.mvID': function (val) {
      if (val) {
        this.mvID = val
        this.setMVID(val)
      }
    }
  },
  methods: {
    ...mapMutations(['setMVID']),
    async init () {
      await this.setMVID(this.$route.params.mvID)
      await this.getMVDetail()
      await this.getArtistsDetail()
      await this.getSimiMV()
      await this.getMVComments()
    },
    onClickLeft () {
      this.$toast('返回')
      this.$router.go(-1)
    },
    async getMVDetail () {
      const result = await this.axios.get('/mv/detail', {
        params: {
          mvid: this.mvID
        }
      })
      console.log(result)
      this.MVDetail = result.data.data
      this.artistsId = result.data.data.artistId
    },
    async getArtistsDetail () {
      const result = await this.axios.get('/artists', {
        params: {
          id: this.artistsId
        }
      })
      console.log(result)
      this.artistsDetail = result.data.artist
    },
    async getSimiMV () {
      const result = await this.axios.get('/simi/mv', {
        params: {
          mvid: this.mvID
        }
      })
      console.log(result)
      this.SimiMV = result.data.mvs
    },
    goMVs (id) {
      this.mvID = id
      this.setMVID(this.mvID)
      this.$router.push('/playmv/' + this.mvID)
      this.init()
    },
    async getMVComments () {
      const result = await this.axios.get('/comment/mv', {
        params: {
          id: this.mvID,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit
        }
      })
      console.log(result)
      this.MVComments = result.data.comments
      if (this.currentPage === 1) {
        this.hotComments = result.data.hotComments
      }
      this.total = result.data.total
    },
    currentPageChange () {
      this.getMVComments()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="less">
.header{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  .coverImg{
    width: 160px;
    height: 100px;
  }
  .header-content{
    padding: 10px;
    p{
      display: flex;
      align-items: center;
      padding: 5px;
    }
  }
}
.artistsDetail{
  display: flex;
  align-items: center;
  img{
    width: 100px;
    height: 100px;
  }
  p{
    padding: 5px;
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

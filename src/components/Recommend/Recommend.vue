<template>
  <div>
    <van-dropdown-menu>
      <van-dropdown-item @change="dropdownItemChange" get-container="body" v-model="cat" :options="cats" />
    </van-dropdown-menu>
    <div class="card">
      <h4>推荐歌单</h4>
      <van-grid :column-num="3">
        <van-grid-item v-for="item in RecommendList" :key="item.id" @click="goPlayLists(item.id)">
          <van-image :src="item.coverImgUrl" />
          <p>{{ item.name }}</p>
        </van-grid-item>
      </van-grid>
    </div>
    <van-pagination
      @change="currentPageChange"
      v-model="currentPage"
      :total-items="total"
      :show-page-size="3"
      force-ellipses
    />
  </div>
</template>

<script>
export default {
  name: 'Recommend',
  data () {
    return {
      RecommendList: [],
      currentPage: 1,
      total: 0,
      limit: 18,
      cat: '全部',
      cats: [
        { text: '全部', value: '全部' },
        { text: '欧美', value: '欧美' },
        { text: '华语', value: '华语' },
        { text: '流行', value: '流行' },
        { text: '说唱', value: '说唱' },
        { text: '摇滚', value: '摇滚' },
        { text: '民谣', value: '民谣' },
        { text: '电子', value: '电子' },
        { text: '轻音乐', value: '轻音乐' },
        { text: '影视原声', value: '影视原声' },
        { text: 'ACG', value: 'ACG' },
        { text: '怀旧', value: '怀旧' },
        { text: '治愈', value: '治愈' },
        { text: '旅行', value: '旅行' }
      ],
      playListId: ''
    }
  },
  mounted () {
    this.getRecommendList()
  },
  methods: {
    async getRecommendList () {
      const result = await this.axios.get('/top/playlist/', {
        params: {
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit,
          cat: this.cat
        }
      })
      console.log(result)
      this.RecommendList = result.data.playlists
      this.total = result.data.total
    },
    currentPageChange () {
      this.getRecommendList()
    },
    dropdownItemChange () {
      this.getRecommendList()
    },
    goPlayLists (id) {
      this.playListId = id
      this.$router.push('/playlists/' + this.playListId)
    }
  }
}
</script>

<style scoped lang="less">
.card {
  padding: 5px;

  h4 {
    margin-bottom: 0;
    padding-left: 1rem;
  }

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: .9rem;
  }
}
</style>

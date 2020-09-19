<template>
  <div>
    <van-dropdown-menu>
      <van-dropdown-item @change="dropdownItemChange" get-container="body" v-model="area" :options="areas" />
      <van-dropdown-item @change="dropdownItemChange" get-container="body" v-model="type" :options="types" />
      <van-dropdown-item @change="dropdownItemChange" get-container="body" v-model="order" :options="orders" />
    </van-dropdown-menu>
    <div class="card">
      <h4>推荐MV</h4>
      <van-grid :column-num="3">
        <van-grid-item v-for="item in LatestMVList" :key="item.id" @click="goMVs(item.id)">
          <van-image :src="item.cover" />
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
import { mapMutations } from 'vuex'
export default {
  name: 'LatestMV',
  data () {
    return {
      LatestMVList: [],
      limit: 18,
      total: 0,
      currentPage: 0,
      area: '全部',
      areas: [
        { text: '全部', value: '全部' },
        { text: '内地', value: '内地' },
        { text: '港台', value: '港台' },
        { text: '欧美', value: '欧美' },
        { text: '日本', value: '日本' },
        { text: '韩国', value: '韩国' }
      ],
      type: '全部',
      types: [
        { text: '全部', value: '全部' },
        { text: '官方版', value: '官方版' },
        { text: '原声', value: '原声' },
        { text: '现场版', value: '现场版' },
        { text: '网易出品', value: '网易出品' }
      ],
      order: '最热',
      orders: [
        { text: '上升最快', value: '上升最快' },
        { text: '最热', value: '最热' },
        { text: '最新', value: '最新' }
      ],
      MVId: ''
    }
  },
  mounted () {
    this.getLatestMV()
  },
  methods: {
    ...mapMutations(['setMVID']),
    async getLatestMV () {
      const result = await this.axios.get('/mv/all', {
        params: {
          area: this.area,
          type: this.type,
          order: this.order,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit
        }
      })
      console.log(result)
      this.LatestMVList = result.data.data
      if (this.currentPage === 1) {
        this.total = result.data.count
      }
    },
    currentPageChange () {
      this.getLatestMV()
    },
    dropdownItemChange () {
      this.getLatestMV()
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

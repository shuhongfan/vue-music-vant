<template>
  <div class="box">
<!--    导航栏-->
    <van-nav-bar
      fixed
      placeholder
      title="凡音"
      @click-left="onClickLeft"
      @click-right="onClickRight">
      <template #left>
        <van-image
          round
          width="6rem"
          height="3rem"
          :src="require('../../assets/img/logo.png')"
        />
      </template>
      <template #right>
        <van-icon name="search" size="26" color="white" />
      </template>
    </van-nav-bar>
<!--    tab标签页-->
    <van-tabs v-model="active" color="#1da0ef">
      <van-tab title="发现音乐" name="发现音乐">
        <Discovr></Discovr>
      </van-tab>
      <van-tab title="推荐歌单" name="推荐歌单">内容 2</van-tab>
      <van-tab title="最新音乐" name="最新音乐">内容 3</van-tab>
      <van-tab title="最新MV" name="最新MV">内容 4</van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Discovr from '@/components/Discovr/Discovr'
export default {
  name: 'Index',
  data () {
    return {
      active: '发现音乐'
    }
  },
  components: {
    Discovr
  },
  methods: {
    onClickLeft () {
      this.$toast('凡音-舒洪凡')
      this.$router.push('/')
    },
    onClickRight () {
      this.$toast('搜索')
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .van-nav-bar--fixed{
  background: #1da0ef!important;
}
/deep/ .van-nav-bar__title{
  color: white;
}
</style>

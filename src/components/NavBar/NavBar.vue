<template>
  <van-nav-bar
    fixed
    placeholder
    title="凡音"
    @click-left="onClickLeft">
    <template #left>
      <van-image
        round
        width="6rem"
        height="3rem"
        :src="require('../../assets/img/logo.png')"
      />
    </template>
    <template #right>
      <van-search
        @search="onSearch"
        v-model="keyWord"
        placeholder="音乐/歌单/MV/歌手"
        background="rgba(0,0,0,0)"/>
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      keyWord: this.$route.params.keyword
    }
  },
  methods: {
    onClickLeft () {
      this.$toast('凡音-舒洪凡')
      this.$router.push('/')
    },
    onSearch () {
      this.$toast('搜索')
      this.$router.push('/search/' + this.keyWord)
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
/deep/ .van-search{
  width: 30vw;
}
</style>

<template>
  <div class="box">
<!--    导航栏-->
    <NavBar></NavBar>
<!--    tab标签页-->
    <van-tabs v-model="active" color="#1da0ef" animated>
      <van-tab title="发现音乐" name="发现音乐">
        <Discovr></Discovr>
      </van-tab>
      <van-tab title="推荐歌单" name="推荐歌单">
        <Recommend></Recommend>
      </van-tab>
      <van-tab title="最新音乐" name="最新音乐">
        <LatestMusic></LatestMusic>
      </van-tab>
      <van-tab title="最新MV" name="最新MV">
        <LatestMV></LatestMV>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar'
import Discovr from '@/components/Discovr/Discovr'
import Recommend from '@/components/Recommend/Recommend'
import LatestMusic from '@/components/LatestMusic/LatestMusic'
import LatestMV from '@/components/LatestMV/LatestMV'
export default {
  name: 'Index',
  data () {
    return {
      active: '发现音乐'
    }
  },
  components: {
    NavBar,
    Discovr,
    Recommend,
    LatestMusic,
    LatestMV
  }
}
</script>

<style scoped lang="less">
.aplayer{
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>

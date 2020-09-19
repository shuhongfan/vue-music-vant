<template>
  <div id="app">
    <div class="views">
      <router-view/>
    </div>
    <div class="aplayer">
      <VueAplayer></VueAplayer>
    </div>
  </div>
</template>

<script>
import VueAplayer from '@/components/VueAplayer/VueAplayer'
export default {
  name: 'App',
  data () {
    return {}
  },
  components: {
    VueAplayer
  }
}
</script>

<style scoped lang="less">
.views{
  margin-bottom: 90px;
}
.aplayer{
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  margin: 0;
}
</style>

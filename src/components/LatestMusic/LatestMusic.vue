<template>
  <div>
    <van-tabs v-model="Tabtype" animated @change="tabChange">
      <van-tab v-for="item in Tabtypes" :key="item.id" :title="item.title" :name="item.id">
        <van-panel
          @click="goPlayMusic(music.id)"
          v-for="(music, index) in LatestMusicLists"
          :key="music.id"
          :title="(index + 1)+ ' ' + music.name"
          :desc="music.artists&&music.artists[0].name">
          <van-icon name="play-circle" />
        </van-panel>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'LatestMusic',
  data () {
    return {
      MusicId: '',
      LatestMusicLists: [],
      Tabtype: '0',
      Tabtypes: [
        { title: '全部', id: 0 },
        { title: '华语', id: 7 },
        { title: '欧美', id: 96 },
        { title: '日本', id: 8 },
        { title: '韩国', id: 16 }
      ]
    }
  },
  mounted () {
    this.getLatestMusic()
  },
  methods: {
    ...mapMutations(['setMusicID']),
    async getLatestMusic () {
      const result = await this.axios.get('/top/song', {
        params: {
          type: this.Tabtype
        }
      })
      console.log(result)
      this.LatestMusicLists = result.data.data.slice(0, 30)
    },
    tabChange () {
      this.getLatestMusic()
    },
    goPlayMusic (id) {
      this.MusicId = id
      this.setMusicID(this.MusicId)
      this.$router.push('/playmusic/' + this.MusicId)
    }
  }
}
</script>

<style scoped lang="less">
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
</style>

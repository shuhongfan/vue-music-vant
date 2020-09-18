<template>
  <div>
    <van-nav-bar
      :title="PlayLists.name"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <div class="header" :style="{background: `url(${PlayLists.coverImgUrl})`}">
      <img class="coverImg" :src="PlayLists.coverImgUrl" alt="">
      <div class="header-content">
        <h3>{{PlayLists.name}}</h3>
        <p>
          <img :src="PlayLists.creator.avatarUrl" alt="">
          <span>{{PlayLists.creator.nickname}}</span>
        </p>
      </div>
    </div>
    <van-panel
      @click="goPlayMusic(music.id)"
      v-for="(music, index) in PlayLists.tracks"
      :key="music.id"
      :title="(index + 1)+ ' ' + music.name"
      :desc="music.ar&&music.ar[0].name">
      <van-icon name="play-circle" />
    </van-panel>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'PlayLists',
  data () {
    return {
      playlistsId: this.$route.params.playlistsId,
      PlayLists: {},
      MusicId: ''
    }
  },
  watch: {
    '$route.params.playlistsId': function (val) {
      if (val) {
        this.playlistsId = val
      }
    }
  },
  mounted () {
    this.getPlayLists()
  },
  methods: {
    ...mapMutations(['setMusicID']),
    async getPlayLists () {
      const result = await this.axios.get('/playlist/detail', {
        params: {
          id: this.playlistsId
        }
      })
      console.log(result)
      this.PlayLists = result.data.playlist
    },
    onClickLeft () {
      this.$toast('返回')
      this.$router.go(-1)
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
.header{
  display: flex;
  justify-content: space-around;
  padding: 10px;
  .coverImg{
    width: 150px;
    height: 150px;
  }
  .header-content{
    padding: 10px;
    img{
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    p{
      display: flex;
      align-items: center;
      padding: 5px;
      span{
        margin-left: 10px;
      }
    }
  }
}
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

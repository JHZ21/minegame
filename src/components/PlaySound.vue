<template>
  <div class="palysound">
    <audio ref="sd" :src="srcSound"></audio>
  </div>
</template>

<script>
import EventBus from "../eventBus";
export default {
  name: "PlaySound.vue",
  data: function() {
    return {
      srcSound: "",
      srcSoundOption: {
        "cell-click": "/cell-click0.mp3",
        "burst-sound": "/burst-sound0.mp3",
        "you-win": "/youWin.mpg"
      }
    };
  },
  created: function() {
    this.srcSound = this.srcSoundOption["cell-click"];
    EventBus.$on("click-cell", () => {
      this.srcSound = this.srcSoundOption["cell-click"];
      this.$refs.sd.play();
    });
    EventBus.$on("boom-end", () => {
      this.$refs.sd.pause();
      new Promise(resolve => {
        this.srcSound = this.srcSoundOption["burst-sound"];
        resolve();
      }).then(() => {
        this.$refs.sd.play();
      });
    });
    EventBus.$on("you-win", () => {
      // setTimeout( () => {
      //     new Promise(resolve => {
      //         this.srcSound = this.srcSoundOption["you-win"];
      //         resolve();
      //     }).then(() => {
      //         this.$refs.sd.play();
      //     });
      // },300);
    });
  }
};
</script>

<style lang="scss" scoped>
.playsound {
  width: 0;
  height: 0;
  visibility: hidden;
  position: absolute;
}
</style>

<template>
  <div class="palysound">
    <audio ref="cell-click" :src="srcSoundOption['cell-click']"></audio>
    <audio ref="burst-sound" :src="srcSoundOption['burst-sound']"></audio>
    <audio ref="you-win" :src="srcSoundOption['you-win']"></audio>
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
        "cell-click": "./cell-click0.mp3",
        "burst-sound": "./burst-sound0.mp3",
        "you-win": "./youWin.mp3"
      }
    };
  },
  created: function() {
    EventBus.$on("click-cell", () => {
      this.$refs["cell-click"].play();
    });
    EventBus.$on("boom-end", () => {
      this.$refs["burst-sound"].play();
    });
    EventBus.$on("you-win", () => {
      this.$refs["you-win"].play();
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

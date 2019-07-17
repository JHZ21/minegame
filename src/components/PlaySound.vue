<template>
  <div class="palysound">
    <audio
      ref="playsound"
      v-for="(item, key) in srcSoundOption"
      :src="item"
      :key="key"
    ></audio>
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
      this.$refs.playsound[0].play();
    });
    EventBus.$on("boom-end", () => {
      this.$refs.playsound[1].play();
    });
    EventBus.$on("you-win", () => {
      this.$refs.playsound[2].play();
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

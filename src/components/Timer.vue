<template>
  <div class="timer">{{ hh }}小时 {{ mm }}分钟 {{ ss }}秒</div>
</template>

<script>
import EventBus from "../eventBus";
export default {
  name: "Timer.vue",
  data() {
    return {
      hh: "00",
      mm: "00",
      ss: "00",
      startTime: 0,
      endTime: 0,
      timerId: 0
    };
  },
  created() {
    // 监听炸弹爆炸
    EventBus.$on("boom-end", () => {
      this.endTime = Date.now();
      this.showTimer(this.endTime - this.startTime);
      clearInterval(this.timerId);
    });
    EventBus.$on("you-win", () => {
      this.endTime = Date.now();
      this.showTimer(this.endTime - this.startTime);
      clearInterval(this.timerId);
    });
    //
    EventBus.$on("start-timer", () => {
      this.startTime = Date.now();
      this.timerId = setInterval(() => {
        let s = Date.now() - this.startTime;
        this.showTimer(s);
      }, 500);
    });
  },
  methods: {
    showTimer(s) {
      this.ss = String(Math.trunc(s / 1000) % 60).padStart(2, "0"); // 04
      this.mm = String(Math.trunc(s / (1000 * 60)) % 60).padStart(2, "0"); //04
      this.hh = String(Math.trunc(s / (1000 * 60 * 60)) % 60).padStart(2, "0"); //04
    }
  }
};
</script>

<style scoped></style>

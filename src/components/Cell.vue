<template>
  <td
    :class="{
      boom: cellData.isBoom && cellData.isClear,
      'mine-clear': !cellData.isBoom && cellData.isClear,
      marked: cellData.isMarked
    }"
    @mousedown="cellClick"
    :style="{ width: size.w + 'px', height: size.h + 'px' }"
  >
    <!-- 如果是炸弹 -->
    <template v-if="cellData.isBoom">
      <!-- B -->
    </template>
    <!-- 如果不是炸弹 -->
    <template v-else>
      <span
        :style="{ color: getNumColor(cellData.data) }"
        v-if="cellData.isClear"
        >{{ cellData.data === 0 ? "" : cellData.data }}</span
      >
    </template>
  </td>
</template>

<script>
import EventBus from "../eventBus";

export default {
  name: "Cell",
  data() {
    return {};
  },
  methods: {
    getNumColor(num) {
      switch (num) {
        case 1:
          return "#fff";
        case 2:
          return "#c6a";
        case 3:
          return "#08a";
        case 4:
          return "#0a2";
        case 5:
          return "#a20";
        case 6:
          return "#4a0";
        default:
          return "#f90";
      }
    },
    cellClick($event) {
      // 无影响操作
      if (this.cellData.isClear) {
        return;
      }
      // 如果是点击了鼠标的右键，标记为marked状态
      if ($event.button === 2) {
        // EventBus.$emit("click-cell");
        this.$set(this.cellData, "isMarked", !this.cellData.isMarked);
        return;
      }
      // 点击鼠标左键
      if ($event.button === 0) {
        // 如果已标记，则无效返回。
        if (this.cellData.isMarked) return;
        if (this.cellData.isBoom) {
          //发送游戏结束的事件（game over)
          console.log("boom");
          EventBus.$emit("boom-end");
        } else {
          EventBus.$emit("click-cell");
          // 让当前的单元格显示数字;
          // 将要清理的坐标index发送给父容器。
          this.$emit("clearBoom", this.cellData.cellIndex);
        }
      }
    }
  },
  props: {
    cellData: {
      type: Object,
      required: true
    },
    size: {
      type: Object,
      required: false,
      default: function() {
        return {
          w: 30,
          h: 30
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  text-align: center;
  vertical-aling: center;
}
.mine-clear {
  background-color: #333 !important;
}
.boom {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url("../../public/bomb-burst.png") !important;
  }
}
.marked {
  background-image: url("../../public/flag.png") !important;
  background-size: cover;
}
</style>

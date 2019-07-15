<template>
  <div id="app">
    <h1>这是AICODER项目</h1>
    <h2>非炸弹：{{ hasClearCellsNum }} / {{ cols * rows - boomsNum }}</h2>
    <div class="container">
      <div class="main">
        <table class="mine-table">
          <tr v-for="(rowItem, rIndex) of rows" :key="'row_' + rIndex">
            <cell
              @clearBoom="clearBoom"
              :cell-data="cellArray[rIndex * cols + cIndex]"
              :size="{ w: cellWidth, h: cellHeight }"
              v-for="(colItem, cIndex) of cols"
              :key="'col_' + cIndex"
            ></cell>
          </tr>
        </table>
      </div>
      <div class="aside">
        aside
        <el-radio-group @change="changeLevel" v-model="level" size="mini">
          <el-radio-button label="简单"></el-radio-button>
          <el-radio-button label="中级"></el-radio-button>
          <el-radio-button label="高级"></el-radio-button>
        </el-radio-group>
        <div class="block">
          <span class="demonstration">列数:{{ cols }}</span>
          <el-slider v-model="cols" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">行数:{{ rows }}</span>
          <el-slider v-model="rows" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <el-switch
            style="display: block;"
            v-model="isCellWHSync"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是否同步宽高"
          >
          </el-switch>
        </div>
        <div class="block">
          <span class="demonstration">行高:{{ cellWidth }}</span>
          <el-slider v-model="cellWidth" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">列高:{{ cellHeight }}</span>
          <el-slider v-model="cellHeight" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <el-button @click="initCellData" type="success">重置</el-button>
        </div>
      </div>
    </div>
    <play-sound></play-sound>
    <timer></timer>
  </div>
</template>

<script>
import Cell from "./components/Cell";
import "element-ui/lib/theme-chalk/index.css";
import PlaySound from "./components/PlaySound";
import Timer from "./components/Timer";
import EventBus from "./eventBus";
export default {
  name: "app",
  data: function() {
    return {
      level: "简单",
      cols: 10,
      rows: 10,
      isCellWHSync: true,
      cellWidth: 30,
      cellHeight: 30,
      cellArray: [],
      // 是否为重置状态
      isReset: true,
      hasClearCellsNum: 0,
      boomsNum: 0
    };
  },
  created() {
    this.initCellData();
    // 鼠标右键显示菜单禁止
    document.oncontextmenu = () => {
      return false;
    };
    EventBus.$on("boom-end", () => {
      this.boomEnd();
    });
    EventBus.$on("click-cell", () => {
      this.isReset && EventBus.$emit("start-timer");
      this.isReset = false;
    });
  },
  methods: {
    boomEnd() {
      // 把所有的雷与其他单元格显示出来 clear
      this.cellArray.forEach(item => {
        this.$set(item, "isClear", true);
      });
    },
    // 清理雷区
    clearBoom(index) {
      const innerClearBoom = cIndex => {
        if (cIndex >= 0 && cIndex < this.cellArray.length) {
          let cell = this.cellArray[cIndex];
          if (cell.isMarked || cell.isBoom || cell.isClear) {
            return;
          }
          this.$set(cell, "isClear", true);
          this.hasClearCellsNum++;
          // 如果自己的数字也是0， 继续清理
          this.clearBoom(cIndex);
        }
      };
      // 如果当前自己data不是0,那么就直接把自己清理掉。 isClear true
      let cell = this.cellArray[index];
      if (cell.data !== 0) {
        if (cell.isClear) return;
        this.$set(cell, "isClear", true);
        this.hasClearCellsNum++;
      } else {
        // 如果是0， 那么把周围的8个单元格clear.
        this.getCellsAround(this, index, function(cIndex) {
          innerClearBoom(cIndex);
        });
      }
    },
    changeLevel() {
      this.initCellData();
    },
    initCellData() {
      this.isReset = true;
      // 格子总数
      let sum = this.cols * this.rows;
      // 炸弹总数
      let randomBooms = this.getLevelNum() * 0.15 * sum;
      let randomIndexSet = new Set();
      while (randomIndexSet.size <= randomBooms) {
        randomIndexSet.add(Math.trunc(Math.random() * sum));
      }
      this.boomsNum = randomIndexSet.size;
      console.log(randomIndexSet);
      //设置每个格子的状态
      this.cellArray = [];
      for (let i = 0; i < sum; i++) {
        let isBoom = randomIndexSet.has(i);
        let data = this.getBoomsNumAround(i, randomIndexSet);
        this.cellArray.push({
          isBoom,
          data,
          // isShowBoom: fasle,
          isMarked: false,
          isClear: false,
          cellIndex: i
        });
      }
      this.hasClearCellsNum = 0;
    },
    getCellsAround(context, index, callback) {
      let cols = context.cols;
      let rows = context.rows;
      for (let i = -1; i <= 1; i++) {
        let cIndex = index - cols * i;
        if (cIndex < 0 || cIndex >= cols * rows) continue;
        let trow = Math.floor(cIndex / cols);
        for (let i = -1; i <= 1; i++) {
          if (Math.floor((cIndex - i) / cols) === trow) {
            // 回调函数
            callback(cIndex - i);
          }
        }
      }
    },
    getBoomsNumAround(index, boomSet) {
      let count = 0;
      this.getCellsAround(this, index, function(cIndex) {
        count += boomSet.has(cIndex);
      });
      return count;
    },
    getLevelNum() {
      if (this.level === "简单") {
        return 1;
      } else if (this.level === "中级") {
        return 2;
      } else {
        return 3;
      }
    }
  },
  watch: {
    hasClearCellsNum(newVal) {
      console.log(newVal, this.cols * this.rows - this.boomsNum);
      if (newVal === this.cols * this.rows - this.boomsNum) {
        console.log("you win !!");
        // 游戏结束，计时停止
        EventBus.$emit("you-win");
      }
    },
    cellWidth(newVal) {
      this.isCellWHSync && (this.cellHeight = newVal);
    },
    cellHeight(newVal) {
      this.isCellWHSync && (this.cellWidth = newVal);
    },
    rows() {
      this.initCellData();
    },
    cols() {
      this.initCellData();
    }
  },
  components: {
    cell: Cell,
    "play-sound": PlaySound,
    timer: Timer
  }
};
</script>

<style lang="scss">
.block {
  border-top: 1px solid #c09;
  margin-top: 5px;
}
#app {
  .container {
    display: flex;
    & > div {
      border: 1px solid #ccc;
    }
    .main {
      flex: 5 0 500px;
      min-height: 300px;
    }
    .aside {
      flex: 2 0 200px;
      min-height: 300px;
    }
    .mine-table {
      border-collapse: collapse;
      td {
        width: 30px;
        height: 30px;
        border: 1px solid #c09;
        background-color: aliceblue;
      }
    }
  }
}
</style>

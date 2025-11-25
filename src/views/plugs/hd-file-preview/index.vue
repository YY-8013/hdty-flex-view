<template>
  <el-dialog title="图片预览" :visible.sync="visible" v-if="visible" append-to-body>
    <hd-pane fit>
      <viewer>
        <el-carousel height="500px" :initial-index="index" :autoplay="false" @change="changeIndex">
          <el-carousel-item v-for="(item, index) in urlList" :key="index">
            <div class="img-preview-container" title="点击查看大图">
              <img :src="item" alt :id="'showImg' + index" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </viewer>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="warning" icon="el-icon-refresh-left" @click="setImgRotate('L')">左旋转</el-button>
      <el-button type="warning" icon="el-icon-refresh-right" @click="setImgRotate('R')">右旋转</el-button>
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Index',
  props: {
    prop: String,
    // 当前索引
    currentIndex: {
      type: Number,
      default: 0
    },
    // 当前图片url集合
    currentUrlList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 图片索引
      index: this.currentIndex,
      // 图片url列表
      urlList: this.currentUrlList,
      // 旋转
      rotateList: []
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.index = this.currentIndex;
          this.urlList = this.currentUrlList;
          this.rotateList = [];
          this.currentUrlList.forEach((item) => {
            this.rotateList.push(0);
          });
        } else {
          this.index = 0;
          this.urlList = [];
          this.rotateList = [];
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 图片旋转
    setImgRotate(leftOrRight) {
      let img = document.getElementById('showImg' + this.index);
      //左旋转
      if (leftOrRight === 'L') {
        this.rotateList[this.index] = (this.rotateList[this.index] - 90) % 360;
      }
      //右旋转
      else if (leftOrRight === 'R') {
        this.rotateList[this.index] = (this.rotateList[this.index] + 90) % 360;
      }
      img.style.transform = 'rotate(' + this.rotateList[this.index] + 'deg)';
    },
    // 切换图片（幻灯片）
    changeIndex(index1, index2) {
      this.index = index1;
    },
    // 取消
    cancelForm() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.img-preview-container {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>

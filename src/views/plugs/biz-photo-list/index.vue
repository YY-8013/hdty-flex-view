<template>
  <div class="hd-photo-list">
    <div class="body">
      <div
        v-if="fileList && fileList.length > 0"
        class="file-photo-list hdty-scroll"
        :class="scroll ? 'list-row-scroll' : ''"
      >
        <span
          class="file-photo-item"
          v-for="(fileItem, index) in fileList"
          :key="`photo-${index}-${fileItem.id}`"
        >
          <viewer class="display:inline">
            <img
              :src="fileItem.url"
              :class="border ? 'img-border' : ''"
              :style="{ 'object-fit': 'contain', height: imgHeight }"
              :title="`点击查看【${fileItem.name}】`"
            />
          </viewer>
        </span>
      </div>
      <div v-else class="file-empty" :style="{ height: emptyHeight }">
        <span>暂无照片</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BizPhotoList",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    },
    scroll: {
      type: Boolean,
      default: false
    },
    imgHeight: {
      type: String,
      default: "200px"
    },
    emptyHeight: {
      type: String,
      default: "60px"
    }
  },
  data() {
    return {};
  },
  computed: {
    fileList() {
      return this.value;
    }
  }
};
</script>
<style lang="scss" scoped>
.file-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  span {
    color: #141414;
    letter-spacing: 2px;
  }
}
.file-photo-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  &.list-row-scroll {
    flex-wrap: nowrap;
  }
  .file-photo-item {
    margin-right: 8px;
    margin-bottom: 8px;
    img {
      cursor: pointer;
      &.img-border {
        border: 1px dashed #dadada;
      }
    }
  }
}
</style>

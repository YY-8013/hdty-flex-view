export default {
  methods: {
    // 锚点
    handleAnchor(anchorValue) {
      // 点击锚点操作，则不监听滚动事件，否则点击最下方的锚点，滚动监听代码会将选中的锚点再次改变
      this.clickAnchor = true;
      // 设置选中的锚点
      this.activeAnchor =
        anchorValue === "top" ? this.anchorIds[0] : anchorValue;
      this.currentSection =
        anchorValue === "top" ? this.anchorIds[0] : anchorValue;
      // 找到锚点
      let anchorElement = document.getElementById(this.activeAnchor);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) anchorElement.scrollIntoView();
    },
    initScrollBox() {
      let _this = this;
      // 监听滚动
      let scrollBox = document.getElementById(_this.formId);
      scrollBox.addEventListener("scroll", this.handleScroll);
    },
    // 初始化滚动区域
    handleScroll() {
      let _this = this;
      // 不是点击锚点而是滚动页面，才会监听滚动事件并执行后续代码
      if (!_this.clickAnchor) {
        for (let i = 0; i < _this.anchorIds.length - 1; i++) {
          let rect = document
            .getElementById(_this.anchorIds[i])
            .getBoundingClientRect();
          let nextRect = document
            .getElementById(_this.anchorIds[i + 1])
            .getBoundingClientRect();
          if (rect.top <= 72.4 && nextRect.top > 72.4) {
            _this.activeAnchor = _this.anchorIds[i];
            break;
          }
        }
      }
      // 将是否点击锚点事件改为 false
      _this.clickAnchor = false;
    }
  }
};

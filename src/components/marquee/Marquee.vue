<template>

</template>

<script>
  export default {
    name: "Marquee",
    provide() {
      return {
        hdMarquee: this
      };
    },
    data() {
      return {
        options: {
          // 选框所在容器（HTML Element）
          container: null,
          // 选框目标选择器（CSS selectors）
          target: null,
          // 完成回调
          oncomplete: null
        },
        props: {
          containerSelector: '.hdty-body',
          targetSelector: 'input[type="checkbox"]'
        },
        isDefaultTarget: false,
        isMousemove: false,
        marqueeEl: null,
        startX: null,
        startY: null
      }
    },
    mounted() {
      this.options.container = this.options.container || document.querySelector(this.props.containerSelector);
      this.options.target = this.options.target || this.props.targetSelector;
      if(this.options.target === this.props.targetSelector) this.isDefaultTarget = true;
      let marqueeEl = document.querySelector('.hdty-marquee');
      if(marqueeEl) marqueeEl.remove();
      this.options.container.addEventListener('mousedown', this.listenerMousedown);
    },
    methods: {
      listenerMousedown(e) {
        // 阻止事件冒泡
        if (e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
        // 阻止默认行为
        if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
        // 创建选框节点
        if(!this.marqueeEl) {
          this.marqueeEl = document.createElement('div');
          this.marqueeEl.className = 'hdty-marquee';
          document.body.appendChild(this.marqueeEl);
        }
        // 设置选框初始位置
        this.startX = e.x || e.clientX;
        this.startY = e.y || e.clientY;
        this.marqueeEl.style.left = this.startX + 'px';
        this.marqueeEl.style.top = this.startY + 'px';
        this.marqueeEl.style.width = '0';
        this.marqueeEl.style.height = '0';

        this.options.container.addEventListener('mouseup', this.listenerMouseup);
        this.options.container.addEventListener('mousemove', this.listenerMousemove);
        this.marqueeEl.addEventListener('mouseup', this.listenerMouseup);
        this.marqueeEl.addEventListener('mousemove', this.listenerMousemove);
      },
      listenerMouseup() {
        this.options.container.removeEventListener('mousemove', this.listenerMousemove);
        this.marqueeEl.removeEventListener('mousemove', this.listenerMousemove);
        this.options.container.removeEventListener('mouseup', this.listenerMousemove);
        this.marqueeEl.removeEventListener('mouseup', this.listenerMousemove);
        if(this.marqueeEl) this.marqueeEl.style.display = 'none';
        if(this.isMousemove) {
          let selectedEl = this.options.container.querySelectorAll('.is-marquee-selected');
          if(typeof(this.options.oncomplete) === 'function') {
            this.options.oncomplete(selectedEl.length > 0 ? selectedEl : null);
          }
          [].forEach.call(selectedEl, function(e) {
            e.addEventListener('click', removeSelectedClass);
          });
          function removeSelectedClass(e) {
            e.currentTarget.classList.remove('is-marquee-selected');
            e.currentTarget.removeEventListener('click', removeSelectedClass);
          }
        }
        this.isMousemove = false;
      },
      listenerMousemove(e) {
        if(!this.isMousemove) this.isMousemove = true;
        // 设置选框可见
        this.marqueeEl.style.display = 'block';
        //  设置选框位置
        let _x = e.x || e.clientX;
        let _y = e.y || e.clientY;
        let _left = Math.min(_x, this.startX);
        let _top = Math.min(_y, this.startY);
        this.marqueeEl.style.left = _left + 'px';
        this.marqueeEl.style.top = _top + 'px';
        // 设置选框宽高
        let _width  = Math.abs(_x - this.startX);
        let _height = Math.abs(_y - this.startY);
        this.marqueeEl.style.width = _width + 'px';
        this.marqueeEl.style.height = _height + 'px';
        // 遍历容器中的选项
        let targetEls = this.options.container.querySelectorAll(this.options.target);
        [].forEach.call(targetEls, (e, i) => {
          (function(i, _this) {
            let validEl = e;
            if(_this.isDefaultTarget && e.className.includes('el-checkbox__original')) {
              validEl = e.parentNode.parentNode;
              e = e.previousElementSibling;
            }
            if(_this.$utilElem.getStyle(validEl, 'display') === 'none'
              || _this.$utilElem.getStyle(validEl, 'visibility') === 'hidden'
              || validEl.getAttribute('disabled') === 'disabled'
              || validEl.className.includes('is-disabled')
              || validEl.className.includes('is-ban')) {
              return ;
            }
            // 选项的起始位置
            let offset = _this.$utilElem.getOffset(e);
            let _itemStartX = offset.left;
            let _itemStartY = offset.top;
            // 选项的终止位置
            let _itemEndX = _itemStartX + e.offsetWidth;
            let _itemEndY = _itemStartY + e.offsetHeight;
            // 判断选项是否与选框有交集
            if(_itemEndX > _left
              && _itemEndY > _top
              && _itemStartX < (_left + _width)
              && _itemStartY < (_top + _height)) {
              if(!e.className.includes('is-marquee-selected')) {
                e.classList.add('is-marquee-selected');
                if(_this.isDefaultTarget) {
                  setTimeout(() => {
                    e.click();
                  });
                }
              }
            } else {
              if(e.className.includes('is-marquee-selected')) {
                e.classList.remove('is-marquee-selected');
                if(_this.isDefaultTarget) {
                  setTimeout(() => {
                    e.click();
                  });
                }
              }
            }
          })(i, this);
        });
      },
      close() {
        this.options.container.removeEventListener('mousedown', this.listenerMousedown);
      }
    }
  }
</script>

<style scoped>

</style>

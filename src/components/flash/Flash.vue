<template>

</template>

<script>
  // 急促的警车警报声
  import audio0 from "./src/audio/0.mp3";
  export default {
    name: "Flash",
    provide() {
      return {
        hdFlash: this
      };
    },
    data() {
      return {
        options: {
          // 闪烁过渡时长（毫秒）
          duration: 300,
          // 闪烁颜色（空则随机生成）
          color: [],
          // 渐变颜色闪烁配置（用于渐变背景闪烁）
          /*示例：
          gradient: {
            background: 'radial-gradient(transparent, rgba(247, 34, 34, 1))',  // 渐变背景
            transition: ['background-position', 'background-size'],  // 过渡效果属性
            backgroundPosition: '50% 50%',  // 过渡效果（属性值为过渡效果属性转驼峰）
            backgroundSize: ['100% 100%', '300% 300%']  // 过渡效果（属性值为过渡效果属性转驼峰）
          }*/
          gradient: null,
          // 音效（数字0，或自定义）
          audio: null,
          // 插槽内容（HTMLElement）
          slot: null,
          // 打开回调
          onopen: null,
          // 关闭回调
          onclose: null,
        },
        flashEl: null,
        audioEl: null,
        count: 0,
        timer: null
      }
    },
    destroyed() {
      if(this.timer) clearTimeout(this.timer);
    },
    mounted() {
      // 查找元素
      let flashEl = document.querySelector('.hdty-flash');
      if(flashEl) flashEl.remove();
      // 创建元素
      flashEl = document.createElement('div');
      flashEl.className = 'hdty-flash';
      flashEl.style.transition = 'background ' + Number(this.options.duration) + 'ms';
      document.body.appendChild(flashEl);
      this.flashEl = flashEl;
      if(this.options.gradient) {
        if(this.options.gradient.background) {
          flashEl.style.background = this.options.gradient.background;
        }
        if(this.options.gradient.transition) {
          let property = this.options.gradient.transition;
          if(Array.isArray(property)) {
            let transition = '';
            for (let i = 0; i < property.length; i++) {
              if(i === 0) {
                transition = property[i] + ' ' + Number(this.options.duration) + 'ms';
              } else {
                transition = transition + ', ' + property[i] + ' ' + Number(this.options.duration) + 'ms';
              }
            }
            flashEl.style.transition = transition;
          } else {
            flashEl.style.transition = property + ' ' + Number(this.options.duration) + 'ms';
          }
        }
      }
      if(this.options.slot) {
        this.flashEl.innerHTML = this.options.slot;
      }
      if (typeof(this.options.onopen) === 'function') {
        this.options.onopen(this.flashEl);
      }
      this.start();
      this.play();
      window.addEventListener('mousemove', this.close);
    },
    methods: {
      start() {
        if(this.options.color && this.options.color.length > 0) {
          if(Array.isArray(this.options.color)) {
            this.flashEl.style.background = this.options.color[this.count % this.options.color.length];
          } else {
            this.flashEl.style.background = this.options.color;
          }
          this.flashEl.style.background = color;
        } else if (this.options.gradient) {
          if(this.options.gradient.transition) {
            let property = this.options.gradient.transition;
            if(Array.isArray(property)) {
              for (let i = 0; i < property.length; i++) {
                let humpProperty = this.$utilStr.hyphenToHump(property[i]);
                if(this.options.gradient[humpProperty]) {
                  if(Array.isArray(this.options.gradient[humpProperty])) {
                    this.flashEl.style[humpProperty] = this.options.gradient[humpProperty][this.count % this.options.gradient[humpProperty].length];
                  } else {
                    this.flashEl.style[humpProperty] = this.options.gradient[humpProperty];
                  }
                }
              }
            } else {
              let humpProperty = this.$utilStr.hyphenToHump(property);
              if(this.options.gradient[humpProperty]) {
                if(Array.isArray(this.options.gradient[humpProperty])) {
                  this.flashEl.style[humpProperty] = this.options.gradient[humpProperty][this.count % this.options.gradient[humpProperty].length];
                } else {
                  this.flashEl.style[humpProperty] = this.options.gradient[humpProperty];
                }
              }
            }
          }
        } else {
          let color = '';
          // 随机生成16进制色值
          for (let i = 0; i < 6; i++) {
            let cool = '0123456abcdef'[Math.floor(Math.random() * 13)];
            color += cool;
          }
          // 拼接色值
          color = '#' + color;
          // 设置背景颜色
          this.flashEl.style.background = color;
        }
        this.count++;
        if(this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.start, this.options.duration);
      },
      play() {
        if(!this.$utilStr.isEmpty(this.options.audio)) {
          this.audioEl = document.createElement('audio');
          if(/^[0-9]*$/.test(this.options.audio)) {
            if(parseInt(this.options.audio) === 0) {
              this.audioEl.src = audio0;
            }
          } else if(!this.$utilStr.isURL(this.options.audio)) {
            this.audioEl.src = process.env.NODE_PATH + this.options.audio.replace(new RegExp(process.env.NODE_PATH), '');
          } else {
            this.audioEl.src = this.options.audio;
          }
          this.audioEl.loop = 'loop';
          this.flashEl.appendChild(this.audioEl);
          this.audioEl.play();
        }
      },
      close() {
        window.removeEventListener('mousemove', this.close);
        if(this.timer) clearTimeout(this.timer);
        if(this.flashEl) {
          this.flashEl.classList.add('animated', 'fadeOut');
          this.flashEl.style.pointerEvents = 'none';
        }
        if(this.audioEl) {
          this.audioEl.pause();
        }
        this.count = 0;
        if (typeof(this.options.onclose) === 'function') {
          this.options.onclose(this.flashEl);
        }
      }
    }
  }
</script>

<style scoped>

</style>

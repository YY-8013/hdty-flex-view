<template>

</template>

<script>
  import audioAlarm from '@/assets/hdtyui/media/audio/beep/alarm.mp3';
  import audioApply from '@/assets/hdtyui/media/audio/beep/apply.mp3';
  import audioRemind from '@/assets/hdtyui/media/audio/beep/remind.mp3';
  import audioNotify from '@/assets/hdtyui/media/audio/beep/notify.mp3';
  export default {
    name: "Notify",
    provide() {
      return {
        hdNotify: this
      };
    },
    data() {
      return {
        transition: [
          {
            position: 'bottomRight',
            transitionIn: 'bounceInLeft',
            transitionOut: 'fadeOut'
          },
          {
            position: 'bottomLeft',
            transitionIn: 'bounceInRight',
            transitionOut: 'fadeOut'
          },
          {
            position: 'topRight',
            transitionIn: 'fadeInDown',
            transitionOut: 'fadeOut'
          },
          {
            position: 'topLeft',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX'
          },
          {
            position: 'topCenter',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX'
          },
          {
            position: 'bottomCenter',
            transitionIn: 'fadeInUp',
            transitionOut: 'fadeOut'
          }
        ],
        options: {
          // 通知标题
          title: '通知',
          // 通知消息
          message: '',
          // 主题，可以是light或dark，或设置其他类别
          theme: 'dark',
          // 图标类
          icon: 'el-icon-message-solid',
          // 封面图片
          image: 'default',
          // 封面图片的宽度
          imageWidth: 70,
          // 布局类，可以是1或2，或设置其他类别
          layout: 2,
          // 气球形状
          balloon: false,
          // 显示位置
          position: '',
          // 关闭延迟时间
          timeout: 10000,
          // 打开动画
          transitionIn: '',
          // 关闭动画
          transitionOut: '',
          // 提示音（alarm/apply/remind/notify或自定义）
          audio: 'notify',
          // 点击回调事件
          onclick: null,
          // 关闭回调事件
          onclose: null,
          onClosing: (options, element, trigger) => {
            this.close(options, element, trigger);
          },
          onOpening: (options, element) => {
            element.setAttribute('title', '查看详情');
            element.onclick = e => {
              this.click(options, e);
              this.$toast._izi.hide({}, element);
            };
            let toastClose = element.querySelector('.iziToast-close');
            toastClose.setAttribute('title', '');
            toastClose.onclick = (event) => {
              event.stopPropagation();
            };
            let progressBar = element.querySelector('.iziToast-progressbar');
            if(options.timeout === 0) {
              setTimeout(() => {
                progressBar.firstElementChild.style.width = '0%';
              }, 350);
            }
            if(this.options.audio) {
              let audioEl = document.createElement('audio');
              if(this.options.audio === 'alarm') {
                audioEl.src = audioAlarm;
              } else if(this.options.audio === 'apply') {
                audioEl.src = audioApply;
              } else if(this.options.audio === 'remind') {
                audioEl.src = audioRemind;
              } else if(this.options.audio === 'notify') {
                audioEl.src = audioNotify;
              } else if(!this.$utilStr.isURL(this.options.audio)) {
                audioEl.src = process.env.NODE_PATH + this.options.audio.replace(new RegExp(process.env.NODE_PATH), '');
              } else {
                audioEl.src = this.options.audio;
              }
              element.appendChild(audioEl);
              audioEl.play();
            }
          }
        }
      }
    },
    created() {
      if(!this.options.position) {
        this.options.position = this.$storage.local.get('hdty-admin-position') || this.$app.notifyPosition;
        if(!this.options.transitionIn || !this.options.transitionOut) {
          this.transition.forEach(e => {
            if(e.position === this.options.position) {
              this.options.transitionIn = e.transitionIn;
              this.options.transitionOut = e.transitionOut;
            }
          });
        }
      } else {
        if(!this.options.transitionIn || !this.options.transitionOut) {
          this.transition.forEach(e => {
            if(e.position === this.options.position) {
              this.options.transitionIn = e.transitionIn;
              this.options.transitionOut = e.transitionOut;
            }
          });
        }
      }
    },
    mounted() {
      let _this = this;
      _this.$toast.show(
        _this.options.message,
        _this.options.title,
        _this.options
      );
    },
    methods: {
      click(o, e) {
        if (typeof(this.options.onclick) === 'function') {
          this.options.onclick(o, e);
        }
      },
      close(o, e, t) {
        if (typeof(this.options.onclose) === 'function') {
          this.options.onclose(o, e, t);
        }
      }
    }
  }
</script>

<style scoped>

</style>

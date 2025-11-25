<template>
  <div
    class="hdty-dialog-select hdty-iconfont-select"
    :class="{ 'is-adaptive': adaptive }"
    :underline="underline">
    <hd-input
      ref="inputRef"
      v-model="input"
      suffix-icon="el-icon-more"
      :size="size"
      clear-class="hdty-dialog-select-clear"
      :placeholder="placeholder"
      :miss="echoIcon"
      :clearable="clearable"
      :readonly="readonly"
      :disabled="disabled"
      :adaptive="adaptive"
      :class="{ 'is-miss': echoIcon }"
      @focus="handleInputFocus"
      @clear="handleInputClear">
    </hd-input>
    <div v-if="echoIcon" class="hdty-iconfont-echo">
      <i :class="input"></i>
    </div>
    <el-dialog
      ref="dialogRef"
      :visible.sync="visible"
      :title="dialogTitle || placeholder"
      class="hdty-dialog-select-wrapper"
      custom-class="hdty-dialog-select-panel hdty-iconfont-select-dialog hdty-dialog-large"
      append-to-body
      @open="handleDialogOpen">
      <hd-pane>
        <div class="hdty-container">
          <div class="hdty-row">
            <div v-for="item in iconData" class="hdty-col-md12">
              <div class="hdty-card">
                <div class="hdty-card-header">
                  <div class="hdty-card-title">
                    {{ item.title }}
                  </div>
                </div>
                <div class="hdty-card-body">
                  <ul class="hdty-row hdty-icon-list" style="border-left: none;">
                    <li v-for="icon in item.icons" class="hdty-col-md1 hdty-col-sm2 hdty-col-xs6 hdty-hover" :class="{ 'is-active':currentSelect===icon}" @click.stop="handleChecked(icon)">
                      <div class="hdty-icon-content">
                        <div class="hdty-icon-item">
                          <i :class="icon"></i>
                          <cite>{{ icon }}</cite>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </hd-pane>
      <div slot="footer" class="hdty-dialog-footer">
        <div class="hdty-float-left">当前选择：
          <el-tag
            v-if="input"
            closable
            type="success"
            @close="handleTagClose">
            {{ input }}
          </el-tag>
        </div>
        <div class="hdty-btn-container">
          <el-button @click="cancelForm">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { hdComponent, hdForm } from "@/utils/util-framework";
  export default {
    name: "index",
    provide() {
      return {
        hdIconfont: this
      };
    },
    mixins: [hdComponent, hdForm],
    props: {
      prop: String,
      // 绑定值
      value: {
        type: String,
        default: ''
      },
      // 输入框尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 会话选择窗口标题
      dialogTitle: {
        type: String,
        default: '选择图标'
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选择'
      },
      // 是否回显图标
      echoIcon: {
        type: Boolean,
        default: false
      },
      // 是否可清空
      clearable: {
        type: Boolean,
        default: true,
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: false
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 宽度自适应（元素宽度随内容变化）
      adaptive: {
        type: Boolean,
        default: false
      },
      // 下划线风格
      underline: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 绑定值
        input: this.value, // input接收父组件传来的value值
        // 当前选择
        currentSelect: '',
        // 数据
        iconData: [
          {
            title: '电子设备',
            icons: [
              'icon-phone',
              'icon-call',
              'icon-mobile',
              'icon-iphone',
              'icon-computer',
              'icon-photograph-o',
              'icon-video-player',
              'icon-video',
              'icon-camera',
              'icon-monitor',
              'icon-cardreading-o',
              'icon-printer',
              'icon-machine',
              'icon-lamp',
              'icon-alarm-light',
            ]
          },
          {
            title: '交通工具',
            icons: [
              'icon-car',
              'icon-car-side',
              'icon-bus',
              'icon-truck',
              'icon-big-truck',
              'icon-plane',
              'icon-flight',
            ]
          },
          {
            title: '生活工具',
            icons: [
              'icon-set',
              'icon-set-o',
              'icon-setting',
              'icon-delete',
              'icon-brush',
              'icon-clear',
              'icon-clear-tilt',
              'icon-clock',
              'icon-time',
              'icon-period',
              'icon-date',
              'icon-lock',
              'icon-search',
              'icon-magnifier',
              'icon-box',
              'icon-color',
              'icon-gate',
              'icon-shopping-cart',
              'icon-open-the-door',
              'icon-bell',
              'icon-brooch',
            ]
          },
          {
            title: '办公工具',
            icons: [
              'icon-file',
              'icon-note',
              'icon-sign-for',
              'icon-news',
              'icon-diary',
              'icon-document',
              'icon-list',
              'icon-bulletin',
              'icon-empty',
              'icon-table',
              'icon-email-o',
              'icon-email',
              'icon-dictionary',
              'icon-edit',
              'icon-edit-outline',
              'icon-font',
              'icon-eyedropper',
              'icon-seal',
            ]
          },
          {
            title: '地理位置',
            icons: [
              'icon-map',
              'icon-map-o',
              'icon-nmg',
              'icon-nmg-o',
              'icon-ah',
              'icon-ah-o',
              'icon-jx',
              'icon-jx-o',
              'icon-sx',
              'icon-sx-o',
              'icon-xj',
              'icon-xj-o',
              'icon-gs',
              'icon-gs-o',
              'icon-earth',
              'icon-area',
              'icon-location',
              'icon-position',
              'icon-position-plain',
              'icon-site',
              'icon-trajectory',
              'icon-target',
              'icon-marker',
              'icon-symbol',
              'icon-address',
              'icon-goto',
            ]
          },
          {
            title: '建筑',
            icons: [
              'icon-home',
              'icon-building',
              'icon-company',
              'icon-home-o',
              'icon-round-house',
              'icon-house',
              'icon-bungalow',
            ]
          },
          {
            title: '人物身份',
            icons: [
              'icon-gender',
              'icon-user',
              'icon-user-o',
              'icon-half-user',
              'icon-population',
              'icon-employed',
              'icon-role',
              'icon-key-user',
              'icon-head',
              'icon-passenger',
              'icon-passengerflight',
              'icon-three-people',
              'icon-three-people-o',
              'icon-police',
              'icon-credentials',
              'icon-card',
              'icon-organ',
              'icon-medal',
              'icon-eye',
              'icon-eye-o',
            ]
          },
          {
            title: '品牌',
            icons: [
              'icon-wechat',
              'icon-sina',
              'icon-blog',
            ]
          },
          {
            title: '动植物',
            icons: [
              'icon-pet-dog',
              'icon-dog',
              'icon-dog-o',
            ]
          },
          {
            title: '食物',
            icons: [
              'icon-bone',
              'icon-noodles',
            ]
          },
          {
            title: '自然天气',
            icons: [
              'icon-lightning',
              'icon-collect',
              'icon-collect-o',
              'icon-boom',
            ]
          },
          {
            title: '图表',
            icons: [
              'icon-line',
              'icon-bar',
              'icon-bar-o',
              'icon-scatter',
              'icon-pie',
              'icon-pie-o',
              'icon-up-trend',
            ]
          },
          {
            title: '旋转',
            icons: [
              'icon-cycle',
              'icon-refresh',
              'icon-sync',
              'icon-cloud-sync',
              'icon-rotate-left',
              'icon-rotate-right',
            ]
          },
          {
            title: '方向',
            icons: [
              'icon-enter',
              'icon-return',
              'icon-play',
              'icon-up',
              'icon-down',
              'icon-arrow-up',
              'icon-arrow-down',
              'icon-arrow-tip-left',
              'icon-arrow-tip-right',
              'icon-caret-top',
              'icon-caret-bottom',
              'icon-caret-left',
              'icon-caret-right',
              'icon-darts-up',
              'icon-darts-down',
              'icon-darts-left',
              'icon-darts-right',
              'icon-arrow-left',
              'icon-arrow-right',
              'icon-thin-arrow-up',
              'icon-thin-arrow-down',
              'icon-thin-arrow-left',
              'icon-thin-arrow-right',
              'icon-sort',
              'icon-turn',
              'icon-rise',
              'icon-fall',
              'icon-rise-mirror',
              'icon-fall-mirror',
              'icon-increase',
              'icon-decrease',
            ]
          },
          {
            title: '控制',
            icons: [
              'icon-add',
              'icon-minus',
              'icon-add-sign',
              'icon-minus-sign',
              'icon-handle',
              'icon-leave',
              'icon-direction',
              'icon-fold',
              'icon-retract',
              'icon-scan-box',
              'icon-scanning',
              'icon-focus',
              'icon-window',
              'icon-multi-window',
              'icon-maximize',
              'icon-minimize',
              'icon-maximize-arrow',
              'icon-minimize-arrow',
              'icon-fullscreen-bold',
              'icon-fullscreen',
              'icon-fullscreen-restore',
              'icon-screen-full-bold',
              'icon-screen-full',
              'icon-polyline',
              'icon-polygon',
              'icon-rect',
              'icon-rect-ring',
              'icon-diamond',
              'icon-circle',
              'icon-circle-o',
              'icon-dot',
              'icon-ring',
              'icon-check',
              'icon-check-o',
              'icon-close',
              'icon-close-o',
              'icon-palm-check',
              'icon-palm-close',
              'icon-cancel',
              'icon-prohibit',
              'icon-quit',
              'icon-switch',
              'icon-upload',
              'icon-upload-o',
              'icon-cloud-upload',
              'icon-cloud-download',
              'icon-drag',
            ]
          },
          {
            title: '程序应用',
            icons: [
              'icon-function',
              'icon-menu',
              'icon-service',
              'icon-image',
              'icon-no-image',
              'icon-remind',
              'icon-remind-o',
              'icon-warn',
              'icon-warn-o',
              'icon-help',
              'icon-help-o',
              'icon-type',
              'icon-guard',
              'icon-security',
              'icon-chat-square',
              'icon-chat-round',
              'icon-message',
              'icon-tube',
              'icon-frequency',
              'icon-film',
              'icon-filter',
              'icon-number',
              'icon-sudoku',
            ]
          }
        ],
        // 显示Dialog
        visible: false
      }
    },
    watch: {
      value: {
        handler(val) {
          this.input = val;
        },
        immediate: true
      }
    },
    methods: {
      // input获得焦点
      handleInputFocus() {
        if(!this.readonly) {
          this.visible = true;
          this.$emit('currentOpening', this);
          this.currentSelect = this.value;
        }
      },
      // input清空
      handleInputClear() {
        this.$emit('input', '');
        this.$emit('currentChanged', []);
      },
      // tag关闭
      handleTagClose() {
        this.currentSelect = '';
        this.input = '';
        this.$emit('input', '');
        this.$emit('currentChanged', []);
      },
      // dialog打开
      handleDialogOpen() {
        this.$refs.dialogRef.$el.onclick = evt => {
          evt.stopPropagation();
        };
        this.$nextTick(() => {
          let popupParentHiddenEl = document.querySelector('.el-popup-parent--hidden');
          if(popupParentHiddenEl) {
            popupParentHiddenEl.onclick = evt => {
              evt.stopPropagation();
              popupParentHiddenEl.onclick = null;
            };
          }
        });
      },
      // 单选
      handleChecked(val) {
        this.currentSelect = val;
        this.visible = false;
        this.input = val;
        this.$emit('input', val); //触发 input 事件，并传入新值
        this.$emit('currentChanged', val);
      },
      // 取消
      cancelForm() {
        this.visible = false;
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width:768px) {
    .hdty-col-sm2 {
      width: 20%;
    }
  }
  @media screen and (min-width:992px) {
    .hdty-col-md1 {
      width: 10%;
    }
  }
</style>

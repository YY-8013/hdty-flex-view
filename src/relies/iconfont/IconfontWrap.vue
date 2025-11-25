<template>
  <div class="hdty-container hdty-scroll">
    <div class="hdty-row">
      <div v-for="item in iconData" class="hdty-col-md12">
        <div class="hdty-card">
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              {{ item.title }}
            </div>
          </div>
          <div class="hdty-card-body">
            <ul class="hdty-row hdty-icon-list">
              <li v-for="icon in item.icons" class="hdty-col-md1 hdty-col-sm2 hdty-col-xs6">
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
</template>

<script>
  export default {
    name: "IconfontWrap",
    data () {
      return {
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
        ]
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>

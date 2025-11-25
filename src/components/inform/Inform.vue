<template>
  <div class="hdty-inform">
    <div class="hdty-inform-container hdty-scroll">
      <div v-if="projectLogo" class="hdty-inform-logo">
        <img :src="projectLogo">
      </div>
      <div class="hdty-inform-wrapper">
        <div
          v-if="collecting"
          class="hdty-inform-collect"
          @click="handleCollect($event)">
          <i class="icon-collect">
          </i>
        </div>
        <div class="hdty-inform-content">
          <div class="hdty-inform-header">
            <div v-if="title" class="hdty-inform-title">
              {{ title }}
            </div>
            <div v-if="subtitle" class="hdty-inform-subtitle">
              <span>{{ subtitle }}</span>
            </div>
            <div v-if="edition" class="hdty-inform-edition">
              {{ edition }}
            </div>
            <div
              v-if="printing || reading || avatar || agency || author || time"
              class="hdty-inform-meta">
              <ul v-if="printing || reading" class="hdty-inform-tool">
                <li v-if="printing" class="hdty-tool-item">
                  <i class="icon-printer">
                  </i>
                  打印本页
                </li>
                <li v-if="reading">
                  <i class="icon-eye">
                  </i>
                  {{ reading }}
                </li>
              </ul>
              <div class="hdty-flex-fill">
                <hd-avatar v-if="avatar || agency || author" :avatar="avatar"></hd-avatar>
                <div v-if="agency || author" class="hdty-inform-issuing">
                  <div v-if="agency" class="hdty-inform-agency">
                    {{ agency }}
                  </div>
                  <div v-if="author" class="hdty-inform-author">
                    {{ author }}
                  </div>
                </div>
              </div>
              <div
                class="hdty-flex-fit"
                :class="{
                  'hdty-flex-center': (!printing && !reading) && ((agency && !author) || (!agency && author)),
                  'hdty-mobile-flex-center': (agency && !author) || (!agency && author)
                }">
                <div v-if="time" class="hdty-inform-time" pc>
                  发布于：{{ $utilDate.dateFtt(time) }}
                </div>
                <div v-if="time" class="hdty-inform-time" mobile>
                  {{ $utilDate.dateHumanize($utilDate.toNumber(time)) }}
                </div>
              </div>
            </div>
          </div>
          <div v-html="content" class="hdty-inform-body">
          </div>
          <div class="hdty-inform-footer">
            <div class="hdty-inform-tool" mobile>
              <li v-if="reading" class="hdty-count">
                <i class="icon-eye">
                </i>
                {{ reading }}
              </li>
              <li
                v-if="collecting"
                class="hdty-tool-item">
                <div
                  class="hdty-tool-collect"
                  @click="handleCollect($event)">
                  <i class="icon-collect-o">
                  </i>
                  收藏
                </div>
              </li>
            </div>
            <div v-if="Array.isArray(projectCopyright)" class="hdty-copyright hdty-middle" :style="activeCopyrightStyle">
              <p v-for="(value, index) in projectCopyright" :key="index">
                {{ value }}
              </p>
            </div>
            <div v-else v-html="projectCopyright" class="hdty-copyright hdty-middle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Inform",
    provide() {
      return {
        hdInform: this
      };
    },
    data() {
      return {
        // 项目标志
        projectLogo: this.$app.projectLogo.large,
        // 项目版权
        projectCopyright: this.$app.projectCopyright,
        // 显示收藏
        collecting: true,
        // 显示打印
        printing: true,
        // 阅读量
        reading: '',
        // 唯一标识
        id: '',
        // 标题
        title: '',
        // 副标题
        subtitle: '',
        // 版记
        edition: '',
        // 发文机关
        agency: '',
        // 作者
        author: '',
        // 头像
        avatar: '',
        // 发文时间
        time: '',
        // 正文
        content: ''
      }
    },
    computed: {
      activeCopyrightStyle() {
        if(Array.isArray(this.projectCopyright)) {
          if(this.projectCopyright.length > 3) {
            return {
              'line-height': '22px'
            }
          } else if(this.projectCopyright.length > 4) {
            return {
              'line-height': '20px'
            }
          } else if(this.projectCopyright.length > 5) {
            return {
              'line-height': '18px'
            }
          }
        }
        return null;
      }
    },
    created() {
      Object.assign(this.$data, this.$storage.session.get('inform'));
    },
    methods: {
      handleCollect(e) {
        let el = e.target.className.includes('icon-collect') ? e.target.parentNode : e.target;
        if(el.className.includes('is-active')) {
          el.classList.remove('is-active');
        }else {
          el.classList.add('is-active');
        }
      }
    }
  }
</script>

<style scoped>

</style>

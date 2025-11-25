<template>
  <div
    class="hdty-layout hdty-layout-admin"
    :class="{
      'hdty-layout-collapse': menucollapEnabled,
      'hdty-layout-shrink': shrinkEnabled,
      'hdty-layout-pure': !pagetabEnabled,
      'hdty-layout-hide': bodypage
    }"
  >
    <!-- 顶部栏 -->
    <div v-if="activeScheme!=='upanddown' && !bodypage" class="hdty-header">
      <div class="hdty-flex">
        <div class="hdty-logo hdty-flex-fit">
          <a href="javascript:;">
            <img :src="projectLogo" />
            <span>{{ projectName }}</span>
          </a>
        </div>
        <div class="hdty-flex-fill">
          <!-- 导航条 -->
          <div v-if="topnavEnabled" class="hdty-topnav">
            <topnav
              v-model="currentTopnavIndex"
              :navigations="realNavigations"
              @currentChanged="handleTopnavChange"
            ></topnav>
          </div>
          <!-- 面包屑 -->
          <div v-if="crumbEnabled" class="hdty-breadcrumb">
            <breadcrumb></breadcrumb>
          </div>
          <!-- 搜索条 -->
          <div v-if="searchInfo.isEnabled" class="hdty-searchbar">
            <ul class="hdty-nav">
              <li class="hdty-nav-item">
                <el-input v-model="searchInfo.value" placeholder="一键搜索"></el-input>
              </li>
            </ul>
          </div>
        </div>
        <!-- 工具条 -->
        <div class="hdty-toolbar hdty-flex-fit">
          <toolbar ref="toolRef" :badge="badgeEnabled"></toolbar>
        </div>
      </div>
    </div>
    <div v-else-if="activeScheme==='upanddown' && !bodypage" class="hdty-header">
      <topbar
        v-model="currentTopnavIndex"
        :navigations="realNavigations"
        @currentChanged="handleTopnavChange"
      ></topbar>
    </div>
    <!-- 菜单栏 -->
    <div v-if="!bodypage" class="hdty-side hdty-side-menu">
      <div v-if="activeScheme==='upanddown'" class="hdty-side-top">
        <hd-avatar :avatar="$utilLogin.getUserAvatar()"></hd-avatar>
        <div class="hdty-person-title">
          <p class="hdty-person-author hdty-elip">{{ user.xm ? user.xm : user.username }}</p>
          <!--<p class="hdty-person-dept hdty-elip">此处可再添加一行部门信息</p>-->
        </div>
        <collapse v-if="!pagetabEnabled" ref="collapseRef" direction="right" :badge="badgeEnabled"></collapse>
        <div class="hdty-btn-container">
          <el-button :title="menucollapEnabled?'个人中心':''" @click="handleMyCenter">个人中心</el-button>
          <el-button :title="menucollapEnabled?'修改密码':''" @click="handleChangePwd">修改密码</el-button>
          <el-button :title="menucollapEnabled?'退出登录':''" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
      <div class="hdty-menu">
        <div v-if="sloganEnabled" class="hdty-menu-slogan">
          <img :src="sloganImgs.header" class="hdty-slogan-header" />
          <div class="hdty-slogan-content">
            <img :src="sloganImgs.content[sloganIndex]" />
          </div>
          <img :src="sloganImgs.footer" class="hdty-slogan-footer" />
        </div>
        <div v-else-if="activeScheme==='upanddown'" class="hdty-menu-header">
          <i :class="currentRootnav.icon"></i>
          <span>{{ currentRootnav.name }}</span>
        </div>
        <div class="hdty-menu-body hdty-scroll">
          <side-menu :navigations="currentSubnavs" :collapse="menucollapEnabled"></side-menu>
        </div>
      </div>
      <div class="hdty-footer">
        <div
          v-if="Array.isArray(projectCopyright)"
          class="hdty-copyright hdty-copyright-emboss hdty-middle"
          :style="activeCopyrightStyle"
        >
          <p v-for="(value, index) in projectCopyright" :key="index">{{ value }}</p>
        </div>
        <div
          v-else
          v-html="projectCopyright"
          class="hdty-copyright hdty-copyright-emboss hdty-middle"
        ></div>
        <a href="javascript:;" title="折叠菜单" class="hdty-collapse-caret" @click="handleMenuCollapse">
          <i class="icon-fold"></i>
        </a>
      </div>
    </div>
    <!-- 选项卡 -->
    <div v-if="pagetabEnabled && !bodypage" class="hdty-pagetabs">
      <page-tabs
        :active="currentTab"
        :data="pageTabsInfo.pageTabs"
        @currentClose="handlePagetabClose"
      ></page-tabs>
      <collapse v-if="activeScheme==='upanddown'" ref="collapseRef" :badge="badgeEnabled"></collapse>
    </div>
    <!-- 主体区 -->
    <div class="hdty-body">
      <keep-alive :include="cachedViews.map(e => e.name)">
        <router-view
          v-if="$route.meta.keepAlive
          && !isNewPageTab
           && (!$route.meta.linkType
            || $route.meta.linkType === $global.dictItem.linkType.default)"
          :key="routerViewKey"
        ></router-view>
      </keep-alive>
      <component
        v-show="$route.meta.keepAlive && item.path === $route.fullPath"
        v-for="item in cachedComponents"
        :key="item.name"
        :is="item.component"
        :class="$route.meta.keepAlive && item.path === $route.fullPath ? '' : 'hdty-hide'"
      ></component>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <!-- MQTT控制中心 -->
    <mqtt-control v-if="mqttEnabled"></mqtt-control>
    <!-- 主题栏 -->
    <side-theme ref="themeRef"></side-theme>
    <!-- 设置栏 -->
    <side-set ref="setRef"></side-set>
    <!-- 消息栏 -->
    <side-msg ref="msgRef"></side-msg>
    <!-- 修改密码窗口 -->
    <change-pwd ref="pwdRef"></change-pwd>
    <!-- 异步操作 -->
    <asynchronous v-if="!subpage"></asynchronous>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb';
import PageTabs from './PageTabs';
import Collapse from './Collapse';
import MqttControl from './MqttControl';
import Topnav from './navbar/Topnav';
import Topbar from './navbar/Topbar';
import Toolbar from './navbar/Toolbar';
import SideMenu from './sidebar/SideMenu';
import SideTheme from './sidebar/SideTheme';
import SideSet from './sidebar/SideSet';
import SideMsg from './sidebar/SideMsg';
import ChangePwd from './modules/ChangePwd';

import staticRoutes from '@/router/routes';

const Asynchronous = () => import('./Asynchronous');

export default {
  name: 'Layout',
  provide() {
    return {
      hdLayout: this
    };
  },
  components: {
    Breadcrumb,
    PageTabs,
    Collapse,
    MqttControl,
    Topnav,
    Topbar,
    Toolbar,
    SideMenu,
    SideTheme,
    SideSet,
    SideMsg,
    ChangePwd,
    Asynchronous
  },
  data() {
    return {
      // 全部导航
      allNavigations: this.$utilLogin.getUserNavigations(),
      // 导航
      navigations: this.$utilLogin
        .getUserNavigations()
        .filter((e) => e.hasAuthority),
      // 当前顶部导航索引
      currentTopnavIndex: this.$app.topnavCheckedIndex,
      // 当前根导航
      currentRootnav: this.$app.navRootOptions,
      // 当前子导航
      currentSubnavs: [],
      // 路由
      dynamicRoutes: this.$utilLogin.getUserRouters(),
      // 当前页签
      currentTab: '',
      // 项目名称
      projectName: this.$app.projectName,
      // 项目标志
      projectLogo: this.$app.projectLogo.small,
      // 项目版权
      projectCopyright: this.$app.projectCopyright,
      // 标语图
      sloganImgs: {
        content: this.$app.sloganImages.content || [],
        header: this.$app.sloganImages.header,
        footer: this.$app.sloganImages.footer
      },
      // 导航信息
      navInfo: {
        limit: this.$app.topnavLimit,
        moreOptions: this.$app.navMoreOptions
      },
      // 搜索信息
      searchInfo: {
        value: '',
        isEnabled: this.$app.searchEnabled
      },
      // 选项卡信息
      pageTabsInfo: {
        pageTabs: []
      },
      // 登录用户
      user: this.$utilLogin.getUserInfo(),
      // 小型屏幕左侧菜单折叠状态
      smallScreenMenuCollapse: true,
      // 屏幕可见区域宽度
      screenWidth: document.documentElement.clientWidth,
      // 打开主题
      opentheme: false,
      // 打开设置
      openset: false,
      // 打开消息
      openmsg: false,
      // 主体页
      bodypage: false,
      // 子页
      subpage: false
    };
  },
  computed: {
    cachedViews() {
      return this.$store.state.system.cachedViews;
    },
    routerViewKey() {
      return this.$route.fullPath;
    },
    isNewPageTab() {
      if (this.$route.query && this.$route.query.newpagetab) {
        let newPageTabInfo = this.$route.query.newpagetab;
        newPageTabInfo = JSON.parse(decodeURIComponent(newPageTabInfo));
        if (
          newPageTabInfo.enabled ||
          newPageTabInfo.name ||
          newPageTabInfo.label
        ) {
          return true;
        }
      }
      return false;
    },
    cachedComponents() {
      return this.$store.state.system.cachedComponents;
    },
    activeCopyrightStyle() {
      if (Array.isArray(this.projectCopyright)) {
        if (this.projectCopyright.length > 2) {
          return {
            'line-height': '16px'
          };
        } else if (this.projectCopyright.length > 3) {
          return {
            'line-height': '14px'
          };
        }
      }
      return null;
    },
    activeScheme() {
      return this.$store.state.app.scheme || this.$app.schemeDefault;
    },
    topnavEnabled() {
      return !this.$utilStr.isEmpty(this.$store.state.app.topnav)
        ? this.$store.state.app.topnav
        : this.$app.topnavEnabled;
    },
    realNavigations() {
      let navigations = this.navigations;
      if (this.topnavEnabled) {
        let newNavigations = [];
        if (
          this.$app.topnavAuthorizationDefeat === 'disabled' &&
          this.activeScheme === 'upanddown'
        ) {
          navigations = this.allNavigations;
        }
        let navLen = navigations.length;
        this.navInfo.moreOptions.children = [];
        navigations.forEach((row, i) => {
          if (
            this.navInfo.limit &&
            navLen > this.navInfo.limit &&
            i > this.navInfo.limit - 2
          ) {
            if (row.hasAuthority) {
              if (!this.navInfo.moreOptions.hasAuthority) {
                this.navInfo.moreOptions.hasAuthority = true;
              }
              this.navInfo.moreOptions.children.push(row);
            }
            if (i === navLen - 1) {
              newNavigations.push(this.navInfo.moreOptions);
            }
          } else {
            newNavigations.push(row);
          }
        });
        navigations = newNavigations;
      }
      return navigations;
    },
    crumbEnabled() {
      return !this.topnavEnabled ? this.$app.crumbEnabled : false;
    },
    pagetabEnabled() {
      return !this.$utilStr.isEmpty(this.$store.state.app.pagetab)
        ? this.$store.state.app.pagetab
        : this.$app.pagetabEnabled;
    },
    badgeEnabled() {
      return this.$store.state.app.badge || this.$app.notifyUnreadBadge;
    },
    menucollapEnabled() {
      return this.screenWidth <= 992
        ? this.smallScreenMenuCollapse
        : !this.$utilStr.isEmpty(this.$store.state.app.menucollap)
        ? this.$store.state.app.menucollap
        : this.$app.sideMenuDefaultCollapse;
    },
    mqttEnabled() {
      return this.$app.mqttMessageEnabled && !this.subpage;
    },
    shrinkEnabled() {
      return (
        this.currentSubnavs &&
        this.currentSubnavs.length === 0 &&
        (!this.$app.sloganEnabled ||
          (this.sloganImgs.content && this.sloganImgs.content.length === 0))
      );
    },
    sloganEnabled() {
      return (
        this.$app.sloganEnabled &&
        this.currentSubnavs &&
        this.currentSubnavs.length === 0 &&
        this.sloganImgs.content &&
        this.sloganImgs.content.length > 0
      );
    },
    sloganIndex() {
      return (
        this.sloganEnabled &&
        this.$utilStr.randomNum(0, this.sloganImgs.content.length - 1)
      );
    },
    activeLanding() {
      return this.$utilStr.parseBoolean(this.$route.query.landing);
    },
    activeRedirecting() {
      return this.$utilStr.parseBoolean(this.$route.query.redirecting);
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        // 获取当前匹配的最高级路由导航
        let currentHighestRouteNavMatched = to.matched.filter(
          (e) => !e.parent
        )[0];
        // 设置当前匹配的顶部导航索引
        let currentNavNotInMoreNavs = false;
        for (let i = 0; i < this.realNavigations.length; i++) {
          if (
            this.realNavigations[i].code === currentHighestRouteNavMatched.name
          ) {
            this.currentTopnavIndex = i;
            currentNavNotInMoreNavs = true;
            break;
          } else if (this.realNavigations[i].code === to.name) {
            this.currentTopnavIndex = i;
            currentNavNotInMoreNavs = true;
            break;
          } else if (to.path === '/') {
            this.currentTopnavIndex = this.$app.topnavCheckedIndex;
            currentNavNotInMoreNavs = true;
            break;
          }
        }
        // 判断当前匹配的导航是否不在更多导航中，若否，则设置当前匹配的顶部导航为更多导航
        if (!currentNavNotInMoreNavs) {
          this.currentTopnavIndex = this.realNavigations.length - 1;
        }
        // 判断当前是否开启顶部导航，若开启，则设置当前子导航为当前匹配的顶部导航下的子导航，若不开启，则设置当前子导航为全部导航
        if (this.topnavEnabled) {
          if (currentHighestRouteNavMatched.path) {
            let currentHighestRealNavMatched = this.realNavigations.find(
              (e) => e.code === currentHighestRouteNavMatched.name
            );
            if (currentHighestRealNavMatched) {
              this.currentRootnav = currentHighestRealNavMatched;
              this.currentSubnavs = currentHighestRealNavMatched
                ? currentHighestRealNavMatched.children
                : [];
            } else {
              currentHighestRealNavMatched =
                this.navInfo.moreOptions.children.find(
                  (e) => e.code === currentHighestRouteNavMatched.name
                );
              if (currentHighestRealNavMatched) {
                this.currentRootnav = this.navInfo.moreOptions;
                this.currentSubnavs = this.navInfo.moreOptions.children;
              } else {
                currentHighestRealNavMatched =
                  this.navInfo.moreOptions.children.find(
                    (e) => e.code === to.name
                  );
                if (currentHighestRealNavMatched) {
                  this.currentRootnav = this.navInfo.moreOptions;
                  this.currentSubnavs = this.navInfo.moreOptions.children;
                } else {
                  this.currentSubnavs = [];
                }
              }
            }
          } else {
            if (!this.$utilStr.isEmpty(this.currentTopnavIndex)) {
              this.currentRootnav =
                this.realNavigations[this.currentTopnavIndex];
              this.currentSubnavs =
                this.realNavigations[this.currentTopnavIndex].children || [];
            } else {
              this.currentSubnavs = [];
            }
          }
        } else {
          this.currentSubnavs = this.realNavigations;
        }
        // 若需要永久保留某些页面选项卡，则设置要永久保留的页面选项卡
        if (this.$app.pagetabKeeps && this.$app.pagetabKeeps.length > 0) {
          this.$app.pagetabKeeps.forEach((val) => {
            if (!this.pageTabsInfo.pageTabs.find((e) => e.tabName === val)) {
              let tab = this.currentTabs(val);
              if (tab) {
                this.pageTabsInfo.pageTabs.push({
                  tabName: tab.name,
                  tabLabel: tab.meta.title || to.fullPath,
                  tabRoute: tab.path ? tab.path : { name: tab.name },
                  tabClass: tab.name,
                  tabClosable: false
                });
              }
            }
          });
        }
        // 判断当前是否为替换路由，若是，则返回不继续执行
        if (to.name === 'Redirect') return;
        // 获取当前匹配的导航信息
        let currentNavInfo = this.currentNavs(to.name);
        if (currentNavInfo) {
          if (!currentNavInfo.code) {
            currentNavInfo.code = to.name;
          }
          if (!currentNavInfo.name) {
            currentNavInfo.name = to.meta.title || to.fullPath;
          }
        } else {
          currentNavInfo = {
            code: to.name,
            name: to.meta.title || to.fullPath
          };
        }
        // 判断当前导航路由地址和导航地址是否相同，若相同设置由路由名称跳转，不相同设置由导航地址跳转
        currentNavInfo.path =
          to.path !== to.fullPath ? to.fullPath : { name: to.name };
        // 设置当前导航分类，默认为当前导航标识符
        currentNavInfo.class = currentNavInfo.code;
        // 判断当前导航是否携带新页面选项卡信息，若是，获取新页面选项卡信息
        let newPageTabEnabled = false;
        let newPageTabChanged = false;
        let newPageTabName = '';
        let newPageTabLabel = '';
        if (to.query && to.query.newpagetab) {
          let newPageTabInfo = JSON.parse(
            decodeURIComponent(to.query.newpagetab)
          );
          if (newPageTabInfo.enabled) {
            newPageTabEnabled = true;
          }
          if (newPageTabInfo.name) {
            newPageTabChanged = true;
            newPageTabName = newPageTabInfo.name;
          }
          if (newPageTabInfo.label) {
            newPageTabChanged = true;
            newPageTabLabel = newPageTabInfo.label;
          }
        }
        // 判断当前导航是否需要使用新页面选项卡打开，若需要，重新设置导航信息
        if (newPageTabEnabled) {
          currentNavInfo.code =
            'NEW_' +
            (newPageTabName ? newPageTabName + '_' : '') +
            to.name +
            '?' +
            this.$utilStr.objToParameter(to.query);
          currentNavInfo.name = newPageTabLabel || to.meta.title || to.fullPath;
          currentNavInfo.path = to.fullPath;
          currentNavInfo.class = currentNavInfo.code;
        } else if (newPageTabChanged) {
          currentNavInfo.code =
            'NEW_' + (newPageTabName ? newPageTabName + '_' : '') + to.name;
          currentNavInfo.name = newPageTabLabel || to.meta.title || to.fullPath;
          currentNavInfo.path = to.fullPath;
          currentNavInfo.class = currentNavInfo.code;
        }
        // 设置当前匹配的页面选项卡标识符
        this.currentTab = currentNavInfo.code;
        // 判断当前页面选项卡是否存在，若不存在，添加当前页面选项卡
        let currentPageTab = this.pageTabsInfo.pageTabs.find(
          (e) => e.tabName === this.currentTab
        );
        if (!currentPageTab) {
          this.pageTabsInfo.pageTabs.push({
            tabName: currentNavInfo.code,
            tabLabel: currentNavInfo.name,
            tabRoute: currentNavInfo.path,
            tabClass: currentNavInfo.class,
            tabClosable: true
          });
        }
        // 判断当前导航是否需要缓存，若需要，缓存当前视图或组件
        if (to.meta.keepAlive) {
          let currentCacheViewName = currentNavInfo.code;
          let currentCacheComponentName =
            Object.keys(to.query).length > 0
              ? currentNavInfo.code +
                '?' +
                this.$utilStr.objToParameter(to.query)
              : currentNavInfo.code;
          let currentCacheView = this.cachedViews.find(
            (e) => e.name === currentCacheViewName
          );
          let currentCacheComponent = this.cachedComponents.find(
            (e) => e.name === currentCacheComponentName
          );
          if (!currentCacheView && !currentCacheComponent) {
            if (
              !to.meta.linkType ||
              to.meta.linkType === this.$global.dictItem.linkType.default
            ) {
              if (!newPageTabEnabled && !newPageTabChanged) {
                let cacheViewInfo = {
                  name: currentCacheViewName,
                  path: to.fullPath,
                  meta: to.meta,
                  class: currentNavInfo.class
                };
                this.$store.dispatch('addCachedView', cacheViewInfo);
              } else {
                let cacheComponentInfo = {
                  name: currentCacheComponentName,
                  path: to.fullPath,
                  meta: to.meta,
                  class: currentNavInfo.class,
                  component:
                    to.matched[to.matched.length - 1].components.default ||
                    to.matched[to.matched.length - 1].components
                };
                this.$store.dispatch('addCachedComponent', cacheComponentInfo);
              }
            } else if (
              to.meta.linkType === this.$global.dictItem.linkType.component ||
              to.meta.linkType === this.$global.dictItem.linkType.system ||
              to.meta.linkType === this.$global.dictItem.linkType.website
            ) {
              let cacheComponentInfo = {
                name: currentCacheComponentName,
                path: to.fullPath,
                meta: to.meta,
                class: currentNavInfo.class,
                component:
                  to.matched[to.matched.length - 1].components.default ||
                  to.matched[to.matched.length - 1].components
              };
              this.$store.dispatch('addCachedComponent', cacheComponentInfo);
            }
          }
        } else {
          if (from && from.name === to.name) {
            if (from.fullPath !== to.fullPath) {
              this.$nextTick(() => {
                this.$router.replace({
                  path: '/redirect' + currentNavInfo.path
                });
              });
            }
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // 接收Mqtt消息
    appMessage.$on('mqtt-message', this.receiveMqttMessage);
    // 监听窗口大小
    window.addEventListener('resize', this.listenerWinResize);
    // 定制Layout
    this.customLayout();
  },
  methods: {
    currentNavs(val) {
      let arr = [];
      (function fn(key, value, items, resultArr) {
        let checkResult = false;
        for (let index = 0; index < items.length; index++) {
          const e = items[index];
          checkResult =
            e[key] === value ||
            (e.children && fn(key, value, e.children, resultArr));
          if (checkResult) {
            resultArr.push(Object.assign({}, e));
            break;
          }
        }
        return checkResult;
      })('code', val, this.navigations, arr);
      return arr[0];
    },
    currentTabs(val) {
      let arr = [];
      let allRoutes = staticRoutes.concat(this.dynamicRoutes);
      (function fn(key, value, items, resultArr) {
        let checkResult = false;
        for (let index = 0; index < items.length; index++) {
          const e = items[index];
          checkResult =
            e[key] === value ||
            (e.children && fn(key, value, e.children, resultArr));
          if (checkResult) {
            resultArr.push(Object.assign({}, e));
            break;
          }
        }
        return checkResult;
      })('name', val, allRoutes, arr);
      return arr[0];
    },
    // 接收Mqtt消息
    receiveMqttMessage(evt) {
      if (evt.type === 'reload') {
        if (this.$refs.toolRef) {
          this.$refs.toolRef.setMsgUnread();
        }
        if (this.$refs.collapseRef) {
          this.$refs.collapseRef.setMsgUnread();
        }
        if (this.$refs.msgRef.visible) {
          this.$refs.msgRef.loadUnreadList();
          this.$refs.msgRef.reload();
        }
      }
      if (evt.type === 'count') {
        if (this.$refs.toolRef) {
          this.$refs.toolRef.unread = this.$refs.toolRef.unread + evt.data;
        }
        if (this.$refs.collapseRef) {
          this.$refs.collapseRef.unread =
            this.$refs.collapseRef.unread + evt.data;
        }
        if (this.$refs.msgRef.visible) {
          this.$refs.msgRef.loadUnreadList();
        }
      }
      if (evt.type === 'insert') {
        if (this.$refs.toolRef) {
          this.$refs.toolRef.unread =
            this.$refs.toolRef.unread + evt.data.count;
        }
        if (this.$refs.collapseRef) {
          this.$refs.collapseRef.unread =
            this.$refs.collapseRef.unread + evt.data.count;
        }
        if (this.$refs.msgRef.visible) {
          this.$refs.msgRef.loadUnreadList();
          this.$refs.msgRef.triggerInsert(evt.data);
        }
      }
      if (evt.type === 'jump') {
        this.$refs.msgRef.handleGoto(evt.data);
      }
    },
    // 监听窗口大小
    listenerWinResize() {
      this.screenWidth = document.documentElement.clientWidth;
    },
    // 定制Layout
    customLayout() {
      let sessionSubpage = this.$storage.session.get('subpage');
      let sessionBodypage = this.$storage.session.get('bodypage');
      if (!this.$utilStr.isEmpty(this.$storage.session.get('sm-menucollap'))) {
        this.smallScreenMenuCollapse =
          this.$storage.session.get('sm-menucollap');
      }
      let { subpage, bodypage } = this.$route.query;
      if (this.activeLanding) {
        this.subpage = this.$utilStr.parseBoolean(subpage || sessionSubpage);
        this.bodypage = this.$utilStr.parseBoolean(bodypage || sessionBodypage);
      } else if (this.activeRedirecting) {
        this.subpage = this.$utilStr.parseBoolean(subpage || sessionSubpage);
        this.bodypage = this.$utilStr.parseBoolean(bodypage || sessionBodypage);
      }
      if (this.subpage) {
        this.$watermark.set('');
      }
      if (this.bodypage) {
        this.resetLayout();
      }
    },
    // 重置Layout布局
    resetLayout() {
      this.$nextTick(() => {
        let o = this.$el.children;
        for (let i = o.length - 1; i >= 0; i--) {
          if (o[i].className && o[i].className !== 'hdty-body') {
            o[i].remove();
          }
        }
      });
    },
    // 折叠左侧菜单
    handleMenuCollapse() {
      if (this.screenWidth <= 992) {
        this.smallScreenMenuCollapse = !this.smallScreenMenuCollapse;
        this.$storage.session.set(
          'sm-menucollap',
          this.smallScreenMenuCollapse
        );
      } else {
        this.$storage.local.set(
          'hdty-admin-menucollap',
          !this.menucollapEnabled
        );
        this.$store.dispatch('editMenucollap', !this.menucollapEnabled);
      }
    },
    // 切换顶部导航
    handleTopnavChange(val) {
      this.currentRootnav = val;
      if (val.children) {
        this.currentSubnavs = val.children;
      } else {
        if (this.$route.name === val.code) {
          this.currentSubnavs = [];
        }
      }
    },
    // 关闭页面选项卡
    handlePagetabClose(val) {
      this.pageTabsInfo.pageTabs = val;
    },
    // 打开主题
    handleMyTheme() {
      this.opentheme = !this.opentheme;
      this.$refs.themeRef.visible = this.opentheme;
      this.openset = false;
      this.$refs.setRef.visible = this.openset;
      this.openmsg = false;
      this.$refs.msgRef.visible = this.openmsg;
    },
    // 打开设置
    handleMySet() {
      this.openset = !this.openset;
      this.$refs.setRef.visible = this.openset;
      this.opentheme = false;
      this.$refs.themeRef.visible = this.opentheme;
      this.openmsg = false;
      this.$refs.msgRef.visible = this.openmsg;
    },
    // 打开消息
    handleMyMessage() {
      this.openmsg = !this.openmsg;
      this.$refs.msgRef.visible = this.openmsg;
      this.opentheme = false;
      this.$refs.themeRef.visible = this.opentheme;
      this.openset = false;
      this.$refs.setRef.visible = this.openset;
    },
    // 打开个人中心
    handleMyCenter() {
      this.$router.push('/my-center');
    },
    // 打开修改密码
    handleChangePwd() {
      this.$refs.pwdRef.visible = true;
      this.$refs.pwdRef.beforeLoadForm();
    },
    // 退出登录
    handleLogout() {
      this.$confirm('确定要退出系统吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$utilLogin.logout();
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>

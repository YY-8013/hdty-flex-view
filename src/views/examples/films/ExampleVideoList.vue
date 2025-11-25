<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="extendData" ref="componentRef">
          <hd-query>
            <el-form-item label="设备名称" prop="name">
              <hd-factor-input
                prop="nameFilterFactor"
                v-model="queryData.name"
                :model-control.sync="extendData.nameFilterFactor"
                placeholder="请输入设备名称"
              ></hd-factor-input>
            </el-form-item>
          </hd-query>
        </hd-component>
      </el-form>
      <!-- 新写法-->
      <hd-button-container>
        <hd-button type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
      </hd-button-container>
    </div>
    <div v-loading="loading" class="hdty-fit">
      <div class="hdty-fluid hdty-fluid-space0 hdty-scroll">
        <div v-if="videoList && videoList.length > 0" class="hdty-row hdty-col-space16">
          <div v-for="item in videoList" class="hdty-col-md3">
            <hd-video
              :session="item.session"
              :poster="item.poster"
              :title="item.title"
              :subtitle="item.subtitle"
              @play="handlePlay"
            ></hd-video>
          </div>
        </div>
        <div v-else class="hdty-empty-tips">暂无数据</div>
      </div>
    </div>
    <div class="hdty-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        :total="pageOptions.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <hd-video-easy-player
      :visible.sync="playerOptions.visible"
      :session="playerOptions.session"
      :poster="playerOptions.poster"
      :sources-src="playerOptions.sourcesSrc"
      @ready="handleReady"
      @stop="handleStop"
    ></hd-video-easy-player>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import EasyPlayer from '@easydarwin/easyplayer';

export default {
  name: 'ExampleVideoList',
  mixins: [hdList],
  components: { EasyPlayer },
  data() {
    return {
      sourcesSrc:
        'http://172.16.60.191:18086/api/v1/ipc/live/play/group1.xaeyjkmp4h2nbrpn1u2dszhd.m3u8',
      // 查询
      queryData: {
        name: ''
      },
      // 查询扩展
      extendData: {
        nameFilterFactor: ''
      },
      // 视频列表
      videoList: [],
      // 分页选项
      pageOptions: {
        current: 1,
        sizes: [20, 40, 100, 200],
        size: 20,
        total: 0
      },
      // 播放配置
      playerOptions: {
        // 是否显示
        visible: false,
        // 视频标识
        session: '',
        // 封面图片
        poster: '',
        // 视频URL
        sourcesSrc: ''
      }
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    // 加载列表
    loadList() {
      this.loading = true;
      this.videoList = [];
      for (let i = 0; i < this.pageOptions.size; i++) {
        this.videoList.push({
          session: this.$utilStr.uuid(),
          poster:
            'https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800',
          title: '设备：HDTYADMIM01',
          subtitle: '位置：Web前端实验所'
        });
      }
      this.pageOptions.total = this.pageOptions.size;
      this.loading = false;
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.pageOptions.current = 1;
          _this.loadList();
        }
      });
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    // 点击播放
    handlePlay(val, e) {
      this.playerOptions.visible = true;
      // this.playerOptions.session = val;
      this.playerOptions.session = 'group1.ea2dlli33vfe3a1gavjoqcvm';
      this.playerOptions.poster =
        'https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800';
      // this.playerOptions.sourcesSrc = 'https://vse2-as-all35.secdn.net/logos-channel/live/biblescreen-ad-free/playlist.m3u8';
      // 播放地址
      this.playerOptions.sourcesSrc =
        'http://172.16.60.191:18086/api/v1/ipc/live/play/group1.ea2dlli33vfe3a1gavjoqcvm.m3u8';
    },
    // 视频播放就绪
    handleReady(val, e) {
      console.log('视频播放就绪：', val, e);
    },
    // 视频播放结束
    handleStop(val, e) {
      console.log('视频播放结束：', val, e);
    }
  }
};
</script>

<style scoped>
</style>

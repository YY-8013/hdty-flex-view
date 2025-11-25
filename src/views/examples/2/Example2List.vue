<template>
  <div class="hdty-container hdty-flex hdty-flex-row">
    <div class="hdty-flex-fit">
      <hd-dict-menu
        v-model="menuActiveKey"
        :dict-code="$global.dictType.clientType"
        @currentChanged="handleMenuChange"
      ></hd-dict-menu>
    </div>
    <div class="hdty-flex-fill hdty-flex hdty-flex-column">
      <div class="hdty-header">
        <hd-button-container>
          <hd-button name="show" type="info" icon="el-icon-plus" @click="handleShowColumn">显示列</hd-button>
          <hd-button name="hide" icon="el-icon-minus" @click="handleHideColumn">隐藏列</hd-button>
          <hd-button
            name="add"
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd"
          >表单上传文件</hd-button>
          <hd-button name="print" type="primary" icon="el-icon-printer" @click="handlePrint">打印</hd-button>
          <hd-button-upload
            name="upload"
            type="success"
            v-model="file"
            :loading="uploading"
            @currentChanged="handleUpload"
            @click="handleFileChooserOpen"
          >上传</hd-button-upload>
          <hd-button
            name="download"
            type="warning"
            icon="icon-cloud-download"
            :loading="downloading"
            @click="handleDownload"
          >下载</hd-button>
          <hd-button name="notify" type="success" icon="el-icon-menu" @click="handleNotify">通知</hd-button>
          <hd-button
            name="inform"
            type="warning"
            icon="el-icon-document-copy"
            @click="handleInform"
          >通告</hd-button>
          <hd-button name="drawer" type="success" icon="el-icon-menu" @click="handleDrawer">抽屉</hd-button>
          <hd-button
            name="contextmenu"
            type="primary"
            icon="el-icon-mouse"
            @contextmenu.native="handleContextmenu"
          >右键菜单</hd-button>
          <hd-button name="marquee" type="success" icon="el-icon-mouse" @click="handleMarquee">选框工具</hd-button>
          <hd-button
            name="flash"
            type="warning"
            icon="el-icon-document-copy"
            @click="handleFlash"
          >闪屏</hd-button>
          <el-dropdown>
            <el-button type="info">更多功能</el-button>
            <el-dropdown-menu slot="dropdown">
              <hd-button
                name="download"
                type="warning"
                icon="el-icon-menu"
                @click="handleDropdownMenu1"
              >功能1</hd-button>
              <hd-button
                name="download"
                type="warning"
                icon="el-icon-menu"
                @click="handleDropdownMenu2"
              >功能2</hd-button>
            </el-dropdown-menu>
          </el-dropdown>
        </hd-button-container>
      </div>
      <div class="hdty-fit">
        <el-table
          v-loading="loading"
          ref="tableRef"
          :data="tableData"
          row-key="vo.id"
          :empty-text="emptyText"
          border
          fit
          height="100%"
          @sort-change="handleSortChange"
        >
          <el-table-column fixed type="selection" reserve-selection align="center" width="50"></el-table-column>
          <el-table-column
            fixed
            type="index"
            :index="setIndex"
            label="序号"
            class-name="is-index"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column fixed label="操作" align="center" width="435">
            <template slot-scope="scope">
              <hd-button-container>
                <hd-button
                  name="detail"
                  type="success"
                  @click="handleDetail(scope.$index, scope.row)"
                >表单显示图片及加标题</hd-button>
                <hd-button
                  name="edit"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                >表单编辑文件</hd-button>
                <hd-button
                  name="off"
                  type="danger"
                  :disabled="scope.row.vo.status === $global.dictItem.isOrNot.is"
                  @click="handleOff(scope.$index, scope.row)"
                >注销</hd-button>
                <el-dropdown>
                  <el-button type="info">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <hd-button
                      name="download"
                      type="warning"
                      icon="el-icon-menu"
                      @click="handleMore1(scope.$index, scope.row)"
                    >功能1</hd-button>
                    <hd-button
                      name="download"
                      type="warning"
                      icon="el-icon-menu"
                      @click="handleMore2(scope.$index, scope.row)"
                    >功能2</hd-button>
                  </el-dropdown-menu>
                </el-dropdown>
              </hd-button-container>
            </template>
          </el-table-column>
          <el-table-column prop="vo.photoUrl" label="图片1" header-align="center" width="140">
            <template slot-scope="scope">
              <hd-image :src="scope.row.vo.photoUrl" class="hdty-img-scale-wide"></hd-image>
            </template>
          </el-table-column>
          <el-table-column prop="vo.photoUrl" label="图片2" header-align="center" width="140">
            <template slot-scope="scope">
              <hd-image-preview :value="scope.row.vo.photoUrl"></hd-image-preview>
            </template>
          </el-table-column>
          <el-table-column
            prop="vo.item1"
            label="列表项1"
            sortable="custom"
            header-align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="vo.item2"
            label="列表项2"
            sortable="custom"
            header-align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            v-if="columnsVisible[0]"
            key="vo.item3"
            prop="vo.item3"
            label="列表项3"
            sortable="custom"
            header-align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            v-if="columnsVisible[1]"
            key="vo.item4"
            prop="vo.item4"
            label="列表项4"
            sortable="custom"
            header-align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            v-if="columnsVisible[2]"
            key="vo.item5"
            prop="vo.item5"
            label="列表项5"
            sortable="custom"
            header-align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            v-if="columnsVisible[3]"
            key="vo.position"
            prop="vo.position"
            label="位置"
            sortable="custom"
            header-align="center"
            width="160"
          >
            <template slot-scope="scope">
              {{ scope.row.vox.position || '未知' }}
              <hd-map-point
                v-if="scope.row.vo.position"
                type="button"
                :value="scope.row.vo.position"
                :model-text="scope.row.vox.position"
              ></hd-map-point>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnsVisible[4]"
            key="vo.status"
            prop="vo.status"
            label="状态"
            sortable="custom"
            header-align="center"
            width="160"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.vo.status === $global.dictItem.isOrNot.is ? 'danger' : 'success'"
              >{{ scope.row.vox.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="vo.time"
            label="时间"
            sortable="custom"
            header-align="center"
            min-width="180"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span v-html="formatDatetime(scope.row.vo.time)"></span>
            </template>
          </el-table-column>
        </el-table>
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
    </div>
    <example-drawer ref="drawerRef"></example-drawer>
    <example-add ref="addRef"></example-add>
    <example-print ref="printRef"></example-print>
    <example-detail ref="detailRef"></example-detail>
    <example-edit ref="editRef"></example-edit>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { page, off, upload, download } from './api';
import ExampleDrawer from './Example2Drawer';
import ExampleAdd from './Example2Add';
import ExamplePrint from './Example2Print';
import ExampleDetail from './Example2Detail';
import ExampleEdit from './Example2Edit';
export default {
  name: 'Example2List',
  moduleName: 'Example2List',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    ExampleDrawer,
    ExampleAdd,
    ExamplePrint,
    ExampleDetail,
    ExampleEdit
  },
  data() {
    return {
      // 当前选中菜单标识
      menuActiveKey: this.$global.dictItem.clientType.pcTerminal,
      // 查询
      queryData: {},
      // 查询扩展
      extendData: {},
      // 表格
      tableData: [
        {
          vo: {
            id: '1',
            photoUrl:
              'https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800',
            item1: '示例',
            item2: '示例',
            item3: '增加列',
            item4: '增加列',
            item5: '增加列',
            position: {
              lng: 111.671574,
              lat: 40.834886
            },
            status: '0',
            time: '00000000000000'
          },
          vox: {
            position: '呼和浩特火车站',
            status: '未注销'
          }
        },
        {
          vo: {
            id: '2',
            photoUrl: '',
            item1: '示例',
            item2: '示例',
            item3: '增加列',
            item4: '增加列',
            item5: '增加列',
            status: '1',
            time: '00000000000000'
          },
          vox: {
            status: '已注销'
          }
        },
        {
          vo: {
            id: '3',
            photoUrl:
              'https://images.pexels.com/photos/2138922/pexels-photo-2138922.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800',
            item1: '示例',
            item2: '示例',
            item3: '增加列',
            item4: '增加列',
            item5: '增加列',
            position: {
              lng: 111.833126,
              lat: 40.860645
            },
            status: '0',
            time: '00000000000000'
          },
          vox: {
            position: '呼和浩特白塔机场',
            status: '未注销'
          }
        }
      ],
      // 显示的列
      columnsVisible: [false, false, false, true, true],
      // 文件
      file: null,
      // hdMarquee示例
      hdMarquee: null
    };
  },
  destroyed() {
    // 关闭hdMarquee
    if (this.hdMarquee) {
      this.hdMarquee.close();
    }
  },
  mounted() {
    // 加载数据表格
    this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      if (this.AUTHORITY_QUERY) {
        this.loading = true;
        // 参数
        let dataParams = {
          ...this.extendData,
          ...this.queryData,
          ...this.pageOptions
        };
        // Lambda写法
        page(dataParams)
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              this.pageOptions.total = data.total;
              this.tableData = data.records;
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          })
          .finally(() => {
            this.$refs.tableRef.doLayout();
            this.loading = false;
          });
      }
    },
    // 改变菜单选择
    handleMenuChange(val, oldVal, selection) {
      console.log('菜单选择：', val, oldVal, selection);
    },
    // 显示列
    handleShowColumn() {
      this.loading = true;
      this.columnsVisible = [true, true, true, true, true];
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout();
        this.loading = false;
      });
    },
    // 隐藏列
    handleHideColumn() {
      this.loading = true;
      this.columnsVisible = [false, false, false, false, false];
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout();
        this.loading = false;
      });
    },
    // 新增
    handleAdd() {
      this.$refs.addRef.visible = true;
      this.$refs.addRef.beforeLoadForm();
    },
    // 打印
    handlePrint() {
      this.$refs.printRef.visible = true;
    },
    // 打开文件选择对话框
    handleFileChooserOpen(val, e) {
      console.log('打开文件选择对话框', val, e);
      // val.chooserVisible = true; // 如果阻止了自动唤醒文件选择对话框，则执行该行代码重新唤醒
    },
    // 文件上传
    handleUpload(val, filename) {
      console.log('当前上传文件：', val, filename);
      this.uploading = true;
      // 参数
      let formData = new FormData();
      formData.append('file', this.file);
      // Lambda写法
      upload(formData)
        .then((response) => {
          // 响应成功回调
          let { success, msg } = response.data;
          if (success) {
            this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: msg,
              type: 'success'
            });
            this.handleQuery();
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          this.uploading = false;
        });
    },
    // 文件下载
    handleDownload() {
      this.downloading = true;
      download()
        .then((response) => {
          // 响应成功回调
          this.download(response);
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          this.downloading = false;
        });
    },
    // 通知
    handleNotify() {
      this.$notify({
        title: '通知标题',
        message: '通知内容通知内容通知内容通知内容通知内容通知内容',
        // timeout: 0, // 设置为0永不关闭
        // audio: '', // 提示音（alarm/apply/remind/notify或自定义）
        onclick: this.handleNotifyClick,
        onclose: this.handleNotifyClose
      });
    },
    // 点击通知
    handleNotifyClick(val, e) {
      console.log('通知点击', val, e);
    },
    // 关闭通知
    handleNotifyClose(val, e, trigger) {
      console.log('通知关闭', val, e, trigger);
    },
    // 通告
    handleInform() {
      this.$inform({
        collecting: true,
        printing: true,
        reading: '1234',
        id: '1',
        title: 'HdtyAdmin通用后台管理模板系统介绍',
        subtitle: '化繁为简，星辰大海',
        edition: '华动泰越发[2021] 001号',
        agency: '华动泰越',
        author: 'Web前端实验所',
        avatar:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAIAAABoJHXvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTI0VDEwOjEzOjI5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA2LTI0VDEwOjEzOjI5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0yNFQxMDoxMzoyOSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplNjA2MTZhOC0xMGRkLTgyNDAtYTVlZC1iZjQ1ZjA5MmU0YmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowY2I2OGE4NC0xYmVlLTNhNDktOGM0Yy03MWM4MTZjYmJlNTMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyNjRlMjVlNC04MWY3LWIwNDMtYjRmOS0zZjFjMjAwZTIzNWIiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjI2NGUyNWU0LTgxZjctYjA0My1iNGY5LTNmMWMyMDBlMjM1YiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0yNFQxMDoxMzoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplNjA2MTZhOC0xMGRkLTgyNDAtYTVlZC1iZjQ1ZjA5MmU0YmMiIHN0RXZ0OndoZW49IjIwMjAtMDYtMjRUMTA6MTM6MjkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5RT2M8AAAMZUlEQVR4nO2de3BUVx3Hz929+8ruZneTEPIC8oAkUBseSXhocWqFitShtgottZSZMh214siMVGWs8kctVq3ajmOp7Wit2rG1VTpVEFo61pIEAiEgJCSQkPc72d1k37vZu9c/1snETbK79577O+deuJ9/997fPcn3nt855/f7nXOZosbjSEU5aGg3QEUYqmAKQxVMYaiCKQxVMIWhCqYwVMEUhiqYwlAFUxiqYApDFUxhqIIpDFUwhaEKpjBUwRSGKpjCUAVTGKpg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',
        time: '20210101090000',
        content:
          '<p>HdtyAdmin前端开发框架，是我公司自主研发的一个后台前端解决方案，基于vue和element-ui实现。它使用了最新的前端技术栈，包括ES2015+、vue、vuex、vue-router 、vue-cli 、axios和 element-ui。同时内置了动态路由、权限验证、典型业务模板、常用业务组件，模拟数据、HMR 实时预览、状态管理等实用功能辅助开发，它可以快速搭建企业级中后台产品原型。</p>' +
          '<p>1）动态路由：通过菜单管理动态添加页面，从而将页面快速展现给用户，同时，合理利用浏览器前进后退键缓存，记住当前滚动位置，提供最好的用户体验；</p>' +
          '<p>2）权限验证：通过用户、角色、菜单、路由、组件配置快速进行用户权限验证，同时，完整的权限控制流程既极大的增强了系统安全性，又不失开发时的灵活性。</p>' +
          '<p>3）典型业务模板：框架内置了丰富优秀的典型业务模板，包括对业务系统的管理，如用户管理、角色管理、菜单管理、消息中心、机构管理、地区管理、数据字典、系统配置、业务管理、接入系统管理、系统日志、导出日志、删除规则、缓存管理；对硬件设备的管理，如读卡器管理、摄像头管理、扫码器管理；对内嵌其他网站的管理等；</p>' +
          '<p>4）常用业务组件：框架内置了丰富优秀的业务组件，如socket连接组件、mqtt连接组件、字体图标组件、浏览器打印组件、自适应面板组件、地图组件、编辑器组件、业务查询组件、图片上传组件、图片显示组件、字典选择组件、机构选择组件、地区选择组件等；</p>' +
          '<p>5）模拟数据：框架通过mock.js模拟数据。Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发更加独立自主，不会被服务端的开发所阻塞。</p>' +
          '<p>HdtyAdmin前端开发框架，兼容ie11以上及大部分主流浏览器，它对用户体验的格外注重，提供了包括主题风格、布局方式、字体大小、快捷导航等用户个性化配置方案。在和服务端进行交互上，为了方便管理维护，通过UI 组件交互操作、调用统一管理的 api service 请求函数、使用封装的 request.js 发送请求、获取服务端返回、更新 data这样完整的前端请求流程控制。</p>' +
          '<p>HdtyAdmin前端开发框架，具备全方位的解决方案，致力于服务各个阶段的开发人员，以最具效率的开发方式，让用户页面轻松拥有丰富友好的操作体验。</p>'
      });
    },
    // 抽屉
    handleDrawer() {
      this.$refs.drawerRef.visible = true;
      this.$refs.drawerRef.beforeLoadForm();
    },
    // 右键菜单
    handleContextmenu(e) {
      this.$contextmenu({
        menus: [
          {
            label: '功能1',
            icon: 'icon-menu',
            onclick: this.handleContextmenu1
          },
          {
            label: '功能2',
            icon: 'icon-menu',
            onclick: this.handleContextmenu2
          },
          {
            label: '功能3',
            icon: 'icon-menu',
            divided: true,
            children: [
              {
                label: '功能3-1',
                icon: 'icon-menu',
                onclick: this.handleContextmenu31
              },
              {
                label: '功能3-2',
                icon: 'icon-menu',
                onclick: this.handleContextmenu32
              }
            ]
          }
        ],
        event: e,
        onclose: this.handleContextmenuClose
      });
    },
    // 右键菜单功能1
    handleContextmenu1(val, e, self) {
      console.log('右键菜单功能1选择', val);
    },
    // 右键菜单功能2
    handleContextmenu2(val, e, self) {
      console.log('右键菜单功能2选择', val);
    },
    // 右键菜单功能3-1
    handleContextmenu31(val, e, self) {
      console.log('右键菜单功能3-1选择', val);
    },
    // 右键菜单功能3-2
    handleContextmenu32(val, e, self) {
      console.log('右键菜单功能3-2选择', val);
    },
    // 右键菜单关闭回调
    handleContextmenuClose(val, self) {
      console.log('右键菜单关闭', val);
    },
    // 选框工具
    handleMarquee() {
      this.hdMarquee = this.$marquee({
        // container: Element, // 选框所在容器，默认为hdty-body主体元素
        // target: CSSSelectors, // 选框目标CSS选择器，默认为checkbox复选框
        oncomplete: this.handleMarqueeComplete
      });
    },
    // 选框工具选取完成回调
    handleMarqueeComplete(e) {
      console.log('选框工具选取完成', e);
    },
    // 闪屏
    handleFlash() {
      this.$flash({
        // duration: Number,  // 闪烁过渡时长（毫秒）
        // color: Array,  // 闪烁颜色（空则随机生成）
        // gradient: Object, // 渐变颜色闪烁配置（用于渐变背景闪烁）
        // audio: Number,  // 音效（数字0，或自定义）
        // slot: HTMLElement,  // 插槽内容（HTMLElement）
        onopen: this.handleFlashOpen,
        onclose: this.handleFlashClose
      });
    },
    // 闪屏打开回调
    handleFlashOpen(self) {
      console.log('闪屏打开', self);
    },
    // 闪屏关闭回调
    handleFlashClose(self) {
      console.log('闪屏关闭', self);
    },
    // 更多功能1
    handleDropdownMenu1(e) {
      console.log('更多功能1选择', e);
    },
    // 更多功能2
    handleDropdownMenu2(e) {
      console.log('更多功能2选择', e);
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 编辑
    handleEdit(index, row) {
      this.$refs.editRef.visible = true;
      this.$refs.editRef.row = row;
      this.$refs.editRef.beforeLoadForm();
    },
    // 注销
    handleOff(index, row) {
      this.$prompt('请输入注销原因', '注销', {
        customClass: 'is-required',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\S\s]{1,100}$/,
        inputErrorMessage: '请输入注销原因，长度不能超过100字符'
      })
        .then(({ value }) => {
          // 参数
          let dataParams = {
            id: row.id,
            reason: value
          };
          // Lambda写法
          off(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                this.loadList();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            });
        })
        .catch(() => {});
      /*
        // 如果注销原因非必填
        this.$prompt('请输入注销原因', '注销', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: this.$utilValidate.promptValidateCharLimit100,
          inputErrorMessage: '注销原因长度不能超过100字符'
        }).then(({ value }) => {
          // 确定回调
        }).catch(() => {
          // 取消回调
        });
        */
    },
    // 表格更多功能1
    handleMore1(index, row) {
      console.log('表格更多功能1选择', index, row);
    },
    // 表格更多功能2
    handleMore2(index, row) {
      console.log('表格更多功能2选择', index, row);
    }
  }
};
</script>

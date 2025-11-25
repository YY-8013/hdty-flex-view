<template>
  <div class="hdty-side hdty-side-msg hdty-flex" :visible="visible">
    <div class="hdty-card-header hdty-flex-fit">
      <div v-if="show" class="hdty-card-category">
        <el-radio-group
          v-model="category.value"
          @change="handleChange">
          <template v-for="item in category.data">
            <el-badge :class="{'is-load': !item.count, 'is-hide': item.count<=0 }" :value="item.count" :max="99" :type="item.badge">
              <el-radio-button :label="item.key" :key="item.key">{{ item.value }}</el-radio-button>
            </el-badge>
          </template>
        </el-radio-group>
      </div>
      <div v-else class="hdty-card-title">
        消息中心
      </div>
      <ul class="hdty-card-subtitle">
        <li>
          <a href="javascript:;" @click="handleClearRead">
            清除已读
          </a>
        </li>
        <li>
          <a href="javascript:;" @click="handleClearAll">
            全部清除
          </a>
        </li>
      </ul>
    </div>
    <div class="hdty-card-body hdty-flex-fill hdty-scroll">
      <ul
        v-if="visible"
        class="hdty-flow-list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled">
        <transition-group enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" tag="p" :css="animation">
          <li
            v-for="item in msgData"
            class="hdty-flow-item"
            :key="item.vo.id"
            @click.stop="handleClick(item.vo)">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                <div class="hdty-label hdty-elip">
                  <transition leave-active-class="animated fadeOut">
                    <i v-if="item.vo.readType===$global.dictItem.msgReadStatus.unRead" class="hdty-msg-status icon-circle"></i>
                  </transition>
                  {{ item.vo.title }}
                </div>
              </div>
              <div class="hdty-card-more">{{ $utilDate.dateHumanize(item.vo.createTime) }}</div>
            </div>
            <div class="hdty-card-body">
              <el-tag effect="dark" :type="msgTag">{{ item.vox.msgType}}</el-tag>{{ item.vo.description }}
            </div>
            <i class="hdty-flow-item-icon el-icon-close" @click.stop="handleClearItem(item.vo.id)"></i>
            <i v-if="item.vo.handleType===$global.dictItem.msgType.handle" class="hdty-flow-item-icon el-icon-edit" title="去处理" @click.stop="handleGoto(item.vo)"></i>
          </li>
        </transition-group>
      </ul>
      <p v-if="loading" class="hdty-center">加载中...</p>
      <p v-if="noMore" class="hdty-center">没有更多了</p>
    </div>
  </div>
</template>

<script>
  import { getCategory, getUnreadItemsCount, myCenter, delAll, delReadMsg, delOne, readOne, readArray, getMsgDealUrl } from "@/api/msg";
  export default {
    name: "SideMsg",
    data() {
      return {
        // 显示side
        visible: false,
        // 显示category
        show: this.$app.categoryEnabled,
        // 移除category选项
        categoryRemove: this.$app.categoryRemoveOptions,
        // 已读触发方式
        readMode: this.$app.readTrigger,
        // 跳转新页签
        newPagetab: this.$app.newpagetabEnabled,
        // 消息类别
        category: {
          // 绑定值
          value: this.$app.categoryEnabled ? this.$global.dictItem.msgTopic.alarmType : '',
          // 标记
          badge: [
            'danger',
            'info',
            'warning',
            'primary',
          ],
          // 数据
          data: [],
          // 未读数量
          unread: [],
        },
        // 标签
        msgTag: 'danger',
        // 数据
        msgData: [],
        // 分页
        pageData: {
          current: 1,
          size: 10,
          total: null,
        },
        // 加载上一页
        pagePrev: false,
        // 计数器
        index: 0,
        // 动画
        animation: false,
        // 加载中
        loading: false
      }
    },
    watch: {
      visible: {
        handler(val) {
          if (val) {
            this.init();
            this.handleChange();
            this.createMask();
          }else {
            this.removeMask();
          }
        },
        immediate: false
      }
    },
    computed: {
      noMore() {
        return this.index === this.pageData.total;
      },
      disabled() {
        return this.loading || this.noMore;
      }
    },
    methods: {
      // 初始化
      init() {
        if(this.show) {
          // 加载消息类别
          this.loadCategoryList();
          // 加载未读数量
          this.loadUnreadList();
        }
      },
      // 加载消息类别
      loadCategoryList() {
        let _this = this;
        // 参数
        let dataParams = {
          typeId: _this.$global.dictType.msgTopic
        };
        // Lambda写法
        getCategory(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if(success) {
            data.forEach((item, index) => {
              item.badge = _this.category.badge[index];
            });
            _this.category.data = _this.triggerFilterCategory(data);
            if(_this.category.unread && _this.category.unread.length > 0) {
              _this.category.unread.forEach(item => {
                for (let i=0;i<_this.category.data.length;i++) {
                  if(_this.category.data[i].key === item.key) {
                    _this.$set(_this.category.data[i], 'count', item.count);
                    break;
                  }
                }
              });
            }
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      // 筛选类别
      triggerFilterCategory(val) {
        if(this.categoryRemove && this.categoryRemove.length > 0) {
          for (let i=this.categoryRemove.length - 1;i>=0;i--) {
            val = val.filter((e, j) => j !== Number(this.categoryRemove.sort(this.compare)[i]));
          }
        }
        return val;
      },
      // 大小比较
      compare(x, y) {
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        } else {
          return 0;
        }
      },
      // 加载未读数量
      loadUnreadList() {
        let _this = this;
        // 参数
        let dataParams = {
          typeId: _this.$global.dictType.msgTopic
        };
        // Lambda写法
        getUnreadItemsCount(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if(success) {
            _this.category.unread = data;
            if(_this.category.data && _this.category.data.length > 0) {
              _this.category.unread.forEach(item => {
                for (let i=0;i<_this.category.data.length;i++) {
                  if(_this.category.data[i].key === item.key) {
                    _this.$set(_this.category.data[i], 'count', item.count);
                    break;
                  }
                }
              });
            }
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      // 加载
      load() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          msgType: _this.category.value,
          current: _this.pageData.current,
          size: _this.pageData.size,
          isLoadPreviousPageData: _this.pagePrev
        };
        // Lambda写法
        myCenter(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if(_this.pagePrev) {
                _this.pagePrev = !_this.pagePrev;
                _this.msgData.forEach(row => {
                  for (let i=data.records.length-1;i>=0;i--) {
                    if(data.records[i].vo.id === row.vo.id) {
                      data.records.splice(i, 1);
                      break;
                    }
                  }
                });
              }
              _this.pageData.total = data.total;
              let currentRead = [];
              data.records.forEach(row => {
                _this.msgData.push(row);
                _this.index++;
                if(_this.readMode === 'scroll') {
                  if (row.vo.readType === _this.$global.dictItem.msgReadStatus.unRead) {
                    currentRead.push(row.vo.id);
                  }
                }
              });
              if(_this.readMode === 'scroll') {
                if(currentRead.length > 0) {
                  _this.triggerScrollRead(currentRead);
                }
              }
              _this.pageData.current++;
            }
          }
        ).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loading = false;
        });
      },
      // 重新加载
      reload() {
        this.animation = false;
        this.msgData = [];
        this.pageData.current = 1;
        this.pageData.total = null;
        this.index = 0;
        this.pagePrev = false;
        this.load();
      },
      // 插入数据
      triggerInsert(val) {
        let _this = this;
        if(val.vo.msgTypeItem === _this.category.value) {
          _this.animation = true;
          _this.msgData.unshift(val);
        }
      },
      // 滚动已读
      triggerScrollRead(val) {
        let _this = this;
        // 参数
        let dataParams = {
          ids: val
        };
        // Lambda写法
        readArray(dataParams).then(response => {
          // 响应成功回调
          let { success } = response.data;
          if (success) {
            _this.pagePrev = true;
            setTimeout(() => {
              // 修改未读状态
              val.forEach(id => {
                let row = _this.msgData.find(e => e.vo.id === id);
                if(row) {
                  row.vo.readType = _this.$global.dictItem.msgReadStatus.haveRead;
                }
              });
            }, 1000);
            setTimeout(() => {
              // 修改未读数量
              let row = _this.category.data.find(e => e.key === _this.category.value);
              if (row) {
                row.count = row.count - val.length;
                appMessage.$emit('mqtt-message', {
                  type: 'count',
                  data: -val.length
                });
              }
            }, 2000);
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      // 点击消息
      handleClick(val) {
        let _this = this;
        _this.$nextTick(() => {
          _this.$router.replace({
            path: '/redirect/msg/list',
            query: {
              id: val.id,
              // forward: val.targetParam
            }
          });
        });
        if(_this.readMode === 'click') {
          if(val.readType === _this.$global.dictItem.msgReadStatus.unRead) {
            _this.triggerClickRead(val.id);
          }
        }
      },
      // 点击已读
      triggerClickRead(val) {
        let _this = this;
        // 参数
        let dataParams = {
          id: val
        };
        // Lambda写法
        readOne(dataParams).then(response => {
          // 响应成功回调
          let { success } = response.data;
          if (success) {
            // 修改未读状态
            let msg = _this.msgData.find(e => e.vo.id === val);
            if(msg) {
              msg.vo.readType = _this.$global.dictItem.msgReadStatus.haveRead;
            }
            // 修改未读数量
            let cate = _this.category.data.find(e => e.key === _this.category.value);
            if (cate) {
              cate.count--;
            }
            appMessage.$emit('mqtt-message', {
              type: 'count',
              data: -1
            });
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      // 点击处理
      handleGoto(val) {
        let _this = this;
        if(val.readType === _this.$global.dictItem.msgReadStatus.unRead) {
          _this.triggerClickRead(val.id);
        }
        let newPageTab = {
          enabled: _this.newPagetab,
        };
        if(val.appId === _this.$utilLogin.getAppId()) {
          _this.$nextTick(() => {
            _this.$router.push({
              path: val.targetPath,
              query: {
                newpagetab: encodeURIComponent(JSON.stringify(newPageTab)),
                ..._this.$utilStr.parameterToObj(val.targetParam)
              }
            });
          });
        }else {
          // 参数
          let dataParams = {
            id: val.id
          };
          // Lambda写法
          getMsgDealUrl(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              /*
              // 重命名要打开的页面选项卡
              newPageTab.name = ''; // 选项卡的标识符
              newPageTab.label = ''; // 选项卡的标题
               */
              _this.$nextTick(() => {
                _this.$router.push({
                  name: data.name,
                  query: {
                    newpagetab: encodeURIComponent(JSON.stringify(newPageTab)),
                    ..._this.$utilStr.parameterToObj(val.targetParam)
                  }
                });
              });
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }
      },
      // 单个清除
      handleClearItem(val) {
        let _this = this;
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 参数
          let dataParams = {
            id: val
          };
          // Lambda写法
          delOne(dataParams).then(response => {
            // 响应成功回调
            let { success } = response.data;
            if (success) {
              for (let i=0;i<_this.msgData.length;i++) {
                if (_this.msgData[i].vo.id === val) {
                  _this.animation = true;
                  _this.msgData.splice(i, 1);
                  _this.pageData.total--;
                  _this.index--;
                  if(_this.index < _this.pageData.size) {
                    _this.pagePrev = true;
                    _this.load();
                  }
                  break;
                }
              }
              // 修改未读数量
              let row = _this.category.data.find(e => e.key === _this.category.value);
              if (row) {
                row.count--;
                appMessage.$emit('mqtt-message', {
                  type: 'count',
                  data: -1
                });
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      },
      // 清除已读
      handleClearRead() {
        let _this = this;
        _this.$confirm('确定要清除所有已读消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 参数
          let dataParams = {
            msgType: _this.category.value,
          };
          // Lambda写法
          delReadMsg(dataParams).then(response => {
            // 响应成功回调
            let { success } = response.data;
            if (success) {
              for(let i=_this.msgData.length-1;i>=0;i--) {
                if (_this.msgData[i].vo.readType === _this.$global.dictItem.msgReadStatus.haveRead) {
                  _this.animation = true;
                  _this.msgData.splice(i, 1);
                  _this.pageData.total--;
                  _this.index--;
                }
                if(_this.index < _this.pageData.size) {
                  _this.pagePrev = true;
                  _this.load();
                }
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      },
      // 清除全部
      handleClearAll() {
        let _this = this;
        _this.$confirm('确定要清除所有消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 参数
          let dataParams = {
            msgType: _this.category.value,
          };
          // Lambda写法
          delAll(dataParams).then(response => {
            // 响应成功回调
            let { success } = response.data;
            if (success) {
              _this.animation = true;
              _this.msgData = [];
              _this.pageData.current = 1;
              _this.pageData.total = 0;
              _this.index = 0;
              // 修改未读数量
              let row = _this.category.data.find(e => e.key === _this.category.value);
              if (row) {
                let unreadCount = row.count;
                row.count = 0;
                appMessage.$emit('mqtt-message', {
                  type: 'count',
                  data: -unreadCount
                });
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      },
      // 切换类别
      handleChange(val) {
        this.animation = false;
        this.msgData = [];
        this.pageData.current = 1;
        this.pageData.total = null;
        this.index = 0;
        let tempData = this.category.data.find(e => e.key === val);
        if (tempData) {
          this.msgTag = tempData.badge;
        }
        this.pagePrev = false;
        this.load();
      },
      // 点击遮罩
      handleMask() {
        this.visible = false;
        this.$parent.openmsg = false;
      },
      // 移除遮罩
      removeMask() {
        let element = document.querySelector('#hd-mask');
        element.remove();
      },
      // 创建遮罩
      createMask() {
        let element = document.createElement('div');
        element.setAttribute('id', 'hd-mask');
        element.setAttribute('class', 'hdty-mask');
        element.onclick = this.handleMask;
        document.body.appendChild(element);
      }
    }
  }
</script>

<style scoped>

</style>

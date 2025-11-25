<template>
  <span>
    <a href="javascript:;" class v-if="cardId" title="点击查看治搜数据">
      <i
        class="el-icon-document"
        v-if="copyBtn"
        @click="handleCopy(cardId)"
        style="cursor: pointer;"
        title="点击复制身份证号"
      ></i>
      <span class="text-clickable" @click="handlePersonFile(cardId)" title="点击查看人员档案">{{cardId}}</span>
      <!--复制身份证号-->
      <span class="con-copy" v-if="copyBtn">
        <input type="text" class="con-copy-input" id="copyText" />
      </span>
    </a>
    <a
      href="javascript:;"
      v-if="phone"
      class="text-color-4 text-clickable"
      style="font-weight: bold"
      @click="handleBigData('2', phone)"
      title="点击查看大数据一键搜数据"
    >{{phone}}</a>
    <a
      href="javascript:;"
      v-if="carNum"
      class="text-color-4 text-clickable"
      @click="handleBigData('3', carNum)"
      title="点击查看大数据一键搜数据"
    >{{carNum}}</a>
  </span>
</template>

<script>
import { getBigDataSystemUrl } from './api';

export default {
  name: 'index',
  components: {},
  props: {
    prop: String,
    // 身份证号
    cardId: {
      type: [String],
      default: ''
    },
    // 是否显示复制按钮
    copyBtn: {
      type: [Boolean],
      default: true
    },
    // 联系电话
    phone: {
      type: [String],
      default: ''
    },
    // 车牌号
    carNum: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    // 复制身份证号
    handleCopy(val) {
      let copyText = document.getElementById('copyText');
      copyText.value = val;
      copyText.select();
      document.execCommand('copy');
      this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '复制成功',
        type: 'success'
      });
    },
    // 点击查看人员档案
    handlePersonFile(val) {
      this.$utilPublic.getLinkPageURL({
        path: '/link/person/file',
        appId: 'hdty-spcs-search',
        params: {
          idCard: encodeURIComponent(
            this.$crypto.aesEncryptNetworkData(val, appEnv.searchCryptKey)
          )
        },
        subpage: true,
        bodypage: true,
        transform: true,
        callback: ({ fullPath }) => {
          window.open(fullPath, '_blank');
        }
      });
    },
    // 大数据一件搜
    handleBigData(searchType, searchContent) {
      let _this = this;
      if (searchContent) {
        // 遮罩父级页面
        _this.$emit('loadingParent', {
          flag: true,
          msg: '大数据用户验证中请稍候...'
        });
        // 参数
        let dataParams = {
          systemType: '2', // 访问系统类型 1智慧大脑 2大数据智搜
          searchType: searchType, // 一键搜搜索类 1身份证号 2手机 3车牌 不传默认1公民身份证号
          searchContent: searchContent
        };
        // Lambda写法
        getBigDataSystemUrl(dataParams)
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              window.open(data.url, '_blank');
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          })
          .finally(() => {
            // 遮罩父级页面
            _this.$emit('loadingParent', {
              flag: false,
              msg: ''
            });
          });
      } else {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '数据缺失',
          type: 'warning'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.text-clickable {
  font-weight: bolder;
}

/*复制身份证号*/
.con-copy {
  position: relative;
  .con-copy-input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
</style>

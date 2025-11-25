<template>
  <div>
    <!-- 实有人口详情 -->
    <!-- <real-person-detail ref="detailRef" v-if="isDetail"></real-person-detail> -->
    <!-- 实有人口添加-->
    <!-- <real-person-add ref="addRef" v-if="isAdd === '1'" @currentSyrk="handleSryk"></real-person-add> -->
    <!-- 实有人口编辑-->
    <!-- <real-person-edit ref="editRef" v-if="isAdd === '0' && !isDetail" @currentSyrk="handleSryk"></real-person-edit> -->
  </div>
</template>
<script>
import { personDetailIsHave } from './api';
// import RealPersonAdd from "../../../police-network/ybss/threemanage/modeladd/realperson/RealPersonAdd.vue";
// import RealPersonEdit from "../../../police-network/ybss/threemanage/modeladd/realperson/RealPersonEdit.vue";
// import RealPersonDetail from '../../../police-network/ybss/threemanage/modeladd/realperson/RealPersonDetail.vue';

export default {
  name: 'BizSyrkCheck',
  provide() {
    return {
      BizSyrkCheck: this
    };
  },
  components: {
    // RealPersonAdd,
    // RealPersonEdit,
    // RealPersonDetail
  },
  props: {
    prop: String,
    // 身份证号
    gmsfhm: {
      type: String,
      default: ''
    },
    // 参考地址
    ckdz: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      row: null,
      isAdd: ''
    };
  },
  mounted() {
    this.loadForm();
  },
  methods: {
    // 获取数据列表
    loadForm() {
      let _this = this;
      // 参数
      let dataParams = {
        gmsfhm: this.gmsfhm
      };
      personDetailIsHave(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.isAdd = data && data.vo && data.vo.ywid ? '0' : '1';
            _this.$nextTick(() => {
              if (_this.$refs.addRef) {
                _this.$refs.addRef.addData.gmsfhm = _this.gmsfhm;
                _this.$refs.addRef.ckdz = _this.ckdz;
                _this.$refs.addRef.isTaskCenter = true;
              }
              if (_this.$refs.editRef) {
                _this.$refs.editRef.row = {
                  vo: {
                    id: data.vo.ywid,
                    rylx: data.vo.rylx
                  }
                };
                _this.$refs.editRef.isTaskCenter = true;
                _this.$refs.editRef.dyly = '3';
                _this.$refs.editRef.beforeLoadForm();
              }
            });
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {});
    },
    handleSryk(item) {
      this.$emit('currentChanged', item);
    }
  }
};
</script>

<style scoped>
</style>

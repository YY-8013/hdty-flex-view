<template>
  <div>
    <!-- 从业人员详情 -->
    <employees-check-detail
      ref="detailRef"
      v-show="checkStatus === 1"
      @handleChanged="currentChanged"
    ></employees-check-detail>
    <!-- 实有人口核查-->
    <employees-check-edit-content
      ref="addRef"
      v-show="checkStatus === 0"
      @handleChanged="currentChanged"
    ></employees-check-edit-content>
  </div>
</template>
<script>
import { employeesDetailIsHave } from './api';
// import EmployeesCheckEditContent from "../../../employees-check/EmployeesCheckEditContent.vue"
// import EmployeesCheckDetail from "@/views/employees-check/EmployeesCheckDetail.vue"
export default {
  name: 'bizEmployeesCheck',
  provide() {
    return {
      bizEmployeesCheck: this,
      EmployeesCheckEdit: this
    };
  },
  components: {
    // EmployeesCheckDetail,
    // EmployeesCheckEditContent,
  },
  props: {
    prop: String,
    // 身份证号
    gmsfhm: {
      type: String,
      default: ''
    },
    // 业务主键-核查任务编码
    ywId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      row: null,
      checkStatus: 0 // 0.未核查 1.已核查
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
        cyrlBm: this.ywId
      };
      employeesDetailIsHave(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.checkStatus = 0;
            _this.$refs.addRef.dyly = '2'; // 调用来源：从任务中心跳转
            _this.$refs.addRef.row = {
              vo: {
                cyrlBm: this.ywId,
                personCardid: this.gmsfhm
              }
            };
            _this.$refs.addRef.beforeLoadForm();
          }
        })
        .catch((error) => {
          _this.checkStatus = 1;
          _this.$refs.detailRef.row = {
            vo: {
              cyrlBm: this.ywId
            }
          };
          _this.$refs.detailRef.beforeLoadForm();
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {});
    },
    currentChanged(item) {
      this.$emit('currentChanged', item);
    }
  }
};
</script>

<style scoped>
</style>

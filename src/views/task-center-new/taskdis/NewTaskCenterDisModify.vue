<template>
  <div>
    <el-dialog append-to-body title="编辑" :visible.sync="visible">
      <div v-loading="loading">
        <step0 ref="Step0Ref" :showFileRwfj="false"></step0>
        <step2 ref="Step2Ref"></step2>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskDetail, editTask } from './../api';
import Step0 from './../steps/Step0';
import Step2 from './../steps/Step2Edit';
export default {
  name: 'NewTaskCenterDisModify',
  components: {
    Step0,
    Step2
  },
  data() {
    return {
      loading: false,
      visible: false,
      row: {
        vo: '',
        vox: ''
      },
      // 任务详情数据
      detailData: ''
    };
  },
  methods: {
    show(row) {
      this.row = row;
      this.loadForm();
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        id: _this.row.vo.id
      };
      // Lambda写法
      getTaskDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 赋值数据
            _this.$nextTick(() => {
              _this.detailData = data;
              _this.$refs.Step0Ref.editDetail(data);
              _this.$refs.Step2Ref.editDetail(data);
              _this.loading = false;
            });
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    // 提交表单
    async handleSubmit() {
      const _this = this;
      if (_this.loading) return;
      const p1 = await this.$refs.Step0Ref.validateForm();
      const p2 = await this.$refs.Step2Ref.validateForm();
      Promise.all([p1, p2]).then(() => {
        _this.submitFormReally();
      });
    },
    // 真正的提交
    submitFormReally() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        id: _this.row.vo.id,
        // step0
        taskContent: _this.$refs.Step0Ref.formData.taskContent,
        taskMode: _this.$refs.Step0Ref.formData.taskMode,
        taskLevel: _this.$refs.Step0Ref.formData.taskLevel,
        taskRwyq: _this.$refs.Step0Ref.formData.taskRwyq,
        // step2
        cycleState: _this.$refs.Step2Ref.formData.cycleState,
        startTime: _this.$refs.Step2Ref.formData.startTime,
        endTime: _this.$refs.Step2Ref.formData.endTime,
        cycleType: _this.$refs.Step2Ref.formData.cycleType,
        cycleCustom: _this.$utilStr.splitArray(
          _this.$refs.Step2Ref.formData.cycleCustom,
          ','
        )
        // ishaveItem: _this.detailData.vo.ishaveItem,
        // ishaveObject: _this.detailData.vo.ishaveObject,
      };
      // Lambda写法
      editTask(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, msg } = response.data;
          if (success) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: msg,
              type: 'success'
            });
            _this.visible = false;
            _this.$emit('update-list');
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>

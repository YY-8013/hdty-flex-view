<template>
  <div class="con-single-step">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="0">
      <hd-component
        :model="extendData"
        ref="componentRef">

        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-document"></i>
              任务要求
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <!--任务名称-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span class="required">任务名称</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="taskContent">
                            <el-input
                              v-model="formData.taskContent"
                              placeholder="请输入任务名称"
                              maxlength="500">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--任务类型-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span class="required">任务类型</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="taskMode">
                            <hd-dict-radio
                              v-model="formData.taskMode"
                              :dict-code="$global.dictType.rwlx"
                              type="button">
                            </hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--任务等级-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span class="required">任务等级</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="taskLevel">
                            <hd-dict-radio
                              v-model="formData.taskLevel"
                              :dict-code="$global.dictType.rwdj"
                              type="button">
                            </hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--任务要求-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>任务要求</span></label>
                      <div class="p-div p-div3">
                        <div class="text-div">
                          <el-form-item prop="taskRwyq">
                            <el-input
                              type="textarea"
                              :rows="3"
                              v-model="formData.taskRwyq"
                              placeholder="请输入任务要求"
                              maxlength="2000">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--附件内容-->
                  <div class="form-row" v-if="showFileRwfj">
                    <div class="form-item-24 form-item">
                      <label class="label"><span>附件内容</span></label>
                      <div class="p-div p-divs" style="padding: 8px;">
                        <biz-file-rwzx ref="fileListRef"></biz-file-rwzx>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>

      </hd-component>
    </el-form>
  </div>
</template>

<script>
  import {hdForm} from "@/utils/util-framework";

  export default {
    name: "Step0",
    props: {
      // 是否显示附件
      showFileRwfj: {
        type: Boolean,
        default: true
      }
    },
    provide() {
      return {
        Step0: this
      };
    },
    // inject: ['NewTaskCenterDisAdd'],
    mixins: [hdForm],
    data() {
      return {
        // 表单
        formData: {
          taskContent: '',
          taskMode: '',
          taskLevel: '',
          taskRwyq: '',
        },
        // 表单扩展
        extendData: {},
        // 验证
        rules: {
          taskContent: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          taskMode: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ],
          taskLevel: [
            { required: true, message: '请选择任务等级', trigger: 'change' }
          ],
        },
      };
    },
    methods: {
      // 重置
      resetForm() {
        this.$refs.formRef.resetFields();
        this.$refs.componentRef.resetFields();
        this.$refs.fileListRef.idList = [];
        this.$refs.fileListRef.urlList = [];
        this.$refs.fileListRef.nameList = [];
      },
      // 任务编辑使用
      editDetail(row) {
        this.formData.taskContent = row.vo.taskContent;
        this.formData.taskMode = row.vo.taskMode;
        this.formData.taskLevel = row.vo.taskLevel;
        this.formData.taskRwyq = row.vo.taskRwyq;
      },
      // 验证表单
      validateForm() {
        return new Promise((resolve, reject) => {
          this.$refs.formRef.validate((valid) => {
            if (valid) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .con-single-step {
    width: 100%;
    height: 100%;
  }
</style>

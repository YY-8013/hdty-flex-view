<template>
  <div class="con-single-step">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
      <hd-component :model="extendData" ref="componentRef">
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-document"></i>
              指派对象
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div slot="header" class="clearfix">
                <div class="base">
                  <i class="el-icon-date"></i>
                  任务时间
                </div>
              </div>
              <div class="body">
                <div class="form">
                  <!--任务时间类型-->
                  <div class="form-row form-row-radio-button">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">任务时间类型</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cycleState">
                            <el-radio-group v-model="formData.cycleState" size="small">
                              <el-radio-button label="1" key="1">单次任务</el-radio-button>
                              <el-radio-button label="2" key="2">周期任务</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--任务开始时间、任务结束时间-->
                  <div class="form-row">
                    <div class="form-item-12 form-item">
                      <label class="label">
                        <span class="required">任务开始时间</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="startTime">
                            <hd-date-picker
                              type="datetime"
                              v-model="formData.startTime"
                              value-format="yyyyMMddHHmmss"
                              placeholder="请选择任务开始时间"
                            ></hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-12 form-item">
                      <label class="label">
                        <span class="required">任务结束时间</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="endTime">
                            <hd-date-picker
                              type="datetime"
                              default-time="23:59:59"
                              v-model="formData.endTime"
                              value-format="yyyyMMddHHmmss"
                              placeholder="请选择任务结束时间"
                            ></hd-date-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--任务周期类型-->
                  <div class="form-row" v-if="formData.cycleState === '2'">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">任务周期类型</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cycleType">
                            <hd-dict-radio
                              v-model="formData.cycleType"
                              :dict-code="$global.dictType.rwTimeType"
                              type="button"
                            ></hd-dict-radio>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--自定义周期-->
                  <div
                    class="form-row form-row-checkbox-button"
                    v-if="
                      formData.cycleState === '2' && formData.cycleType === '5'
                    "
                  >
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span :class="formData.cycleType === '5' ? 'required' : ''">自定义周期</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="cycleCustom">
                            <el-checkbox-group v-model="formData.cycleCustom" size="small">
                              <el-checkbox-button label="星期一" key="1">星期一</el-checkbox-button>
                              <el-checkbox-button label="星期二" key="2">星期二</el-checkbox-button>
                              <el-checkbox-button label="星期三" key="3">星期三</el-checkbox-button>
                              <el-checkbox-button label="星期四" key="4">星期四</el-checkbox-button>
                              <el-checkbox-button label="星期五" key="5">星期五</el-checkbox-button>
                              <el-checkbox-button label="星期六" key="6">星期六</el-checkbox-button>
                              <el-checkbox-button label="星期日" key="7">星期日</el-checkbox-button>
                            </el-checkbox-group>
                          </el-form-item>
                        </div>
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
import { hdForm } from '@/utils/util-framework';

export default {
  name: 'Step2',
  provide() {
    return {
      Step2: this
    };
  },
  mixins: [hdForm],
  components: {},
  data() {
    return {
      // 表单
      formData: {
        startTime: '',
        endTime: '',
        cycleState: '',
        cycleType: '',
        cycleCustom: []
        // allowAllMjDel: "0",
        // taskBllx: "1",
      },
      // 表单扩展
      extendData: {
        gmsfhmList: [],
        orgIdList: []
      },
      // 验证
      rules: {
        startTime: [
          { required: true, message: '请选择任务开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择任务结束时间', trigger: 'change' }
        ],
        cycleState: [
          { required: true, message: '请选择任务时间类型', trigger: 'change' }
        ],
        cycleType: [
          { required: true, message: '请选择任务周期类型', trigger: 'change' }
        ],
        cycleCustom: [
          { required: true, message: '请选择自定义周期', trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    'formData.cycleState': function (val) {
      // 如果是单次任务，则开始时间默认为今天
      // if (val === "1") {
      //   this.formData.startTime = this.$utilDate.dateFtt(
      //     new Date(),
      //     "yyyyMMddHHmmss"
      //   );
      // }
    },
    'formData.startTime': function (val) {
      // 开始时间必须小于结束时间
      if (
        this.formData.endTime &&
        this.formData.startTime >= this.formData.endTime
      ) {
        this.formData.startTime = '';
        this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '开始时间必须小于结束时间',
          type: 'warning'
        });
      }
    },
    'formData.endTime': function (val) {
      // 开始时间必须小于结束时间
      if (
        this.formData.startTime &&
        this.formData.endTime <= this.formData.startTime
      ) {
        this.formData.endTime = '';
        this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '结束时间必须大于开始时间',
          type: 'warning'
        });
      }
    }
  },
  methods: {
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    // 回显数据 任务编辑使用
    editDetail(row) {
      this.formData.startTime = row.vo.startTime;
      this.formData.endTime = row.vo.endTime;
      this.formData.cycleState = row.vo.cycleState;
      this.formData.cycleType = row.vo.cycleType;
      this.formData.cycleCustom =
        row.vo.cycleCustom && row.vo.cycleCustom != null
          ? row.vo.cycleCustom.split(',')
          : [];
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
    }
  }
};
</script>

<style lang="scss" scoped>
.con-single-step {
  width: 100%;
  height: 100%;
  .form-row-checkbox-button {
    ::v-deep .el-checkbox-group {
      .el-checkbox-button {
        .el-checkbox-button__inner {
          border-color: #e8e8e8;
          background-color: #fff;
        }
        &.is-checked {
          .el-checkbox-button__inner {
            border-color: #1194fb;
            background-color: #1194fb;
          }
        }
      }
    }
  }
  .form-row-radio-button {
    ::v-deep .el-radio-group {
      .el-radio-button {
        .el-radio-button__inner {
          border-color: #e8e8e8;
          background-color: #fff;
        }
        &.is-checked {
          .el-radio-button__inner {
            border-color: #1194fb;
            background-color: #1194fb;
          }
        }
      }
    }
  }
  .con-empty-ppdx {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    i {
      font-size: 17px;
      margin-top: -2px;
    }
  }
}
</style>

<template>
  <el-dialog
    title="新增"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <biz-form-card title="流动信息">
          <biz-form>
            <biz-form-row>
              <biz-form-item
                label="来&ensp;源&ensp;地"
                :required="true"
                :span="24"
              >
                <el-form-item prop="lyd">
                  <hd-region
                    v-model="formData.lyd"
                    :model-text.sync="formData.lydText"
                    :filterCity="false"
                    showLevel="2"
                    :checkLevel="2"
                    placeholder="请选择来源地"
                  ></hd-region>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <biz-form-row>
              <biz-form-item
                label="来我市目的"
                :required="true"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="lwsmd">
                  <el-input
                    type="textarea"
                    v-model="formData.lwsmd"
                    :autosize="{ minRows: 1, maxRows: 3 }"
                    placeholder="请输入来我市目的"
                    maxlength="500"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <biz-form-row>
              <biz-form-item label="到达日期" :required="true" :span="12">
                <el-form-item prop="ddsj">
                  <hd-date-picker
                    type="date"
                    v-model="formData.ddsj"
                    value-format="yyyyMMdd"
                    placeholder="请选择到达日期"
                  ></hd-date-picker>
                </el-form-item>
              </biz-form-item>
              <biz-form-item label="到达交通工具" :required="true" :span="12">
                <el-form-item prop="ddJtgjList">
                  <hd-dict-select
                    v-model="formData.ddJtgjList"
                    :dict-code="$global.dictType.jtgjType"
                    :model-text.sync="formData.ddJtgjTextList"
                    :multiple="true"
                    placeholder="请选择交通工具"
                  ></hd-dict-select>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <biz-form-row>
              <biz-form-item
                label="目&ensp;的&ensp;地"
                :required="false"
                :span="24"
              >
                <el-form-item prop="mdd">
                  <hd-region
                    v-model="formData.mdd"
                    :model-text.sync="formData.mddText"
                    :filterCity="false"
                    showLevel="2"
                    :checkLevel="2"
                    placeholder="请选择目的地"
                  ></hd-region>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
            <biz-form-row>
              <biz-form-item label="离开日期" :required="false" :span="12">
                <el-form-item prop="lksj">
                  <hd-date-picker
                    type="date"
                    v-model="formData.lksj"
                    value-format="yyyyMMdd"
                    placeholder="请选择离开日期"
                  ></hd-date-picker>
                </el-form-item>
              </biz-form-item>
              <biz-form-item label="离开交通工具" :required="false" :span="12">
                <el-form-item prop="lkJtgjList">
                  <hd-dict-select
                    v-model="formData.lkJtgjList"
                    :dict-code="$global.dictType.jtgjType"
                    :model-text.sync="formData.lkJtgjTextList"
                    :multiple="true"
                    placeholder="请选择交通工具"
                  ></hd-dict-select>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>

            <biz-form-row>
              <biz-form-item
                label="备&emsp;&emsp;注"
                :required="false"
                :span="24"
                pClass="p-divs"
              >
                <el-form-item prop="memo">
                  <el-input
                    type="textarea"
                    v-model="formData.memo"
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    placeholder="请输入备注"
                    maxlength="500"
                  ></el-input>
                </el-form-item>
              </biz-form-item>
            </biz-form-row>
          </biz-form>
        </biz-form-card>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";

export default {
  name: "BizRyldxxAdd",
  provide() {
    return {
      BizRyldAdd: this
    };
  },
  inject: ["BizList"],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示与隐藏
      visible: false,
      // 表单信息
      formData: {
        ddJtgjList: [],
        ddJtgjTextList: [],
        ddsj: "",
        lkJtgjList: [],
        lkJtgjTextList: [],
        lksj: "",
        lwsmd: "",
        lydText: "",
        mddText: "",
        memo: ""
      },
      // 验证
      rules: {
        lyd: [{ required: true, message: "请选择来源地", trigger: "change" }],
        ddsj: [
          { required: true, message: "请选择达到时间", trigger: "change" }
        ],
        ddJtgjList: [
          { required: true, message: "请选择达到交通工具", trigger: "change" }
        ],
        lwsmd: [
          { required: true, message: "请输入来我市目的", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 加载之前
    beforeLoadForm() {},
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.$emit("currentChange", _this.formData);
          _this.cancelForm();
        }
      });
    },

    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    }
  }
};
</script>

<style lang="scss" scoped></style>

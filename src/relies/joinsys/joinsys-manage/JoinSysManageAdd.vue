<template>
  <el-dialog title="添加接入系统信息" :visible.sync="visible" append-to-body>
    <hd-pane fit v-loading="submitting">
      <el-form
        :model="fromData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-row>
            <el-col :span="24">
              <el-form-item label="系统名称" prop="systemName">
                <el-input
                  v-model="fromData.systemName"
                  placeholder="请输入系统名称"
                  maxlength="100"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="系统AppId" prop="systemAppid">
                <el-input
                  v-model="fromData.systemAppid"
                  placeholder="请输入系统AppId(唯一标识)"
                  maxlength="32"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="使用AppId过滤"
                prop="clientType"
                label-width="120px"
              >
                <hd-dict-radio
                  v-model="fromData.isAppIdFilterData"
                  :dict-code="$global.dictType.isOrNot"
                  underline
                >
                </hd-dict-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="访问地址" prop="systemServerAddress">
                <el-input
                  v-model="fromData.systemServerAddress"
                  placeholder="请输入系统访问地址"
                  maxlength="200"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="Api地址" prop="systemApiAddress">
                <el-input
                  v-model="fromData.systemApiAddress"
                  placeholder="请输入子系统Api地址"
                  maxlength="200"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              label="是否地址路由"
              prop="enableUrlRouters"
              label-width="120px"
            >
              <hd-dict-radio
                v-model="fromData.enableUrlRouters"
                :dict-code="$global.dictType.isOrNot"
                underline
              >
              </hd-dict-radio>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="所属企业" prop="companyName">
                <el-input
                  v-model="fromData.companyName"
                  placeholder="请输入系统所属企业"
                  maxlength="100"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="负 责 人" prop="dutyPerson">
                <el-input
                  v-model="fromData.dutyPerson"
                  placeholder="请输入系统负责人姓名"
                  maxlength="30"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="联系电话" prop="dutyPhone">
                <el-input
                  v-model="fromData.dutyPhone"
                  placeholder="请输入系统负责人联系电话"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="备  注" prop="memo">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  v-model="fromData.memo"
                  placeholder="请输入备注"
                  maxlength="200"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import { add } from "@/api/joinsys-manage";
export default {
  name: "JoinSysManageAdd",
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ["hdList"],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      fromData: {
        systemName: "",
        systemAppid: "",
        systemServerAddress: "",
        systemApiAddress: "",
        enableUrlRouters: this.$global.dictItem.isOrNot.not,
        companyName: "",
        dutyPerson: "",
        dutyPhone: "",
        isAppIdFilterData: this.$global.dictItem.isOrNot.not,
        memo: ""
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        systemName: [
          { required: true, message: "请输入系统名称", trigger: "blur" }
        ],
        systemAppid: [
          { required: true, message: "请输入系统AppId", trigger: "blur" },
          { min: 3, max: 32, message: "长度在 3 到 32 个字符", trigger: "blur" }
        ],
        systemServerAddress: [
          { required: true, message: "请输入系统访问地址", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入系统所属企业", trigger: "blur" }
        ],
        dutyPerson: [
          { required: true, message: "请输入系统负责人姓名", trigger: "blur" }
        ],
        dutyPhone: [
          {
            required: true,
            message: "请输入系统负责人联系电话",
            trigger: "blur"
          },
          { validator: this.$utilValidate.validateMobile, trigger: "blur" }
        ],
        enableUrlRouters: [
          { required: true, message: "请选择是否地址路由", trigger: "change" }
        ]
      },
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      // 加载表单
      this.loadForm();
    },
    // 加载表单
    loadForm() {},
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.submitting = true;
          // 参数
          let dataParams = {
            ..._this.fromData
          };
          // Lambda写法
          add(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                _this.resetForm();
                _this.hdList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              _this.submitting = false;
            });
        }
      });
    },
    // 取消
    cancelForm() {
      this.resetForm();
      this.visible = false;
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>

<style scoped></style>

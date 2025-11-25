<template>
  <el-dialog title="编辑" :visible.sync="visible" custom-class="hdty-dialog-medium" append-to-body>
    <hd-pane fit v-loading="handleLoading">
      <el-form
        :model="editData"
        :rules="rules"
        ref="formRef"
        label-width="80px"
        @keyup.enter.native="submitForm"
      >
        <!--基础配置-->
        <el-form-item label="管辖机构" prop="orgid">
          <hd-organ
            v-model="editData.orgid"
            :model-text.sync="editData.orgidText"
            disabled
            placeholder="请选择管辖机构"
            underline
          ></hd-organ>
        </el-form-item>

        <!--分数配置-->
        <div class="listContainer">
          <el-button
            type="success"
            icon="el-icon-plus"
            class="addDocBtn"
            circle
            @click="handleScoreAdd"
          ></el-button>
          <el-form-item label="分数配置">
            <el-row class="score-row" v-for="(item, index) in editData.scoreList" :key="index">
              <el-col :span="24">
                <el-col :span="22">
                  <el-col :span="12">
                    <el-form-item
                      label="分数分值"
                      :prop="'scoreList.' + index + '.vo.score'"
                      :rules="[{ validator: validateScore, trigger: 'blur' }]"
                    >
                      <el-input
                        v-model.number="item.vo.score"
                        placeholder="请输入分值"
                        maxlength="3"
                        underline
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分数等级" :prop="'scoreList.' + index + '.vo.levelCode'">
                      <hd-dict-select
                        v-model="item.vo.levelCode"
                        :dictCode="$global.dictType.zdrygkdj"
                        :model-text.sync="item.vox.levelCode"
                        filterable
                        placeholder="请选择等级"
                        underline
                      ></hd-dict-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分数频率" :prop="'scoreList.' + index + '.vo.gkplKey'">
                      <hd-dict-select
                        v-model="item.vo.gkplKey"
                        :dictCode="$global.dictType.zdrygkpl"
                        :model-text.sync="item.vox.gkplKey"
                        filterable
                        placeholder="请选择频率"
                        underline
                      ></hd-dict-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分数颜色" :prop="'scoreList.' + index + '.vo.colorKey'">
                      <hd-dict-select
                        v-model="item.vo.colorKey"
                        :dictCode="$global.dictType.zdrygkys"
                        :model-text.sync="item.vox.colorKey"
                        filterable
                        placeholder="请选择颜色"
                        underline
                      ></hd-dict-select>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="2">
                  <el-col :span="24" class="score-fourth-col">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="handleScoreDelete(index)"
                      :disabled="editData.docList.length <= 1"
                    ></el-button>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <!--附件配置-->
        <div class="listContainer">
          <el-button
            type="success"
            icon="el-icon-plus"
            class="addDocBtn"
            circle
            @click="handleDocAdd"
          ></el-button>
          <el-form-item label="附件配置">
            <el-row class="score-row" v-for="(item, index) in editData.docList" :key="index">
              <el-col :span="24">
                <el-col :span="22">
                  <el-col :span="12">
                    <el-form-item label="业务类型" :prop="'docList.' + index + '.vo.ywlx'">
                      <hd-dict-select
                        v-model="item.vo.ywlx"
                        :dictCode="$global.dictType.businessType"
                        :model-text.sync="item.vox.ywlx"
                        filterable
                        placeholder="请选择业务类型"
                        underline
                      ></hd-dict-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="人员类型" :prop="'docList.' + index + '.vo.zdrylx'">
                      <hd-dict-cascader
                        v-model="item.vo.zdrylx"
                        :model-text.sync="item.vox.zdrylx"
                        :dict-code="$global.dictType.gzryType"
                        :check-strictly="false"
                        multiple
                        placeholder="请选择人员类型"
                        bigCascaderPane7
                        underline
                      ></hd-dict-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="附件类型" :prop="'docList.' + index + '.vo.allDocs'">
                      <el-select
                        v-model="item.vo.allDocs"
                        placeholder="请选择附件类型"
                        multiple
                        filterable
                        @change="handleAllChange(index)"
                        underline
                        collapse-tags
                        class="multiple-select"
                      >
                        <el-option
                          v-for="items in baseDictionary"
                          :key="items.id"
                          :label="items.value"
                          :value="items.key"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="必选附件" :prop="'docList.' + index + '.vo.requiredDocs'">
                      <el-select
                        v-model="item.vo.requiredDocs"
                        placeholder="请选择必选附件"
                        multiple
                        filterable
                        underline
                        collapse-tags
                        class="multiple-select"
                      >
                        <el-option
                          v-for="items in item.vo.allDocs"
                          :key="items"
                          :label="handleDocName(items)"
                          :value="items"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="2">
                  <el-col :span="24" class="score-fourth-col">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="handleDocDelete(index)"
                      :disabled="editData.docList.length <= 1"
                    ></el-button>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <!--审批配置-->
        <div class="listContainer">
          <el-button
            type="success"
            icon="el-icon-plus"
            class="addDocBtn"
            circle
            @click="handleApproveAdd"
          ></el-button>
          <el-form-item label="审批配置">
            <el-row class="score-row" v-for="(item, index) in editData.spList" :key="index">
              <el-col :span="24">
                <el-col :span="22">
                  <el-col :span="12">
                    <el-form-item label="业务类型" :prop="'spList.' + index + '.vo.ywlx'">
                      <hd-dict-select
                        v-model="item.vo.ywlx"
                        :dictCode="$global.dictType.approveBusType"
                        :model-text.sync="item.vox.ywlx"
                        filterable
                        placeholder="请选择业务类型"
                        underline
                      ></hd-dict-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="人员类型" :prop="'spList.' + index + '.vo.zdrylx'">
                      <hd-dict-cascader
                        v-model="item.vo.zdrylx"
                        :model-text.sync="item.vox.zdrylx"
                        :dict-code="$global.dictType.gzryType"
                        :check-strictly="false"
                        multiple
                        placeholder="请选择人员类型"
                        bigCascaderPane7
                        underline
                      ></hd-dict-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="审批级别" :prop="'spList.' + index + '.vo.spLevel'">
                      <hd-dict-select
                        v-model="item.vo.spLevel"
                        :dictCode="$global.dictType.orgLevel"
                        :model-text.sync="item.vox.spLevel"
                        multiple
                        collapseTags
                        :removeOption="['1', '6', '7']"
                        placeholder="请选择审批级别"
                        underline
                      ></hd-dict-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否启用" :prop="'spList.' + index + '.vo.enabled'">
                      <el-select
                        v-model="item.vo.enabled"
                        placeholder="请选择是否启用"
                        clearable
                        underline
                      >
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="2">
                  <el-col :span="24" class="score-fourth-col">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="handleApproveDelete(index)"
                      :disabled="editData.spList.length <= 1"
                    ></el-button>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { hdForm } from '@/utils/util-framework';
import { getList } from '@/api/dict-item';
import { add, detail } from './api';

export default {
  name: 'DeployEdit',
  provide() {
    return {
      hdAdd: this
    };
  },
  components: {},
  inject: ['hdList'],
  mixins: [hdList, hdForm],
  data() {
    return {
      // 基础字典集合
      baseDictionary: [],
      // 基础字典key集合
      baseKeyDictionary: [],
      // 基础字典value集合
      baseValueDictionary: [],
      // 表单
      editData: {
        orgid: '',
        orgidText: '',
        scoreList: [{ vo: {}, vox: {} }],
        docList: [{ vo: {}, vox: {} }],
        spList: [{ vo: {}, vox: {} }]
      },
      rules: {
        orgid: [
          { required: true, message: '请选择管辖机构', trigger: 'change' }
        ]
      },
      // 显示
      visible: false
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (!val) {
          this.resetForm();
        }
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    // 表单加载之前
    beforeLoadForm() {
      // 加载字典数据
      this.loadFileList();
      // 加载表单
      this.loadForm();
    },
    // 加载字典数据
    loadFileList() {
      let _this = this;
      // 参数
      let dataParams = {
        ascs: ['F_ORDER'],
        descs: [],
        excludeKeys: [],
        typeId: _this.$global.dictType.annexType
      };
      getList(dataParams)
        .then((response) => {
          let { data } = response.data;
          _this.baseDictionary = data;
          _this.baseDictionary.forEach((item) => {
            _this.baseKeyDictionary.push(item.key);
            _this.baseValueDictionary.push(item.value);
          });
        })
        .catch((error) => {
          // 响应错误回调
          console.log(error);
        });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.handleLoading = true;
      // 参数
      let dataParams = {
        orgid: _this.row.vo.orgid
      };
      // Lambda写法
      detail(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 管辖机构
            _this.editData.orgid = data.vo.orgid;
            _this.editData.orgidText = data.vox.orgid;
            // 分数配置
            if (data.vo.scoreList && data.vo.scoreList.length > 0) {
              _this.editData.scoreList = data.vo.scoreList;
            }
            // 附件配置
            if (data.vo.docList && data.vo.docList.length > 0) {
              // 以下方法为了解决多选列表除第一项外多选框不显示文字的问题
              for (let i = 0; i < data.vo.docList.length; i++) {
                _this.editData.docList.push({ vo: {}, vox: {} });
              }
              _this.$nextTick(() => {
                _this.editData.docList = data.vo.docList;
              });
            }
            // 审批配置
            if (data.vo.spList && data.vo.spList.length > 0) {
              // 以下方法为了解决多选列表除第一项外多选框不显示文字的问题
              for (let i = 0; i < data.vo.spList.length; i++) {
                _this.editData.spList.push({ vo: {}, vox: {} });
              }
              _this.$nextTick(() => {
                _this.editData.spList = data.vo.spList;
              });
            }
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.log(error);
        })
        .finally(() => {
          _this.handleLoading = false;
        });
    },
    // 验证分数是否有相同值
    validateScore(rule, value, callback) {
      if (value) {
        const reg = /^(0{1}|[1-9]\d{0,3}|.{0})$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的分数'));
        } else {
          let mun = 0;
          this.editData.scoreList.forEach((item) => {
            if (value === item.vo.score) mun++;
          });
          if (mun > 1) {
            callback(new Error('该分数值已存在'));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    },
    // 分数项新增
    handleScoreAdd() {
      if (this.editData.scoreList.length < 3) {
        this.editData.scoreList.push({ vo: {}, vox: {} });
      } else {
        this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '分数最多允许配置三项',
          type: 'error'
        });
      }
    },
    // 分数项删除
    handleScoreDelete(index) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.editData.scoreList.splice(index, 1);
        });
    },
    // 附件新增项
    handleDocAdd() {
      this.editData.docList.push({ vo: {}, vox: {} });
    },
    // 附件项删除
    handleDocDelete(index) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.editData.docList.splice(index, 1);
        });
    },
    // 审批新增项
    handleApproveAdd() {
      this.editData.spList.push({ vo: {}, vox: {} });
    },
    // 审批项删除
    handleApproveDelete(index) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.editData.spList.splice(index, 1);
        });
    },
    // 格式化提交数据
    formatData() {
      let dataParams = {
        orgid: '',
        scoreList: [],
        docList: [],
        spList: []
      };
      // 管辖机构
      dataParams.orgid = this.editData.orgid;
      // 分数
      this.editData.scoreList.forEach((item) => {
        if (
          item.vo.score &&
          item.vo.levelCode &&
          item.vo.gkplKey &&
          item.vo.colorKey
        ) {
          dataParams.scoreList.push({
            colorKey: item.vo.colorKey,
            gkplKey: item.vo.gkplKey,
            levelCode: item.vo.levelCode,
            score: item.vo.score
          });
        }
      });
      // 附件
      this.editData.docList.forEach((item) => {
        if (
          item.vo.ywlx &&
          item.vo.zdrylx &&
          item.vo.allDocs &&
          item.vo.requiredDocs
        ) {
          dataParams.docList.push({
            ywlx: item.vo.ywlx,
            zdrylx: item.vo.zdrylx,
            allDocs: item.vo.allDocs,
            requiredDocs: item.vo.requiredDocs
          });
        }
      });
      // 审批
      this.editData.spList.forEach((item) => {
        if (
          item.vo.ywlx &&
          item.vo.zdrylx &&
          item.vo.spLevel &&
          item.vo.enabled
        ) {
          dataParams.spList.push({
            ywlx: item.vo.ywlx,
            zdrylx: item.vo.zdrylx,
            spLevel: item.vo.spLevel,
            enabled: item.vo.enabled
          });
        }
      });
      return dataParams;
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 全部为空时的验证
          let scoreStatus = true;
          _this.editData.scoreList.forEach((item) => {
            if (
              !item.vo.score &&
              !item.vo.levelCode &&
              !item.vo.gkplKey &&
              !item.vo.colorKey
            ) {
              // 都无值则可以通过
            } else {
              scoreStatus = false;
            }
          });
          let docStatus = true;
          _this.editData.docList.forEach((item) => {
            if (
              !item.vo.ywlx &&
              (!item.vo.zdrylx || item.vo.zdrylx.length === 0) &&
              (!item.vo.allDocs || item.vo.allDocs.length === 0) &&
              (!item.vo.requiredDocs || item.vo.requiredDocs.length === 0)
            ) {
              // 都无值则可以通过
            } else {
              docStatus = false;
            }
          });
          let spStatus = true;
          _this.editData.spList.forEach((item) => {
            if (
              !item.vo.ywlx &&
              (!item.vo.zdrylx || item.vo.zdrylx.length === 0) &&
              (!item.vo.spLevel || item.vo.spLevel.length === 0) &&
              !item.vo.enabled
            ) {
              // 都无值则可以通过
            } else {
              spStatus = false;
            }
          });
          if (scoreStatus && docStatus && spStatus) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '请至少选择一项配置项',
              type: 'error'
            });
            return false;
          }
          // 分数验证
          let scoreValidate = true;
          _this.editData.scoreList.forEach((item) => {
            if (
              item.vo.score &&
              item.vo.levelCode &&
              item.vo.gkplKey &&
              item.vo.colorKey
            ) {
              // 都有值则可以通过
            } else if (
              !item.vo.score &&
              !item.vo.levelCode &&
              !item.vo.gkplKey &&
              !item.vo.colorKey
            ) {
              // 都无值则可以通过
            } else {
              scoreValidate = false;
            }
          });
          if (!scoreValidate) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '请将分数配置补充完整',
              type: 'error'
            });
            return false;
          }
          // 附件验证
          let docValidate = true;
          _this.editData.docList.forEach((item) => {
            if (
              item.vo.ywlx &&
              item.vo.zdrylx &&
              item.vo.zdrylx.length > 0 &&
              item.vo.allDocs &&
              item.vo.allDocs.length > 0
            ) {
              // 都有值则可以通过（必选附件为非必填）
            } else if (
              !item.vo.ywlx &&
              (!item.vo.zdrylx || item.vo.zdrylx.length === 0) &&
              (!item.vo.allDocs || item.vo.allDocs.length === 0) &&
              (!item.vo.requiredDocs || item.vo.requiredDocs.length === 0)
            ) {
              // 都无值则可以通过
            } else {
              docValidate = false;
            }
          });
          if (!docValidate) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '请将附件配置补充完整',
              type: 'error'
            });
            return false;
          }
          // 审批验证
          let spValidate = true;
          _this.editData.spList.forEach((item) => {
            if (
              item.vo.ywlx &&
              item.vo.zdrylx &&
              item.vo.zdrylx.length > 0 &&
              item.vo.spLevel &&
              item.vo.spLevel.length > 0 &&
              item.vo.enabled
            ) {
              // 都有值则可以通过
            } else if (
              !item.vo.ywlx &&
              (!item.vo.zdrylx || item.vo.zdrylx.length === 0) &&
              (!item.vo.spLevel || item.vo.spLevel.length === 0) &&
              !item.vo.enabled
            ) {
              // 都无值则可以通过
            } else {
              spValidate = false;
            }
          });
          if (!spValidate) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '请将审批配置补充完整',
              type: 'error'
            });
            return false;
          }
          _this.handleLoading = true;
          // 参数
          let dataParams = _this.formatData();
          // Lambda写法
          add(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.hdList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
            })
            .finally(() => {
              _this.handleLoading = false;
            });
        }
      });
    },
    // 全部附件变化时的操作
    handleAllChange(index) {
      this.editData.docList[index].vo.requiredDocs = [];
    },
    // 根据字典key获取字典value
    handleDocName(key) {
      return this.baseValueDictionary[this.baseKeyDictionary.indexOf(key)];
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.editData = {
        orgid: '',
        orgidText: '',
        scoreList: [{ vo: {}, vox: {} }],
        docList: [{ vo: {}, vox: {} }],
        spList: [{ vo: {}, vox: {} }]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.score-row {
  margin-bottom: 16px;
}

::v-deep .score-row .el-form-item__label {
  width: 100px !important;
}

::v-deep .score-row .el-form-item__content {
  margin-left: 100px !important;
}

.score-fourth-col {
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.score-fourth-col > div {
  height: 30px;
  width: 30px;
  border-radius: 3px;
}

.listContainer {
  position: relative;
  min-height: 80px;
}

::v-deep .is-circle {
  width: 30px !important;
  height: 30px !important;
  padding: 0 !important;
}

::v-deep .addDocBtn {
  position: absolute;
  // top: 40px;
  bottom: 50px;
  left: 25px;
  z-index: 10;
}

.multiple-select {
  ::v-deep .el-select__tags {
    .el-select__input {
      background: none !important;
      margin-left: 0;
    }
  }
}
</style>

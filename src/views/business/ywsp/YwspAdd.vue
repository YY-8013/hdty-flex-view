<template>
  <el-dialog
    title="业务审批配置 - 添加"
    :visible.sync="visible"
    custom-class="new-form"
    width="60%"
    append-to-body
  >
    <hd-pane fit v-loading="handleLoading">
      <el-form 
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <biz-form-card title="基础信息">
            <biz-form>
              <biz-form-row>
                <biz-form-item label="所属机构" :required="true" :span="24" pClass="p-divs">
                  <el-form-item prop="orgId">
                    <hd-organ
                      v-model="formData.orgId"
                      :model-text.sync="extendData.orgId"
                      placeholder="请选择所属机构"
                      :filterCode="userInfo.orgId.substring(0, 2) + '0000000000'"
                      showLevel="5"
                    ></hd-organ>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
              <biz-form-row>
                <biz-form-item label="审批是否启用" :required="true" :span="24">
                  <el-form-item prop="spEnable">
                    <hd-dict-radio
                      v-model="formData.spEnable"
                      :dict-code="$global.dictType.isOrNot"
                    ></hd-dict-radio>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
              <biz-form-row>
                <biz-form-item label="审批业务类型" :required="true" :span="24">
                  <el-form-item prop="spYwType">
                    <hd-dict-select
                      v-model="formData.spYwType"
                      :dict-code="$global.dictType.ywspType"
                      placeholder="请选择审批业务类型"
                    ></hd-dict-select>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
              <biz-form-row>
                <biz-form-item label="表单名称" :required="true" :span="24" pClass="p-divs">
                  <el-form-item prop="formId">
                    <biz-table-form-select
                      v-model="formData.formId"
                      :model-text.sync="extendData.formId"
                    ></biz-table-form-select>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
              <biz-form-row>
                <biz-form-item label="审批任务级别" :required="true" :span="24">
                  <el-form-item prop="spLevel">
                    <hd-dict-radio
                      v-model="formData.spLevel"
                      :dict-code="$global.dictType.rwdj"
                    ></hd-dict-radio>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
              <biz-form-row>
                <biz-form-item label="审批任务时限<br/>(单位：分钟)" :required="true" :span="12" pClass="p-divs">
                  <el-form-item prop="spTimer">
                    <hd-input-number
                      v-model="formData.spTimer"
                      :min="1"
                      :max="525600"
                      placeholder="请输入审批任务时限"
                      controls-position="right"
                    ></hd-input-number>
                  </el-form-item>
                </biz-form-item>
                <biz-form-item label="时限选项" :required="false" :span="12" pClass="p-divs">
                  <el-form-item prop="spTimerSelect">
                    <el-select v-model="formData.spTimerSelect" @change="handleChangeSpTimerSelect">
                      <el-option label="一天" :value="1440"></el-option>
                      <el-option label="七天" :value="10080"></el-option>
                      <el-option label="十五天" :value="21600"></el-option>
                      <el-option label="一个月" :value="43200"></el-option>
                      <el-option label="三个月" :value="129600"></el-option>
                    </el-select>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
              <biz-form-row>
                <biz-form-item label="备&emsp;&emsp;注" :required="false" :span="24" pClass="p-divs">
                  <el-form-item prop="memo">
                    <el-input
                      type="textarea"
                      v-model="formData.memo"
                      :rows="3"
                      placeholder="请输入备注"
                      maxlength="500"
                    ></el-input>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
            </biz-form>
          </biz-form-card>

          <biz-form-card title="审批步骤">
            <div>
              <el-steps direction="vertical" :active="formData.fkSpConfigList.length">
                <el-step
                  v-for="(stepItem,index) in formData.fkSpConfigList"
                  :key="`step-${index}`"
                  :title="`步骤 ${index + 1}`"
                >
                  <div slot="title" class="sp-step-header">
                    <div class="sp-step-title">步骤{{ index + 1 }}</div>
                    <div class="sp-step-btn">
                      <hd-button
                        v-if="formData.fkSpConfigList.length > 1 && index !== 0"
                        type="warning"
                        icon="el-icon-top"
                        circle
                        title="向上移动步骤"
                        @click="reorderStep(index, true)"
                      ></hd-button>
                      <hd-button
                        v-if="formData.fkSpConfigList.length > 1 && index !== formData.fkSpConfigList.length - 1"
                        type="primary"
                        icon="el-icon-bottom"
                        circle
                        title="向下移动步骤"
                        @click="reorderStep(index, false)"
                      ></hd-button>
                      <hd-button
                        type="success"
                        icon="el-icon-plus"
                        circle
                        title="向下插入新步骤"
                        @click="addStep(index)"
                      ></hd-button>
                      <hd-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        title="删除此步骤"
                        v-if="formData.fkSpConfigList.length > 1"
                        @click="deleteStep(index)"
                      ></hd-button>
                    </div>
                  </div>
                  <div slot="description">
                    <biz-form style="margin-bottom: 20px;">
                      <biz-form-row>
                        <biz-form-item label="审批模式" :required="true" :span="24">
                          <el-form-item
                            :prop="`fkSpConfigList.${index}.spMode`"
                            :rules="[{required: true, message: '请选择审批模式', trigger: 'change'}]"
                          >
                            <hd-dict-radio
                              v-model="stepItem.spMode"
                              :dict-code="$global.dictType.ywspMode"
                            ></hd-dict-radio>
                          </el-form-item>
                        </biz-form-item>
                      </biz-form-row>
                      <biz-form-row v-if="stepItem.spMode !== '2'">
                        <biz-form-item label="步骤适用级别" :required="true" :span="24">
                          <el-form-item
                            :prop="`fkSpConfigList.${index}.spMatchLevelList`"
                            :rules="[{required: true, message: '请选择步骤适用级别', trigger: 'change'}]"
                          >
                            <hd-dict-select
                              v-model="stepItem.spMatchLevelList"
                              :model-text.sync="stepItem.spMatchLevelTextList"
                              placeholder="请选择步骤适用级别"
                              multiple
                              :dict-code="$global.dictType.orgLevel"
                            ></hd-dict-select>
                          </el-form-item>
                        </biz-form-item>
                      </biz-form-row>
                      <biz-form-row v-if="stepItem.spMode === '2'">
                        <biz-form-item label="审批机构级别" :required="true" :span="24" p-class="p-divs">
                          <el-form-item
                            :prop="`fkSpConfigList.${index}.spOrgLevel`"
                            :rules="[{required: true, message: '请选择审批机构级别', trigger: 'change'}]"
                          >
                            <hd-dict-select
                              v-model="stepItem.spOrgLevel"
                              :model-text.sync="stepItem.spOrgLevelText"
                              placeholder="请选择审批机构级别"
                              :dict-code="$global.dictType.orgLevel"
                            ></hd-dict-select>
                          </el-form-item>
                        </biz-form-item>
                      </biz-form-row>
                      <biz-form-row v-if="stepItem.spMode === '0'">
                        <biz-form-item label="审批机构" :required="true" :span="24">
                          <el-form-item
                            :prop="`fkSpConfigList.${index}.spOrgId`"
                            :rules="[{required: true, message: '请选择审批机构', trigger: 'change'}]"
                          >
                            <hd-organ
                              v-model="stepItem.spOrgId"
                              :model-text.sync="stepItem.spOrgIdText"
                              :filterCode="userInfo.orgId.substring(0, 4) + '00000000'"
                              showLevel="5"
                            ></hd-organ>
                          </el-form-item>
                        </biz-form-item>
                      </biz-form-row>
                      <biz-form-row v-if="stepItem.spMode === '0'">
                        <biz-form-item label="机构匹配模式" :required="true" :span="24" p-class="p-divs">
                          <el-form-item
                            :prop="`fkSpConfigList.${index}.spOrgMatch`"
                            :rules="[{required: true, message: '请选择机构匹配模式', trigger: 'change'}]"
                          >
                            <hd-dict-radio
                              v-model="stepItem.spOrgMatch"
                              :model-text.sync="stepItem.spOrgMatchText"
                              :dict-code="$global.dictType.ywspOrgMatch"
                            ></hd-dict-radio>
                          </el-form-item>
                        </biz-form-item>
                      </biz-form-row>

                      <biz-form-row v-if="stepItem.spMode === '1'">
                        <biz-form-item label="审批人员" :required="true" :span="24">
                          <el-form-item
                            :prop="`fkSpConfigList.${index}.personIds`"
                            :rules="[{required: true, message: '请选择审批人员', trigger: 'change'}]"
                          >
                            <hd-table-select
                              v-model="stepItem.personIds"
                              :modelText.sync="stepItem.personNames"
                              :api="tableSelectOptions.api"
                              :props="tableSelectOptions.props"
                              :columns="tableSelectOptions.columns"
                              :searches="tableSelectOptions.searches"
                              multiple
                              placeholder="请选择审批人员"
                              @currentChanged="(currentKeys, oldValue, multipleData)=>changeSpPerson(currentKeys, oldValue, multipleData,index)"
                            ></hd-table-select>
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
                              v-model="stepItem.memo"
                              :rows="3"
                              placeholder="请输入备注"
                              maxlength="500"
                            ></el-input>
                          </el-form-item>
                        </biz-form-item>
                      </biz-form-row>
                    </biz-form>
                  </div>
                </el-step>
              </el-steps>
            </div>
          </biz-form-card>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>
 
<script>
import { hdForm, hdList } from '@/utils/util-framework';
import { add } from './api';
import { getZdryZrqPage } from '@/api/user';

export default {
  name: 'YwspEdit',
  provide() {
    return {
      YwspEdit: this
    };
  },
  components: {},
  inject: ['hdList'],
  mixins: [hdList, hdForm],
  data() {
    return {
      // 表单
      formData: {
        spYwType: '', // 审批业务类型
        spEnable: '1', // 审批是否启用
        formId: '', // 标准件
        spLevel: '1', // 审批级别
        spTimer: 43200, // 审批时限(分钟)
        spTimerSelect: 43200, // 审批时限选择
        orgId: '', // 机构ID
        memo: '', // 备注
        fkSpConfigList: [], // 关联审批配置
      },
      // 扩展表单
      extendData: {
        orgId: '', // 机构ID
      },
      // 验证
      rules: {
        spYwType: [
          { required: true, message: '请选择审批业务类型', trigger: 'change' }
        ],
        spEnable: [
          { required: true, message: '请选择审批是否启用', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        formId: [
          { required: true, message: '请选择标准件', trigger: 'change' }
        ],
        spLevel: [
          { required: true, message: '请选择审批任务级别', trigger: 'change' }
        ],
        spTimer: [
          { required: true, message: '请输入审批任务时限', trigger: 'blur' }
        ],
      },
      // 显示
      visible: false,
      // 行
      row: {},

      // 表格选择器配置项
      tableSelectOptions: {
        api: getZdryZrqPage,
        props: {
          value: 'vo.id',
          label: 'vo.xm',
          response: 'records'
        },
        columns: [
          {
            field: 'vo.xm',
            label: '警员姓名',
            width: '200'
          },
          {
            field: 'vo.gmsfhm',
            label: '身份证号',
            width: '200'
          },
          {
            field: 'vo.telephone',
            label: '联系电话',
            width: '180'
          },
          {
            field: 'vox.orgId',
            label: '所属机构',
            minWidth: '180'
          }
        ],
        searches: [
          [
            {
              field: 'xm',
              label: '警员姓名',
              type: 'input',
              placeholder: '请输入警员姓名'
            },
            {
              field: 'gmsfhm',
              label: '身份证号',
              type: 'input',
              placeholder: '请输入身份证号'
            }
          ],
          [
            {
              field: 'telephone',
              label: '联系电话',
              type: 'input',
              placeholder: '请输入联系电话'
            },
            {
              field: 'orgId',
              label: '所属机构',
              type: 'organSelect',
              placeholder: '请选择所属机构'
            }
          ]
        ]
      },

      // 用户信息
      userInfo: this.$utilPublic.getUserInfo(),
    };
  },
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        _this.initData();
      });
    },
    // 初始化数据
    initData() {
      let spConfig = {
        spOrder: 0, // 审批序号 (从一开始) ,
        spMode: '', // 审批模式（数据字典3798 0机构1人员） ,
        spMatchLevelList: [],
        spOrgId: '',
        spOrgLevel: '',
        spOrgMatch: '',
        spUserCardId: '',
        spUserId: '',
        spUserName: '',
        memo: '',
      };
      if (
        this.formData.fkSpConfigList &&
        this.formData.fkSpConfigList.length === 0
      ) {
        this.formData.fkSpConfigList.push(spConfig);
      }
    },
    // 添加步骤
    addStep(index) {
      let spConfig = {
        spOrder: 0, // 审批序号 (从一开始) ,
        spMode: '', // 审批模式（数据字典3798 0机构1人员） ,
        spMatchLevelList: [],
        spOrgId: '',
        spOrgLevel: '',
        spOrgMatch: '',
        spUserCardId: '',
        spUserId: '',
        spUserName: '',
        memo: '',
        spPersonList: [],
        personIds: [],
        personNames: []
      };
      this.formData.fkSpConfigList.splice(index + 1, 0, spConfig);
    },
    // 删除步骤
    deleteStep(index) {
      let _this = this;
      _this
        .$confirm('确定要删除此步骤吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.formData.fkSpConfigList.splice(index, 1);
        })
        .catch(() => {});
    },
    // 变更顺序
    reorderStep(index, flag) {
      const list = this.formData.fkSpConfigList; // 简化变量名
      const newIndex = flag ? index - 1 : index + 1; // 计算目标位置

      if (newIndex < 0 || newIndex >= list.length) return; // 防止越界

      const item = list[index]; // 取出当前元素
      list.splice(index, 1); // 删除原位置元素
      list.splice(newIndex, 0, item); // 插入到新位置
    },
    // 切换审批人员
    changeSpPerson(currentKeys, oldValue, multipleData, index) {
      // 组装最新的人员信息
      let personList = multipleData.map((personItem) => {
        return {
          spUserId: personItem.vo.id,
          spUserName: personItem.vo.xm,
          spUserCardId: personItem.vo.gmsfhm
        };
      });
      this.$set(
        this.formData.fkSpConfigList[index],
        'spPersonList',
        personList
      );
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          _this.handleLoading = true;
          // 参数
          let dataParams = {
            ..._this.formData
          };
          console.log('dataParams', dataParams);

          let spConfigList = _this.formData.fkSpConfigList.reduce(
            (pre, cur, index) => {
              // 如果是机构
              if (cur.spMode === '0') {
                let spItem = {
                  spOrder: index + 1,
                  spMode: cur.spMode,
                  spMatchLevelList: cur.spMatchLevelList,
                  spOrgId: cur.spOrgId,
                  spOrgIdText: cur.spOrgIdText,
                  spOrgMatch: cur.spOrgMatch,
                  spOrgMatchText: cur.spOrgMatchText,
                  spOrgLevel: cur.spOrgLevel,
                  spOrgLevelText: cur.spOrgLevelText
                };
                pre.push(spItem);
              }
              // 如果是人员
              else if (cur.spMode === '1') {
                let spPersonList = (cur.spPersonList || []).map((pItem) => {
                  return {
                    spOrder: index + 1,
                    spMode: cur.spMode,
                    spMatchLevelList: cur.spMatchLevelList,
                    spUserCardId: pItem.spUserCardId,
                    spUserId: pItem.spUserId,
                    spUserName: pItem.spUserName
                  };
                });
                pre = pre.concat(spPersonList);
              }
              // 如果是逐级审批
              else if (cur.spMode === '2') {
                let spItem = {
                  spOrder: index + 1,
                  spMode: cur.spMode,
                  spMatchLevelList: cur.spMatchLevelList,
                  spOrgId: cur.spOrgId,
                  spOrgIdText: cur.spOrgIdText,
                  spOrgMatch: cur.spOrgMatch,
                  spOrgMatchText: cur.spOrgMatchText,
                  spOrgLevel: cur.spOrgLevel,
                  spOrgLevelText: cur.spOrgLevelText
                };
                pre.push(spItem);
              }
              return pre;
            },
            []
          );

          console.log('spConfigList', spConfigList);
          dataParams.fkSpConfigRefList = spConfigList;

          // Lambda写法
          add(dataParams)
            .then((response) => {
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.cancelForm();
                _this.hdList.handleQuery();
              }
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              _this.handleLoading = false;
            });
        } else {
          _this.scrollIntoFormErrorView(error);
        }
      });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
      this.formData.fkSpConfigList = [];
    },
    // 选择审批时限
    handleChangeSpTimerSelect(val) {
      let _this = this;
      console.log('val', val);
      if (val) {
        _this.formData.spTimer = val;
      }
      //
      else {
        _this.formData.spTimer = '';
      }

    },
  }
};
</script>
 
<style lang="scss" scoped>
::v-deep .el-step__description {
  padding-right: 0;
}

.sp-step-header {
  display: flex;
  justify-content: space-between;
}
</style>
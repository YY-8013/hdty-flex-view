<template>
  <el-dialog
    title="处理"
    :visible.sync="visible"
    custom-class="hdty-dialog-large new-form"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="con-form-anchor">
      <div class="con-anchor">
        <div class="inner">
          <!--基本信息-->
          <div v-for="anchorItem in anchorList" :key="anchorItem.id">
            <div
              v-if="anchorItem.show"
              class="anchor-item anchor-item-menu"
              :class="{ 'is-active': activeAnchor === anchorItem.id }"
            >
              <a
                href="javascript:;"
                @click.prevent="handleAnchor(anchorItem.id)"
              >
                <i :class="anchorItem.iconClass"></i>
                <p>{{ anchorItem.label }}</p>
              </a>
            </div>
          </div>
          <!--回到顶部-->
          <div class="anchor-item">
            <a href="javascript:;" @click.prevent="handleAnchor('top1')">
              <i class="el-icon-caret-top"></i>
              <p>返回顶部</p>
            </a>
          </div>
        </div>
      </div>
      <div class="con-form">
        <hd-pane fit v-loading="loading || loadingForForm" :id="formId">
          <!--任务要求-->
          <div class="con-area" :id="anchorList[0].id">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                任务要求
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-document"></i>任务要求
                  </div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('1')"
                    >
                      <i class="el-icon-arrow-up" v-if="showRwyq"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <div class="body" v-show="showRwyq">
                  <div class="form">
                    <!--任务名称-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>任务名称</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            {{ formData.vo.taskContent }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--任务类型、任务等级-->
                    <div class="form-row">
                      <div class="form-item-12 form-item">
                        <label class="label">任务类型</label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <span
                              class="text-color-5"
                              v-show="formData.vo.taskMode === '1'"
                              >{{ formData.vox.taskMode }}</span
                            >
                            <span
                              class="text-color-4"
                              v-show="formData.vo.taskMode === '2'"
                              >{{ formData.vox.taskMode }}</span
                            >
                            <span
                              class="text-color-1"
                              v-show="formData.vo.taskMode === '3'"
                              >{{ formData.vox.taskMode }}</span
                            >
                          </div>
                        </div>
                      </div>
                      <div class="form-item-12 form-item">
                        <label class="label">
                          <span>任务等级</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <span
                              class="text-color-5"
                              v-show="formData.vo.taskLevel === '1'"
                              >{{ formData.vox.taskLevel }}</span
                            >
                            <span
                              class="text-color-4"
                              v-show="formData.vo.taskLevel === '2'"
                              >{{ formData.vox.taskLevel }}</span
                            >
                            <span
                              class="text-color-1"
                              v-show="formData.vo.taskLevel === '3'"
                              >{{ formData.vox.taskLevel }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--任务要求-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>任务要求</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">{{ formData.vo.taskRwyq }}</div>
                        </div>
                      </div>
                    </div>
                    <!--附件内容-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>附件内容</span>
                        </label>
                        <div class="p-div p-divs" style="padding: 8px">
                          <biz-file-rwzx
                            ref="fileListRef"
                            :showAddBtn="false"
                            :deleteFileSubItem="false"
                          ></biz-file-rwzx>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="body" v-show="!showRwyq">
                  <div class="con-display-body">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('1')"
                    >
                      点击展开详细信息
                      <i class="el-icon-arrow-down"></i>
                    </a>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!--任务对象-->
          <div class="con-area" :id="anchorList[1].id">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-aim"></i>
                任务对象
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base"><i class="el-icon-aim"></i>任务对象</div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('3')"
                    >
                      <i class="el-icon-arrow-up" v-if="showRwdx"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <div class="body" v-show="showRwdx">
                  <!--表格-->
                  <dynamic-table
                    ref="DynamicTableRef"
                    :allowEditField="false"
                    :allowDeleteField="false"
                    :allowEditData="false"
                    :allowDeleteData="false"
                  ></dynamic-table>
                </div>
                <div class="body" v-show="!showRwdx">
                  <div class="con-display-body">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('3')"
                    >
                      点击展开详细信息
                      <i class="el-icon-arrow-down"></i>
                    </a>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!--任务时间-->
          <div class="con-area" :id="anchorList[2].id">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-time"></i>
                任务时间
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base"><i class="el-icon-time"></i>任务时间</div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('4')"
                    >
                      <i class="el-icon-arrow-up" v-if="showRwsj"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <div class="body" v-show="showRwsj">
                  <div class="form">
                    <!--任务时间类型-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">任务时间类型</label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <div v-if="formData.vo.cycleState === '1'">
                              单次任务
                            </div>
                            <div v-if="formData.vo.cycleState === '2'">
                              周期任务
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--任务开始时间、任务结束时间-->
                    <div class="form-row">
                      <div class="form-item-12 form-item">
                        <label class="label">任务开始时间</label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            {{ formData.vox.startTime }}
                          </div>
                        </div>
                      </div>
                      <div class="form-item-12 form-item">
                        <label class="label">
                          <span>任务结束时间</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">{{ formData.vox.endTime }}</div>
                        </div>
                      </div>
                    </div>
                    <!--任务周期类型-->
                    <div class="form-row" v-if="formData.vo.cycleState === '2'">
                      <div class="form-item-24 form-item">
                        <label class="label">任务周期类型</label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <div class="text-color-4">
                              {{ formData.vox.cycleType }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--自定义周期-->
                    <div
                      class="form-row"
                      v-if="
                        formData.vo.cycleState === '2' &&
                        formData.vo.cycleCustom
                      "
                    >
                      <div class="form-item-24 form-item">
                        <label class="label">自定义周期</label>
                        <div class="p-div p-divs">
                          <div class="text-div flex">
                            <div
                              v-if="formData.vo.cycleCustom"
                              class="tag-plain border-color-5 text-color-5"
                              style="margin-right: 6px"
                              v-for="(
                                item, index
                              ) in formData.vo.cycleCustom.split(',')"
                              :key="index"
                            >
                              {{ item }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="body" v-show="!showRwsj">
                  <div class="con-display-body">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('4')"
                    >
                      点击展开详细信息
                      <i class="el-icon-arrow-down"></i>
                    </a>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 流转轨迹-->
          <div class="con-area" :id="anchorList[3].id">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-s-operation"></i>
                流转轨迹
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div class="body">
                  <biz-popover-xfgj
                    v-if="visible"
                    :taskId="row.vo.taskorgrecodeid"
                  ></biz-popover-xfgj>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 审批轨迹 -->
          <biz-spgj-list
            v-show="anchorList[4].show"
            :id="anchorList[4].id"
            ref="spgjListRef"
          ></biz-spgj-list>

          <!--处理信息-->
          <div class="con-area con-area-warning" :id="anchorList[5].id">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                处理信息
                <span v-if="rwForm.formTitle">【{{ rwForm.formTitle }}】</span>
              </div>
            </div>
            <div
              class="area-body"
              v-show="rwFormItemConfigList && rwFormItemConfigList.length > 0"
            >
              <dynamic-form
                ref="DynamicFormRef"
                :isForbid="false"
                :isDetail="false"
              ></dynamic-form>
            </div>
            <div
              class="area-body no-form-item"
              v-show="
                !rwFormItemConfigList || rwFormItemConfigList.length === 0
              "
            >
              {{ "暂无数据" }}
            </div>
          </div>
        </hd-pane>
      </div>
    </div>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取消任务办理</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        :disabled="!isCanSubmit"
        v-preventReClick
        >确定任务办理</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import { getTaskSubDetail, getFormDetail, handleSubTask } from "./../api";
import DynamicTable from "./../taskobject/DynamicTable";
import DynamicForm from "./../taskform/DynamicForm";
import { debounce } from "@/views/global/utils/util-common";
import BizPopoverXfgj from "../biz-popover-xfgj";

export default {
  name: "NewTaskCenterDelEdit",
  provide() {
    return {
      NewTaskCenterDelEdit: this,
      ParentPage: this
    };
  },
  inject: ["NewTaskCenterDelList"],
  mixins: [hdList, hdForm],
  components: {
    DynamicTable,
    DynamicForm,
    BizPopoverXfgj
  },
  data() {
    return {
      // 基础地址
      baseURL: appEnv.baseURL,
      // 显示
      visible: false,
      // 表单加载提示
      loadingForForm: false,
      // 表单id
      formId: "form" + this.$utilStr.uuid(32),
      // 动态为锚点添加id
      anchorList: [
        {
          label: "任务要求",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document",
          show: true
        },
        {
          label: "任务对象",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-aim",
          show: true
        },
        {
          label: "任务时间",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-time",
          show: true
        },
        {
          label: "流转轨迹",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-s-operation",
          show: true
        },
        {
          label: "审批轨迹",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-s-promotion",
          show: false
        },
        {
          label: "处理信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-s-promotion",
          show: true
        }
      ],
      anchorIds: [],

      // 当前滚动选中的锚点
      activeAnchor: "",
      // 是否为点击锚点操作
      clickAnchor: false,
      // 滚动元素距离滚动容器顶部的距离值集合
      scrollItemTopList: [],

      // 表单
      formData: {
        vo: {},
        vox: {}
      },

      // 显示子项（展开和收缩）
      showRwyq: true,
      showRwdx: true,
      showRwsj: true,

      // 任务对象列表
      objTableData: [],
      tableData: [],

      // 表单配置相关
      rwForm: {},
      rwFormItemConfigList: [],
      rwNformObjectList: [],

      // 行
      row: {
        vo: {},
        vox: {}
      },
      fixedFormData: {}, // 固定数据
      currentFormFixedProps: [], // 当前表单提交时，需要保存的固定表单项
      isCanSubmit: false,

      // 是否展示审批轨迹
      showSpgj: false
    };
  },
  mounted() {},

  methods: {
    // 加载之前
    beforeLoadForm() {
      let _this = this;
      _this.updateAnchorList();
      _this.$nextTick(() => {
        // 重置表单
        _this.resetForm();
        // 加载表单
        _this.loadForm();
        // 初始化滚动区域
        _this.initScrollBox();
      });
    },
    updateAnchorList() {
      this.anchorList = this.anchorList.map((item) => {
        switch (item.label) {
          case "任务要求":
            item.show = true;
            break;
          case "任务对象":
            item.show = true;
            break;
          case "任务时间":
            item.show = true;
            break;
          case "流转轨迹":
            item.show = true;
            break;
          case "审批轨迹":
            item.show = this.showSpgj;
            break;
          case "处理信息":
            item.show = true;
            break;
          default:
            item.show = true;
        }
        return item;
      });
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        id: _this.row.vo.taskUserRecodeId,
        orgRecodeId: _this.row.vo.taskorgrecodeid
      };
      // Lambda写法
      getTaskSubDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 赋值数据
            _this.formData.vo = data.rwNtaskDetail.vo || {};
            _this.formData.vox = data.rwNtaskDetail.vox || {};
            _this.formData.vo.taskUserRecodeId = _this.row.vo.taskUserRecodeId;
            _this.$refs.DynamicFormRef.taskRow = _this.formData;

            // 设置附件内容
            let fileIdList = [];
            let fileUrlList = [];
            let fileNameList = [];
            if (
              _this.formData.vo.fjxxList &&
              _this.formData.vo.fjxxList.length > 0
            ) {
              _this.formData.vo.fjxxList.forEach((item) => {
                if (item) {
                  fileIdList.push(item.fileId);
                  fileUrlList.push(item.fileUrl);
                  fileNameList.push(item.fileName);
                }
              });
            }
            _this.$refs.fileListRef.idList = fileIdList;
            _this.$refs.fileListRef.urlList = fileUrlList;
            _this.$refs.fileListRef.nameList = fileNameList;

            // 设置任务对象列表
            if (data.jsonObject) {
              _this.objTableData = [data.jsonObject];
              _this.tableData = [data.jsonObject];
            }

            // 如果是审批类型表单、并且有wybs（审批主键，则动态加载审批轨迹）
            let spgjFormId = _this.$storage.session
              .get("configData")
              .find((e) => e.key === "RW" && e.keyItem === "spgjFormId");
            let spgjFormIdList = spgjFormId ? spgjFormId.value.split(",") : [];

            _this.showSpgj =
              spgjFormIdList.includes(data.formId) &&
              data.jsonObject &&
              data.jsonObject.wybs;
            _this.updateAnchorList();

            _this.$nextTick(() => {
              if (_this.showSpgj && _this.$refs.spgjListRef) {
                _this.$refs.spgjListRef.initData(data.jsonObject.wybs);
              }
            });

            // 将当前表单的历史处理固定数据保存
            if (data.fixedFormData) {
              let fixedDataObj = {};

              // 这里将null、[]、''、{}的值对应的属性移除
              Object.keys(data.fixedFormData).forEach((key) => {
                if (
                  data.fixedFormData[key] !== null &&
                  data.fixedFormData[key] !== "" &&
                  data.fixedFormData[key].length !== 0 &&
                  JSON.stringify(data.fixedFormData[key]) !== "{}"
                ) {
                  fixedDataObj[key] = data.fixedFormData[key];
                }
              });
              _this.fixedFormData = [fixedDataObj];
            }
            // 加载表单详情（有表单的数据才请求表单数据）
            if (data.formId) {
              _this.loadFormForFormDetail(data.formId);
            }
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
    // 加载表单
    loadFormForFormDetail(formId) {
      let _this = this;
      _this.loadingForForm = true;
      _this.isCanSubmit = false;
      // 参数
      let dataParams = {
        id: formId
      };
      // Lambda写法
      getFormDetail(dataParams)
        .then(async (response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.isCanSubmit = true;
            // 赋值数据
            _this.rwForm = data.rwForm || {};
            // 这里根据配置逐个添加，如果遇到需要动态加载的字段，则需要动态获取接口进行添加
            let rwFormItemConfigListTemp = await _this.processFormItems(
              data.rwFormItemConfigList || []
            );

            _this.rwFormItemConfigList = (rwFormItemConfigListTemp || []).map(
              (formItem) => {
                _this.$set(
                  formItem,
                  "rules",
                  formItem.rules || {
                    required: false,
                    message: ""
                  }
                );
                // 如果是tableList 动态根据rowLength配置初始tableList
                if (formItem.type === "tableList") {
                  // 遍历tableProp表单各列，按sort顺序排序
                  formItem.tableProps.sort(
                    (a, b) => Number(a.order) - Number(b.order)
                  );
                }
                return formItem;
              }
            );
            _this.rwNformObjectList = data.rwNformObjectList || [];
            // 将配置的字段，给动态表单formData添加属性
            _this.rwFormItemConfigList.forEach((item) => {
              if (item.type !== "title") {
                if (item.type === "tableList") {
                  let formTableData = [];
                  if (!item.manualDisabled) {
                    for (let i = 0; i < Number(item.rowLength); i++) {
                      formTableData.push({
                        id: _this.$utilStr.uuid(32)
                      });
                    }
                  }
                  formTableData = formTableData.map((tableItem) => {
                    item.tableProps.forEach((propItem) => {
                      _this.$set(tableItem, propItem.prop, "");
                    });
                    return tableItem;
                  });
                  _this.$set(
                    _this.$refs.DynamicFormRef.formData,
                    item.prop,
                    formTableData
                  );
                } else {
                  _this.$set(
                    _this.$refs.DynamicFormRef.formData,
                    item.prop,
                    item.prop.startsWith("hdArray") ? [] : ""
                  );
                }
                // 如果是下拉框等，则需要添加翻译项
                if (
                  item.type === "select" ||
                  item.type === "selectTree" ||
                  item.type === "region" ||
                  item.type === "organ"
                ) {
                  _this.$set(
                    _this.$refs.DynamicFormRef.formData,
                    item.prop + "Text",
                    item.prop.startsWith("hdArray") ? [] : ""
                  );
                }

                // 如果对象属性和表单属性一样，则将对象中的值赋给表单
                if (_this.rwNformObjectList.find((i) => i.prop === item.prop)) {
                  if (_this.objTableData && _this.objTableData.length > 0) {
                    if (item.type === "tableList") {
                      if (
                        _this.objTableData[0][item.prop] &&
                        _this.objTableData[0][item.prop].length > 0
                      ) {
                        _this.$refs.DynamicFormRef.formData[item.prop] =
                          _this.objTableData[0][item.prop];
                      }
                    } else {
                      if (_this.objTableData[0][item.prop]) {
                        _this.$refs.DynamicFormRef.formData[item.prop] =
                          _this.objTableData[0][item.prop];
                      }
                    }

                    // 如果是下拉框等，则需要添加翻译项
                    if (
                      item.type === "select" ||
                      item.type === "selectTree" ||
                      item.type === "region" ||
                      item.type === "organ"
                    ) {
                      if (_this.objTableData[0][item.prop + "Text"]) {
                        _this.$refs.DynamicFormRef.formData[
                          item.prop + "Text"
                        ] = _this.objTableData[0][item.prop + "Text"];
                      }
                    }

                    // 如果是附件内容，需要特殊处理一下
                    if (
                      _this.objTableData[0][item.prop] &&
                      item.prop.startsWith("hdFile")
                    ) {
                      // 如果固定属性是附件的话，特殊处理一下
                      _this.$refs.DynamicFormRef.formData[item.prop] =
                        _this.dealFileListIds(_this.objTableData[0][item.prop]);
                      _this.$refs.DynamicFormRef.formData[
                        `${item.prop}FileList`
                      ] = _this.$utilStr.deepClone(
                        _this.dealFileListNew(_this.objTableData[0][item.prop])
                      );
                    }
                  }
                }
                // 如果是需要回显用户信息的配置项，则将当前用户信息赋值进去
                if (item.dynamicValueWeb) {
                  let dynamicValue = item.dynamicValueWeb;
                  for (var name in dynamicValue) {
                    if (dynamicValue[name]) {
                      _this.$refs.DynamicFormRef.formData[name] =
                        _this.$utilPublic.getUserInfo()[dynamicValue[name]];
                    }
                  }
                }
                // 如果当前字段是固定字段，则将历史已处理过的字段信息赋值进去
                if (item.isFixed === "1") {
                  _this.currentFormFixedProps.push(item.prop);
                  // 如果是下拉框等，则需要添加翻译项也添加进去
                  if (
                    item.type === "select" ||
                    item.type === "selectTree" ||
                    item.type === "region" ||
                    item.type === "organ"
                  ) {
                    _this.currentFormFixedProps.push(item.prop + "Text");
                  }
                }
              }
            });
            // 将固定字段、历史处理信息赋值
            _this.currentFormFixedProps.forEach((fixedFormItem) => {
              if (_this.fixedFormData && _this.fixedFormData.length > 0) {
                if (_this.fixedFormData[0][fixedFormItem]) {
                  _this.$refs.DynamicFormRef.formData[fixedFormItem] =
                    _this.fixedFormData[0][fixedFormItem];

                  // 如果固定属性是附件的话，特殊处理一下
                  if (fixedFormItem.startsWith("hdFile")) {
                    _this.$refs.DynamicFormRef.formData[
                      `${fixedFormItem}FileList`
                    ] = _this.$utilStr.deepClone(
                      _this.dealFileList(_this.fixedFormData[0][fixedFormItem])
                    );
                  }
                }
              }
            });

            // 把固定数据整体传入、动态判断部分字段的校验规则是否必填、是否可填
            _this.updateFormItemConfig();
            // 动态根据配置判断字段是否可填
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loadingForForm = false;
        });
    },
    // 递归查询处理formItem项
    async processFormItems(configList) {
      let processedList = [];

      // 顺序处理每个配置项
      for (const item of configList) {
        const processedItem = await this.processItem(item);

        // 过滤掉processedList中已存在的项
        const newItems = processedItem.filter(
          (newItem) =>
            !processedList.some(
              (existingItem) =>
                // 这里需要根据你的实际数据结构定义如何判断两个项是否相同
                // 例如，如果每个项有唯一的id属性：
                existingItem.prop === newItem.prop
            )
        );

        processedList = processedList.concat(newItems);
      }

      return processedList;
    },
    // 递归处理函数
    async processItem(item) {
      let _this = this;
      let res = [item];
      // 如果配置了动态根据其他表单加载表单项字段，则动态获取表单项追加到其他表单中
      if (
        item.concatItemByFormId &&
        item.concatItemByFormId.enable &&
        item.concatItemByFormId.formIdField &&
        _this.objTableData &&
        _this.objTableData.length > 0 &&
        _this.objTableData[0][item.concatItemByFormId.formIdField]
      ) {
        try {
          let formResponse = await getFormDetail({
            id: _this.objTableData[0][item.concatItemByFormId.formIdField]
          });
          let { data } = formResponse.data;
          let { rwForm, rwFormItemConfigList } = data;
          let titleObj = {
            ...item,
            label: `${item.label} - ${rwForm.formTitle}`
          };

          let subList = await _this.processFormItems(
            rwFormItemConfigList || []
          );
          // 过滤当前相同的key
          subList = subList.filter((item) => item.prop !== titleObj.prop);
          return [titleObj].concat(subList);
        } catch (error) {
          return res; // 出错时返回原始项
        }
      }
      return res;
    },
    dealFileList(newVal) {
      let fileList = [];
      if (
        newVal &&
        typeof newVal === "object" &&
        Array.isArray(newVal.addList)
      ) {
        fileList = newVal.addList.map((id) => ({
          name: id, // 这里的 name 需要有默认值，或者后续从其他地方补充
          url: `${this.baseURL}/web/rwNtask/fileDetail?id=${String(id)}`, // 动态拼接 URL
          id: id
        }));
      } else {
        fileList = [];
      }
      return fileList;
    },
    dealFileListNew(newVal) {
      let fileList = [];
      if (newVal && typeof newVal === "object" && Array.isArray(newVal)) {
        fileList = newVal.map((fileItem) => ({
          name: fileItem.fileName, // 这里的 name 需要有默认值，或者后续从其他地方补充
          url: this.baseURL + fileItem.fileUrl, // 动态拼接 URL
          id: fileItem.fileId
        }));
      } else {
        fileList = [];
      }
      return fileList;
    },
    dealFileListIds(newVal) {
      let map = {
        addList: [],
        delList: [],
        oldList: []
      };
      if (newVal && typeof newVal === "object" && Array.isArray(newVal)) {
        map.addList = newVal.map((fileItem) => fileItem.fileId);
      }
      return map;
    },
    updateFormItemConfig() {
      let _this = this;
      // 当前固定数据
      // 当前表单
      this.rwFormItemConfigList = this.rwFormItemConfigList.map((formItem) => {
        // 动态配置表单项的是否必填、是否可填
        if (formItem.dynamicValidationEnabled) {
          if (formItem.dynamicValidationConfig) {
            if (formItem.dynamicValidationConfig.type === "organ") {
              let currentValue = "";

              if (
                _this.fixedFormData &&
                _this.fixedFormData.length > 0 &&
                this.fixedFormData[0][formItem.dynamicValidationConfig.prop]
              ) {
                currentValue =
                  _this.fixedFormData[0][formItem.dynamicValidationConfig.prop];
              } else {
                if (
                  _this.objTableData &&
                  _this.objTableData.length > 0 &&
                  _this.objTableData[0][formItem.prop]
                ) {
                  currentValue = _this.objTableData[0][formItem.prop];
                }
              }

              let userValue =
                _this.$utilPublic.getUserInfo()[
                  formItem.dynamicValidationConfig.relateProp
                ];

              let isSame = this.comparePrefix(
                currentValue,
                userValue,
                formItem.dynamicValidationConfig.startLength
              );
              formItem.disabled = !isSame;
              if (formItem.rules) {
                formItem.rules.required = isSame;
              }
              // 动态同步其他相关字段的校验规则
              if (
                formItem.dynamicValidationConfig.childProps &&
                formItem.dynamicValidationConfig.childProps.length > 0
              ) {
                this.rwFormItemConfigList = this.rwFormItemConfigList.map(
                  (childItem) => {
                    if (
                      formItem.dynamicValidationConfig.childProps.includes(
                        childItem.prop
                      )
                    ) {
                      childItem.disabled = true;
                      if (childItem.rules) {
                        childItem.rules.required = isSame;
                      } else {
                        childItem.rules = {
                          required: isSame,
                          requiredMsg: `${formItem.label}不能为空`
                        };
                      }
                    }
                    return childItem;
                  }
                );
              }
            }

            // 如果是根据其他表单项动态配置是否必填、是否可填
            if (
              formItem.dynamicValidationConfig.type === "otherProp" &&
              formItem.dynamicValidationConfig.otherProp &&
              formItem.dynamicValidationConfig.otherPropValue &&
              _this.$refs.DynamicFormRef.formData[
                formItem.dynamicValidationConfig.otherProp
              ] === formItem.dynamicValidationConfig.otherPropValue
            ) {
              formItem.disabled = true;
              if (formItem.rules) {
                formItem.rules.required = false;
              }
            }
          }
        }
        // 动态根据配置判断字段是否可填，如果开启了，那么该字段如果有值，则禁用，如果没有值，则允许填写
        if (formItem.disableByDefaultValue) {
          formItem.disabled = !(
            _this.$refs.DynamicFormRef.formData[formItem.prop] === "" ||
            _this.$refs.DynamicFormRef.formData[formItem.prop] === null
          );
        }
        // 动态根据配置赋值相关字段值（比如通过身份证号分析出其性别、年龄等）
        if (formItem.sfzhfx && formItem.sfzhfx.enable) {
          // 开启身份证号分析
          if (formItem.sfzhfx.genderProp) {
            // 根据身份证号给性别赋值
            _this.$refs.DynamicFormRef.formData[formItem.sfzhfx.genderProp] =
              _this.$utilAll.getXbByGmsfhm(
                _this.$refs.DynamicFormRef.formData[formItem.prop],
                true
              );
          }
          if (formItem.sfzhfx.ageProp) {
            // 根据身份证号给年龄赋值
            _this.$refs.DynamicFormRef.formData[formItem.sfzhfx.ageProp] =
              _this.$utilAll.getAgeByGmsfhm(
                _this.$refs.DynamicFormRef.formData[formItem.prop]
              );
          }
        }

        return formItem;
      });
    },
    comparePrefix(a, b, startLength) {
      return false;
      // 检查startLength是否是大于1的数字
      if (typeof startLength !== "number" || startLength < 1) {
        return false;
      }
      // 如果a或b没有值，返回false
      if (!a || !b) {
        return false;
      }

      // 比较a和b的前startLength个字符
      return a.substring(0, startLength) === b.substring(0, startLength);
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.DynamicFormRef.$refs.formRef.validate((valid) => {
        if (valid) {
          // 校验通过之后，处理动态表单里的冗余数据，只保留显示的字段
          let fixedDataObj = {};
          // 字段校验是否通过
          let isPass = true;
          let errorItems = [];
          let submitPropObj = _this.rwFormItemConfigList.reduce((pre, cur) => {
            if (cur.isSubmit) {
              // 如果该字段显示，则需要提交
              pre[cur.prop] = _this.$refs.DynamicFormRef.formData[cur.prop];
              // 判断tableList的rowLength，是否录入了最少个数
              if (
                cur.type === "tableList" &&
                cur.rowLength &&
                cur.rowLength > 0
              ) {
                if (
                  !_this.$refs.DynamicFormRef.formData[cur.prop] ||
                  _this.$refs.DynamicFormRef.formData[cur.prop].length <
                    cur.rowLength
                ) {
                  isPass = false;
                  errorItems.push(cur);
                }
              }
              // 判断是否需要提交相关字典翻译值
              if (_this.$refs.DynamicFormRef.formData[`${cur.prop}Text`]) {
                pre[`${cur.prop}Text`] =
                  _this.$refs.DynamicFormRef.formData[`${cur.prop}Text`];
              }

              // 需要提交的数据，并判断是否在固定属性中，如果存在，组成新的固定属性对象
              if (_this.currentFormFixedProps.includes(cur.prop)) {
                fixedDataObj[cur.prop] =
                  _this.$refs.DynamicFormRef.formData[cur.prop];
              }
              // 如果对应的翻译值也存在
              if (_this.currentFormFixedProps.includes(`${cur.prop}Text`)) {
                fixedDataObj[`${cur.prop}Text`] =
                  _this.$refs.DynamicFormRef.formData[`${cur.prop}Text`];
              }
            }
            return pre;
          }, {});
          // let fixedFormData = {};
          // _this.currentFormFixedProps.forEach((item) => {
          //   fixedFormData[item] = _this.$refs.DynamicFormRef.formData[item];
          // });
          // tableList校验
          if (!isPass) {
            let errorMsg = errorItems
              .map(
                (item) =>
                  `<p>请录入至少${item.rowLength}条【${item.label}】</p>`
              )
              .join("\n");
            _this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              customClass: "is-fixed",
              message: errorMsg,
              type: "warning"
            });
            return;
          }
          // 表单空对象校验
          if (
            !_this.$utilStr.isNotEmptyObject(
              _this.$refs.DynamicFormRef.formData
            )
          ) {
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              message: "表单数据空，不允许提交",
              type: "error"
            });
            return;
          }
          _this.loading = true;

          // 参数
          let dataParams = {
            id: _this.row.vo.taskUserRecodeId,
            orgRecodeId: _this.row.vo.taskorgrecodeid,

            formData: submitPropObj,
            fixedFormData: fixedDataObj
          };
          // Lambda写法
          handleSubTask(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                this.visible = false;
                this.resetForm();
                _this.NewTaskCenterDelList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              _this.loading = false;
            });
        } else {
          _this.$nextTick(() => {
            const firstErrorField = document.querySelector(".is-error"); // 获取第一个错误的表单项
            if (firstErrorField) {
              firstErrorField.scrollIntoView({
                behavior: "smooth",
                block: "center"
              }); // 滚动到错误位置
            }
          });
        }
      });
    },
    // 取消
    cancelForm() {
      this.$confirm("确定要取消任务办理吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.visible = false;
          this.resetForm();
        })
        .catch(() => {});
    },
    // 重置
    resetForm() {
      this.formData = {
        vo: {},
        vox: {}
      };

      this.currentFormFixedProps = [];
      this.fixedFormData = [];

      this.showRwyq = true;
      this.showRwdx = true;
      this.showRwsj = true;

      this.$refs.fileListRef.idList = [];
      this.$refs.fileListRef.urlList = [];
      this.$refs.fileListRef.nameList = [];

      this.objTableData = [];
      this.tableData = [];

      this.rwForm = {};
      this.rwFormItemConfigList = [];
      this.rwNformObjectList = [];

      this.$refs.DynamicFormRef.formData = {};
    },

    // 子项折叠
    handleFold(flag) {
      if (flag === "1") {
        this.showRwyq = !this.showRwyq;
      } else if (flag === "3") {
        this.showRwdx = !this.showRwdx;
      } else if (flag === "4") {
        this.showRwsj = !this.showRwsj;
      }
    },

    // 锚点
    handleAnchor(anchorValue) {
      // 点击锚点操作，则不监听滚动事件，否则点击最下方的锚点，滚动监听代码会将选中的锚点再次改变
      this.clickAnchor = true;
      // 设置选中的锚点
      this.activeAnchor =
        anchorValue === "top1" ? this.anchorIds[0] : anchorValue;
      this.currentSection =
        anchorValue === "top1" ? this.anchorIds[0] : anchorValue;
      // 找到锚点
      let anchorElement = document.getElementById(this.activeAnchor);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) anchorElement.scrollIntoView();
    },
    initScrollBox() {
      let _this = this;
      // 监听滚动
      let scrollBox = document.getElementById(_this.formId);
      scrollBox.addEventListener("scroll", this.handleScroll);
    },
    // 初始化滚动区域
    handleScroll() {
      let _this = this;
      // 不是点击锚点而是滚动页面，才会监听滚动事件并执行后续代码
      if (!_this.clickAnchor) {
        for (let i = 0; i < _this.anchorIds.length - 1; i++) {
          let rect = document
            .getElementById(_this.anchorIds[i])
            .getBoundingClientRect();
          let nextRect = document
            .getElementById(_this.anchorIds[i + 1])
            .getBoundingClientRect();
          if (rect.top <= 72.4 && nextRect.top > 72.4) {
            _this.activeAnchor = _this.anchorIds[i];
            break;
          }
        }
      }
      // 将是否点击锚点事件改为 false
      _this.clickAnchor = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  .label {
    width: 150px !important;
  }
}

.con-display-body {
  color: #878d99;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    margin-left: 6px;
  }
}

.no-form-item {
  color: #878d99;
  text-align: center;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
</style>

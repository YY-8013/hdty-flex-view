<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="hdty-dialog-large new-form"
    append-to-body
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
        <hd-pane
          fit
          v-loading="loading || loadingForForm || loadingForData"
          ref="scrollPageRef"
          :id="formId"
        >
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
                    <!--任务状态-->
                    <div class="form-row">
                      <div class="form-item-12 form-item">
                        <label class="label">
                          <span>任务状态</span>
                        </label>
                        <div class="p-div">
                          <el-tag
                            size="mini"
                            type="info"
                            effect="dark"
                            v-if="
                              row.vo.taskState === '1' ||
                              row.vo.taskState === '2'
                            "
                            >{{ row.vox.taskState }}</el-tag
                          >
                          <el-tag
                            size="mini"
                            type="warning"
                            effect="dark"
                            v-if="row.vo.taskState === '3'"
                            >{{ row.vox.taskState }}</el-tag
                          >
                          <el-tag
                            size="mini"
                            type="success"
                            effect="dark"
                            v-if="row.vo.taskState === '4'"
                            >{{ row.vox.taskState }}</el-tag
                          >
                        </div>
                      </div>
                      <div class="form-item-12 form-item">
                        <label class="label">
                          <span>是否逾期</span>
                        </label>
                        <div class="p-div">
                          <span v-show="formData.vo.rwsfcq === '1'">
                            <el-tag type="danger" size="mini">已逾期</el-tag>
                            <span class="text-color-1"
                              >（{{ formData.vo.rwyqsj }}）</span
                            >
                          </span>
                          <span v-show="formData.vo.rwsfcq === '0'">
                            <el-tag type="success" size="mini">未逾期</el-tag>
                          </span>
                        </div>
                      </div>
                    </div>
                    <!--任务办结时间-->
                    <div v-show="row.vo.taskState === '4'" class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>任务办结时间</span>
                        </label>
                        <div class="p-div p-divs" style="padding: 8px">
                          {{ $utilDate.dateFtt(formData.vo.rwwcsj) }}
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
                              周期情况
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

          <!--周期情况-->
          <div
            v-if="anchorList[3].show"
            class="con-area"
            :id="anchorList[3].id"
          >
            <div class="area-head">
              <div class="head">
                <i class="el-icon-time"></i>
                周期情况
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-time"></i>周期任务记录情况
                  </div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('5')"
                    >
                      <i class="el-icon-arrow-up" v-if="showZqrw"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <div class="body" v-show="showZqrw">
                  <div class="form">
                    <el-table
                      class="new-table"
                      :data="cycleTableData"
                      empty-text="暂无周期任务情况"
                      row-key="jjrdate"
                      ref="tableRef"
                      v-loading="loading"
                      border
                    >
                      <el-table-column
                        type="index"
                        :index="setIndex"
                        label="序号"
                        class-name="is-index"
                        align="center"
                        width="50"
                      ></el-table-column>
                      <el-table-column
                        prop="jjrdate"
                        label="日期"
                        align="center"
                        header-align="center"
                        width="120"
                      ></el-table-column>
                      <el-table-column
                        prop="jjrdate"
                        label="完成状态"
                        align="center"
                        header-align="center"
                        width="100"
                      >
                        <template slot-scope="scope">
                          <el-tag v-show="scope.row.sfwc === '0'"
                            >未完成</el-tag
                          >
                          <el-tag v-show="scope.row.sfwc === '1'" type="success"
                            >已完成</el-tag
                          >
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="zxwcjgmc"
                        label="机构"
                        header-align="center"
                        align="center"
                        min-width="100"
                      ></el-table-column>
                      <el-table-column
                        prop="zxwcrxm"
                        label="最新完成人"
                        align="center"
                        header-align="center"
                        min-width="100"
                      ></el-table-column>
                      <el-table-column
                        prop="zxwcrlxdh"
                        label="联系电话"
                        align="center"
                        header-align="center"
                        width="160"
                      ></el-table-column>
                      <el-table-column
                        prop="zxwcsj"
                        label="最新完成时间"
                        align="center"
                        header-align="center"
                        width="180"
                      >
                        <template slot-scope="scope">{{
                          $utilDate.dateFtt(scope.row.zxwcsj)
                        }}</template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="body" v-show="!showZqrw">
                  <div class="con-display-body">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('5')"
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
          <div class="con-area" :id="anchorList[4].id">
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
            v-show="anchorList[5].show"
            :id="anchorList[5].id"
            ref="spgjListRef"
          ></biz-spgj-list>

          <!--处理信息-->
          <div class="con-area con-area-warning" :id="anchorList[6].id">
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
                :isForbid="true"
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
      <el-button type="primary" @click="cancelForm" v-preventReClick
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import {
  getTaskSubDetail,
  getFormDetail,
  getFormData,
  cycleList
} from "./../api";
import DynamicTable from "./../taskobject/DynamicTable";
import DynamicForm from "./../taskform/DynamicForm";

import BizPopoverXfgj from "../biz-popover-xfgj";

export default {
  name: "NewTaskCenterDelDetail",
  provide() {
    return {
      NewTaskCenterDelDetail: this,
      ParentPage: this
    };
  },
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
      loadingForData: false,

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
      showZqrw: true,
      showHcdx: true,

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
          label: "周期情况",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-time",
          show: false
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
      // 周期记录
      cycleTableData: [],

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
        // 动态配置要展示的锚点
        if (_this.row.vo.cycleState === "2") {
          _this.loadFormForCycle();
        }
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
          case "周期情况":
            item.show = this.row.vo.cycleState === "2";
            break;
          case "审批轨迹":
            item.show = this.showSpgj;
            break;
          case "处理信息":
            item.show = true;
            break;
          case "流转轨迹":
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
        id: _this.row.vo.taskUserRecodeId
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

            _this.$set(_this.formData.vo, "rwsfcq", data.rwsfcq || "0");
            _this.$set(_this.formData.vo, "rwyqsj", data.rwyqsj);
            _this.$set(_this.formData.vo, "rwwcsj", data.rwwcsj);

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
      // 参数
      let dataParams = {
        id: formId
      };
      // Lambda写法
      getFormDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 赋值数据
            _this.rwForm = data.rwForm || {};
            _this.rwFormItemConfigList = (data.rwFormItemConfigList || []).map(
              (formItem) => {
                _this.$set(formItem, "rules", formItem.rules || {});
                return formItem;
              }
            );
            _this.rwNformObjectList = data.rwNformObjectList || [];
            // 将配置的字段，给动态表单formData添加属性
            _this.rwFormItemConfigList.forEach((item) => {
              if (item.type !== "title") {
                _this.$set(
                  _this.$refs.DynamicFormRef.formData,
                  item.prop,
                  item.prop.startsWith("hdArray") ? [] : ""
                );
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
                    _this.$refs.DynamicFormRef.formData[item.prop] =
                      _this.objTableData[0][item.prop];
                    // 如果是下拉框等，则需要添加翻译项
                    if (
                      item.type === "select" ||
                      item.type === "selectTree" ||
                      item.type === "region" ||
                      item.type === "organ"
                    ) {
                      _this.$refs.DynamicFormRef.formData[item.prop + "Text"] =
                        _this.objTableData[0][item.prop + "Text"];
                    }
                  }
                }

                // 如果是附件内容，需要特殊处理一下
                if (
                  _this.objTableData[0][item.prop] &&
                  item.prop.startsWith("hdFile")
                ) {
                  // 如果固定属性是附件的话，特殊处理一下
                  _this.$refs.DynamicFormRef.formData[item.prop] =
                    _this.dealFileListNew(_this.objTableData[0][item.prop]);
                }
              }
            });

            // 表单加载完，加载表单对应的数据
            if (_this.row.vo.taskState === "4") {
              _this.loadFormForFormData(_this.row.vo.taskUserRecodeId);
              _this.$refs.DynamicFormRef.isPreview = false;
              // 是否已办结,用于动态表单部分按钮的禁用判断
              _this.$refs.DynamicFormRef.isBj = true;
            } else {
              // 在办数据详情，可查看所有表单项
              _this.$refs.DynamicFormRef.isPreview = true;
              _this.$refs.DynamicFormRef.isBj = false;
            }
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
    dealFileListNew(newVal) {
      let fileList = [];
      if (newVal && typeof newVal === "object" && Array.isArray(newVal)) {
        fileList = newVal.map((fileItem) => ({
          fileName: fileItem.fileName, // 这里的 name 需要有默认值，或者后续从其他地方补充
          fileUrl: this.baseURL + fileItem.fileUrl, // 动态拼接 URL
          fileId: fileItem.fileId
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
    // 加载表单
    loadFormForFormData(id) {
      let _this = this;
      _this.loadingForData = true;
      // 参数
      let dataParams = {
        id: id
      };
      // Lambda写法
      getFormData(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // todo 这里还需要放置翻译对象
            if (data && JSON.stringify(data) !== "{}") {
              _this.$refs.DynamicFormRef.formData = data;

              _this.$refs.DynamicFormRef.taskRow = _this.row;
              _this.$refs.DynamicFormRef.taskState = "4";
            }
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loadingForData = false;
        });
    },
    // 加载周期情况
    loadFormForCycle() {
      let _this = this;
      // 参数
      let dataParams = {
        id: _this.row.vo.taskUserRecodeId
      };
      // Lambda写法
      cycleList(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.cycleTableData = data;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {});
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {
        vo: {},
        vox: {}
      };

      this.showRwyq = true;
      this.showRwdx = true;
      this.showRwsj = true;
      this.showZqrw = true;
      this.showHcdx = true;

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
      } else if (flag === "5") {
        this.showZqrw = !this.showZqrw;
      } else if (flag === "6") {
        this.showHcdx = !this.showHcdx;
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

.new-table-obj {
  ::v-deep .el-table__header {
    th {
      padding: 0 !important;
      .header-commo {
        padding: 0 !important;
      }
      .con-dynamic-table-head {
        width: 100%;
        height: 100%;
        min-height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: inherit;
        position: relative;
        .con-dynamic-table-head-operate {
          position: absolute;
          right: 0;
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          a {
            height: 20px;
          }
        }
      }
    }
  }
  ::v-deep .el-table__body {
    // 输入框
    .el-input__inner {
      background-color: #fff;
      border-color: #cfd6e4;
    }
    .con-dynamic-table-data {
      position: relative;
      &.required {
        &:before {
          content: "*";
          position: absolute;
          left: -7px;
          color: #ff0b00;
        }
      }
    }
  }
}
</style>

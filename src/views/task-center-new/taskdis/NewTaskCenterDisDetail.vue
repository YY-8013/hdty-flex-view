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
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId10' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId10')">
              <i class="el-icon-document"></i>
              <p>任务要求</p>
            </a>
          </div>
          <!--任务表单-->
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId20' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId20')">
              <i class="el-icon-document-checked"></i>
              <p>任务表单</p>
            </a>
          </div>
          <!--任务对象-->
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId30' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId30')">
              <i class="el-icon-aim"></i>
              <p>任务对象</p>
            </a>
          </div>
          <!--任务时间-->
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId40' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId40')">
              <i class="el-icon-time"></i>
              <p>任务时间</p>
            </a>
          </div>
          <!--核查对象-->
          <div
            v-if="isShowRhrw"
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId51' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId51')">
              <i class="el-icon-search"></i>
              <p>核查对象</p>
            </a>
          </div>
          <!--办理信息-->
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId50' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId50')">
              <i class="el-icon-s-promotion"></i>
              <p>办理信息</p>
            </a>
          </div>
          <!--流转轨迹-->
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'gjInfo' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('gjInfo')">
              <i class="el-icon-s-operation"></i>
              <p>流转轨迹</p>
            </a>
          </div>
          <!--分析模型流程图-->
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId43' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId43')">
              <i class="el-icon-guide"></i>
              <p>分析模型流程图</p>
            </a>
          </div>
          <!--任务流转流程图-->
          <div
            class="anchor-item"
            :class="{ 'is-active': activeAnchor === 'anchorId46' }"
          >
            <a href="javascript:;" @click.prevent="handleAnchor('anchorId46')">
              <i class="el-icon-thumb"></i>
              <p>任务流转流程图</p>
            </a>
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
        <hd-pane fit v-loading="loading" id="scrollBox">
          <!--任务要求-->
          <div class="con-area" id="anchorId10">
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

          <!--任务表单-->
          <div class="con-area" id="anchorId20">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document-checked"></i>
                任务表单
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-document-checked"></i>任务表单
                  </div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('2')"
                    >
                      <i class="el-icon-arrow-up" v-if="showRwbd"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <div class="body" v-show="showRwbd">
                  <el-table
                    class="new-table"
                    :data="formTableData"
                    empty-text="暂无数据"
                    row-key="id"
                    ref="formTableRef"
                    border
                  >
                    <el-table-column
                      sortable="custom"
                      type="index"
                      label="序号"
                      :index="setIndex"
                      align="center"
                      width="60"
                    ></el-table-column>
                    <el-table-column label="预览" align="center" width="50">
                      <template slot-scope="scope">
                        <el-link
                          :underline="false"
                          type="primary"
                          @click="handlePreview(scope.row, scope.$index)"
                          >预览</el-link
                        >
                      </template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="vo.formTitle"
                      label="表单名称"
                      align="center"
                      min-width="160"
                    ></el-table-column>
                    <el-table-column
                      prop="vox.formType"
                      label="表单类型"
                      header-align="center"
                      min-width="120"
                    ></el-table-column>
                    <el-table-column
                      prop="vo.createUsername"
                      label="创建人"
                      header-align="center"
                      width="160"
                    ></el-table-column>
                    <el-table-column
                      prop="vox.createTime"
                      label="创建时间"
                      sortable="custom"
                      header-align="center"
                      width="180"
                    ></el-table-column>
                  </el-table>
                </div>
                <div class="body" v-show="!showRwbd">
                  <div class="con-display-body">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('2')"
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
          <div class="con-area" id="anchorId30">
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
                  <!--                  <dynamic-table-->
                  <!--                    ref="DynamicTableRef"-->
                  <!--                    :allowEditField="false"-->
                  <!--                    :allowDeleteField="false"-->
                  <!--                    :allowEditData="false"-->
                  <!--                    :allowDeleteData="false"-->
                  <!--                  ></dynamic-table>-->
                  <!-- 动态描述列表 -->
                  <dynamic-descriptions
                    ref="DynamicDescriptionRef"
                  ></dynamic-descriptions>
                  <div class="hdty-footer" style="text-align: left">
                    <el-pagination
                      background
                      layout="total, sizes, prev, pager, next, jumper"
                      :current-page="pageOptions.current"
                      :page-sizes="pageOptions.sizes"
                      :page-size="pageOptions.size"
                      :total="pageOptions.total"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                    ></el-pagination>
                  </div>
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
          <div class="con-area" id="anchorId40">
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

          <!--核查对象 -->
          <div v-if="isShowRhrw" class="con-area" id="anchorId51">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-search"></i>
                核查对象
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base"><i class="el-icon-search"></i>核查对象</div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('7')"
                    >
                      <i class="el-icon-arrow-up" v-if="showHcdx"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <!-- style="width: 100%;height: 630px;" -->
                <div class="body" style="width: 100%" v-show="showHcdx">
                  <rhrw-hcdx-page ref="rhrwHcdxPageRef" />
                </div>
                <div class="body" v-show="!showHcdx">
                  <div class="con-display-body">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('7')"
                    >
                      点击展开详细信息
                      <i class="el-icon-arrow-down"></i>
                    </a>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!--办理信息-->
          <div class="con-area con-area-warning" id="anchorId50">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                办理信息
              </div>
            </div>
            <div class="area-body" style="max-height: 700px; overflow: auto">
              <!--指派对象-->
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div class="body">
                  <div class="form">
                    <!--指派类型-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>指派类型</span>
                        </label>
                        <div class="p-div p-divs">
                          <div class="text-div">
                            <div v-if="formData.vo.isauto === '1'">
                              自动指派
                            </div>
                            <div v-else>
                              <div v-show="formData.vo.assignType === '1'">
                                指派人员
                              </div>
                              <div v-show="formData.vo.assignType === '2'">
                                指派机构
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
              <!--处理明细-->
              <!--              <el-card-->
              <!--                class="con-card box-card"-->
              <!--                style="padding-bottom: 0;"-->
              <!--                v-loading="subTaskListLoading"-->
              <!--              >-->
              <!--                <div slot="header" class="clearfix">-->
              <!--                  <span class="base">-->
              <!--                    <i class="el-icon-document"></i>处理明细-->
              <!--                  </span>-->
              <!--                  <div class="con-right-btn">-->
              <!--                    <el-radio-group-->
              <!--                      v-model="subTaskQueryStatus"-->
              <!--                      size="mini"-->
              <!--                      @change="loadSubTaskList"-->
              <!--                    >-->
              <!--                      <el-radio-button label>全部</el-radio-button>-->
              <!--                      <el-radio-button label="1">在办</el-radio-button>-->
              <!--                      <el-radio-button label="2">超期在办</el-radio-button>-->
              <!--                      <el-radio-button label="3">已办</el-radio-button>-->
              <!--                      <el-radio-button label="4">超期已办</el-radio-button>-->
              <!--                    </el-radio-group>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--                <div class="body">-->
              <!--                  <el-table-->
              <!--                    class="new-table"-->
              <!--                    :data="subTaskList"-->
              <!--                    empty-text="暂无数据"-->
              <!--                    row-key="id"-->
              <!--                    ref="formTableRef"-->
              <!--                    border-->
              <!--                  >-->
              <!--                    <el-table-column-->
              <!--                      fixed-->
              <!--                      sortable="custom"-->
              <!--                      type="index"-->
              <!--                      label="序号"-->
              <!--                      :index="setIndex"-->
              <!--                      align="center"-->
              <!--                      width="60"-->
              <!--                    ></el-table-column>-->
              <!--                    <el-table-column-->
              <!--                      show-overflow-tooltip-->
              <!--                      prop="objectid"-->
              <!--                      label="子任务名称"-->
              <!--                      align="center"-->
              <!--                      min-width="240"-->
              <!--                    >-->
              <!--                      <template slot-scope="scope">-->
              <!--                        <a href="javascript:;" @click="toSubTaskDetail(scope.row)">-->
              <!--                          <span-->
              <!--                            class="text-color-4 text-clickable text-size-15"-->
              <!--                          >{{ scope.row.objectid }}</span>-->
              <!--                        </a>-->
              <!--                      </template>-->
              <!--                    </el-table-column>-->
              <!--                    <el-table-column-->
              <!--                      show-overflow-tooltip-->
              <!--                      prop="sjgsdwmc"-->
              <!--                      label="处理机构"-->
              <!--                      align="center"-->
              <!--                      min-width="180"-->
              <!--                    ></el-table-column>-->
              <!--                    <el-table-column-->
              <!--                      show-overflow-tooltip-->
              <!--                      prop="userCount"-->
              <!--                      label="处理人员"-->
              <!--                      align="center"-->
              <!--                      width="100"-->
              <!--                    >-->
              <!--                      <template slot-scope="scope">-->
              <!--                        <a href="javascript:;" @click="handlePersonList(scope.$index, scope.row)">-->
              <!--                          <el-tag size="mini" type="primary">{{scope.row.userCount}}</el-tag>-->
              <!--                        </a>-->
              <!--                      </template>-->
              <!--                    </el-table-column>-->
              <!--                    <el-table-column-->
              <!--                      show-overflow-tooltip-->
              <!--                      prop="cycleState"-->
              <!--                      label="周期情况"-->
              <!--                      align="center"-->
              <!--                      width="100"-->
              <!--                    >-->
              <!--                      <template slot-scope="scope">-->
              <!--                        <div v-if="scope.row.cycleState === '2'">-->
              <!--                          <div v-if="scope.row.state === '1' || scope.row.state === '2'">-->
              <!--                            <span class="text-size-15">查看周期</span>-->
              <!--                          </div>-->
              <!--                          <div v-if="scope.row.state === '3' || scope.row.state === '4'">-->
              <!--                            <a-->
              <!--                              href="javascript:;"-->
              <!--                              @click="handleCycleList(scope.$index, scope.row)"-->
              <!--                            >-->
              <!--                              <span class="text-color-4 text-clickable text-size-15">查看周期</span>-->
              <!--                            </a>-->
              <!--                          </div>-->
              <!--                        </div>-->
              <!--                        <div class="text-size-15" v-else>非周期任务</div>-->
              <!--                      </template>-->
              <!--                    </el-table-column>-->
              <!--                    <el-table-column-->
              <!--                      show-overflow-tooltip-->
              <!--                      prop="statemc"-->
              <!--                      label="任务状态"-->
              <!--                      align="center"-->
              <!--                      width="100"-->
              <!--                    >-->
              <!--                      <template slot-scope="scope">-->
              <!--                        <el-tag-->
              <!--                          size="mini"-->
              <!--                          type="info"-->
              <!--                          effect="dark"-->
              <!--                          v-if="scope.row.state === '1' || scope.row.state === '2'"-->
              <!--                        >{{ scope.row.statemc }}</el-tag>-->
              <!--                        <el-tag-->
              <!--                          size="mini"-->
              <!--                          type="warning"-->
              <!--                          effect="dark"-->
              <!--                          v-if="scope.row.state === '3'"-->
              <!--                        >{{ scope.row.statemc }}</el-tag>-->
              <!--                        <el-tag-->
              <!--                          size="mini"-->
              <!--                          type="success"-->
              <!--                          effect="dark"-->
              <!--                          v-if="scope.row.state === '4'"-->
              <!--                        >{{ scope.row.statemc }}</el-tag>-->
              <!--                      </template>-->
              <!--                    </el-table-column>-->
              <!--                    <el-table-column prop="rwwcsjmc" label="任务完成时间" align="center" width="180"></el-table-column>-->
              <!--                    <el-table-column-->
              <!--                      show-overflow-tooltip-->
              <!--                      prop="rwsfcq"-->
              <!--                      label="超期情况"-->
              <!--                      align="center"-->
              <!--                      width="160"-->
              <!--                    >-->
              <!--                      <template slot-scope="scope">-->
              <!--                        <div-->
              <!--                          class="text-color-1"-->
              <!--                          v-if="scope.row.rwsfcq === '1'"-->
              <!--                        >{{scope.row.rwyqsj}}</div>-->
              <!--                        <div class="text-color-5" v-else>未超期</div>-->
              <!--                      </template>-->
              <!--                    </el-table-column>-->
              <!--                  </el-table>-->
              <!--                </div>-->
              <!--              </el-card>-->
              <!-- 树状结果展示  -->
              <div
                style="width: 100%; background-color: #fff; min-height: 280px"
                :style="{ height: treeChartHeight + 'px' }"
              >
                <div
                  id="treeChart"
                  style="width: 100%; height: 100%"
                  :loading="echarLoading"
                ></div>
              </div>
              <!--分页-->
              <div class="hdty-footer">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :current-page="pageOptionsTree.current"
                  :page-sizes="pageOptionsTree.sizes"
                  :page-size="pageOptionsTree.size"
                  :total="pageOptionsTree.total"
                  @size-change="handleSizeTreeChange"
                  @current-change="handleCurrenthTreeChange"
                ></el-pagination>
              </div>
              <!--              <div class="hdty-more-page" v-if="dealOrgData.children && dealOrgData.children.length > current">-->
              <!--                <button id="loadMoreBtn" @click="handleLoadMoreDealOrgData">点击加载更多</button>-->
              <!--                <span v-if="dealOrgData.children" style="color: #2f2f2f;margin-left: 15px;">任务共计：<span style="padding: 0 5px;">{{dealOrgData.children.length}}</span>条</span>-->
              <!--              </div>-->
            </div>
          </div>

          <!-- 流转轨迹-->
          <div class="con-area" id="gjInfo">
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
                    :taskId="row.vo.id"
                  ></biz-popover-xfgj>
                </div>
              </el-card>
            </div>
          </div>

          <!--分析模型流程图-->
          <div class="con-area" id="anchorId43">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-guide"></i>
                分析模型流程图
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-guide"></i>分析模型流程图
                  </div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('5')"
                    >
                      <i class="el-icon-arrow-up" v-if="showYwlct"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <div class="body" v-show="showYwlct">
                  <div class="con-flow-img">
                    <hd-image
                      v-model="'data:image/jpeg;base64,' + formData.vo.fxlct"
                      width="100%"
                      height="100%"
                    ></hd-image>
                  </div>
                </div>
                <div class="body" v-show="!showYwlct">
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

          <!--任务流转流程图-->
          <div class="con-area" id="anchorId46">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-thumb"></i>
                任务流转流程图
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card" style="padding-bottom: 0">
                <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-thumb"></i>任务流转流程图
                  </div>
                  <div class="con-head-right">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('6')"
                    >
                      <i class="el-icon-arrow-up" v-if="showSjlzt"></i>
                      <i class="el-icon-arrow-down" v-else></i>
                    </a>
                  </div>
                </div>
                <div class="body" v-show="showSjlzt">
                  <div class="con-flow-img">
                    <hd-image
                      v-model="'data:image/jpeg;base64,' + formData.vo.rwlzlct"
                      width="100%"
                      height="100%"
                    ></hd-image>
                  </div>
                </div>
                <div class="body" v-show="!showSjlzt">
                  <div class="con-display-body">
                    <a
                      href="javascript:;"
                      title="展开/收缩"
                      @click="handleFold('6')"
                    >
                      点击展开详细信息
                      <i class="el-icon-arrow-down"></i>
                    </a>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <new-task-form-preview ref="perviewRef"></new-task-form-preview>
          <dis-detail-for-person-list
            ref="personListRef"
          ></dis-detail-for-person-list>
          <dis-detail-for-cycle-list
            ref="cycleListRef"
          ></dis-detail-for-cycle-list>

          <!-- <new-task-center-del-detail ref="detailRef"></new-task-center-del-detail> -->
          <new-task-center-dis-task-detail
            ref="detailRef"
          ></new-task-center-dis-task-detail>
        </hd-pane>
      </div>
    </div>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import {
  getTaskDetail,
  getSubTaskList,
  rwObjPage,
  ntaskDetailed,
  getZpOrRlTaskPage
} from "./../api";
import DynamicTable from "./../taskobject/DynamicTable";
import DynamicDescriptions from "./../taskobject/DynamicDescriptions";
import NewTaskFormPreview from "./../common/NewTaskFormPreview";
import DisDetailForPersonList from "./disdetail/DisDetailForPersonList";
import DisDetailForCycleList from "./disdetail/DisDetailForCycleList";
import NewTaskCenterDelDetail from "../taskdel/NewTaskCenterDelDetail";
import BizPopoverXfgj from "../biz-popover-xfgj";

import NewTaskCenterDisTaskDetail from "./NewTaskCenterDisTaskDetail";

export default {
  name: "NewTaskCenterDisDetail",
  provide() {
    return {
      NewTaskCenterDisDetail: this,
      ParentPage: this
    };
  },
  mixins: [hdList, hdForm],
  components: {
    DynamicTable,
    DynamicDescriptions,
    NewTaskFormPreview,
    DisDetailForPersonList,
    DisDetailForCycleList,
    BizPopoverXfgj,
    NewTaskCenterDelDetail,
    NewTaskCenterDisTaskDetail
  },
  data() {
    return {
      // 显示
      visible: false,

      // 当前滚动选中的锚点
      activeAnchor: "anchorId10",
      // 是否为点击锚点操作
      clickAnchor: false,
      // 滚动元素距离滚动容器顶部的距离值集合
      scrollItemTopList: [],

      // 表单
      formData: {
        vo: {},
        vox: {}
      },

      // 是否显示入户任务
      isShowRhrw: false,
      // 显示子项（展开和收缩）
      showRwyq: true,
      showRwbd: true,
      showRwdx: true,
      showRwsj: true,
      showYwlct: false,
      showSjlzt: false,
      showHcdx: false,

      // 表单名称列表
      formTableData: [],
      // 任务对象列名列表
      rwNformObjectList: [],
      // 任务对象列表
      objTableData: [],
      tableData: [],
      // 处理对象列表
      dealTableData: [
        {
          vo: {
            id: "1",
            xm: "杨勇",
            gmsfhm: "150923200706296628",
            lxdh: "13012340001",
            zqwcqkAll: "30",
            zqwcqkYwc: "16"
          },
          vox: {
            dealName: "陈旭阳",
            rwzt: "在办",
            cqsj: ""
          }
        },
        {
          vo: {
            id: "2",
            xm: "张昌霖",
            gmsfhm: "130408202404299836",
            lxdh: "13012340002",
            zqwcqkAll: "30",
            zqwcqkYwc: "16"
          },
          vox: {
            dealName: "陈旭阳",
            rwzt: "在办",
            cqsj: "已超期2天4小时"
          }
        },
        {
          vo: {
            id: "3",
            xm: "徐洪刚",
            gmsfhm: "130408202404299836",
            lxdh: "13012340002",
            zqwcqkAll: "30",
            zqwcqkYwc: "30"
          },
          vox: {
            dealName: "李茂财",
            rwzt: "办结",
            cqsj: ""
          }
        },
        {
          vo: {
            id: "4",
            xm: "—",
            gmsfhm: "130408202404299836",
            lxdh: "13012340002",
            zqwcqkAll: "30",
            zqwcqkYwc: "30"
          },
          vox: {
            dealName: "李逍遥",
            rwzt: "办结",
            cqsj: ""
          }
        },
        {
          vo: {
            id: "5",
            xm: "杨勇",
            gmsfhm: "150923200706296628",
            lxdh: "13012340001",
            zqwcqkAll: "30",
            zqwcqkYwc: "16"
          },
          vox: {
            dealName: "乌拉尔路派出所",
            rwzt: "在办",
            cqsj: ""
          }
        },
        {
          vo: {
            id: "6",
            xm: "张昌霖",
            gmsfhm: "130408202404299836",
            lxdh: "13012340002",
            zqwcqkAll: "30",
            zqwcqkYwc: "16"
          },
          vox: {
            dealName: "乌拉尔路派出所",
            rwzt: "在办",
            cqsj: "已超期2天4小时"
          }
        },
        {
          vo: {
            id: "7",
            xm: "徐洪刚",
            gmsfhm: "130408202404299836",
            lxdh: "13012340002",
            zqwcqkAll: "30",
            zqwcqkYwc: "30"
          },
          vox: {
            dealName: "滨河路派出所",
            rwzt: "办结",
            cqsj: ""
          }
        },
        {
          vo: {
            id: "8",
            xm: "—",
            gmsfhm: "130408202404299836",
            lxdh: "13012340002",
            zqwcqkAll: "30",
            zqwcqkYwc: "30"
          },
          vox: {
            dealName: "土贵乌拉派出所",
            rwzt: "办结",
            cqsj: ""
          }
        }
      ],

      // 子任务明细列表加载提示
      subTaskListLoading: false,
      // 子任务明细列表查询
      subTaskQueryStatus: "",
      // 子任务明细列表
      subTaskList: [],

      // 行
      row: {
        vo: {},
        vox: {}
      },
      pageOptions: {
        current: 1,
        sizes: [5, 10, 20, 50, 100],
        size: 5,
        total: 0
      },
      pageOptionsTree: {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0
      },
      // 树形图表
      treeChart: null,
      // 树形图表高度
      treeChartHeight: 280,
      echarLoading: false,
      // 办理信息机构数据
      dealOrgData: [],
      current: 10
    };
  },
  mounted() {},
  updated() {
    // 滚动元素 id 集合
    let scrollItemIdList = [
      "anchorId10",
      "anchorId20",
      "anchorId30",
      "anchorId40",
      "anchorId43",
      "anchorId46",
      "anchorId50"
    ];
    scrollItemIdList = scrollItemIdList.concat(["bottom1"]);
    // 每次需要清空滚动元素距离滚动容器顶部的距离值集合
    this.scrollItemTopList = [];
    // 有表格需要等待接口返回后才会渲染，所以 top1 值需要通过监听实时获取
    scrollItemIdList.forEach((item) => {
      if (document.getElementById(item)) {
        let top1 = document.getElementById(item).offsetTop;
        this.scrollItemTopList.push({
          id: item,
          top1: top1
        });
      }
    });
  },
  created() {
    // 网页大小改变时，图形自适应变化
    window.addEventListener("resize", function () {
      if (this.treeChart) {
        this.treeChart.resize();
      }
    });
  },
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 重置表单
        this.resetForm();
        // 加载表单
        this.loadForm();
        // 加载子任务明细列表
        // this.loadSubTaskList();
        // 初始化滚动区域
        this.initScrollBox();
        // 初始化图表
        this.initChart();
      });
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
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;

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

            // 设置任务表单内容
            _this.formTableData = data.vo.fromList || [];

            // 设置任务对象列名列表
            _this.rwNformObjectList = data.vo.rwNformObjectList || [];
            // 设置任务对象列表
            _this.objTableData = data.vo.rwObjectList || [];

            // 入户核查对象
            const isRhRw = this.row.vo.formId == 141;
            _this.isShowRhrw = isRhRw;
            if (_this.objTableData.length > 0 && isRhRw) {
              setTimeout(() => {
                this.$refs.rhrwHcdxPageRef.queryData.rhrwId =
                  data.jsonObject.wybs;
                this.$refs.rhrwHcdxPageRef.loadList();
              }, 200);
            }
            // 获取任务对象列表-分页
            _this.getTaskObjectListPage();
            // _this.tableData = data.vo.rwObjectList || [];
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
    // 加载任务对象列表-分页
    getTaskObjectListPage() {
      let _this = this;
      _this.rwObjloading = true;
      // 参数
      let dataParams = {
        taskId: _this.row.vo.id,
        zxbs: "0",
        ..._this.pageOptions
      };
      // Lambda写法
      rwObjPage(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          // _this.$refs.DynamicTableRef.$refs.objTableRef.doLayout();
          _this.rwObjloading = false;
        });
    },
    // 分页每页条数改变
    handleSizeChange(val) {
      this.pageOptions.size = val;
      if (this.pageOptions.current <= Math.ceil(this.pageOptions.total / val)) {
        this.getTaskObjectListPage();
      }
    },
    // 分页当前页码改变
    handleCurrentChange(val) {
      this.pageOptions.current = val;
      this.getTaskObjectListPage();
    },
    // 加载子任务明细列表
    loadSubTaskList() {
      let _this = this;
      _this.subTaskListLoading = true;
      // 参数
      let dataParams = {
        id: _this.row.vo.id,
        statType: _this.subTaskQueryStatus
      };
      // Lambda写法
      getSubTaskList(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.subTaskList = data || [];
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.subTaskListLoading = false;
        });
    },
    // 子任务详情列表
    toSubTaskDetail(row) {
      this.$refs.detailRef.visible = true;
      let info = {
        vo: {
          ...row,
          taskorgrecodeid: row.id,
          taskState: row.state
        },
        vox: {
          taskState: row.statemc
        }
      };
      this.$refs.detailRef.row = info;
      this.$refs.detailRef.beforeLoadForm();
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
      this.showRwbd = true;
      this.showRwdx = true;
      this.showRwsj = true;
      this.showYwlct = false;
      this.showSjlzt = false;
      this.showHcdx = false;

      this.$refs.fileListRef.idList = [];
      this.$refs.fileListRef.urlList = [];
      this.$refs.fileListRef.nameList = [];

      this.formTableData = [];
      this.rwNformObjectList = [];
      this.objTableData = [];
      this.tableData = [];
      this.dealTableData = [];

      this.subTaskQueryStatus = "";
      this.subTaskList = [];
    },
    // 预览表单
    handlePreview(row, index) {
      this.$refs.perviewRef.visible = true;
      this.$refs.perviewRef.row = row;
      this.$refs.perviewRef.beforeLoadForm();
    },

    // 子项折叠
    handleFold(flag) {
      if (flag === "1") {
        this.showRwyq = !this.showRwyq;
      } else if (flag === "2") {
        this.showRwbd = !this.showRwbd;
      } else if (flag === "3") {
        this.showRwdx = !this.showRwdx;
      } else if (flag === "4") {
        this.showRwsj = !this.showRwsj;
      } else if (flag === "5") {
        this.showYwlct = !this.showYwlct;
      } else if (flag === "6") {
        this.showSjlzt = !this.showSjlzt;
      } else if (flag === "7") {
        this.showHcdx = !this.showHcdx;
      }
    },
    // 处理人员
    handlePersonList(index, row) {
      this.$refs.personListRef.visible = true;
      this.$refs.personListRef.row = row;
      this.$refs.personListRef.beforeLoadForm();
    },
    // 周期任务
    handleCycleList(index, row) {
      this.$refs.cycleListRef.visible = true;
      this.$refs.cycleListRef.row = row;
      this.$refs.cycleListRef.beforeLoadForm();
    },

    // 初始化滚动区域
    initScrollBox() {
      let _this = this;
      // 监听滚动
      let scrollBox = document.getElementById("scrollBox");
      scrollBox.addEventListener(
        "scroll",
        () => {
          // 不是点击锚点而是滚动页面，才会监听滚动事件并执行后续代码
          if (!_this.clickAnchor) {
            // 当前滚动位置
            let currentScrollTop = scrollBox.scrollTop;
            _this.scrollItemTopList.forEach((item, index) => {
              if (index < _this.scrollItemTopList.length - 1) {
                if (
                  _this.scrollItemTopList[index].top1 <= currentScrollTop &&
                  currentScrollTop <= _this.scrollItemTopList[index + 1].top1
                ) {
                  _this.activeAnchor = item.id;
                }
              }
            });
          }
          // 将是否点击锚点事件改为 false
          _this.clickAnchor = false;
        },
        false
      );
    },
    // 锚点
    handleAnchor(id) {
      // 点击锚点操作，则不监听滚动事件，否则点击最下方的锚点，滚动监听代码会将选中的锚点再次改变
      this.clickAnchor = true;
      // 设置选中的锚点
      this.activeAnchor = id === "top1" ? "anchorId10" : id;
      // 找到锚点
      let anchorElement = document.getElementById(this.activeAnchor);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) anchorElement.scrollIntoView();
    },
    // 加载更多办理信息
    handleLoadMoreDealOrgData() {
      this.current += 10;
      let data = this.$utilStr.deepClone(this.dealOrgData);
      data.children = data.children.slice(0, this.current);
      this.signTableDate = [data] || [];
      // 设置图标的高度，如果超过4个，则每个分配70px的高度，如果不超过4个，则使用最低（默认）高度即可
      // if (this.signTableDate && this.signTableDate.length > 0 && this.signTableDate[0] && this.signTableDate[0].children && this.signTableDate[0].children.length > 4) {
      let length = this.countLeafNodes(this.signTableDate);
      this.treeChartHeight = length * 115;
      // }
      setTimeout(() => {
        // 渲染之前先清除图表，以免多次渲染影响性能
        if (this.treeChart) {
          this.treeChart.clear();
          this.treeChart.dispose();
        }
        this.treeChart = this.$echarts.init(
          document.getElementById("treeChart")
        );
        this.treeChart.setOption(this.handleGetOptions());
      }, 500);
    },
    countLeafNodes(nodes) {
      let count = 0;
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          count += this.countLeafNodes(node.children); // 递归调用
        } else {
          count++; // 没有子节点，则是叶子节点
        }
      });
      return count;
    },
    // 初始化图表
    initChart() {
      let _this = this;
      _this.treeChartHeight = 280;
      // 获取任务处理图表数据
      _this.echarLoading = true;
      // 参数
      let dataParams = {
        taskId: _this.row.vo.id,
        ..._this.pageOptionsTree
      };
      // Lambda写法
      ntaskDetailed(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptionsTree.total = data.total;
            _this.dealOrgData = _this.$utilStr.deepClone(data);
            data.children = data.children.slice(0, _this.current);
            _this.signTableDate = [data] || [];
            // 设置图标的高度，如果超过4个，则每个分配70px的高度，如果不超过4个，则使用最低（默认）高度即可
            // if (_this.signTableDate && _this.signTableDate.length > 0 && _this.signTableDate[0] && _this.signTableDate[0].children && _this.signTableDate[0].children.length > 4) {
            // let length = _this.signTableDate[0].children.length;
            let length = _this.countLeafNodes(_this.signTableDate);
            _this.treeChartHeight = length * 115;
            // }
            // 初始化图表
            setTimeout(() => {
              // 渲染之前先清除图表，以免多次渲染影响性能
              if (_this.treeChart) {
                _this.treeChart.clear();
                _this.treeChart.dispose();
              }
              _this.treeChart = this.$echarts.init(
                document.getElementById("treeChart")
              );
              _this.treeChart.setOption(_this.handleGetOptions());
              _this.treeChart.on("click", function (params) {
                console.log(params, "params*-*-*--*-/*-*");
                _this.goTreeChildNode(params.data);
                // window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
              });
            }, 500);
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.echarLoading = false;
        });
    },
    // 子节点点击跳转办理详情
    goTreeChildNode(data) {
      if (data.children && data.children.length == 0) {
        // Lambda写法
        getZpOrRlTaskPage({
          orgRecodeId: data.orgRecodeId,
          current: 1,
          size: 10
        })
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              this.$refs.detailRef.visible = true;
              this.$refs.detailRef.row = data.records[0];
              this.$refs.detailRef.beforeLoadForm();
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          })
          .finally(() => {});
      }
    },
    // 获取echarts属性设置
    handleGetOptions1() {
      let _this = this;
      return {
        // 图表边距
        // grid: {
        //   top: 50, // 图表距上方容器的距离
        //   right: 50, // 图表距右方容器的距离
        //   bottom: 50, // 图表距下方容器的距离（横轴距下方容器的距离，而不是横轴数字距左方容器的距离）
        //   left: 100 // 图表距左方容器的距离（纵轴距左方容器的距离，而不是纵轴数字距左方容器的距离）
        // },
        // 鼠标悬浮显示的内容
        tooltip: {
          trigger: "axis", // item | axis （当trigger为’item’时只会显示该点的数据，为’axis’时显示该列下所有坐标轴所对应的数据）
          textStyle: {
            fontSize: 16, // 文字大小
            color: "#FFFFFF" // 文字颜色
          },
          transitionDuration: 0, // 提示框悬浮层移动动画过渡时间，设置为0可避免整体页面抖动
          backgroundColor: "#606266", // tooltip提示框背景颜色
          showDelay: 20, // 显示延迟，避免频繁切换，单位 ms
          hideDelay: 0, // 隐藏延迟，设置为0，避免出现鼠标移走还显示tooltip或者出现多个tooltip的情况，单位 ms
          // 重定义鼠标悬浮时显示的内容
          formatter: function (params) {
            console.log(params);
          }
        },
        series: [
          {
            type: "tree",
            left: 250,
            top: 30,
            right: 150,
            bottom: 30,
            layout: "orthogonal", // 树图的布局，有 正交 和 径向 两种
            orient: "LR", // 树图中 正交布局 的方向，对应有 水平 方向的 从左到右
            symbol: "circle",
            symbolSize: 60,
            symbolOffset: ["0", "0"],
            edgeShape: "polyline", // 线条形状，curve 曲线；polyline 折线；
            roam: false, // 可以|设置成 'scale' 或者 'move'。设置成 true 为都开启
            initialTreeDepth: -1,
            itemStyle: {
              color: "#2985f7",
              borderColor: "",
              borderWidth: 3,
              borderType: "solid"
            },
            label: {
              position: "inside",
              distance: 0,
              // offset: [40, 30],
              color: "#1cad7b",
              fontWeight: "bold",
              fontSize: 16,
              // align: 'center',
              // verticalAlign: 'middle',
              // lineHeight: 24,
              formatter: function (val) {
                if (val && val.data) {
                  if (val.data.xm) {
                    return (
                      "{a|" +
                      val.data.result +
                      "}\n{b|" +
                      val.data.xm +
                      "}\n{b|" +
                      val.data.name +
                      "}\n{c|" +
                      _this.$utilDate.dateFtt(
                        val.data.time,
                        "yyyy-MM-dd HH:mm:ss"
                      ) +
                      "}"
                    );
                  } else if (val.data.orgName) {
                    return (
                      "{a|" +
                      val.data.result +
                      "}\n{originB|" +
                      (val.data.orgName || "") +
                      "}\n{originC|" +
                      _this.$utilDate.dateFtt(
                        val.data.time,
                        "yyyy-MM-dd HH:mm:ss"
                      ) +
                      "}\n{originD|" +
                      (val.data.cqsj || "") +
                      "}"
                    );
                  } else {
                    return (
                      "{a|" +
                      val.data.result +
                      "}\n{b|" +
                      val.data.name +
                      "}\n{c|" +
                      _this.$utilDate.dateFtt(
                        val.data.time,
                        "yyyy-MM-dd HH:mm:ss"
                      ) +
                      "}\n{d|" +
                      (val.data.cqsj || "") +
                      "}"
                    );
                  }
                }
              },
              // rich 里是文本片段的样式设置：
              rich: {
                // 状态
                a: {
                  color: "#ffffff",
                  align: "center",
                  // verticalAlign: 'middle',
                  // lineHeight: 50,
                  fontSize: 14,
                  padding: [0, 0, 75, 0]
                },
                // 二级机构
                originB: {
                  color: "#2f2f2f",
                  lineHeight: 24,
                  align: "center",
                  verticalAlign: "middle",
                  fontWeight: "bold",
                  fontSize: 15,
                  padding: [60, 330, 0, 0]
                },
                // 二级时间
                originC: {
                  color: "#818181",
                  lineHeight: 24,
                  align: "center",
                  verticalAlign: "middle",
                  fontSize: 13,
                  padding: [60, 330, 0, 0]
                },
                // 二级超期时间
                originD: {
                  color: "#F56C6C",
                  lineHeight: 24,
                  align: "center",
                  verticalAlign: "middle",
                  fontWeight: "bold",
                  fontSize: 15,
                  padding: [60, 330, 0, 0]
                },
                // 机构
                b: {
                  color: "#2f2f2f",
                  lineHeight: 24,
                  align: "center",
                  verticalAlign: "middle",
                  fontWeight: "bold",
                  fontSize: 15,
                  padding: [60, 240, 0, 0]
                },
                // 时间
                c: {
                  color: "#818181",
                  lineHeight: 24,
                  align: "center",
                  verticalAlign: "middle",
                  fontSize: 13,
                  padding: [65, 240, 0, 0]
                },
                // 超时时间
                d: {
                  color: "#F56C6C",
                  lineHeight: 24,
                  align: "center",
                  verticalAlign: "middle",
                  fontWeight: "bold",
                  fontSize: 16,
                  padding: [60, 240, 0, 0]
                }
              }
            },
            lineStyle: {
              color: "#cfd6e4",
              width: 1,
              curveness: 1
            },
            data: _this.signTableDate
          }
        ],
        // 动画类型（部分图表不会识别某些动画）
        animationEasing: "elasticOut",
        // 动画时间
        animationDuration: 1000
      };
    },
    // 获取echarts属性设置 (兼容 ECharts 5.2.2)
    handleGetOptions() {
      let _this = this;
      return {
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: 16,
            color: "#FFFFFF"
          },
          transitionDuration: 0,
          backgroundColor: "#606266",
          showDelay: 20,
          hideDelay: 0,
          formatter: function (params) {
            // ECharts5 要求返回 string，否则 tooltip 会报错
            if (!params || !params.length) return "";
            return params
              .map((item) => `${item.seriesName}: ${item.value}`)
              .join("<br/>");
          }
        },
        series: [
          {
            type: "tree",
            layout: "orthogonal",
            orient: "LR",
            symbol: "circle",
            symbolSize: 60,
            roam: false,
            initialTreeDepth: -1,
            itemStyle: {
              color: "#f90", // 节点颜色
              borderWidth: 2,
              borderColor: "#fff"
            },
            label: {
              position: "top", // 文字显示在节点下方
              distance: -25, // 和圆点的距离
              align: "center", // 居中对齐
              verticalAlign: "top",
              formatter: function (val) {
                if (val && val.data) {
                  let str = "";
                  if (val.data.xm) {
                    str =
                      "{res|" +
                      val.data.result +
                      "}\n\n\n" +
                      "{name|" +
                      val.data.xm +
                      "}\n" +
                      "{org|" +
                      val.data.name +
                      "}\n" +
                      "{time|" +
                      (_this.$utilDate.dateFtt(
                        val.data.time,
                        "yyyy-MM-dd HH:mm:ss"
                      ) || "") +
                      "}";
                  } else if (val.data.orgName) {
                    str =
                      "{res|" +
                      val.data.result +
                      "}\n\n\n" +
                      "{org|" +
                      val.data.orgName +
                      "}\n" +
                      "{time|" +
                      (_this.$utilDate.dateFtt(
                        val.data.time,
                        "yyyy-MM-dd HH:mm:ss"
                      ) || "") +
                      "}\n" +
                      "{delay|" +
                      (val.data.cqsj || "") +
                      "}";
                  } else {
                    str =
                      "{res|" +
                      val.data.result +
                      "}\n\n\n" +
                      "{org|" +
                      val.data.name +
                      "}\n" +
                      "{time|" +
                      (_this.$utilDate.dateFtt(
                        val.data.time,
                        "yyyy-MM-dd HH:mm:ss"
                      ) || "") +
                      "}\n" +
                      "{delay|" +
                      (val.data.cqsj || "") +
                      "}";
                  }
                  return str;
                }
                return "";
              },
              rich: {
                // 状态
                res: {
                  color: "#ffffff",
                  align: "center",
                  verticalAlign: "top",
                  // lineHeight: 50,
                  fontSize: 14,
                  lineHeight: 20
                },
                name: {
                  color: "#2f2f2f",
                  fontWeight: "bold",
                  fontSize: 15,
                  lineHeight: 24
                },
                org: {
                  color: "#2f2f2f",
                  fontWeight: "bold",
                  fontSize: 15,
                  lineHeight: 24
                },
                time: {
                  color: "#818181",
                  fontSize: 13,
                  lineHeight: 22
                },
                delay: {
                  color: "#F56C6C",
                  fontWeight: "bold",
                  fontSize: 15,
                  lineHeight: 22
                }
              }
            },
            lineStyle: {
              color: "#cfd6e4",
              width: 1
            },
            data: _this.signTableDate
          }
        ],

        animationEasing: "elasticOut",
        animationDuration: 1000
      };
    },
    handleSizeTreeChange() {
      this.pageOptionsTree.size = val;
      if (
        this.pageOptionsTree.current <=
        Math.ceil(this.pageOptionsTree.total / val)
      ) {
        this.initChart();
      }
    },
    // 分页当前页码改变
    handleCurrenthTreeChange(val) {
      this.pageOptionsTree.current = val;
      this.initChart();
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

.con-flow-img {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d1e7f7;
}

.con-right-btn {
}

.el-pagination__total {
  float: right;
}
.hdty-more-page {
  width: 100%;
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
}
#loadMoreBtn {
  /* 加载更多按钮的样式 */
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  cursor: pointer;
}

#loadMoreBtn:hover {
  background-color: #0056b3;
}
</style>

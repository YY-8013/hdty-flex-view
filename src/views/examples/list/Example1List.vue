<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="factorData" ref="componentRef">
          <hd-expand>
            <hd-expand-header>
              <el-form-item label="人员姓名" prop="xm">
                <hd-factor-input
                  style="width: 235px"
                  prop="xmFilterFactor"
                  fuzzy="between"
                  v-model="queryData.xm"
                  :model-control.sync="factorData.xmFilterFactor"
                  placeholder="请输入人员姓名"
                ></hd-factor-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="gmsfhm">
                <hd-factor-input
                  style="width: 235px"
                  prop="gmsfhmFilterFactor"
                  fuzzy="between"
                  v-model="queryData.gmsfhm"
                  :model-control.sync="factorData.gmsfhmFilterFactor"
                  placeholder="请输入身份证号"
                ></hd-factor-input>
              </el-form-item>
              <el-form-item prop="andor" slot="after">
                <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
              </el-form-item>
            </hd-expand-header>
            <hd-expand-body>
              <el-row>
                <el-form-item label="管辖机构" prop="sjgsdwdm">
                  <hd-organ
                    style="width: 235px"
                    v-model="queryData.sjgsdwdm"
                    :model-text.sync="extendData.sjgsdwdm"
                    placeholder="请选择管辖机构"
                  ></hd-organ>
                </el-form-item>
                <el-form-item label="当前位置" prop="dqwz">
                  <hd-region
                    style="width: 235px"
                    v-model="queryData.dqwz"
                    title="当前位置"
                    placeholder="请选择当前位置"
                  ></hd-region>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="录入时间" prop="lgsj">
                  <hd-date-picker
                    v-model="queryData.lgsj"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="请输入开始时间"
                    end-placeholder="请输入结束时间"
                    value-format="yyyyMMddHHmmss"
                    align="right"
                  ></hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-expand-body>
          </hd-expand>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button type="info" icon="el-icon-search" @click="handleQuery"
          >查询</hd-button
        >
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <div class="con-table" v-loading="triggerLoading">
        <div
          class="con-list hdty-scroll"
          v-if="tableData && tableData.length > 0"
        >
          <div
            v-for="(item, index) in tableData"
            :key="index"
            class="con-list-item"
          >
            <div class="list-item">
              <div class="con-img">
                <hd-image
                  v-model="item.vo.photoUrl"
                  width="88"
                  height="100%"
                  fit="cover"
                ></hd-image>
              </div>
              <div class="con-info">
                <div class="row">
                  <div class="text-size-18 text-bold text-right-10">
                    {{ item.vo.xm || "暂无姓名" }}
                  </div>
                  <div class="text-color-4 text-right-10">
                    <div v-show="item.vo.gmsfhm">
                      <span>({{ item.vo.gmsfhm }})</span>
                    </div>
                    <div v-show="!item.vo.gmsfhm">暂无身份证号</div>
                  </div>
                  <div class="text-right-10 pre-vertical-line">
                    {{ item.vox.xbdm || "暂无性别" }}
                  </div>
                  <div class="text-right-10">
                    {{ item.vox.mzdm || "暂无民族" }}
                  </div>
                  <!--列管级别-->
                  <div class="text-right-10">
                    <div
                      class="tag-dark back-color-1"
                      v-show="item.vo.wkjb === '1'"
                    >
                      {{ item.vox.wkjb }}
                    </div>
                    <div
                      class="tag-dark back-color-2"
                      v-show="item.vo.wkjb === '2'"
                    >
                      {{ item.vox.wkjb }}
                    </div>
                    <div
                      class="tag-dark back-color-3"
                      v-show="item.vo.wkjb === '3'"
                    >
                      {{ item.vox.wkjb }}
                    </div>
                    <div
                      class="tag-dark back-color-4"
                      v-show="item.vo.wkjb === '4'"
                    >
                      {{ item.vox.wkjb }}
                    </div>
                    <div
                      class="tag-dark back-color-5"
                      v-show="item.vo.wkjb === '5'"
                    >
                      {{ item.vox.wkjb }}
                    </div>
                    <div class="tag-dark back-color-99" v-show="!item.vo.wkjb">
                      暂无列管级别
                    </div>
                  </div>
                  <!--关注人员类型-->
                  <div v-if="item.vox.zdrylx" :title="item.vox.zdrylx">
                    <div v-if="item.vox.zdrylx.split(',').length < 3">
                      <div
                        class="tag-plain text-color-1 text-right-10"
                        v-for="(zdrylx, zdrylxIndex) in item.vox.zdrylx.split(
                          ','
                        )"
                        :key="zdrylxIndex"
                      >
                        {{ zdrylx }}
                      </div>
                    </div>
                    <div v-if="item.vox.zdrylx.split(',').length >= 3">
                      <div class="tag-plain text-color-1 text-right-10">
                        {{ item.vox.zdrylx.split(",")[0] }}
                      </div>
                      <div class="tag-plain text-color-1 text-right-10">
                        {{ item.vox.zdrylx.split(",")[1] }}
                      </div>
                      <div class="tag-plain text-color-1 text-right-10">
                        +{{ item.vox.zdrylx.split(",").length - 2 }}
                      </div>
                    </div>
                  </div>
                  <!--肇事肇祸级别 & 管控次数-->
                  <div class="flex text-bold last-row-item">
                    <div
                      v-if="item.vo && item.vo.currentLevel"
                      class="flex text-color-99"
                      style="margin-right: 20px"
                    >
                      <
                      <span>肇事肇祸级别：</span>
                      <div
                        v-show="
                          ['00', '01', '02'].includes(item.vo.currentLevel)
                        "
                        class="tag-dark back-color-3"
                      >
                        {{ item.vox.currentLevel }}
                      </div>
                      <div
                        v-show="
                          ['03', '04', '05'].includes(item.vo.currentLevel)
                        "
                        class="tag-dark back-color-1"
                      >
                        {{ item.vox.currentLevel }}
                      </div>
                      >
                    </div>
                    <div class="flex text-bold text-color-2">
                      管控次数：
                      <a href="javascript:;" class="text-clickable">{{
                        item.vo.dailyControlNum
                      }}</a>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <!--联系电话-->
                  <div class="row-item row-item-5">
                    <label>联系电话：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip">
                        {{ item.vo.lxdh || "暂无联系电话" }}
                      </div>
                    </div>
                  </div>
                  <!--数据状态-->
                  <div class="row-item row-item-6">
                    <label class="label-135">数据状态：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip">
                        <div class="text-color-5 text-bold" v-if="item.vo.gkzt">
                          {{ item.vox.gkzt }}
                        </div>
                        <div class="text-color-2 text-bold" v-else>
                          暂无数据状态
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--管控单位类型-->
                  <div class="row-item row-item-7">
                    <label class="label-135">管控单位类型：</label>
                    <div class="p-div">
                      <div
                        class="text-div hdty-elip text-bold text-color-2"
                        :title="item.vox.gkdwlx"
                      >
                        {{ item.vox.gkdwlx }}
                      </div>
                    </div>
                  </div>
                  <!--当前位置-->
                  <div class="row-item row-item-6">
                    <label>当前位置：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip" :title="item.vox.dqwz">
                        {{ item.vox.dqwz || "暂无当前位置" }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <!--录入时间-->
                  <div class="row-item row-item-5">
                    <label>录入时间：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip">
                        {{
                          item.vo.lgsj
                            ? $utilDate.dateFtt(
                                item.vo.lgsj,
                                "yyyy-MM-dd HH:mm:ss"
                              )
                            : "暂无录入时间"
                        }}
                      </div>
                    </div>
                  </div>
                  <!--户籍地责任民警-->
                  <div class="row-item row-item-6">
                    <label class="label-135">户籍地责任民警：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip" :title="item.vo.gkmj">
                        {{ item.vo.gkmj || "暂无户籍地责任民警" }}
                      </div>
                    </div>
                  </div>
                  <!--户籍地管控机构-->
                  <div class="row-item row-item-7">
                    <label class="label-135">户籍地管控机构：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip">
                        {{ "暂无户籍地管控机构" }}
                      </div>
                    </div>
                  </div>
                  <!--通用标签-->
                  <div class="row-item row-item-6">
                    <label>通用标签：</label>
                    <div class="p-div p-divs">
                      <div
                        class="text-div hdty-elip"
                        :title="item.vox.cgbqListStr"
                      >
                        {{ item.vox.cgbqListStr || "暂无通用标签" }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <!--更新时间-->
                  <div class="row-item row-item-5">
                    <label>更新时间：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip">
                        {{
                          item.vo.czsj
                            ? $utilDate.dateFtt(
                                item.vo.czsj,
                                "yyyy-MM-dd HH:mm:ss"
                              )
                            : "暂无更新时间"
                        }}
                      </div>
                    </div>
                  </div>
                  <!--现住地责任民警-->
                  <div class="row-item row-item-6">
                    <label class="label-135">现住地责任民警：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip" :title="item.vo.xzdMj">
                        {{ item.vo.xzdMj || "暂无现住地责任民警" }}
                      </div>
                    </div>
                  </div>
                  <!--现住地管控机构-->
                  <div class="row-item row-item-7">
                    <label class="label-135">现住地管控机构：</label>
                    <div class="p-div">
                      <div class="text-div hdty-elip">
                        {{ "暂无现住地管控机构" }}
                      </div>
                    </div>
                  </div>
                  <!--特定标签-->
                  <div class="row-item row-item-6">
                    <label>特定标签：</label>
                    <div class="p-div">
                      <div
                        class="text-div hdty-elip"
                        :title="item.vox.ryxzListStr"
                      >
                        {{ item.vox.ryxzListStr || "暂无特定标签" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="con-operate" style="width: 140px; min-width: inherit">
                <hd-button-container>
                  <hd-button type="primary">编辑</hd-button>
                  <hd-button type="danger">删除</hd-button>
                </hd-button-container>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-list" v-else>暂无数据</div>
      </div>
    </div>
    <div class="hdty-footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageOptions.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import { exampleData1 } from "./data/responseData";

export default {
  name: "PersonList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {},
  data() {
    return {
      // 查询
      queryData: {
        currentLevel: "",
        currentLevelList: [],
        xm: "",
        gmsfhm: "",
        zdrylx: [],
        ryxl: [],
        wkjb: [],
        gkdwlx: "",
        gkzt: [],
        spzt: [],
        dqwz: "",
        cgbqList: [],
        ryxzList: [],
        sjgsdwdm: "",
        lgsj: [],
        andor: this.$app.factorOptions.logicOpe.and
      },
      extendData: {
        gkzt: [],
        spzt: [],
        sjgsdwdm: ""
      },
      // 查询条件
      factorData: {
        xmFilterFactor: this.$app.factorOptions.matchOpe.between,
        gmsfhmFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 导出加载
      toggleLoading1: false,
      toggleLoading2: false,
      // 上传加载
      uploadLoading: false,
      // 上传文件
      file: [],
      showRcgkBaseOpe: false
    };
  },
  mounted() {
    // 加载数据表格
    this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      this.tableData = exampleData1;
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.pageOptions.current = 1;
          _this.loadList();
        }
      });
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>

<style lang="scss">
.person-import-message {
  .el-message__icon {
    display: none;
  }
}
</style>

<template>
  <div>
    <div style="cursor: pointer">
      <i class="el-icon-s-tools" style="font-size: 25px;color: #fff" @click="drawer = true"></i>
    </div>
    <el-drawer
      title="系统设置"
      :visible.sync="drawer"
      custom-class="hdty-drawer-large-big"
      direction="rtl"
    >
      <el-tabs v-model="activeName" tab-position="left" type="card" style="height: 100%">
        <el-tab-pane name="first">
          <span slot="label">
            <i class="el-icon-date"></i> 任务中心
          </span>
          <div style="background-color: #F6F6F6;padding: 10px;">
            <div class="hdty-card">
              <div class="hdty-card-header">
                <div class="hdty-card-title">任务截止时间设置</div>
              </div>
              <div class="hdty-card-body" style="background-color: #fff;border-radius: 8px;">
                <div class="hdty-card-body-item">
                  默认任务截止时间间隔
                  <div style="float: right">
                    <span v-if="!flag">{{mrvalue}} 天</span>
                    <i
                      class="el-icon-edit"
                      v-if="!flag"
                      @click="flag = true"
                      style="cursor: pointer"
                    ></i>
                    <el-input
                      v-if="flag"
                      size="mini"
                      v-model="mrvalue"
                      @blur="flag = false"
                      @change="flag = false"
                      style="width: 100px"
                    ></el-input>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  矛盾纠纷任务截止时间间隔
                  <div style="float: right">
                    <span>7</span> 天
                    <i class="el-icon-edit"></i>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  实有人口漏登任务截止时间间隔
                  <div style="float: right">
                    <span>7</span> 天
                    <i class="el-icon-edit"></i>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  旅店日常检查任务截止时间间隔
                  <div style="float: right">
                    <span>30</span> 天
                    <i class="el-icon-edit"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="hdty-card">
              <div class="hdty-card-header">
                <div class="hdty-card-title">任务移交相关设置</div>
              </div>
              <div class="hdty-card-body" style="background-color: #fff;border-radius: 8px;">
                <div class="hdty-card-body-item">
                  是否开通移交
                  <div style="float: right">
                    <el-switch v-model="value"></el-switch>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  移交次数限制
                  <div style="float: right">
                    <span>7</span>
                    <i class="el-icon-edit"></i>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  可移交机构类型
                  <div style="float: right">
                    <span>无限制</span>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  不支持移交的表单
                  <div style="float: right">
                    <i class="el-icon-arrow-right" @click="handleYjbd"></i>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  移交次数
                  <div style="float: right">
                    <span style="color: #A8A9AA">未设置</span>
                    <i class="el-icon-arrow-right" @click="handleYjbd"></i>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  移交次数
                  <div style="float: right">
                    <span style="color: #A8A9AA">7</span>
                  </div>
                  <div style="color: #A8A9AA;margin-top: 10px;">暂无权限设置移交次数，如需修改，请向市局用户反馈。</div>
                </div>
              </div>
            </div>
            <div class="hdty-card">
              <div class="hdty-card-header">
                <div class="hdty-card-title">任务指派相关设置</div>
              </div>
              <div class="hdty-card-body" style="background-color: #fff;border-radius: 8px;">
                <div class="hdty-card-body-item">
                  是否开通指派
                  <div style="float: right">
                    <el-switch v-model="value"></el-switch>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  任务指派类型
                  <div style="float: right">
                    <!-- <span>逐级指派</span> <i class="el-icon-arrow-right"></i>-->
                    <el-radio-group v-model="zptype">
                      <el-radio :label="'1'">逐级指派</el-radio>
                      <el-radio :label="'2'">可跨级指派</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">
            <i class="el-icon-setting"></i> 其他设置
          </span>
          <div style="background-color: #F6F6F6;padding: 10px;">
            <div class="hdty-card">
              <div class="hdty-card-header">
                <div class="hdty-card-title">任务指派相关设置</div>
              </div>
              <div class="hdty-card-body" style="background-color: #fff;border-radius: 8px;">
                <div class="hdty-card-body-item">
                  是否开通指派
                  <div style="float: right">
                    <el-switch v-model="value"></el-switch>
                  </div>
                </div>
                <div class="hdty-card-body-item">
                  任务指派类型
                  <div style="float: right">
                    <!-- <span>逐级指派</span> <i class="el-icon-arrow-right"></i>-->
                    <el-radio-group v-model="zptype">
                      <el-radio :label="'1'">逐级指派</el-radio>
                      <el-radio :label="'2'">可跨级指派</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <el-dialog title="不支持移交的表单" :visible.sync="yjbdVisible" width="400px" append-to-body>
      <!--选择表单-->
      <biz-form-select v-model="formIdList" multiple ref="formSelectRef" placeholder="请选择标准件类型"></biz-form-select>
      <div style="padding: 15px 0;color: #409EFF;font-size: 16px;">当前配置的不可移交的表单：</div>
      <div class="hdty-card">
        <el-tag type="success" closable size="small" style="margin-bottom: 5px;">矛盾纠纷排查</el-tag>
        <el-tag type="success" closable size="small" style="margin-bottom: 5px;">废旧金属检查</el-tag>
        <el-tag type="success" closable size="small" style="margin-bottom: 5px;">公章刻制检查</el-tag>
        <el-tag type="success" closable size="small" style="margin-bottom: 5px;">文博单位检查</el-tag>
        <el-tag type="success" closable size="small" style="margin-bottom: 5px;">娱乐场所检查</el-tag>
        <el-tag type="success" closable size="small" style="margin-bottom: 5px;">开锁业检查</el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="yjbdVisible = false">取 消</el-button>
        <el-button type="primary" @click="yjbdVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
export default {
  name: 'SetUp',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  // 组件的其他选项
  data() {
    return {
      // 数据定义
      drawer: false,
      value: true,
      zptype: '1',
      flag: false,
      mrvalue: '7',
      yjbdVisible: false,
      formIdList: [],
      activeName: 'first'
    };
  },
  methods: {
    // 方法定义
    handleYjbd() {
      this.yjbdVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
/* 组件的局部样式 */
::v-deep .el-drawer__header {
  font-size: 16px !important;
}
.hdty-card-title {
  font-size: 16px;
}
.hdty-card-body-item {
  padding: 10px 0px;
  font-size: 16px;
  border-bottom: 1px solid #eaebed;
  div {
    i {
      cursor: pointer;
    }
  }
  &:last-child {
    border-bottom: 0;
  }
}
</style>

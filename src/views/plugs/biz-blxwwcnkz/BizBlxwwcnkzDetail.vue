<template>
  <el-dialog title="详情" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit v-loading="handleLoading">
      <div class="con-area">
        <div class="area-head">
          <div class="head">
            <i class="el-icon-document-copy"></i>
            有严重不良行为未成年人扩展信息
          </div>
        </div>
        <div class="area-body">
          <el-card class="con-card box-card">
            <div class="body">
              <div class="form">
                <!--家庭监护状况,1-父母，2-父亲，3-母亲，4-祖父母或者外祖父母，5-无-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">家庭监护状况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jtjhzkText}}</div>
                    </div>
                  </div>
                </div>
                <!--受教育情况,1-上学，2-辍学，3-已完成义务教育-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">受教育情况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.sjyqkText}}</div>
                    </div>
                  </div>
                </div>
                <!--学校名称-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">学校名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.xxmc}}</div>
                    </div>
                  </div>
                </div>
                <!--父母状况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">父母状况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.fmzkText}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人一姓名-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人一
                      <br />姓名
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhryXm}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人一身份证号-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人一
                      <br />身份证号
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhryGmsfhm}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人一手机号码-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人一
                      <br />手机号码
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhrySjhm}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人一与未成年人关系-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人一
                      <br />与未成年人关系
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhryYwcnrgxText}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人二姓名-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人二
                      <br />姓名
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhreXm}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人二身份证号-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人二
                      <br />身份证号
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhreGmsfhm}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人二手机号码-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人二
                      <br />手机号码
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhreSjhm}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人二与未成年人关系-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人二
                      <br />与未成年人关系
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhreYwcnrgxText}}</div>
                    </div>
                  </div>
                </div>
                <!--监护人二与未成年人关系-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      监护人二
                      <br />与未成年人关系
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jhreYwcnrgxText}}</div>
                    </div>
                  </div>
                </div>
                <!--严重危害社会行为类别-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      严重危害
                      <br />社会行为类别
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.yzwhshxwlbText}}</div>
                    </div>
                  </div>
                </div>
                <!--处罚情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">处罚情况</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.cfqkText}}</div>
                    </div>
                  </div>
                </div>
                <!--矫治情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">矫治情况</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.jzqkText}}</div>
                    </div>
                  </div>
                </div>
                <!--矫治教育措施-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">矫治教育措施</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.jzjycsText}}</div>
                    </div>
                  </div>
                </div>
                <!--提请专门教育情形-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">
                      提请
                      <br />专门教育情形
                    </label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.tqzmjyqxText}}</div>
                    </div>
                  </div>
                </div>
                <!--专门学校名称-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">专门学校名称</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.zmxxmc}}</div>
                    </div>
                  </div>
                </div>
                <!--专门学校地址-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">专门学校地址</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.zmxxdz}}</div>
                    </div>
                  </div>
                </div>
                <!--专门学校期限-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">专门学校期限</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.zmxxqx}}</div>
                    </div>
                  </div>
                </div>
                <!--刑事案件类别-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">刑事案件类别</label>
                    <div class="p-div">
                      <div class="text-div">{{formData.ajlbText}}</div>
                    </div>
                  </div>
                </div>
                <!--简要情况-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">简要情况</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jyqk}}</div>
                    </div>
                  </div>
                </div>
                <!--经常活动场所-->
                <div class="form-row">
                  <div class="form-item-24 form-item">
                    <label class="label">经常活动场所</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{formData.jchdcs}}</div>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <!--录入时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入时间</label>
                    <div class="p-div p-divs">
                      <div
                        class="text-div"
                      >{{ $utilDate.dateFtt(formData.lrsj, 'yyyy-MM-dd HH:mm:ss') }}</div>
                    </div>
                  </div>
                  <!--修改时间-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改时间</label>
                    <div class="p-div p-divs">
                      <div
                        class="text-div"
                      >{{ $utilDate.dateFtt(formData.xgsj, 'yyyy-MM-dd HH:mm:ss') }}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入单位名称-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入单位名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.lrdwmc }}</div>
                    </div>
                  </div>
                  <!--修改单位名称-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改单位名称</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.xgdwmc }}</div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <!--录入人姓名-->
                  <div class="form-item-12 form-item">
                    <label class="label">录入人姓名</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.lrrxm }}</div>
                    </div>
                  </div>
                  <!--修改人姓名-->
                  <div class="form-item-12 form-item">
                    <label class="label">修改人姓名</label>
                    <div class="p-div p-divs">
                      <div class="text-div">{{ formData.xgrxm }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';

export default {
  name: 'bizblxwwcnkzDetail',
  provide() {
    return {
      BizblxwwcnkzDetail: this
    };
  },
  inject: ['bizblxwwcnkz'],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {},
      // 行
      row: {}
    };
  },
  methods: {
    // 初始化执行的方法
    beforeLoadForm() {
      this.$nextTick(() => {
        // 清空表单
        this.resetForm();
        // 加载表单
        this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.handleLoading = true;
      _this.formData = _this.row;
      _this.handleLoading = false;
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {};
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="hdty-fill hdty-base-bg">
    <div class="hdty-container hdty-scroll">
      <fieldset :id="dirData[0].id" class="hdty-fieldset-title">
        <legend>主题风格</legend>
      </fieldset>
      <button1></button1>
      <fieldset :id="dirData[1].id" class="hdty-fieldset-title">
        <legend>图标按钮</legend>
      </fieldset>
      <button2></button2>
      <fieldset :id="dirData[2].id" class="hdty-fieldset-title">
        <legend>只读状态</legend>
      </fieldset>
      <button3></button3>
      <fieldset :id="dirData[3].id" class="hdty-fieldset-title">
        <legend>禁用状态</legend>
      </fieldset>
      <button4></button4>
      <fieldset :id="dirData[4].id" class="hdty-fieldset-title">
        <legend>尺寸</legend>
      </fieldset>
      <button5></button5>
      <fieldset :id="dirData[5].id" class="hdty-fieldset-title">
        <legend>超大尺寸</legend>
      </fieldset>
      <button6></button6>
      <fieldset :id="dirData[6].id" class="hdty-fieldset-title">
        <legend>超小尺寸</legend>
      </fieldset>
      <button7></button7>
      <fieldset :id="dirData[7].id" class="hdty-fieldset-title">
        <legend>固定尺寸</legend>
      </fieldset>
      <button8></button8>
      <fieldset :id="dirData[8].id" class="hdty-fieldset-title">
        <legend>流体按钮</legend>
      </fieldset>
      <div class="hdty-title hdty-title-plain">
        按钮元素使用class="hdty-btn-fluid"，即可形成一个宽度最大化适应父级元素的按钮，即流体按钮，按钮本身主题、风格、尺寸仍可随意搭配
      </div>
      <button9></button9>
      <fieldset :id="dirData[9].id" class="hdty-fieldset-title">
        <legend>按钮组</legend>
      </fieldset>
      <div class="hdty-title hdty-title-plain">
        将按钮放入&lt;el-button-group&gt;&lt;/el-button-group&gt;组件中，即可形成按钮组，按钮本身主题、风格、尺寸仍可随意搭配
      </div>
      <button10></button10>
      <fieldset :id="dirData[10].id" class="hdty-fieldset-title">
        <legend>按钮容器</legend>
      </fieldset>
      <div class="hdty-title hdty-title-plain">
        尽管按钮在同节点并排时会自动拉开间距，但在按钮太多的情况，效果并不是很好，这时需要用到按钮容器。
        将按钮放入class="hdty-btn-container"元素中，即可形成间距效果更友好的按钮集合，按钮本身主题、风格、尺寸仍可随意搭配
      </div>
      <button11></button11>
      <fieldset :id="dirData[11].id" class="hdty-fieldset-title">
        <legend>单选按钮</legend>
      </fieldset>
      <button12></button12>
      <fieldset :id="dirData[12].id" class="hdty-fieldset-title">
        <legend>多选按钮</legend>
      </fieldset>
      <button13></button13>
      <fieldset :id="dirData[13].id" class="hdty-fieldset-title">
        <legend>下拉按钮</legend>
      </fieldset>
      <button14></button14>
    </div>
    <div class="hdty-dir is-inside-right">
      <div class="hdty-dir-title">
        目录
      </div>
      <ul class="hdty-dir-content">
        <li
          v-for="(item, index) in dirData"
          :key="index"
          class="hdty-dir-item"
          :class="{ 'is-active': dirActiveIndex === index }">
          <a href="javascript:;" @click="handleDirClick(index, item)">
            {{ item.label }}
          </a>
        </li>
        <div
          class="hdty-dir-item hdty-center">
          <a href="javascript:;" @click="handleDirClick(0, dirData[0])">
            返回顶部
            <i class="icon-caret-top"></i>
          </a>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import Button1 from "./Button1";
  import Button2 from "./Button2";
  import Button3 from "./Button3";
  import Button4 from "./Button4";
  import Button5 from "./Button5";
  import Button6 from "./Button6";
  import Button7 from "./Button7";
  import Button8 from "./Button8";
  import Button9 from "./Button9";
  import Button10 from "./Button10";
  import Button11 from "./Button11";
  import Button12 from "./Button12";
  import Button13 from "./Button13";
  import Button14 from "./Button14";
  export default {
    name: "ExampleButton",
    components: {
      Button1,
      Button2,
      Button3,
      Button4,
      Button5,
      Button6,
      Button7,
      Button8,
      Button9,
      Button10,
      Button11,
      Button12,
      Button13,
      Button14
    },
    data() {
      return {
        dirActiveIndex: 0,
        dirData: [
          {
            id: 'ExampleButton_Dir_' + 1,
            label: '主题风格'
          },
          {
            id: 'ExampleButton_Dir_' + 2,
            label: '图标按钮'
          },
          {
            id: 'ExampleButton_Dir_' + 3,
            label: '只读状态'
          },
          {
            id: 'ExampleButton_Dir_' + 4,
            label: '禁用状态'
          },
          {
            id: 'ExampleButton_Dir_' + 5,
            label: '尺寸'
          },
          {
            id: 'ExampleButton_Dir_' + 6,
            label: '超大尺寸'
          },
          {
            id: 'ExampleButton_Dir_' + 7,
            label: '超小尺寸'
          },
          {
            id: 'ExampleButton_Dir_' + 8,
            label: '固定尺寸'
          },
          {
            id: 'ExampleButton_Dir_' + 9,
            label: '流体按钮'
          },
          {
            id: 'ExampleButton_Dir_' + 10,
            label: '按钮组'
          },
          {
            id: 'ExampleButton_Dir_' + 11,
            label: '按钮容器'
          },
          {
            id: 'ExampleButton_Dir_' + 12,
            label: '单选按钮'
          },
          {
            id: 'ExampleButton_Dir_' + 13,
            label: '多选按钮'
          },
          {
            id: 'ExampleButton_Dir_' + 14,
            label: '下拉按钮'
          }
        ]
      }
    },
    methods: {
      // 切换目录
      handleDirClick(index, val) {
        this.dirActiveIndex = index;
        let anchorElement = this.$el.querySelector('#' + val.id);
        if(anchorElement) {
          anchorElement.scrollIntoView();
        }
      }
    }
  }
</script>

<style scoped>

</style>

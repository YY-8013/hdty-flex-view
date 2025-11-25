<template>
  <div class="hdty-container hdty-scroll">
    <div class="hdty-blockquote hdty-blockquote-light">
      本篇主要介绍如何利用动态模板渲染组件来渲染页面。在实际开发中，我们常常会碰到因某个值改变而需要变动页面某部分HTML结构的问题，有时变动小，我们直接写判断语句来渲染不同的DOM，有时变动大，我们则会写不同的组件来渲染。
      <br>
      而当这种变动大且多时，我们再开发的代码，内部逻辑庞杂，组件调用繁多，不仅开发周期长，代码也开始极难维护。对于这种情况，我们就需要一种更容易的方式，而动态模板渲染组件，就是为了解决这个问题而生。
      <br>
      它可以将一个模板字符串转换成DOM插入在目标上下文中，这样我们通过简单的配置模板字符串，就可以让页面渲染成自己想要的效果，我们先从简单的渲染一个标题元素开始。
    </div>
    <fieldset class="hdty-fieldset-title">
      <legend>使用前注意事项</legend>
    </fieldset>
    <div class="hdty-blockquote hdty-blockquote-light">
      在使用前，请注意，该功能会用到vue的模板编译器，由于我们的vue项目是运行构建模式，需要在webpack配置文件中引入完整版的vue包，找到项目build目录下的webpack.base.conf.js文件，代码如下：
      <pre style="height: 104px;">
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
      </pre>
      在hdty-framework-web模板项目中，已经引入该包，由于vue独立构建会比运行构建增加70%体积，如果您的项目不会使用该功能，我们强烈建议您删除或注释该部分引用代码。
    </div>
    <fieldset class="hdty-fieldset-title">
      <legend>简单渲染一个标题元素</legend>
    </fieldset>
    <hd-build-template :template="titleTemplate"></hd-build-template>
    <fieldset class="hdty-fieldset-title">
      <legend>动态绑定标题文字</legend>
    </fieldset>
    <div class="hdty-title hdty-title-plain">
      模板字符串中依旧可以使用vue的全部模板语法，比如我们使用<span v-html="'{{...}}'"></span>（双大括号）插入标题文字， 然后使用input输入框的v-model指令来实现双向数据绑定
    </div>
    <hd-build-template :template="activeTitleTemplate"></hd-build-template>
    <div class="hdty-inline">
      <el-input v-model="title" size="mini"></el-input>
    </div>
    <fieldset class="hdty-fieldset-title">
      <legend>渲染一个计数器</legend>
    </fieldset>
    <div class="hdty-title hdty-title-plain">
      我们继续为模板字符串加上一个事件处理器，实现点击按钮触发绑定的数据对象更新
    </div>
    <hd-build-template :template="activeCounterTemplate"></hd-build-template>
    <fieldset class="hdty-fieldset-title">
      <legend>渲染一个卡片列表</legend>
    </fieldset>
    <div class="hdty-title hdty-title-plain">
      再通过使用条件语句和循环语句等，我们就可以实现一些复杂的功能，比如渲染一个不同人员的名片列表
    </div>
    <hd-build-template :template="activeCardListTemplate"></hd-build-template>
  </div>
</template>

<script>
  export default {
    name: "ExampleBuildTemplate",
    data() {
      return {
        title: '标题文字',
        count: 0,
        list: [
          {
            id: '1',
            name: '张三',
            cardId: '110101199903070471',
            gender: '男',
            age: '23岁',
            workingYears: '工龄1年',
            post: '前端工程师',
            company: 'Web前端实验所',
            entryDate: '2022-01-01',
            birthDate: '1990-03-07',
            department: '研发中心-研发部',
            nation: '汉族',
            photo: ''
          },
          {
            id: '2',
            name: '李四',
            cardId: '110101199903070471',
            gender: '男',
            age: '23岁',
            workingYears: '工龄1年',
            post: '前端工程师',
            company: 'Web前端实验所',
            entryDate: '2022-01-01',
            birthDate: '1990-03-07',
            department: '研发中心-研发部',
            nation: '汉族',
            photo: ''
          },
          {
            id: '3',
            name: '王五',
            cardId: '110101199903070471',
            gender: '男',
            age: '23岁',
            workingYears: '工龄1年',
            post: '前端工程师',
            company: 'Web前端实验所',
            entryDate: '2022-01-01',
            birthDate: '1990-03-07',
            department: '研发中心-研发部',
            nation: '汉族',
            photo: ''
          },
          {
            id: '4',
            name: '赵六',
            cardId: '110101199903070471',
            gender: '男',
            age: '23岁',
            workingYears: '工龄1年',
            post: '前端工程师',
            company: 'Web前端实验所',
            entryDate: '2022-01-01',
            birthDate: '1990-03-07',
            department: '研发中心-研发部',
            nation: '汉族',
            photo: ''
          },
          {
            id: '5',
            name: '孙七',
            cardId: '110101199903070471',
            gender: '男',
            age: '23岁',
            workingYears: '工龄1年',
            post: '前端工程师',
            company: 'Web前端实验所',
            entryDate: '2022-01-01',
            birthDate: '1990-03-07',
            department: '研发中心-研发部',
            nation: '汉族',
            photo: ''
          }
        ]
      }
    },
    computed: {
      titleTemplate() {
        return '<h2>这是一个标题元素</h2>';
      },
      activeTitleTemplate() {
        return '<h2>{{title}}</h2>';
      },
      activeCounterTemplate() {
        return '<div><el-button @click="handleCount">计数器</el-button><span class="hdty-aux">计数器被点击了{{count}}次</span></div>';
      },
      activeCardListTemplate() {
        let operationTem = '<div class="hdty-flex-fit hdty-right-space24 hdty-separator"><div class="hdty-btn-container hdty-content-middle" fill><el-button type="warning" @click="handleDetail(item)">详情</el-button></div></div>';
        let photoTem = '<div class="hdty-flex-fit"><hd-image :src="item.photo" :width="100" height="100%"></hd-image></div>';
        let contentHeaderTem = '<div class="hdty-col-md12"><h4 class="hdty-inline">{{item.name}}</h4><span class="hdty-aux">{{item.cardId}}</span><span class="hdty-aux">{{item.gender}}</span><span class="hdty-aux">{{item.age}}</span><span class="hdty-aux">{{item.workingYears}}</span><el-tag type="danger" effect="plain">{{item.post}}</el-tag><span class="hdty-aux hdty-float-right">就职于：{{item.company}}</span></div>';
        let contentBodyTem = '<div class="hdty-col-md6"><div class="hdty-form-label">入职日期</div><div class="hdty-form-content">{{item.entryDate}}</div></div><div class="hdty-col-md6"><div class="hdty-form-label">所在部门</div><div class="hdty-form-content">{{item.department}}</div></div><div class="hdty-col-md6"><div class="hdty-form-label">出生日期</div><div class="hdty-form-content">{{item.birthDate}}</div></div><div class="hdty-col-md6"><div class="hdty-form-label">民  族</div><div class="hdty-form-content">{{item.nation}}</div></div>';
        let contentTem = '<div class="hdty-flex-fill"><div class="hdty-fluid hdty-fluid-space24"><div class="hdty-row hdty-col-space10">' + contentHeaderTem + contentBodyTem + '</div></div></div>';
        return '<div class="hdty-content"><div v-for="item in list" :key="item.id" class="hdty-card"><div class="hdty-card-body hdty-flex hdty-flex-stretch">' + operationTem + contentTem + photoTem + '</div></div></div>';
      }
    },
    methods: {
      handleCount() {
        this.count++;
      },
      handleDetail(row) {
        this.$message({
          showClose: true,
          customClass: 'is-wrap',
          message: '姓名：'+row.name+'，身份证号：'+row.cardId+'，性别：'+row.gender+'，'+row.age+'，就职于：'+row.company+'，任职为：'+row.post+'，'+row.workingYears+'。',
          type: 'warning',
          offset: 76,
          duration: 0
        });
      }
    }
  }
</script>

<style scoped>
  h2 + .hdty-inline {
    margin-top: 12px;
  }
  .hdty-fluid.hdty-fluid-space24 {
    padding: 10px 24px;
  }
  .hdty-form-label {
    width: 56px;
    padding: 0;
  }
  .hdty-form-content {
    margin-left: 68px;
  }
</style>

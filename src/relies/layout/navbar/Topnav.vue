<template>
  <ul class="hdty-nav hdty-flex">
    <li
      v-for="(item, index) in navigations"
      class="hdty-nav-item"
      :class="{ 'is-active':activeNavIndex === index }">
      <a
        href="javascript:;"
        class="hdty-content-middle"
        @click="handleNavItem(item, index)">
        <span>
          <i :class="item.icon"></i>
          <h6>{{ item.name }}</h6>
        </span>
      </a>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "Topnav",
    props: {
      value: {
        type: [Number, String],
        default: ''
      },
      navigations: [Array, Object]
    },
    computed: {
      activeNavIndex: {
        get() {
          if (!this.$utilStr.isEmpty(this.value)) {
            return Number(this.value);
          }
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    },
    methods: {
      handleNavItem(val, index) {
        this.activeNavIndex = index;
        this.$emit('currentChanged', val);
        if (!val.children) {
          let routeData = this.$router.resolve({name: val.code});
          if (routeData.route.meta.viewType === this.$global.dictItem.routerViewType.App) {
            window.open(routeData.href, '_blank');
          } else {
            this.$router.push({name: val.code});
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>

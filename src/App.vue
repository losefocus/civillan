<template>
	<div id="app">
			<router-view></router-view>
	</div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      
    };
  },
  watch: {},
  created() {},
  methods: {},
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.el-menu-item.is-active{
  background-color: #30a487 !important;
  color:#fff !important;
}
.el-submenu .el-menu-item:hover{
  background-color: #3abf9e !important;
  color:#fff !important;
}
.el-menu-item:hover i{
  color:#fff !important;
}
.el-tabs__item:hover{
  color:#30a487 !important
}
.el-tabs__item.is-active{
  color:#30a487 !important
}
.el-tabs__active-bar{
  background-color:#30a487 !important
}
.el-button--primary{
  background-color: #30a487 !important;
  border-color: #30a487 !important;
}
.el-button--primary:focus, .el-button--primary:hover{
  background-color: #3abf9e !important;
  border-color: #3abf9e !important;
}
.el-button--primary.is-active, .el-button--primary:active{
  background-color: #288870 !important;
  border-color: #288870 !important;
}
.el-menu--horizontal>.el-menu-item.is-active{
  border-bottom: 2px solid #30a487 !important;
}
.el-submenu__title:focus, .el-submenu__title:hover{
  background-color: #e4e4e4 !important;
}
.el-table__expanded-cell[class*=cell]{
  padding: 0;
  padding-left: 47px
}
#subTable{
  border-top: none;
  border-bottom: none;
}
#subTable tr:last-child td{
  border-bottom: none !important;
}
#subTable .lastTd{
  border-right:none !important;
}
#subTable .el-table__header-wrapper{
  display: none
}
.el-table__expanded-cell{
  border-right: none !important;
}
#subTable.el-table::before{
  height: 0 !important;
}
</style>
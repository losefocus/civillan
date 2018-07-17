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

.el-table td, .el-table th{
  padding: 5px 0!important
}
.el-table__header th{
  background: #f3f3f3 !important
}

.el-table__expanded-cell[class*=cell]{
  padding: 0 !important;
  padding-left: 47px !important;
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
.el-table__expanded-cell .el-table th,.el-table__expanded-cell .el-table tr{
  background: #fbfbfb
}
#subTable.el-table::before{
  height: 0 !important;
}
// .el-form-item__error{
//     padding-top: 2px !important
// }

.projectManage .el-dialog__body,#product .el-dialog__body{
    padding-top: 0 !important
}

#mapPosition .el-dialog__header{
    position: absolute;
    right: 0;
    z-index: 9999;
}
#mapPosition .el-dialog__body{
    padding: 0!important;
}
#mapPosition .amap-ui-poi-picker-search-results-container.amap-pl-pc.dock-bottom{
    display: none!important;
}


.expand .el-table__expand-column .cell {
    display: none !important;
}

#messageContent .el-upload{
  width: calc(100% - 2px)
}
</style>
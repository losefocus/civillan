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
  background: #f7f7f7 !important;
  color: #666;
  font-weight: bold
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
#subTable.el-table::before{
  height: 0 !important;
}
.projectManage .el-dialog__body,#product .el-dialog__body,.device_ .el-dialog__body{
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
.el-table__expanded-cell .el-table td{
  border: none
}
#help .el-tabs__header{
  margin-bottom: 30px !important
}
#help .el-collapse-item__header{
  background-color: #fbfbfb!important
}
.notify .el-progress-bar__outer{
    background-color:#0089C8 !important
}
.notify .el-progress__text{
    color:#fff !important;
    padding-left:10px;
}


.amap-info-content{
  background: none;
  border: none;
  padding: 0;
}
.amap-info-outer{
  background: none;
  border: none;
  padding: 0;
}
.amap-marker-label{
  padding: 0;
  border: none;
  background: none;
}
.amap-info-close:link{
  text-decoration: none;
}
.amap-info-close{
  color:#fff;
  right:10px !important;
}
.info-group{
  display: flex;
  flex-wrap:wrap ;
  justify-content: space-around;
  padding: 0 5px;
}
.info-group li{
  float: left;
  width:46px;
  height:19px;
  font-size :12px;
  text-align :center;
  line-height :20px;
  color :#ffffff;
  background:rgba(173,173,173,1);
  border-radius:2px;
}
.info-title{
  width: 260px;
  font-size:16px;
  font-weight: bold;
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
}
.info-time{
  width:165px;
  height:25px;
  background:rgba(0,0,0,0.5);
  border-radius:25px 0 0 25px;
  position:absolute;
  right: 0;
  bottom: 10px;
  color: #ffffff;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
}

.amap-logo{
  display: none !important;
}
.amap-copyright{
  display: none !important;
}

#pane-user .el-form-item__error{
  padding-top: 0
}
</style>
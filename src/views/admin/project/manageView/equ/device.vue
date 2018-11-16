<template>
    <div class="clearfix">
        <div style="padding-bottom:10px;">设 备 : {{dataInfo.name}}</div>
        <div style="border:1px solid #ebeef5;padding:10px" v-loading="listLoading">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in list" :label="item.id" :key="index" style="width:145px;margin-left:10px;">
                    <el-tooltip placement="top">
                        <div slot="content">{{item.name}}<br/>{{item.key}}</div>
                        <div style="display: inline-block;vertical-align: middle;">
                            <p style="width:100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.name}}</p>
                            <p style="font-size:12px;color:#ccc;width:100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.key}}</p>
                        </div>
                    </el-tooltip>
                    
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <el-button class="pull-right" type="primary" size="mini" style="margin-top:20px" @click="save" :loading="saveLoading">保存</el-button>
    </div>
</template>

<script>
  import {fetchDeviceList, deviceRelationList, bindDevice} from "@/api/device/device";

  export default {
    props:['dataInfo'],
    data() {
      return {
        listLoading:false,
        saveLoading:false,
        checkAll: false,
        checkedList: [],
        list: [],
        checkAllList:[],
        isIndeterminate: true,
        listQuery: {
            projectId:this.dataInfo.projectId,
            page_index: 1,
            page_size: 99999
        },
        userListQuery:{
            deviceId:this.dataInfo.id,
            page_index: 1,
            page_size: 99999
        }
      };
    },
    created(){
        this.getList()
        this.getBindList()
    },
    methods: {
        getList(){
            this.listLoading = true
            let type = this.dataInfo.type
            fetchDeviceList(type).then(res => {
                this.list = res.data.result
                this.listLoading = false
            })
        },
        getBindList(){
            deviceRelationList(this.userListQuery).then(res =>{
                let list_ = res.data.result.items
                list_.forEach(ele => {
                    this.checkedList.push(ele.relationId)
                });
            })
        },
        handleCheckAllChange(val) {
            this.checkedList = val ? this.checkAllList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.list.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
        },
        save(){
            this.saveLoading = true
            let data = {
                project_id:this.dataInfo.projectId,
                device_id:this.dataInfo.id,
                relation_ids:this.checkedList.join(','),
            }
            bindDevice(data).then(res => {
                if(res.data.success == true){
                    this.$notify({
                        title: "成功",
                        message: res.data.message,
                        type: "success",
                        duration: 2000
                    });
                }else{
                    this.$notify({
                        title: "失败",
                        message: res.data.message,
                        type: "error",
                        duration: 2000
                    });
                }
                this.$parent.$parent.personnelVisible = false
                this.saveLoading = false
            }).catch(err => {
                this.saveLoading = false
            })
        },
    }
}
</script>
<style scoped>

</style>


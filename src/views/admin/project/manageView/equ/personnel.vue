<template>
    <div class="clearfix">
        <div style="padding-bottom:10px;">设 备 : {{dataInfo.name}}</div>
        <div style="border:1px solid #ebeef5;padding:10px" v-loading="listLoading">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <!-- <div style="margin: 15px 0;"></div> -->
            <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(city,index) in list" :label="city.id" :key="index" style="width:104px;margin-left:0px;">{{city.name}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <el-button class="pull-right" type="primary" size="mini" style="margin-top:20px" @click="save" :loading="saveLoading">保存</el-button>
    </div>
</template>

<script>
  import {addDeviceUser, fetchUserList, getDeviceUser} from "@/api/project_per";

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
            fetchUserList(this.listQuery).then(res => {
                let lists = res.data.result.items
                this.list = lists.filter( li => li.userRole[0].projectRole.alias == 'worker')
                this.list.forEach(ele => {
                    this.checkAllList.push(ele.id)
                });
                this.listLoading = false
            })
        },
        getBindList(){
            getDeviceUser(this.userListQuery).then(res =>{
                let list_ = res.data.result.items
                list_.forEach(ele => {
                    this.checkedList.push(ele.projectUser.id)
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
                user_ids:this.checkedList.join(','),
            }
            addDeviceUser(data).then(res => {
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


<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <el-form :model="form" class="clearfix" ref="form" size="mini">
            <el-form-item label="配置名称" style="width: 240px" label-width="70px" >
                <el-input v-model="form.name" size="mini" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="配置内容" style="width: 240px;margin-left:10px;" label-width="70px" >
                <el-input v-model="form.value" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  style="width: 150px" class="pull-right" label-width="0" >
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else>
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right"  @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="配置名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="配置内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.$index, list)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.$index, list)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {getObj,setObj} from "@/api/device/config";

export default {
    props:['dataInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
            form:{
                name:'',
                value:'',
            },
            flag:'add',
            listQuery:{
                deviceId:this.dataInfo.id,
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            templateData:{}
        }
    },
    created() {
        this.getList()
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["configList"]),
    },
    methods:{
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        getList(){
            this.listLoading = true
            // let id
            // this.productInfo.productTemplate.forEach(element => {
            //     if(element.type === 1)id = element.id
            // });
            let data_ = {
                device_id:this.dataInfo.id,
                key:'device_config'
            }
            getObj(data_).then(res => {
                this.list = []
                this.total = 0
                let data = res.data.result
                this.templateData = data
                if(data.content && data.content !=''){
                    this.list = JSON.parse(data.content)
                    this.total = this.list.length
                }
                this.listLoading = false
            })
        },
        handleAdd(){
            let obj = Object.assign({},this.form)
            obj.status = obj.status?1:0
            let [...dataList] = this.list
            dataList.push(obj)
            this.templateData.content = JSON.stringify(dataList)
            this.createdLoading = true
            this.setContent()
        },
        deleteList(index,rows){
            rows.splice(index, 1);
            let content = (rows.length!=0)?JSON.stringify(rows):''
            this.templateData.content = content
            this.setContent()
        },
        updateList(index,rows){
            this.flag = 'edit'
            this.form = Object.assign({},rows[index])
            this.form.status = this.form.status==1?true:false
            this.editIndex = index
        },
        handleEdit(){
            let obj = Object.assign({},this.form)
            obj.status = obj.status?1:0
            let [...dataList] = this.list
            dataList.splice(this.editIndex, 1,obj)
            this.templateData.content = JSON.stringify(dataList)
            this.createdLoading = true
            this.setContent()
        },
        // 保存变量
        setContent(){
            if(this.templateData.name == undefined)this.templateData.name = '设备配置'
            setObj(this.templateData).then(res => {
                if(res.data.success == true){
                    this.getList()
                    this.cancelEdit()
                    this.$notify({
                        title: '成功',
                        message: "保存成功",
                        type: "success",
                        duration: 2000
                    });
                }else{
                    this.$notify({
                        title: '失败',
                        message: "保存失败",
                        type: "error",
                        duration: 2000
                    });
                }
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
        },
        resetTem(){
            this.form={
                name:'',
                label:'',
                sort:'',
                type:'',
                status:true
            }
            this.createdLoading = false
        },
    },
    watch:{
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px;
    margin-bottom: 10px
}

</style>

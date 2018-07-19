<template>
    <div class="clearfix">
        <div>产 品 : {{productInfo.name}} </div>
        <el-form :model="form" class="clearfix" ref="form" label-width="70px" size="mini" style="padding-top:10px;">
            <el-form-item label="报警标题" style="width: 310px">
                <el-input v-model="form.title" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="报警周期" style="width: 310px;;margin-left:30px">
                <el-select v-model="form.cycle" placeholder="请选择" size="mini">
                    <el-option
                    v-for="item in dicts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报警内容" style="width: 310px">
                <el-input v-model="form.triggerMessage" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="恢复内容" style="width: 310px;margin-left:30px">
                <el-input v-model="form.recoverMessage" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="触发条件" style="width: 310px;">
                <el-input v-model="form.condition" type="textarea" :rows="2" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" style="width: 310px;margin-left:30px">
                <el-input v-model="form.comment" type="textarea" :rows="2" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  :style="flag == 'add'?'width: 140px':'width: 220px'" class="pull-right" style="padding-top:5px">
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else>
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px">
                <el-table-column align="center" label="报警标题">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="报警内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.triggerMessage}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="恢复内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.recoverMessage}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                        <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                        <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.$index, list)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.$index, list)" style="margin-left:0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { remote } from "@/api/dict";
import { findByvalue } from "@/util/util";
import {get_templateObj,set_templateObj} from "@/api/product";
export default {
    props:['productInfo'],
    data(){
        return {
            listLoading:false,
            flag:'add',
            textareax:'',
            list:[],
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            templateData:null,
            form:{
                title:'',
                condition:'',
                triggerMessage:'',
                recoverMessage:'',
                comment:'',
                status:true
            },
            createdLoading:false,
            editIndex:null,
            dicts:[]
        }
    },
    created() {
        this.getList()
        remote("cycle").then(response => {
            this.dicts = response.data.result;
            console.log(this.dicts)
            console.log(findByvalue(this.dicts,'30'))
        });
        
    },
    mounted() {
    },
    computed: {},
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
            let id
            this.productInfo.productTemplate.forEach(element => {
                if(element.type === 2)id = element.id
            });
            get_templateObj(id).then(res => {
                let data = res.data.result
                this.templateData = data
                this.list = []
                this.total = 0
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
        setContent(){
            set_templateObj(this.templateData).then(res => {
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
                title:'',
                condition:'',
                triggerMessage:'',
                recoverMessage:'',
                comment:'',
                status:true
            }
            this.createdLoading = false
        },
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px
}
</style>

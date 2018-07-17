<template>
    <div class="clearfix">
        <div>产 品 : {{productInfo.name}} </div>
        <el-form :model="form" class="clearfix" ref="form" label-width="0" size="mini" style="padding-top:10px;">
            <el-form-item label="" style="width: 100px;margin-right:5px">
                <el-input v-model="form.name" size="mini" auto-complete="off" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="" style="width: 100px;margin-right:5px">
                <el-input v-model="form.label" size="mini" auto-complete="off" placeholder="标识"></el-input>
            </el-form-item>
            <el-form-item label="" style="width: 100px;margin-right:5px">
                <el-input v-model="form.sort" size="mini" auto-complete="off" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item label="" style="width: 100px;margin-right:5px">
                <el-select v-model="form.type" placeholder="选择类型" size="mini">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  :style="flag == 'add'?'width: 80px':'width: 150px'" class="pull-right">
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else >
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item style="width: 70px;margin-left:5px" class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px">
                <el-table-column align="center" label="变量">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标识">
                    <template slot-scope="scope">
                        <span>{{scope.row.label}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序">
                    <template slot-scope="scope">
                        <span>{{scope.row.sort}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.type}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                        <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                        <i v-else class="el-icon-circle-close" style="font-size:18px;color:#f56c6c"></i>
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
            options:[
                {
                    value: 'bool',
                    label: 'bool'
                },{
                    value: 'float',
                    label: 'float'
                },{
                    value: 'integer',
                    label: 'integer'
                },{
                    value: 'char',
                    label: 'char'
                },
            ],
            form:{
                name:'',
                label:'',
                sort:'',
                type:'',
                status:true
            },
            createdLoading:false,
            editIndex:null,
        }
    },
    created() {
        this.getList()
    },
    mounted() {
    },
    computed: {},
    methods:{
        handleCurrentChange(){},
        handleSizeChange(){},
        getList(){
            this.listLoading = true
            let id
            this.productInfo.productTemplate.forEach(element => {
                if(element.type === 1)id = element.id
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
                name:'',
                label:'',
                sort:'',
                type:'',
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

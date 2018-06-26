<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <el-form :model="form" class="clearfix" ref="form" label-width="50px">
            <el-form-item label="名称" style="width: 163px">
                <el-input v-model="form.name" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="标识" style="width: 162px">
                <el-input v-model="form.label" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 163px">
                <el-input v-model="form.sort" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" style="width: 162px">
                <el-select v-model="form.type" placeholder="请选择" size="small">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item  :style="flag == 'add'?'width: 140px':'width: 220px'" class="pull-right" style="padding-top:5px">
                <div v-if="flag == 'add'">
                    <el-button size="small" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else >
                    <el-button size="small" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="small" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="sensorList" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:10px">
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
                <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                        <span>{{(scope.row.status == 1)?'已启用':'未启用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" plain @click="deleteList(scope.row)">删除</el-button>
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
import { mapGetters } from "vuex";
import {addObj,delObj,editObj} from "@/api/project/sensor";

export default {
    props:['dataInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
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
                status:''
            },
            flag:'add',
            listQuery:{
                deviceId:this.dataInfo.id,
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null
        }
    },
    created() {
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["sensorList"]),
    },
    methods:{
        handleCurrentChange(){},
        handleSizeChange(){},
        getContent(){
            
        },
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该变量(变量名:" + row.title + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.$parent.$parent.getSensorList(this.listQuery)
                    this.$parent.$parent.$parent.$parent.alertNotify('删除')
                })
            })
            
        },
        handleAdd(){
            let data = Object.assign({},this.form)
            data.sort = parseInt(data.sort)
            data.status = data.status?1:0
            data.deviceId = this.dataInfo.id
            this.createdLoading = true
            addObj(data).then(res => {
                this.$parent.$parent.getSensorList(this.listQuery)
                this.$parent.$parent.$parent.$parent.alertNotify('添加')
                this.resetTem()
            })
        },
        handleEdit(){
            this.createdLoading = true
            let data = Object.assign({},this.form)
            data.status = data.status?1:0
            editObj(data).then(res => {
                this.$parent.$parent.getSensorList(this.listQuery)
                this.$parent.$parent.$parent.$parent.alertNotify('修改')
                this.resetTem()
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
                status:''
            }
            this.createdLoading = false
        }
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

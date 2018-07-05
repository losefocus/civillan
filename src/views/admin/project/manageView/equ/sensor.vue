<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <el-form :model="form" class="clearfix" ref="form" label-width="50px" size="small">
            <el-form-item label="名称" style="width: 163px">
                <el-input v-model="form.name" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="标识" style="width: 162px">
                <el-input v-model="form.label" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 163px">
                <el-input v-model="form.sort" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" style="width: 162px">
                <el-select v-model="form.type" placeholder="请选择" size="mini">
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
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else >
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div style="margin-bottom:10px;">
            <el-button @click="importexcel" size="mini">导出</el-button>
            <el-button @click="importexcel" size="mini">导入</el-button>
        </div>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" @selection-change="handleSelectionChange" stripe border fit highlight-current-row style="width: 100%;margin-bottom:10px">
                <el-table-column type="selection" align="center" width="50">
                </el-table-column>
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
                        <el-button size="mini" type="success" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" plain @click="deleteList(scope.row)" style="margin-left:0">删除</el-button>
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
import {getObj,addObj,delObj,editObj} from "@/api/project/sensor";

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
            list:null,
            listSelection : []
        }
    },
    created() {
        this.getList()
    },
    mounted() {
    },
    computed: {
        ...mapGetters(["sensorList"]),
    },
    methods:{
        handleSelectionChange(val) {
            this.listSelection = val;
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        getList(){
            this.resetTem()
            this.listLoading = true
            getObj(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该变量(变量名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList(this.listQuery)
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
                this.getList(this.listQuery)
                this.$parent.$parent.$parent.$parent.alertNotify('添加')
                this.resetTem()
            })
        },
        handleEdit(){
            this.createdLoading = true
            let data = Object.assign({},this.form)
            data.status = data.status?1:0
            editObj(data).then(res => {
                this.getList(this.listQuery)
                this.$parent.$parent.$parent.$parent.alertNotify('修改')
                this.cancelEdit()
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
        },
        importexcel() {　
        　　require.ensure([], () => {　　　　　　　　
                const { export_json_to_excel } = require('@/vendor/Export2Excel');　　//引入文件　　　　　　
                const tHeader = ['变量名称', '标识', '类型']; //将对应的属性名转换成中文
                //const tHeader = [];　
                const filterVal = ['name', 'label', 'type'];//table表格中对应的属性名　　　　　 　　　
                const list = this.listSelection;　　　　　　　　
                const data = this.formatJson(filterVal, list);　　　　　　　　
                export_json_to_excel(tHeader, data, '列表excel');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
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

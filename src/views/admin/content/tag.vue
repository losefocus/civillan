<template>
    <div>
        <el-form :model="form" class="clearfix" ref="form" :rules="rules" size="mini">
            <el-form-item label="名称" prop="tagName" style="width: 240px" label-width="70px" >
                <el-input v-model="form.tagName" size="mini" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 240px;margin-left:10px;" label-width="70px" >
                <el-input v-model="form.sort" size="mini" auto-complete="off"></el-input>
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
            <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="标签名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.tagName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序">
                    <template slot-scope="scope">
                        <span>{{scope.row.sort}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)">删除</el-button>
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
  import {mapGetters} from "vuex";
  import {addObj, delObj, editObj, fetchList} from "@/api/content_tag";

  export default {
    data(){
        var validateName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入名称'));
            } else {
                callback();
            }
        };
        return {
            rules:{
                tagName:[
                    { validator: validateName,trigger: 'blur' },
                ],
            },
            listLoading:false,
            createdLoading:false,
            form:{
                tagName:'',
                sort:0
            },
            flag:'add',
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
        }    
    },
    created() {
        this.getList();
    },
    mounted() {

    },
    computed: {
        // ...mapGetters(["alarmList"]),
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
            this.listQuery.sort_by = 'sort'
            this.listQuery.direction = 'asc'
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
                let newMap = new Map();
                this.list.forEach(ele => {
                    // ele.value = ele.id
                    // ele.label = ele.tagName
                    newMap.set(ele.id,ele.tagName)
                });
                this.$emit('showTagOptions',this.list);
                this.$emit('showTagHash',newMap);
            })
        },
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该标签(标签名:" + row.tagName + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList()
                    this.alertNotify('删除')
                })
            }).catch(() => {});
        },
        handleAdd(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.sort = parseInt(data.sort)
                    this.createdLoading = true
                    addObj(data).then(res => {
                        this.getList()
                        this.alertNotify('添加')
                        this.resetTem()
                    })
                }
            })
        },
        handleEdit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.createdLoading = true
                    let data = Object.assign({},this.form)
                    data.sort = parseInt(data.sort)
                    editObj(data).then(res => {
                        this.getList()
                        this.alertNotify('修改')
                        this.cancelEdit()
                    })
                }
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
        },
        resetTem(){
            this.form={
                tagName:'',
                sort:0,
            }
            this.createdLoading = false
            this.$refs.form.resetFields();
        },
        alertNotify(str){
            this.$notify({
                title: str,
                message: str+"成功",
                type: "success",
                duration: 2000
            });
        }
    },
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px;
    margin-bottom: 10px
}
</style>

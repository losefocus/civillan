<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加配置</el-button>
            <el-button class="filter-item" style="" size="small" type="primary" @click="configTemplateVisible=true">导入</el-button>
            <download-btn :header="header2" :data="modleData" :btnName='btnName' :ifNull='true' :fileName="fileName" style="margin-left:10px;cursor:pointer"></download-btn> 
            <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
            <el-input @keyup.enter.native="handleFilter" style="width: 150px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="按名称搜索" v-model="listQuery.name"></el-input>
            <!-- <el-select v-model="filterType" size="small" clearable class="pull-right" placeholder="按类型筛选" style="width: 150px !important;margin-right:20px;" @change="changeTypeFilter">
                <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> -->
            <el-radio-group class="pull-right" v-model="filterType" size="small" @change="changeTypeFilter"  style="margin-right:20px;">
                <el-radio-button v-for="item in typeOptions" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="list" v-loading="listLoading" ref="multipleTable" fit highlight-current-row style="width: 99%;margin-bottom:20px;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" min-width="55"></el-table-column>
            <el-table-column align="left" label="名称" min-width="150">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标识" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型" min-width="80">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;">{{typeMap.get(scope.row.typeId)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" min-width="60">   
                <template slot-scope="scope">   
                    <span>{{scope.row.sort}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" min-width="60">   
                <template slot-scope="scope">
                    <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                    <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="220">
                <template slot-scope="scope" >
                    <el-button size="mini" type="" class="copyBtn" plain :data-clipboard-text="JSON.stringify(scope.row)" @click="copyObj()">复制</el-button>
                    <el-button size="mini" type="" plain @click="updataObj(scope.row)" style="margin-left:0px">修改</el-button>
                    <el-button size="mini" type="" plain @click="deleteObj(scope.row)" style="margin-left:0px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,50,100]" :page-size="listQuery.page_size" layout="total,sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <div>
            <el-checkbox v-model="allChecked" @change="checkAll">全选</el-checkbox>
            <el-select v-model="valueType" placeholder="请选择操作" size="mini" style="width:120px!important;margin:0 10px">
                <el-option label="批量删除" value="batchDelete"></el-option>
                <el-option label="导出" value="export"></el-option>
            </el-select>
            <el-button size="mini" v-if="valueType == 'export'" style="margin-right:10px" type="primary">
                <download-btn :header="header" :data="multipleSelection" :btnName="btnName2" :fileName="fileName2" style="text-decoration:none"></download-btn> 
            </el-button>
            <el-button type="primary" v-else size="mini" @click="confirm">确认</el-button>
        </div>
        <el-dialog title="导入" :visible.sync="configTemplateVisible" width='300px' >
            <div class="clearfix" v-loading="uploading">
                <el-select v-model="params.typeId" size="small" placeholder="请选择类型" style="width:100%;">
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="headers"
                    action="/project/project_work_config/importWorkConfig"
                    :limit="999"
                    :data="params"
                    name="files"
                    multiple
                    :show-file-list ="false"
                    :before-upload='beforeUpload'
                    :on-success="uploadSuccess"
                    :auto-upload="true">
                        <el-button slot="trigger" size="small" type="primary" style="width:260px;margin-top:10px;">选择文件</el-button>
                </el-upload>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";
  import {batchDelObj, categoryList, delObj, fetchList} from "@/api/project_config";
  import downloadBtn from "./equ/downloadBtn"

  export default {
    components:{downloadBtn},
    props:['projectInfo'],
    data(){
        return {
            header:[
                {label:'名称',prop:'name'},
                {label:'标识',prop:'key'},
                {label:'类型',prop:'typeName'},
                {label:'配置项',prop:'content'},
            ],
            header2:[
                {label:'名称',prop:'name'},
                {label:'标识',prop:'key'},
                {label:'配置项',prop:'content'},
            ],
            btnName:'作业配置模板文件.csv',
            fileName:'作业配置模板文件.csv',
            btnName2:'确认',
            fileName2:this.projectInfo.name+'——作业配置.csv',
            modleData:[],
            listLoading:false,
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            filterType:'',
            total:null,
            multipleSelection:[],
            typeMap:null,
            uploading:false,
            headers:{Authorization: "Bearer " + getToken()},
            params:{
                projectId:this.projectInfo.id,
                typeId:null
            },
            configTemplateVisible:false,
            typeOptions:[],
            allChecked:false,
            valueType:'',
        }
    },
    created() {
        this.getCategoryList()
    },
    mounted() {
        this.getList()
    },
    computed: {
        ...mapGetters(["adminerHash"])
    },
    methods:{
        beforeUpload(file){
            const isCSV = file.type === 'application/vnd.ms-excel';
            // const isLt2M = file.size / 1024 / 1024 < 2; 文件大小2M
            if(this.params.typeId == null){
                this.$message({
                    message: '请选择类型',
                    type: 'waring'
                });
                return false
            }else{
                if (!isCSV) {
                    this.$message.error('只允许上传 CSV 格式文件!');
                    return isCSV;
                }else{
                    this.uploading = true
                    return true
                }
            }
            
        },
        uploadSuccess(response, file, fileList){
            this.uploading = false
            this.configTemplateVisible = false
            if(response.success == true){
                this.getList()
                this.$message({
                    message: '上传成功',
                    type: 'success'
                });
            }else{
                this.$message({
                    message: '上传失敗',
                    type: 'error'
                });
                this.uploading = true
            }
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
            this.allChecked = (this.multipleSelection.length == this.list.length)?true:false
        },
        checkAll(){
            if(this.allChecked == true){
                this.list.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row,true);
                });
            }else{
                this.list.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row,false);
                });
            }
        },
        confirm(){
            let ids = this.multipleSelection.map(v => {return v.id}).join()
            if(ids == ''){
                this.$message({
                    message: '请选择配置',
                    type: 'warning'
                });
                return
            }
            else if(this.valueType == ''){
                this.$message({
                    message: '请选择操作',
                    type: 'warning'
                });
                return
            }
            
            if(this.valueType == 'batchDelete'){
                batchDelObj(ids).then(res => {
                    this.getList()
                    this.$notify({
                        title: '成功',
                        message: '批量删除成功',
                        type: 'success'
                    });
                })
            }
        },
        // importexcel() {　
        // 　　require.ensure([], () => {　　　　　　　　
        //         const { export_json_to_excel } = require('@/vendor/Export2Excel');　　//引入文件　　　　　　
        //         const tHeader = ['名称', '标识', '类型', '配置项']; //将对应的属性名转换成中文
        //         const filterVal = ['name', 'key', 'type', 'content'];//table表格中对应的属性名　　　　　 　　　
        //         let list = this.multipleSelection.map(item => {
        //             return { name: item.name, key: item.key , type: this.typeMap.get(item.typeId) , content: item.content };
        //         });　
        //         const data = this.formatJson(filterVal, list);　　　　　　　　
        //         export_json_to_excel(tHeader, data, 'excel文件');
        //     })
        // },
        // formatJson(filterVal, jsonData) {
        //     return jsonData.map(v => filterVal.map(j => v[j]));
        // },
        getCategoryList(){
            categoryList(this.allListQuery).then(res => {
                let list = res.data.result.items
                this.typeMap = new Map()
                for (let i=0; i<list.length; i++) {
                    this.typeMap.set(list[i].id,list[i].name)
                }
                this.typeOptions = list.map(item => {
                    return { value: item.id, label: item.name };
                });
                this.typeOptions.unshift({value:0,label:'全部类型'})
            })
        },
        handleAdd(){
            this.$parent.cardVisibel = !this.$parent.cardVisibel
            this.$parent.$refs.addConfig.flag = 'add'
            this.$parent.$refs.addConfig.resetTemp()
        },
        getList(){
            this.listLoading = true
            this.listQuery.sort_by = 'sort'
            this.listQuery.direction = 'asc'
            this.listQuery.projectId = this.projectInfo.id
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.list.forEach(res => {
                    // res.typeName = this.typeMap.get(res.typeId)
                })
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        changeTypeFilter(){
            this.listQuery.typeId = this.filterType
            if (this.filterType == 0) delete this.listQuery.typeId
            this.listQuery.page_index = 1;
            this.getList()
        },
        handleFilter(){
            if(this.listQuery.name == '') delete this.listQuery.name
            this.listQuery.typeId = this.filterType
            if(this.filterType == 0) delete this.listQuery.typeId
            this.listQuery.page_index = 1;
            this.getList()
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        deleteObj(row){
            this.$confirm(
                "此操作将永久删除该配置(配置名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList()
                    this.$parent.$parent.alertNotify('删除')
                })
            })
        },
        updataObj(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addConfig.flag = 'updata'
            this.$parent.$refs.addConfig.form = Object.assign({},row)
            this.$parent.$refs.addConfig.form.status = (row.status === 1)?true:false
            let contents = JSON.parse(row.content)
            
            contents.forEach(ele => {
                ele.flag = false
            });
            this.$parent.$refs.addConfig.config_content = contents
            this.$parent.$refs.addConfig.changeType(row.typeId)
        },
        copyObj(){
            var clipboard = new this.Clipboard('.copyBtn');  
            clipboard.on('success', e => {  
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
                    // 释放内存  
                clipboard.destroy()  
            })  
            clipboard.on('error', e => {  
                // 不支持复制  
                this.$message({
                    message: '该浏览器不支持自动复制',
                    type: 'warning'
                });
                // 释放内存  
                clipboard.destroy()  
            }) 
        }
    }
}
</script>
<style scoped>

</style>

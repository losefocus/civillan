<template>
    <div>
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}配置</h3><span>{{(flag == 'add')?'Add':'Edit'}} Config</span></div>
        <el-form label-width="55px" :model="form" ref="form" :rules="rules" label-position="left">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="标识" prop="key">
                <el-input v-model="form.name" size="small" placeholder="请输入标识"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.name" size="small" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="typeId">
                <el-input v-model="form.name" size="small" placeholder="请输入类型"></el-input>
            </el-form-item>
            <!-- <el-form-item>
                <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('form')" size="small" style="width:85px;">添加</el-button>
                <el-button v-else type="primary" :loading="createLoading" @click="updataForm('form')" size="small" style="width:85px;">保存</el-button>
                <el-button type="info" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
            </el-form-item> -->
        </el-form>
        <p>配置内容</p>
        <div>
            <el-input v-model="form.name" style="width:100px" size="mini" placeholder="配置项"></el-input>
            <el-input v-model="form.name" style="width:90px" size="mini" placeholder="值"></el-input>
            <el-button type="primary" size="mini" style="width:60px;">添加</el-button>
        </div>
        <!-- <div class="config_content"></div> -->
        <el-table class="config_content" :data="config_content" border :show-header="false" style="width:100%;border-radius: 4px;margin:10px 0;">
            <el-table-column prop="key" align="center" label="配置项">
                <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>    
                </template>
            </el-table-column>
            <el-table-column prop="value" align="center" label="值">
                <template slot-scope="scope">
                    <!-- <span>{{scope.row.value}}</span> -->
                    <el-input v-model="scope.row.value" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="90">
                <template slot-scope="scope" >
                    <a size="mini" type="" plain @click.native.prevent="editContent(scope.$index, config_content)" style="width:30px;cursor:pointer;">修改</a>
                    <a size="mini" type="" plain @click.native.prevent="deleteContent(scope.$index, config_content)" style="width:30px;cursor:pointer;">删除</a>
                </template>
            </el-table-column>
        </el-table>
        
        <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('form')" size="small" style="width:85px;">保存</el-button>
        <el-button v-else type="primary" :loading="createLoading" @click="updataForm('form')" size="small" style="width:85px;">保存</el-button>
        <el-button type="info" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
    </div>
</template>
<script>
import {addObj,updataObj} from "@/api/project_doc";
export default {
    props:['projectInfo'],
    data(){
        var validataFileBaseUrl = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请添加文件'));
            }else{
                callback()
            }
        }
        var validataName = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入项目名称'));
            }else{
                callback()
            }
        }
        return {
            rules: {
                fileBaseUrl: [
                    {  validator: validataFileBaseUrl, trigger: 'blur' }
                ],
                name: [
                    {  validator: validataName, trigger: 'blur' }
                ]
            },
            form:{
                name:'',
                key:'',
                sort:'',
                typeId:'',
                content:'',
            },
            config_content:[{key:'桩长',value:100},{key:'轴长',value:200}],
            createLoading:false,
            flag:'add',
        }
    },
    created() {},
    mounted() {

    },
    computed: {},
    methods:{
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    data.projectId = this.projectInfo.id
                    this.createLoading = true
                    addObj(data).then(res => {
                        this.$parent.$parent.$refs.doc.getList();
                        this.$parent.$parent.$parent.alertNotify('添加')
                        this.cancel()
                    })
                }else{
                    
                }
            })
            
        },
        uploadSuccess(response, file, fileList){
            this.form.fileBaseUrl = response.result.baseUrl
            this.form.filePath = response.result.path
            // this.fileName = response.result.name
            this.fileName = file.name
            this.fileList = []
        }, 
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    this.createLoading = true
                    updataObj(data).then(res => {
                        this.$parent.$parent.$refs.doc.getList();
                        this.$parent.$parent.$parent.alertNotify('修改')
                        this.cancel()
                    })
                }
            })
            
        },
        cancel(){
            this.flag = 'add'
            this.createLoading = false
            this.resetTemp()
            this.$parent.$parent.cardVisibel = false
        },
        resetTemp() {
            this.form = {
                name:'',
                key:'',
                sort:'',
                typeId:'',
                content:'',
            }
            this.$refs.form.resetFields()
        },
        addContent(){
            
        },
        editContent(index,rows){
            console.log(index,rows)
        },
        deleteContent(index,rows){
            rows.splice(index, 1);
        },
    }
}
</script>
<style scoped>
.el-form-item{
    margin-bottom: 15px
}
.addNewProject{
    width: 260px;
    border: 1px solid #dcdfe6;
    padding: 10px 20px 0 20px
}
.el-form-item__error{
    padding-top: 0 !important
}
.config_content{
    /* margin-top:10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 260px;
    max-height: 280px; */
}
</style>

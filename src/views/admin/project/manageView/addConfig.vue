<template>
    <div>
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}配置</h3><span>{{(flag == 'add')?'Add':'Edit'}} Config</span></div>
        <el-form label-width="55px" :model="form" ref="form" label-position="left">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="typeId">
                <el-input v-model="form.typeId" size="small" placeholder="请输入类型"></el-input>
            </el-form-item>
            <el-form-item label="标识" prop="key">
                <el-input v-model="form.key" size="small" placeholder="请输入标识"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" size="small" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
            </el-form-item>
            
        </el-form>
        <p>配置内容</p>
        <div>
            <el-form id="content_form" ref="content_form" :inline="true" label-width="0" size="mini">
                <el-form-item label="" prop="typeId" style="width:100px">
                    <el-input v-model="content_form.key" size="mini" placeholder="配置项"></el-input>
                </el-form-item>
                <el-form-item label="" prop="key" style="width:90px">
                    <el-input v-model="content_form.value" size="mini" placeholder="值"></el-input>
                </el-form-item>
                <el-form-item label="" style="width:60px">
                    <el-button type="primary" size="mini" style="width:60px;" @click="addContent">添加</el-button>
                </el-form-item>
            </el-form>
            <!-- <el-input v-model="content_form.key" style="width:100px" size="mini" placeholder="配置项"></el-input>
            <el-input v-model="content_form.value" style="width:90px" size="mini" placeholder="值"></el-input>
            <el-button type="primary" size="mini" style="width:60px;">添加</el-button> -->
        </div>
        <el-table class="config_content" :data="config_content" border max-height="250" :show-header="false" style="width:100%;border-radius: 4px;margin:10px 0 20px 0;">
            <el-table-column prop="key" align="center" label="配置项">
                <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>    
                </template>
            </el-table-column>
            <el-table-column prop="value" align="center" label="值">
                <template slot-scope="scope">
                    <span v-if="!scope.row.flag">{{scope.row.value}}</span>
                    <!-- <el-input v-else v-model="tempValue" size="mini" style="height:23px;"></el-input> -->
                    <input v-else v-model="tempValue" :value="tempValue" autofocus style="height:20px;width:50px;border-radius: 4px;border: 1px solid #dcdfe6;text-align: center">
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="90">
                <template slot-scope="scope" >
                    <a v-if="!scope.row.flag" size="mini" type="" plain @click="editContent(scope.$index, config_content)" style="width:30px;cursor:pointer;">修改</a>
                    <a v-else size="mini" type="" plain @click="conformContent(scope.$index, config_content)" style="width:30px;cursor:pointer;">确定</a>
                    <a size="mini" type="" plain @click="deleteContent(scope.$index, config_content)" style="width:30px;cursor:pointer;">删除</a>
                </template>
            </el-table-column>
        </el-table>
        
        <div style="text-align:center">
            <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('form')" size="small" style="width:85px;">保存</el-button>
            <el-button v-else type="primary" :loading="createLoading" @click="updataForm('form')" size="small" style="width:85px;">保存</el-button>
            <el-button type="info" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
        </div>
    </div>
</template>
<script>
import {addObj,editObj} from "@/api/project_config";
export default {
    props:['projectInfo'],
    data(){
        
        var validataName = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入名称'));
            }else{
                callback()
            }
        }
        var validataTypeId = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请选择类型'));
            }else{
                callback()
            }
        }
        var validataKey = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入标识'));
            }else{
                callback()
            }
        }
        return {
            rules: {
                
                name: [
                    {  validator: validataName, trigger: 'blur' }
                ],
                typeId: [
                    {  validator: validataTypeId, trigger: 'change' }
                ],
                key: [
                    {  validator: validataKey, trigger: 'change' }
                ],
            },
            form:{
                name:'',
                key:'',
                sort:'',
                typeId:'',
                content:'',
                status:true,
            },
            content_form:{
                key:'',
                value:'',
                flag:false
            },
            config_content:[{key:'桩长',value:100,flag:false},{key:'轴长',value:200,flag:false}],
            tempValue:null,
            lastIndex:null,
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
                    this.createLoading = true
                    let data = Object.assign({},this.form)
                    data.projectId = this.projectInfo.id
                    data.status = data.status?1:0
                    data.typeId = parseFloat(data.typeId)
                    data.sort = parseFloat(data.sort)
                    this.config_content.forEach(ele => {
                        delete ele.flag
                    });
                    data.content = JSON.stringify(this.config_content)
                    addObj(data).then(res => {
                        this.$parent.$parent.$refs.config.getList();
                        this.$parent.$parent.$parent.alertNotify('添加')
                        this.cancel()
                    })
                }else{
                    
                }
            })
            
        },
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    this.config_content.forEach(ele => {
                        delete ele.flag
                    });
                    data.content = JSON.stringify(this.config_content)
                    this.createLoading = true
                    editObj(data).then(res => {
                        this.$parent.$parent.$refs.config.getList();
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
                status:true
            }
            this.$refs.form.resetFields()
        },
        addContent(){
            this.config_content.unshift(Object.assign({}, this.content_form))
            this.content_form = {
                key:'',
                value:'',
                flag:false
            }
            this.$refs.content_form.resetFields()
        },
        editContent(index,rows){
            if(this.lastIndex!=null)rows[this.lastIndex].flag = false
            rows[index].flag = true
            this.tempValue = rows[index].value
            this.lastIndex = index
        },
        conformContent(index,rows){
            rows[index].value = this.tempValue
            rows[index].flag = false
            
        },
        deleteContent(index,rows){
            rows.splice(index, 1);
        },
    }
}
</script>
<style scoped>
#content_form .el-form-item{
    margin-right:0!important
}
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

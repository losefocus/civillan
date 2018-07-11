<template>
    <div>
        <!-- <h3>{{flag == 'add'?'添加':'修改'}}人员</h3> -->
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}人员</h3><span>{{(flag == 'add')?'Add':'Edit'}} Personnel</span></div>
        <el-form label-width="55px" :model="form" :rules="rules"  ref="forms" label-position="left">
            <el-form-item label="机构" prop="projectOrgan.id">
                <el-select v-model="form.projectOrgan.id" size="small" placeholder="请选择机构">
                    <el-option
                    v-for="item in organOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="userRole">
                <el-select v-model="role" size="small" placeholder="请选择角色" @change="selectRole()">
                    <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" size="small" placeholder="请输入电话" @blur="checkDuplication('phone')"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="username" >
                <el-input v-model="form.username" size="small" placeholder="请输入账号" :disabled="usernameDisabled" @blur="checkDuplication('username')"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" size="small" placeholder="请输入密码"></el-input>
            </el-form-item>
            <!-- <el-form-item label="确认密码" prop="password2">
                <el-input v-model="form.password2" type="password" size="small" placeholder="请输入内容"></el-input>
            </el-form-item> -->
            <el-form-item label="备注" prop="comment">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"
                v-model="form.comment">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('forms')" size="small" style="width:85px;">添加</el-button>
                <el-button v-else type="primary" :loading="createLoading" @click="updateForm('forms')" size="small" style="width:85px;">保存</el-button>
                <el-button  type="info" @click="cancel('forms')" size="small" style="width:85px;">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { fetchOrganList,addObj,updateObj,fetchUserList} from "@/api/project_per";
export default {
    props:['projectInfo'],
    data(){
        var validataOrganId = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择机构'));
            }else {
                callback();
            }
        };
        var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
        var validataPhone = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入手机号码'));
            } else {
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的手机号码'));
                }else if (this.duplication_phone == true) {
                    callback(new Error('该手机号码已存在!'));
                } else {
                    callback();
                }
            }
        };
        var validateUserName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入用户名'));
            } else if (this.duplication_username == true) {
                callback(new Error('该用户名已存在!'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        var validataName = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入姓名'));
            }else{
                callback()
            }
        }
        var validataroleId = (rule, value, callback) => {
            if(value.length == 0){
                callback(new Error('请选择角色'));
            }else{
                callback()
            }
        }
        return {
            rules: {
                "projectOrgan.id": [
                    { validator: validataOrganId, trigger: 'change' },
                ],
                userRole: [
                    { validator: validataroleId, trigger: 'change' },
                ],
                name: [
                    {  validator: validataName, trigger: 'blur' },
                    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"}
                ],
                phone: [
                    { validator: validataPhone, trigger: 'blur' },
                ],
                username: [
                    { validator: validateUserName, trigger: 'blur' },
                    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"}
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 50, message: "长度在 6 到 50 个字符", trigger: "blur"}
                ],
            },
            form:{
                projectOrgan : {id:null} ,
                userRole:[],
                status:true
            },
            duplication_username:false,
            duplication_phone:false,
            usernameDisabled:false,
            role:'',
            flag:'add',
            organOptions:[],
            createLoading:false
        }
    },
    created() {
        this.getOrganOptions()
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["roleOptions"]),
    },
    methods:{
        //检查用户名是否存在
        checkDuplication(type){
            let data = {}
            data[type]=this.form[type]
            fetchUserList(data).then(res => {
                if(res.data.result.total != 0) this['duplication_'+type] = true 
                else this['duplication_'+type] = false
                this.$refs.forms.validateField(type);
            })
        },
        selectRole(){
            this.form.userRole = [{projectRole:{id:parseInt(this.role)}}]
        },
        getOrganOptions(){
            fetchOrganList(this.projectInfo.id).then(res => {
                let data = res.data.result.items
                let array = []
                data.forEach(element => {
                    element.value = element.id
                    element.label = element.name
                    array.push(element)
                });
                this.organOptions = array
            })
        },
        submitForm(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.projectId = this.projectInfo.id
                    data.status = data.status?1:0
                    this.createLoading = true
                    addObj(data).then((res) => {
                        if(res.data.success == true){
                            this.$parent.$parent.$refs.per.getList()
                            this.cancel()
                            this.$parent.$parent.$parent.alertNotify('添加')
                        }else{
                            this.$notify({
                                title: '错误',
                                message: res.data.message,
                                type: 'error'
                            });
                            this.createLoading = false
                        }
                        
                    });
                } else {
                    return false;
                }
            });
        },
        updateForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = this.form.status?1:0
                    data.userRole = [{projectRole:{id:parseInt(this.role)}}]
                    this.createLoading = true
                    updateObj(data).then(response => {
                        this.$parent.$parent.$refs.per.getList()
                        this.cancel()
                        this.$parent.$parent.$parent.alertNotify('修改')
                    })
                }
            });
        },
        cancel(formName){
            this.flag = 'add'
            this.resetTemp()
            this.$parent.$parent.cardVisibel = false
        },
        resetTemp() {
            this.createLoading = false
            this.form={
                projectOrgan: {id:null} ,
                status:true
            }
            this.usernameDisabled = false
            this.role = ''
        },

    }
}
</script>
<style scoped>
.el-form-item{
    margin-bottom: 15px
}
</style>

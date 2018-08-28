<template>
    <div>
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}机构</h3><span>{{(flag == 'add')?'Add':'Edit'}} Organization</span></div>
        <el-form label-width="55px" :model="addNewForm" :rules="rules"  ref="addNewForm" label-position="left">
            <el-form-item label="名称" prop="name">
                <el-input v-model="addNewForm.name" size="small" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="typeId">
                <el-select v-model="addNewForm.typeId" placeholder="请选择类型" size="small" >
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
                <el-input v-model="addNewForm.contact" size="small" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="addNewForm.phone" size="small" placeholder="请输入电话"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="addNewForm.address" size="small" placeholder="请输入地址"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"
                v-model="addNewForm.comment">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="已启用" v-model="addNewForm.status" size="small"></el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('addNewForm')" size="small" style="width:85px;">添加</el-button>
                <el-button v-else type="primary" :loading="createLoading" @click="updateForm('addNewForm')" size="small" style="width:85px;">保存</el-button>
                <el-button  type="info" @click="cancel('addNewForm')" size="small" style="width:85px;">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {addObj, updateObj} from "@/api/project_org";

  export default {
    props:['projectInfo'],
    data(){
        var validateName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入机构名称'));
            } else {
                callback();
            }
        };
        var validateTypeId = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择机构类型'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                name: [
                    {validator: validateName, message: '请输入机构名称', trigger: 'blur' }
                ],
                typeId: [
                    { validator: validateTypeId, message: '请选择机构类型', trigger: 'change' }
                ],
            },
            flag:'add',
            addNewForm:{
                status:true
            },
            createLoading: false,
        }
    },
    created() {
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["typeOptions"]),
    },
    methods:{
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addNewForm.projectId = this.projectInfo.id
                    this.addNewForm.status = this.addNewForm.status?1:0
                    this.createLoading = true
                    addObj(this.addNewForm).then(response => {
                        this.$parent.$parent.$refs.org.getList()
                        this.cancel()
                        this.$parent.$parent.$parent.alertNotify('添加')
                    })
                }
            });
        },
        updateForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addNewForm.status = this.addNewForm.status?1:0
                    this.createLoading = true
                    updateObj(this.addNewForm).then(response => {
                        this.$parent.$parent.$refs.org.getList()
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
        resetTemp(){
            this.addNewForm = {
                status:true
            }
            this.createLoading = false
            this.$refs.addNewForm.resetFields()
        }
    }
}
</script>
<style scoped>
.el-form-item{
    margin-bottom: 15px
}
</style>

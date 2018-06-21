<template>
    <div>
        <h3>{{flag == 'add'?'添加':'修改'}}机构</h3>
        <el-form label-width="65px" :model="addNewForm"  ref="addNewForm">
            <el-form-item label="项目" >
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="addNewForm.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="typeId">
                <el-select v-model="addNewForm.typeId" placeholder="请选择">
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="addNewForm.address" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
                <el-input v-model="addNewForm.contact" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="addNewForm.phone" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="addNewForm.comment">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="已启用" v-model="addNewForm.status" size="small"></el-checkbox>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" class="pull-right" @click="submitForm('addNewForm')" size="small" style="width:90px;">添加</el-button>
                <div v-else class="clearfix">
                    <el-button  type="primary" :loading="createLoading" class="pull-left" @click="updateForm('addNewForm')" size="small" style="width:90px;">保存</el-button>
                    <el-button  type="info" class="pull-right" @click="cancel('addNewForm')" size="small" style="width:90px;">取消</el-button>
                </div>
            </el-form-item>
            <!-- <el-form-item>
                
            </el-form-item> -->
        </el-form>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { addObj,updateObj} from "@/api/project_org";
export default {
    props:['projectInfo'],
    data(){
        return {
            rules: {
                parentId: [
                    { required: false, message: '请选择父级项目', trigger: 'change' },
                ],
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                tm: [
                    { required: true, message: '请选择工期', trigger: 'blur' }
                ],
                adminer: [
                    { required: true, message: '请选择管理员', trigger: 'change' }
                ],
                thumbnailPath: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ],
                position: [
                    { required: true, message: '请选择位置', trigger: 'blur' }
                ],
                comment: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            flag:'add',
            addNewForm:{
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
                        this.$parent.$refs.org.getList()
                        this.$refs[formName].resetFields()
                        this.createLoading = false
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
                        this.createLoading = false
                        this.$parent.$refs.org.getList()
                        this.addNewForm = {}
                        this.flag = 'add'
                    })
                }
            });
        },
        cancel(formName){
            this.flag = 'add'
            this.addNewForm = {}
        },
    }
}
</script>
<style scoped>
.el-form-item{
    margin-bottom: 15px
}
</style>

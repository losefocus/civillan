<template>
    <div>
        <h3>添加机构</h3>
        <el-form label-width="65px" :model="addNewForm"  ref="addNewForm">
            <el-form-item label="项目" >
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="addNewForm.name" size="small" placeholder="请输入内容"></el-input>
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
                <el-button type="primary" class="pull-right" @click="submitForm('addNewForm')" size="small" style="width:100px;">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { fetchList,addObj,delObj,editObj} from "@/api/project_org";
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
            addNewForm:{

            },
            parentIdOptions:[],
            createLoading: true,
        }
    },
    created() {},
    mounted() {

    },
    computed: {},
    methods:{
        selectParentId(){},
        selectAdminer(){},
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    
                    this.addNewForm.projectId = this.projectInfo.id
                    this.addNewForm.status = this.addNewForm.status?1:0
                    console.log(this.addNewForm)
                    // this.createLoading = true
                    // let formData = Object.assign({}, this.addNewForm);
                    // formData.beginAt = Math.round(new Date(formData.tm[0]).getTime()/1000);
                    // formData.endAt = Math.round(new Date(formData.tm[1]).getTime()/1000);
                    // formData.adminer = formData.adminer.toString()
                    // formData.status = formData.status?1:0
                    addObj(this.addNewForm).then(response => {
                        this.createLoading = false
                    })
                }
            });
        }
    }
}
</script>
<style scoped>

</style>

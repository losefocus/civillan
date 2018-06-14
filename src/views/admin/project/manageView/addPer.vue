<template>
    <div>
        <h3>添加人员</h3>
        <el-form label-width="65px" :model="addNewForm"  ref="addNewForm">
            <el-form-item label="项目">
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="机构" prop="organId">
                <el-select v-model="addNewForm.organId" size="small" placeholder="请选择" @change="selectOrganId">
                    <el-option
                    v-for="item in organIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select v-model="addNewForm.roleId" size="small" placeholder="请选择" @change="selectRoleId">
                    <el-option
                    v-for="item in roleIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="addNewForm.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="addNewForm.phone" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="username">
                <el-input v-model="addNewForm.username" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addNewForm.password" size="small" placeholder="请输入内容"></el-input>
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
                <el-button type="primary" class="pull-right" @click="create('addNewForm')" size="small" style="width:100px;">保持</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { addObj} from "@/api/project_per";
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
            addNewForm:{},
            organIdOptions:[],
            roleIdOptions:[],
        }
    },
    created() {console.log(this.projectInfo)},
    mounted() {

    },
    computed: {},
    methods:{
        selectOrganId(){},
        selectRoleId(){},
        create(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    addObj(this.form).then(() => {
                        this.$parent.getList();
                        this.$notify({
                        title: "成功",
                        message: "创建成功",
                        type: "success",
                        duration: 2000
                        });
                    });
                } else {
                    return false;
                }
            });
        }
    }
}
</script>
<style scoped>

</style>

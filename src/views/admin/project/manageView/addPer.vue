<template>
    <div>
        <h3>{{flag == 'add'?'添加':'修改'}}人员</h3>
        <el-form label-width="65px" :model="form"  ref="forms">
            <el-form-item label="项目">
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="机构" prop="organId">
                <el-select v-model="form.organId" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in organOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select v-model="form.roleId" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="username">
                <el-input v-model="form.username" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="form.comment">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" class="pull-right" @click="submitForm('forms')" size="small" style="width:90px;">添加</el-button>
                <div v-else class="clearfix">
                    <el-button  type="primary" :loading="createLoading" class="pull-left" @click="updataForm('forms')" size="small" style="width:90px;">保存</el-button>
                    <el-button  type="info" class="pull-right" @click="cancel('forms')" size="small" style="width:90px;">取消</el-button>
                </div>            
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { fetchOrganList,addObj,} from "@/api/project_per";
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
            form:{},
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
                // this.$store.commit("SET_ORGANOPTIONS",organOptions);
            })
        },
        submitForm(formName){
            let data = Object.assign({},this.form)
            data.projectId = this.projectInfo.id
            data.status = data.status?1:0
            delete data.roleId
            this.$refs[formName].validate(valid => {
                if (valid) {
                    addObj(data).then(() => {
                        this.$parent.$refs.per.getList()
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

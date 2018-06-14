<template>
    <div>
        <h3>添加文件</h3>
        <el-form label-width="65px" :model="addNewForm" ref="addNewForm">
            <el-form-item label="项目" prop="parentId">
                <el-select v-model="addNewForm.parentId" size="small" placeholder="请选择" @change="selectParentId">
                    <el-option
                    v-for="item in parentIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文件" prop="name">
                <el-input v-model="addNewForm.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="position">
                <el-input v-model="addNewForm.position" size="small" placeholder="请输入内容"></el-input>
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
                <el-button type="primary" class="pull-right" @click="submitForm('addNewForm')" size="small" style="width:100px;">保持</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
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
            parentIdOptions:[],
        }
    },
    created() {},
    mounted() {

    },
    computed: {},
    methods:{
        selectParentId(){},
        selectAdminer(){},
        submitForm(){}
    }
}
</script>
<style scoped>

</style>

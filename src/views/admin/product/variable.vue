<template>
    <div>
        <div>
            产 品 : {{productInfo.name}} 
        </div>
        <el-form :model="form" class="clearfix" ref="form">
            <el-form-item label="名称" style="width: 140px">
                <el-input v-model="form.role" style="width:90px;" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="标识" style="width: 140px">
                <el-input v-model="form.role" style="width:90px;" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 140px">
                <el-input v-model="form.role" style="width:90px;" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item >
                <el-checkbox v-model="form.available" >已启用</el-checkbox>
            </el-form-item>
            <el-form-item  style="width: 150px">
                <div v-if="flag == 'add'">
                    <el-button size="small" type="primary" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else>
                    <el-button size="small" type="primary" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                    <el-button size="small" type="info" @click="cancelEdit('form')">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 99%;margin-bottom:10px">
                <el-table-column align="center" label="角色">
                    <template slot-scope="scope">
                        <span>{{scope.row.role}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="描述">
                    <template slot-scope="scope">
                        <span>{{scope.row.description}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <span>{{(scope.row.available == 1)?'已启用':'未启用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" plain @click="updateForm(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" plain @click="deleteForm(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['productInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
            form:{},
            flag:'add',
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:[]
        }
    },
    created() {
        console.log(this.productInfo)
    },
    mounted() {

    },
    computed: {},
    methods:{
        handleCurrentChange(){},
        handleSizeChange(){},
        updateForm(row){},
        deleteForm(row){},
        handleAdd(){},
        handleEdit(){},
        cancelEdit(){}
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px
}
</style>

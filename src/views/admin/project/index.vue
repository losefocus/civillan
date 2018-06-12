<template>
    <div class="app-container calendar-list-container">
        <div v-show="showView === 'index'">
            <div class="filter-container">
                <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" v-if="roleProject_btn_add">添加项目
                </el-button>
                <el-button class="filter-item" style="" @click="toProjectMap"  size="small" type="primary" icon="edit" >项目地图
                </el-button>
                <div class="pull-right">
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" class="filter-item" placeholder="项目名称" v-model="listQuery.page_index">
                    </el-input>
                    <el-button class="filter-item" type="primary" v-waves icon="search" size="small" @click="handleFilter">搜索</el-button>
                </div>
            </div>
            <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.children" border ref="subTable" id="subTable">
                            <el-table-column align="center" label="缩略图">{{scope.row.children}}
                            </el-table-column>      
                            <el-table-column align="center" label="缩略图">
                            </el-table-column>      
                            <el-table-column align="center" label="缩略图">
                            </el-table-column>      
                            <el-table-column align="center" label="缩略图">
                            </el-table-column>      
                            <el-table-column align="center" label="缩略图">
                            </el-table-column>      
                            <el-table-column align="center" label="缩略图">
                            </el-table-column>      
                            <el-table-column align="center" label="操作"  width="400" class-name="lastTd">
                                <template slot-scope="scope">
                                    <el-button size="small" type="success" @click="toInfo(scope.row)">信息</el-button>
                                    <el-button size="small" type="success" @click="toOrg(scope.row)">机构</el-button>
                                    <el-button size="small" type="success" @click="toPer(scope.row)">人员</el-button>
                                    <el-button size="small" type="success" @click="toEqu(scope.row)">设备</el-button>
                                    <el-button size="small" type="success" @click="toDoc(scope.row)">文档</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="缩略图">
                    <template slot-scope="scope">
                        <span>{{scope.row.roleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="项目名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.roleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="开始时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.roleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="结束时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.roleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="Product key">
                    <template slot-scope="scope">
                        <span>{{scope.row.roleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="管理员">
                    <template slot-scope="scope">
                        <span>{{scope.row.roleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="400">
                </el-table-column>
            </el-table>    
            <!-- <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div> -->
        </div>
        <div v-show="showView === 'mapView'">
            <map-view></map-view>
        </div>
        <div v-show="showView === 'manage'">
            <project-manage ref="proManage"></project-manage>
        </div>
    </div>
</template>

<script>
import { fetchList } from "@/api/project";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js";
import mapView from "./map";
import projectManage from "./manage";

export default {
    components:{
        mapView,
        projectManage
    },
    data(){
        return {
            roleProject_btn_add:true,
            sys_user_upd:true,
            sys_user_del:true,
            listQuery: {
                // keyword:'',
                page_index: 1,
                page_size: 20
            },
            listLoading:false,
            list:[{children:[{aa:''},{aa:''}]},{}],
            showView:'index'
        }
    },
    created() {
        // this.getList();
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["permissions"])
    },
    methods:{
        getList(){
            fetchList(this.listQuery).then(response => {
                console.log(response)
                // this.list = response.data.result.items;
                // this.total = response.data.result.total;
                this.listLoading = false;
            });
        },
        handleCreate(){
            console.log(this.$refs)
        },
        handleFilter(){

        },
        //地图
        toProjectMap(){ 
            this.showView = 'mapView'
        },
        //信息
        toInfo(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'info'
        },
        //机构
        toOrg(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'org'
        },
        //人员
        toPer(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'per'
        },
        //设备
        toEqu(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'equ'
        },
        //文档
        toDoc(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'doc'
            
        },
        
    }
}
</script>

<style scoped>

</style>


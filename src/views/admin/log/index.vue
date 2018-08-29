<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container clearfix">
      <div class="pull-right">
        <el-select style="width: 200px;margin-right:10px;" class="filter-item" v-model="listQuery.type" clearable filterable placeholder="请选择" size="small" @change="handleFilter">
          <el-option v-for="item in dicts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button  class="filter-item pull-right" type="primary" v-waves icon="search" @click="handleFilter" size="small">搜索</el-button>
        <el-input class="pull-right" @keyup.enter.native="handleFilter" style="width: 200px;margin-right:10px;" size="small" suffix-icon="el-icon-search" placeholder="用户名" v-model="listQuery.username"></el-input>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="用户">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter}}</span>
        </template>
      </el-table-column>s
      
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP地址">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container" style="margin-top:10px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {delObj, fetchList} from "@/api/log";
  import {remote} from "@/api/dict";
  import waves from "@/directive/waves/index.js"; // 水波纹指令
  import {mapGetters} from "vuex";

  export default {
  name: "table_log",
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      sys_dict_add: false,
      listLoading: true,
      dicts: [
        {label:'添加',value:'add'},
        {label:'删除',value:'delete'},
        {label:'修改',value:'update'},
        {label:'查询',value:'query'},
        {label:'登录',value:'login'},
      ],
      listQuery: {
        page_index: 1,
        page_size: 20,
        type: undefined
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        'add': "添加",
        'delete': "删除",
        'update': "修改",
        'query': "查询",
        'login': "登录",
      };
      return typeMap[type];
    }
  },
  created() {
    this.getList();
    // this.sys_log_del = this.permissions["sys_log_del"];
    // remote("log_type").then(response => {
    //   this.dicts = response.data.result;
    // });
  },
  methods: {
    getSerialNumber(index) {
      return index + 1 + (this.listQuery.page_index - 1) * this.listQuery.page_size;
    },
    getList() {
      this.listLoading = true;
      this.listQuery.sort_by = "createNow";
      this.listQuery.direction = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page_index = val;
      this.getList();
    },
    handleDelete(row) {
      delObj(row.id).then(response => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
      });
    },
    handleFilter() {
      this.listQuery.page_index = 1;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>

</style>


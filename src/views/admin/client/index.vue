<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container clearfix">
      <div class="pull-right">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="编号" v-model="listQuery.client_id" size="small">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" size="small">搜索</el-button>
      </div>
      <el-button v-if="sys_client_add" class="filter-item" @click="handleCreate" type="primary" icon="edit" size="small">新增
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密钥">
        <template slot-scope="scope">
          <span>{{ scope.row.clientSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="域">
        <template slot-scope="scope">
          <span>{{ scope.row.scope }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="自动放行">
        <template slot-scope="scope">
          <span>{{ scope.row.autoapprove }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_client_upd" size="mini" type="" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_client_del" size="mini" type="" @click="handleDelete(scope.row)" style="margin-left:0">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="编号" prop="clientId">
          <el-input v-model="form.clientId" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="密钥" prop="clientSecret">
          <el-input v-model="form.clientSecret" placeholder="密钥"></el-input>
        </el-form-item>
        <el-form-item label="域" prop="scope">
          <el-input v-model="form.scope" placeholder="域"></el-input>
        </el-form-item>
        <el-form-item label="授权模式" prop="authorizedGrantTypes">
          <el-input v-model="form.authorizedGrantTypes" placeholder="授权模式"></el-input>
        </el-form-item>
        <!--<el-form-item label="回调地址" prop="webServerRedirectUri">
          <el-input v-model="form.webServerRedirectUri" placeholder="回调地址"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="authorities">
          <el-input v-model="form.authorities" placeholder="权限"></el-input>
        </el-form-item>
        <el-form-item label="请求令牌" prop="accessTokenValidity">
          <el-input v-model="form.accessTokenValidity" placeholder="请求令牌"></el-input>
        </el-form-item>
        <el-form-item label="刷新令牌" prop="refreshTokenValidity">
          <el-input v-model="form.refreshTokenValidity" placeholder="刷新令牌"></el-input>
        </el-form-item>
        <el-form-item label="自动放行" prop="autoapprove">
          <el-radio-group v-model="form.autoapprove">
            <el-radio label="false">否</el-radio>
            <el-radio label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="扩展信息" prop="additionalInformation">
          <el-input v-model="form.additionalInformation" placeholder="扩展信息"></el-input>
        </el-form-item>
        <el-form-item label="资源ID" prop="resourceIds">
          <el-input v-model="form.resourceIds" placeholder="资源ID"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" size="small">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" size="small">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" size="small">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/client";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { mapGetters } from "vuex";

export default {
  name: "client",
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page_index: 1,
        page_size: 20
      },
      rules: {
        clientSecret: [
          {
            required: true,
            message: "请输入密钥",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        clientId: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        scope: [
          {
            required: true,
            message: "请输入域",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        authorizedGrantTypes:[
          {
            required: true,
            message: "请输入授权模式",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        autoapprove:[
          {
            required: true,
            message: "请选择是否自动放行",
            trigger: "blur"
          }
        ]
      },
      form: {},
      dialogFormVisible: false,
      dialogStatus: "",
      sys_client_add: false,
      sys_client_upd: false,
      sys_client_del: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "有效",
        1: "无效"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    this.sys_client_add = this.permissions["sys_client_add"];
    this.sys_client_upd = this.permissions["sys_client_upd"];
    this.sys_client_del = this.permissions["sys_client_del"];
  },
  methods: {
    getSerialNumber(index) {
      return index + 1 + (this.listQuery.page_index - 1) * this.listQuery.page_size;
    },
    getList() {
      this.listLoading = true;
      this.listQuery.sort_by = "";
      this.listQuery.direction = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page_index = 1;
      this.getList();
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
      delObj(row.clientId).then(response => {
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
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.form.clientId = row.clientId;
      this.form.clientSecret = row.clientSecret;
      this.form.scope = row.scope;
      this.form.authorizedGrantTypes = row.authorizedGrantTypes;
      this.form.webServerRedirectUri = row.webServerRedirectUri;
      this.form.authorities = row.authorities;
      this.form.accessTokenValidity = row.accessTokenValidity;
      this.form.refreshTokenValidity = row.refreshTokenValidity;
      this.form.autoapprove = row.autoapprove;
      this.form.additionalInformation = row.additionalInformation;
      this.form.resourceIds = row.resourceIds;
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
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
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          //this.form.password = undefined;
          putObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
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
};

</script>

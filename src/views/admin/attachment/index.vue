<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button v-if="attachment_btn_del" class="filter-item" style="margin-left: 10px;" @click="deletes_query" type="primary" icon="edit">批量删除</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%" @selection-change="handleSelectionChange">

      <!-- <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        type="selection"
        width="50">
      </el-table-column>    
      <el-table-column
        align="center" label="序号"
        type="index"
        width="50">
      </el-table-column>

      <el-table-column align="center" label="文件名">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.name}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="访问地址">
        <template slot-scope="scope">
          <span>{{scope.row.baseUrl}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文件类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.component}} </span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="文件存放路径">
        <template slot-scope="scope">
          <span >{{scope.row.path}} </span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="文件类型">
        <template slot-scope="scope">
          <span >{{scope.row.type}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文件大小">
        <template slot-scope="scope">
          <span >{{scope.row.size}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上传用户ip">
        <template slot-scope="scope">
          <span >{{scope.row.uploadIp}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上传时间">
        <template slot-scope="scope">
          <span>{{scope.row.createAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="100" v-if="attachment_btn_del">
        <template slot-scope="scope">
          <el-button  size="small" type="danger" @click="deletes(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" :props="defaultProps" @node-click="getNodeData" default-expand-all>
      </el-tree>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输用户名"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" prop="deptName">
          <el-input v-model="form.deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input>
          <input type="hidden" v-model="form.deptId" />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select class="filter-item" v-model="role" placeholder="请选择" multiple>
            <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId" :disabled="isDisabled[item.status]">
              <span style="float: left">{{ item.roleDesc }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="验证码登录使用"></el-input>
        </el-form-item>

        <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="status">
          <el-select class="filter-item" v-model="form.status" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/attachment";
import { deptRoleList, fetchDeptTree } from "@/api/role";
import waves from "@/directive/waves/index.js"; // 水波纹指令
// import { parseTime } from '@/utils'
import { mapGetters } from "vuex";
import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
import ElOption from "element-ui/packages/select/src/option";

export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: "table_user",
  directives: {
    waves
  },
  data() {
    return {
      treeDeptData: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page_index: 1,
        page_size: 20
      },
      role: [],
      form: {
        username: undefined,
        password: undefined,
        status: undefined,
        deptId: undefined,
        mobile: undefined
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur"
          }
        ],
        deptId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur"
          }
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "手机号",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "长度在11 个字符",
            trigger: "blur"
          }
        ]
      },
      statusOptions: ["0", "1"],
      rolesOptions: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0,
      ids:''
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "有效",
        0: "无效",
        9: "锁定"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    this.attachment_btn_del = this.permissions["attachment_btn_del"]
  },
  methods: {
    handleSelectionChange(val){
      this.ids = ''
      val.forEach((ele,index) => {
        this.ids += (index == 0)?ele.id:','+ele.id
      });
    },
    getList() {
      this.listLoading = true;
      this.listQuery.sort_by = "created_at";
      // this.listQuery.direction = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.total;
        this.listLoading = false;
      });
    },
    getNodeData(data) {
      this.dialogDeptVisible = false;
      this.form.deptId = data.id;
      this.form.deptName = data.name;
      deptRoleList(data.id).then(response => {
        this.rolesOptions = response.data;
      });
    },
    handleDept() {
      fetchDeptTree().then(response => {
        this.treeDeptData = response.data.result;
        this.dialogDeptVisible = true;
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
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data.result;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
        this.role = [];
        for (var i = 0; i < row.roleList.length; i++) {
          this.role[i] = row.roleList[i].roleId;
        }
        deptRoleList(response.data.result.deptId).then(response => {
          console.log(response.data)
          this.rolesOptions = response.data;
        });
      });
    },
    create(formName) {
      const set = this.$refs;
      this.form.role = this.role;
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
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      this.form.role = this.role;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
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
    },
    // 删除单个文件
    deletes(row) {
      this.$confirm(
        "此操作将永久删除该文件(文件名:" + row.name + "), 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        delObj(row.id)
          .then(() => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
          })
          .cache(() => {
            this.$notify({
              title: "失败",
              message: "删除失败",
              type: "error",
              duration: 2000
            });
          });
      });
    },
    // 批量删除文件
    deletes_query() {
      let ids = this.ids
      console.log(ids)
      if(ids ===''){
        this.$message({
          message: '请先选择文件',
          type: 'warning'
        });
      }else{
        this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          delObj(ids)
            .then(() => {
              this.getList();
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
            })
            .cache(() => {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "error",
                duration: 2000
              });
            });
        });
      }
    },
    resetTemp() {
      this.form = {
        id: undefined,
        username: "",
        password: "",
        role: [],
        status: "",
        deptId: "",
        mobile: ""
      };
    }
  }
};
</script>

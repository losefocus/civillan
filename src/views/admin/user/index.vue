<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container clearfix">
      <el-button v-if="sys_user_add" class="filter-item" @click="handleCreate" type="primary" icon="edit" size="small">添加</el-button>
      <div class="pull-right">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名" v-model="listQuery.username" size="small">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" size="small">搜索</el-button>
      </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.username}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="所属部门" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.deptName}} </span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="所属分组" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.groupName}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="(role,index) in scope.row.roleList" :key="index">{{role.roleName}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" min-width="130">
        <template slot-scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态" width="60">
        <template slot-scope="scope">
          <!-- <el-tag size="small">{{scope.row.status | statusFilter}}</el-tag> -->
          <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
          <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="140">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd" size="mini" type="" @click="handleUpdate(scope.row)" :disabled="scope.row.createdBy === 0">编辑
          </el-button>
          <el-button v-if="sys_user_del" size="mini" type="" @click="deletes(scope.row)" style="margin-left:0" :disabled="scope.row.createdBy === 0">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container" style="margin-top:25px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" :props="defaultProps" @node-click="getNodeData" default-expand-all>
      </el-tree>
    </el-dialog> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输用户名"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码"  prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <!-- <el-form-item label="所属部门" prop="deptName">
          <el-input v-model="form.deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input>
          <input type="hidden" v-model="form.deptId" />
        </el-form-item> -->

        <el-form-item label="所属分组" prop="groupIds">
          <!-- <el-input v-model="form.groupName" placeholder="选择分组" @focus="handleDept()" readonly></el-input> -->
          <!-- <input type="hidden" v-model="form.group" /> -->
          <el-cascader :options="groupOptions" placeholder="请选择所属分组" :props="defaultProps" v-model="groupIds" :show-all-levels="false" change-on-select @change="changeGroup" style="width:100%"></el-cascader>
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select class="filter-item" v-model="role" placeholder="请选择角色" multiple style="width:100%" no-data-text="请先添加角色">
            <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="isDisabled[item.status]">
              <span style="float: left">{{ item.roleName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="验证码登录使用"></el-input>
        </el-form-item>

        <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="status">
          <!-- <el-select class="filter-item" v-model="form.status" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select> -->
          <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
        </el-form-item>
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
  import {addObj, delObj, fetchList, get_parent, getObj, putObj} from "@/api/user";
  import {fetchDeptTree, roleList} from "@/api/role";
  import {fetchTree} from "@/api/group";
  import {treeAddValue,treeToArr,reduce_,listParents} from "@/util/util";
  import waves from "@/directive/waves/index.js"; // 水波纹指令
  // import { parseTime } from '@/utils'
  import {mapGetters} from "vuex";
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
    var validateGroup = (rule, value, callback) => {
        if (this.groupIds.length == 0) {
            callback(new Error('请选择分组'));
        } else {
            callback();
        }
    };
    var validateRole = (rule, value, callback) => {
        if (value.length == 0) {
            callback(new Error('请选择角色'));
        } else {
            callback();
        }
    };
    return {
      treeDeptData: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "name",
        value:'id'
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page_index: 1,
        page_size: 20
      },
      role: [],
      roleName:[],
      groupIds:[],
      form: {
        name:undefined,
        username: undefined,
        password: undefined,
        mobile: undefined,
        group:undefined,
        groupName:undefined,
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
            // max: 20,
            message: "长度不能小于5个字符",
            trigger: "blur"
          }
        ],
        groupIds: [
           {validator: validateGroup,trigger: 'blur' ,required: true,}
        ],
        role: [
           {validator: validateRole,trigger: 'blur' ,required: true,}
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
      groupOptions: [],
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
      tableKey: 0
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
    this.handleDept();
    this.getRoleList()
    this.sys_user_add = this.permissions["sys_user_add"];
    this.sys_user_upd = this.permissions["sys_user_upd"];
    this.sys_user_del = this.permissions["sys_user_del"];
  },
  methods: {
    getList() {
      this.listLoading = true;
      // this.listQuery.sort_by = "`user`.created_at";
      // this.listQuery.direction = "desc";
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.total;
        this.listLoading = false;
      });
    },
    // getNodeData(data) {
    //   this.dialogDeptVisible = false;
    //   this.form.group = data.id;
    //   this.form.groupName = data.name;
    //   roleList().then(response => {
    //     this.rolesOptions = response.data.result;
    //   });
    // },
    changeGroup(){
      this.form.group = this.groupIds[this.groupIds.length - 1]
    },
    handleDept() {
      fetchTree().then(response => {
        this.treeDeptData = response.data.result;
        this.groupOptions = treeAddValue(response.data.result)
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
      this.$refs.form.resetFields();
    },
    getRoleList(){
      roleList().then(response => {
          this.rolesOptions = response.data.result;
        });
    },
    handleUpdate(row) {
      if(this.$refs.form) this.$refs.form.resetFields()
      getObj(row.id).then(response => {
        this.form = response.data.result;
        this.form.status = this.form.status == 1?true:false
        this.form.groupName = row.groupName
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
        this.role = [];
        this.roleName = [];
        for (var i = 0; i < row.roleList.length; i++) {
          this.role[i] = row.roleList[i].roleId ;
          this.roleName[i] = row.roleList[i].roleName;
        }
        let op = reduce_(treeToArr(this.groupOptions))
        this.groupIds = listParents(op, {id:parseInt(this.form.group),parentId:parseInt(this.form.groupParentId)}).concat([{id:parseInt(this.form.group)}]).map(x => parseInt(x.id))
        // get_parent(this.form.group).then(res => {
        //   let groups = new Array
        //   res.data.result.forEach(ele => {
        //     groups.push(ele.id)
        //   });
        //   this.groupIds = groups
        // })
      });
    },
    create(formName) {
      const set = this.$refs;
      this.form.role = this.role;
      set[formName].validate(valid => {
        if (valid) {
          delete this.form.status
          delete this.form.groupName
          delete this.form.roleName
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
          this.form.status = this.form.status?1:0
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
    deletes(row) {
      this.$confirm(
        "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        delObj(row.id)
          .then((res) => {
            if(res.data.success == false){
              this.$notify({
                title: "失败",
                message: res.data.message,
                type: "error",
                duration: 2000
              });
            }else{
              this.getList();
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
            }
          })
          // .cache(() => {
          //   this.$notify({
          //     title: "失败",
          //     message: "删除失败",
          //     type: "error",
          //     duration: 2000
          //   });
          // });
      }).catch(() => {});
    },
    resetTemp() {
      this.form = {
        name:undefined,
        username: undefined,
        password: undefined,
        mobile: undefined,
        group:undefined,
        groupName:undefined,
      }
      this.role = []
      this.groupIds = []
    }
  }
};
</script>

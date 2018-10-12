<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" v-if="group_btn_add" icon="plus" @click="handlerAdd" size="small">添加</el-button>
        <el-button type="primary" v-if="group_btn_edit" icon="edit" @click="handlerEdit" size="small">编辑</el-button>
        <el-button type="primary" v-if="group_btn_del" icon="delete" @click="handleDelete" size="small">删除</el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="7" style='margin-top:15px;'>
        <el-tree
          class="filter-tree"
          node-key="id"
          highlight-current
          :data="treeData"
          :default-expanded-keys="aExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @node-click="getNodeData"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
        </el-tree>
      </el-col>
      <el-col :span="16" class="pull-right" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item label="父级节点" prop="parentId">
              <!-- <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点"></el-input> -->
              <el-cascader :options="pOptions" v-model="parentIds" :props="pProps" :disabled="formEdit"
                placeholder="请输入父级节点"
                :show-all-levels="false"
                change-on-select
                @change="changeP"
                style="width:100%">
              </el-cascader>
            </el-form-item>
            <!-- <el-form-item label="节点ID" prop="id">
              <el-input v-model="form.id" disabled placeholder="请输入节点ID"></el-input>
            </el-form-item> -->
            <el-form-item label="分组名称" prop="name">
              <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="form.comment" :disabled="formEdit" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="update" size="small">更新</el-button>
              <el-button @click="onCancel" size="small">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="create" size="small">保存</el-button>
              <el-button @click="onCancel" size="small">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {addObj, delObj, fetchTree, getObj, putObj} from '@/api/group'
  import {mapGetters} from 'vuex'
  import {treeToArr,reduce_,listParents} from "@/util/util";

  export default {
    name: 'menu',
    data() {
      return {
        list: null,
        total: null,
        formEdit: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: ['0', '1'],
        methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        listQuery: {
          name: undefined
        },
        treeData: [],
        oExpandedKey: {
          // key (from tree id) : expandedOrNot boolean
        },
        oTreeNodeChildren: {
          // id1 : [children] (from tree node id1)
          // id2 : [children] (from tree node id2)
        },
        aExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        labelPosition: 'right',
        form: {
          id: undefined,
          name: undefined,
          parentId: undefined,
          url: undefined,
          sort: undefined,
          comment: undefined,
          tenant : '21fe87251b01541399c7c1a8cec741c5'
        },
        parentIds:[],
        pOptions:[],
        pProps: {
          label:'name',
          value:'id',
          children: 'children'
        },
        currentId: 0,
        group_btn_add: false,
        group_btn_edit: false,
        group_btn_del: false
      }
    },
    filters: {
    },
    created() {
      this.getList()
      this.group_btn_add = this.permissions['group_btn_add']
      this.group_btn_edit = this.permissions['group_btn_edit']
      this.group_btn_del = this.permissions['group_btn_del']
    },
    computed: {
      ...mapGetters([
        'elements',
        'permissions'
      ])
    },
    methods: {
      changeP(){
        this.form.parentId = this.parentIds[this.parentIds.length-1]
      },
      getList() {
        fetchTree(this.listQuery).then(response => {
          this.treeData = response.data.result
          this.pOptions = [{id:0,name:'无'}].concat(this.treeData)
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },

      nodeExpand(data) {
          let aChildren = data.children
          if (aChildren.length > 0) {
            this.oExpandedKey[data.id] = true
            this.oTreeNodeChildren[data.id] = aChildren
          }
          this.setExpandedKeys()
      },
      nodeCollapse(data) {
        this.oExpandedKey[data.id] = false
        // 如果有子节点
        this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
          this.oExpandedKey[oNode.id] = false
        });
        this.setExpandedKeys()
      },
      setExpandedKeys() {
        let oTemp = this.oExpandedKey
        this.aExpandedKeys = []
        for (let sKey in oTemp) {
          if (oTemp[sKey]) {
            this.aExpandedKeys.push(parseInt(sKey));
          }
        }
      },
      treeRecursion(aChildren, fnCallback) {
        if (aChildren) {
          for (let i = 0; i < aChildren.length; ++i) {
            let oNode = aChildren[i]
            fnCallback && fnCallback(oNode)
            this.treeRecursion(oNode.children, fnCallback)
          }
        }
      },

      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update'
        }
        getObj(data.id).then(response => {
          this.form = response.data.result;
          let tree_ = reduce_(treeToArr(this.pOptions))
          this.parentIds = (this.form.parentId == 0)?[0]:listParents(tree_, this.form).map(x => x.id)
          // if(this.form.parentId == 0)
          // console.log(listParents(tree_, this.form).map(x => x.id))
        })
        this.currentId = data.id
        this.showElement = true
      },
      handlerEdit() {
        if (this.form.id) {
          this.formEdit = false
          this.formStatus = 'update'
        }
      },
      handlerAdd() {
        this.resetForm()
        this.formEdit = false
        this.formStatus = 'create'
      },
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(() => {
            this.getList()
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      update() {
        if(this.form.id == this.form.parentId){
          this.$notify({
            title: '失败',
            message: '父级节点不能选择本身',
            type: 'error',
            duration: 2000
          })
          return
        }
        putObj(this.form).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      create() {
        addObj(this.form).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      onCancel() {
        this.formEdit = true
        this.formStatus = ''
      },
      resetForm() {
        this.form = {
          permission: undefined,
          name: undefined,
          menuId: undefined,
          parentId: this.currentId,
          url: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          method: undefined,
          path: undefined
        }
      }
    }
  }
</script>


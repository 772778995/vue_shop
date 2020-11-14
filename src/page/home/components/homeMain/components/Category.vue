<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加新分类 -->
      <el-button
        type="primary"
        @click="addCateShow=true">
        添加新分类
      </el-button>
      <!-- 表格区域 -->
       <el-table
           ref="table"
           :data="cateList"
           style="width: 100%"
           row-key="id"
           border
           lazy
           :load="load"
           :tree-props="{ hasChildren: 'child'}">
           <!-- 索引列 -->
           <el-table-column
             prop="id"
             label="#"
             width="120">
           </el-table-column>
           <!-- 分类等级列 -->
           <el-table-column label="分类等级">
             <template slot-scope="scope">
               <el-tag
                 effect="dark"
                 type="primary"
                 v-if="scope.row.id%1===0">
                 一级分类
               </el-tag>
               <el-tag
                 effect="dark"
                 type="success"
                 v-else-if="scope.row.id*10%1===0">
                 二级分类
               </el-tag>
               <el-tag
                 effect="dark"
                 type="warning"
                 v-else>
                 三级分类
               </el-tag>
             </template>
           </el-table-column>
           <!-- 商品分类列 -->
           <el-table-column label="商品分类">
             <template slot-scope="scope">
               <el-tag
                 effect="dark"
                 type="primary"
                 v-if="scope.row.id%1===0">
                 {{scope.row.title}}
               </el-tag>
               <el-tag
                 effect="dark"
                 type="success"
                 v-else-if="scope.row.id*10%1===0">
                 {{scope.row.title}}
               </el-tag>
               <el-tag
                 effect="dark"
                 type="warning"
                 v-else>
                 {{scope.row.title}}
               </el-tag>
             </template>
           </el-table-column>
           <!-- 操作列 -->
           <el-table-column label="操作" width="130">
             <template slot-scope="scope">
               <!-- 修改按钮 -->
               <el-tooltip effect="dark"
                 content="修改"
                 :enterable="false"
                 placement="top">
                   <el-button
                     @click="editCate(scope.row)"
                     type="primary"
                     size="mini"
                     icon="el-icon-edit">
                   </el-button>
                 {{scope.row.id}}
               </el-tooltip>
               <el-tooltip effect="dark"
                 content="删除"
                 :enterable="false"
                 placement="top">
                   <el-button
                     type="danger"
                     @click="delCate(scope.row)"
                     size="mini"
                     icon="el-icon-delete">
                   </el-button>
               </el-tooltip>
             </template>
           </el-table-column>
        </el-table>
    </el-card>
    <!-- 编辑分类名称对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editFormShow"
      width="50%">
      <!-- 对话框中的编辑表单 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="id:">
          <el-input readonly disabled v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="分类等级:">
          <el-input readonly disabled v-model="editForm.level"></el-input>
        </el-form-item>
        <el-form-item label="分类名称:" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFormShow=false">取 消</el-button>
        <el-button @click="editFormSure" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加新分类对话框 -->
    <el-dialog
      title="添加新分类"
      :visible.sync="addCateShow"
      width="50%">
      <!-- 对话框中的添加新分类表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules">
        <!-- 分类等级选择器 -->
        <el-form-item prop="cateLevel">
          <span class="label">分类等级：</span>
          <el-select
            class="select"
            @change="cateLvchange"
            v-model="addCateForm.cateLevel"
            placeholder="请选择">
              <el-option
                v-for="item in addCateForm.cateLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <!-- 一级分类列表选择器 -->
        <el-form-item prop="cateLv1" v-if="addCateForm.cateLevel">
          <span class="label">一级分类列表：</span>
          <el-select
            class="select"
            @change="cateLv1Change"
            v-model="addCateForm.cateLv1"
            placeholder="请选择">
              <el-option
                v-for="item in addCateForm.cateLv1List"
                :key="item.id"
                :label="item.title"
                :value="item.id">
                  <span style="float: left">{{ item.title }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
              </el-option>
            </el-select>
        </el-form-item>
        <!-- 二级分类列表 -->
        <el-form-item prop="cateLv2" v-if="addCateForm.cateLevel===2">
          <span class="label">二级分类列表：</span>
          <el-select
            :disabled="!addCateForm.cateLv1"
            class="select"
            no-data-text="无数据,请先为目标分类添加父级分类"
            @change="cateLv2Change"
            v-model="addCateForm.cateLv2"
            placeholder="请选择">
              <el-option
                v-for="item in addCateForm.cateLv2List"
                :key="item.id"
                :label="item.title"
                :value="item.id">
                  <span style="float: left">{{ item.title }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="addCateForm.cateLv3List" style="padding: 0 10%;">
          <span class="label">已有三级分类：</span>
          <el-tag
            v-for="item in addCateForm.cateLv3List"
            :key="item.id">
              {{item.title}}
          </el-tag>
        </el-form-item>
        <el-form-item prop="cateID">
          <span class="label">分类 ID ：</span>
          <el-input class="select" v-model="addCateForm.cateID" readonly disabled></el-input>
        </el-form-item>
        <el-form-item prop="cateTitle">
          <span class="label">分类名称：</span>
          <el-input class="select" v-model="addCateForm.cateTitle"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateShow=false">取 消</el-button>
        <el-button @click="addCateFormSure" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CateList',
  data () {
    // 如果选择添加二级分类,则一级分类选择器不得为空
    const checkCateLv1 = (rule, value, callback) => {
      if (this.addCateForm.cateLevel && !value) {
        return callback(new Error('请选择一级分类'))
      }
      callback()
    }
    // 如果选择添加三级分类,则二级分类选择器不得为空
    const checkCateLv2 = (rule, value, callback) => {
      if (this.addCateForm.cateLv1 && !value) {
        return callback(new Error('请选择二级分类'))
      }
      callback()
    }
    return {
      cateList: [],
      addCateShow: false,
      addCateForm: {
        cateLevelOptions: [
          { value: 0, label: '一级分类' },
          { value: 1, label: '二级分类' },
          { value: 2, label: '三级分类' }
        ],
        cateLevel: '',
        cateLv1List: null,
        cateLv1: '',
        cateLv2List: null,
        cateLv2: '',
        cateLv3List: null,
        cateTitle: '',
        cateID: ''
      },
      addCateFormRules: {
        cateLevel: [
          { required: true, message: '请选择分类等级', trigger: 'change' }
        ],
        cateLv1: [
          { validator: checkCateLv1, trigger: 'change' }
        ],
        cateLv2: [
          { validator: checkCateLv2, trigger: 'change' }
        ],
        cateTitle: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 6, message: '请输入1-6位字符', trigger: 'blur' }
        ],
        cateID: [
          { required: true, message: '请输入分类 ID ', trigger: 'blur' }
        ]
      },
      editFormShow: false,
      editForm: {
        id: null,
        title: null,
        level: null,
        parent: null
      },
      editFormRules: {
        title: [
          { required: true, message: '请输入分类标题', trigger: 'blur' },
          { min: 2, max: 8, message: '请输入2-8位字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取分类列表,参数可为空,第一个参数传入上一级分类的id,第二个参数是一个返回结果的回调函数
    getCateList: function (param, callback) {
      this.$axios.get(
        '/vue_shop/getCategory.php', {
          params: { parent: param }
        }
      ).then(res => {
        callback(res)
      })
    },
    // 树状表格的懒加载事件
    load (tree, treeNode, resolve) {
      this.getCateList(tree.id, (res) => {
        resolve(res.data)
      })
    },
    // 弹出编辑对话框并传入数据
    editCate (editInfo) {
      const { id, title, parent } = editInfo
      this.editForm.id = id
      this.editForm.title = title
      this.editForm.parent = parent
      if (id % 1 === 0) {
        this.editForm.level = '等级一'
      } else if (id * 10 % 1 === 0) {
        this.editForm.level = '等级二'
      } else {
        this.editForm.level = '等级三'
      }
      this.editFormShow = true
    },
    // 确认修改,向后台发起请求
    editFormSure () {
      const { id, title, parent } = this.editForm
      this.$axios.get(
        '/vue_shop/editCate.php', {
          params: {
            id: id,
            title: title
          }
        }
      ).then(res => {
        // 修改成功!
        if (res.status === 200) {
          this.editFormShow = false
          this.$message.success('修改成功！')
          // 重新请求被修改节点的数据
          this.getCateList(parent, res => {
            // 找到该节点并重新赋值
            this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parent, res.data)
          })
        } else {
          // 修改失败
          this.$message.error('修改失败！')
        }
      })
    },
    // 删除目标分类以及目标级别以下所有分类
    delCate (delInfo) {
      // 确认是否删除？
      this.$messageBox.confirm('删除目标分类以及目标等级下的所有分类, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除
        const { id, parent } = delInfo
        this.$axios.get(
          '/vue_shop/delCate.php', {
            params: {
              id: id
            }
          }).then(res => {
          // 删除成功
          if (res.status === 200) {
            this.$message.success('删除成功！')
            this.getCateList(parent, res => {
              // 重新渲染
              if (!parent) {
                this.cateList = res.data
              } else {
                this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parent, res.data)
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分类等级选择器改变
    cateLvchange () {
      this.addCateForm.cateLv1 = null
      this.addCateForm.cateLv3List = null
      if (!this.addCateForm.cateLevel) {
        if (this.cateList.length >= 1) {
          const arr = this.cateList.map(item => item.id)
          this.addCateForm.cateID = Math.max(...arr) + 1
        } else {
          this.addCateForm.cateID = 1
        }
      }
    },
    // 一级分类列表选择器改变
    cateLv1Change () {
      this.addCateForm.cateLv2 = null
      this.getCateList(this.addCateForm.cateLv1, res => {
        this.addCateForm.cateLv2List = res.data
        const lv1 = this.addCateForm.cateLv1
        if (res.data.length >= 1) {
          const arr = []
          for (let i = 0; i < res.data.length; i++) {
            arr[i] = res.data[i].id.replace(/\d\./, '')
            arr[i] = parseInt(arr[i])
          }
          const lv2 = Math.max(...arr)
          this.addCateForm.cateID = `${lv1}.${lv2}`
        } else {
          this.addCateForm.cateID = `${lv1}.1`
        }
      })
    },
    // 二级分类列表选择器改变
    cateLv2Change () {
      this.getCateList(this.addCateForm.cateLv2, res => {
        this.addCateForm.cateLv3List = res.data
        // 遍历并截取id
        if (res.data.length >= 1) {
          const arr = res.data.map(item => item.id.replace(/\d+\.\d+\./, ''))
          // 取最大值id
          const maxID = Math.max(...arr) + 1
          // 给添加表单的分类id取最新的id
          this.addCateForm.cateID = `${this.addCateForm.cateLv2}.${maxID}`
        } else {
          this.addCateForm.cateID = `${this.addCateForm.cateLv2}.1`
        }
      })
    },
    // 确定提交表单
    addCateFormSure () {
      this.$refs.addCateFormRef.validate(val => {
        if (val) {
          const { cateID: id, cateTitle: title, cateLevel: lv, cateLv1: lv1, cateLv2: lv2 } = this.addCateForm
          let parent = ''
          if (lv === 1) parent = lv1
          else if (lv === 2) parent = lv2
          this.$axios.get(
            '/vue_shop/addCate.php', {
              params: {
                id: id,
                title: title,
                parent: parent
              }
            }
          ).then(res => {
            if (res.status === 200) {
              this.$message.success('添加分类成功！')
              this.getCateList(parent, res => {
                // 重新渲染
                if (!parent) {
                  this.cateList = res.data
                  this.addCateForm.cateLv1List = res.data
                } else {
                  this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parent, res.data)
                }
              })
              this.$refs.addCateFormRef.resetFields()
            } else {
              this.$message.error('添加分类失败！')
            }
          })
          this.addCateShow = false
        }
      })
    }
  },
  created () {
    this.getCateList(null, res => {
      this.cateList = res.data
      this.addCateForm.cateLv1List = res.data
    })
  }
}
</script>

<style scoped>
  .label {
    width: 30%;
    display: block;
    float: left;
    text-align: right;
  }
  .select {
    width: 50%;
    padding-right: 20%;
  }
</style>

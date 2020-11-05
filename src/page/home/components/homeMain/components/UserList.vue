<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <div class="text item">
        <!-- 搜索 -->
        <el-row :gutter="20">
          <el-col :span="10">
             <el-input
              clearable
              @clear="getUserList"
              placeholder="请输入内容"
              v-model="query">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getUserList">
                </el-button>
             </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table
        border
        :data="userList"
        style="width: 100%">
          <!-- id列 -->
          <el-table-column
            width="60"
            prop="id"
            label="#id">
          </el-table-column>
          <!-- 邮箱列 -->
          <el-table-column
            prop="Email"
            label="邮箱地址">
          </el-table-column>
          <!-- 昵称列 -->
          <el-table-column
            prop="name"
            label="昵称"
            width="200">
          </el-table-column>
          <!-- 角色列 -->
          <el-table-column
            label="角色"
            width="160">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.power>900">{{scope.row.object}}</el-tag>
                <el-tag v-else-if="scope.row.power>200" type="success">{{scope.row.object}}</el-tag>
                <el-tag v-else-if="scope.row.power>100" type="warning">{{scope.row.object}}</el-tag>
                <el-tag v-else type="info">{{scope.row.object}}</el-tag>
              </template>
          </el-table-column>
          <!-- 注册时间列 -->
          <el-table-column
            prop="createTime"
            label="注册时间">
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column
            label="人事经理及以上有权限"
            width="180">
              <!-- 模板插槽 -->
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-tooltip effect="dark" content="修改" :enterable="false" placement="top">
                  <el-button
                    @click="editUser(scope.row)"
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    :disabled="userInfo.power-scope.row.power<10 || userInfo.power!=101 && userInfo.power<200">
                  </el-button>
                </el-tooltip>
                <!-- <el-tooltip effect="dark" content="设置" :enterable="false" placement="top">
                  <el-button
                    type="warning"
                    size="mini"
                    icon="el-icon-setting"
                    :disabled="userInfo.power<=scope.row.power">
                  </el-button>
                </el-tooltip> -->
                <el-tooltip effect="dark" content="删除" :enterable="false" placement="top">
                  <el-button
                    @click="delUser(scope.row.id)"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    :disabled="userInfo.power-scope.row.power<10 || userInfo.power!=101 && userInfo.power<200">
                  </el-button>
                </el-tooltip>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-button-group>
        <el-button
          @click="prev"
          type="primary"
          :disabled="page===0"
          icon="el-icon-arrow-left">
            上一页
        </el-button>
        <el-button
          @click="next"
          type="primary"
          :disabled="userList.length<7 || !userList">
            下一页<i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
      <el-tag type="primary">{{page+1}}</el-tag>
    </el-card>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户昵称"
      :visible.sync="editUserShow"
      width="50%">
        <!-- 对话框中的编辑表单 -->
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="id:">
            <el-input readonly disabled v-model="editForm.id"></el-input>
          </el-form-item>
          <el-form-item label="Email:">
            <el-input readonly disabled v-model="editForm.Email"></el-input>
          </el-form-item>
          <el-form-item label="name:" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserShow=false">取 消</el-button>
          <el-button @click="editUserSure" type="primary">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  props: ['userInfo'],
  data () {
    return {
      // 用户列表
      userList: [],
      // 当前页数
      page: 0,
      // 搜索内容
      query: '',
      // 修改用户表单对话框是否显示
      editUserShow: false,
      // 修改用户表单数据
      editForm: {
        id: '',
        Email: '',
        name: ''
      },
      // 修改用户表单规则
      editFormRules: {
        name: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 12, message: '请输入6-12位字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 请求用户列表
    getUserList: function () {
      this.$axios.post(
        // 判断搜索框值是否为空选择请求路径
        this.query ? '/vue_shop/userSerch.php' : '/vue_shop/userList.php',
        `&page=${this.page}&query=${this.query}`
      )
        .then(res => {
          this.userList = res.data
        })
    },
    // 修改用户
    editUser: function (userInfo) {
      this.editUserShow = true
      const { id, Email, name } = userInfo
      this.editForm.id = id
      this.editForm.Email = Email
      this.editForm.name = name
    },
    // 确定修改
    editUserSure: function () {
      this.$refs.editFormRef.validate(value => {
        if (value) {
          const { id, name } = this.editForm
          this.$axios.post(
            '/vue_shop/edit.php',
            `&id=${id}&name=${name}`
          )
            .then(res => {
              if (res.status === 200) {
                this.$message.success('修改成功！')
                this.getUserList()
                this.editUserShow = false
              } else {
                this.$message.error('修改失败！')
              }
            })
        }
      })
    },
    // 删除用户
    delUser: function (id) {
      this.$messageBox.confirm('删除该用户后无法恢复, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          '/vue_shop/deleteUser.php',
          `id=${id}`
        ).then(res => {
          if (res.status === 200) {
            this.$message.success('删除成功！')
            this.getUserList()
          } else {
            this.$message.error('删除失败！')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 上一页
    prev: function () {
      --this.page
      this.getUserList()
    },
    // 下一页
    next: function () {
      ++this.page
      this.getUserList()
    }
  },
  // 挂载组件后加载用户列表
  mounted () {
    this.getUserList()
  }
}
</script>

<style scoped>
  .el-card {
    position: relative;
    padding-bottom: 40px;
  }
  .el-button-group {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
  }
  .el-form {
    padding-right: 40px;
  }
  .el-tag {
    float: right;
  }
</style>

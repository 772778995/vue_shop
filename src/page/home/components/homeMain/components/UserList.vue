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
        <!-- 搜索，添加区域 -->
        <el-row :gutter="20">
          <el-col :span="10">
             <!-- 搜索框 -->
             <el-input placeholder="请输入内容" class="input-with-select">
               <el-button slot="append" icon="el-icon-search"></el-button>
             </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table
        border
        :data="userList"
        style="width: 100%">
          <el-table-column
            width="60"
            prop="id"
            label="#id">
          </el-table-column>
          <el-table-column
            prop="Email"
            label="邮箱地址">
          </el-table-column>
          <el-table-column
            prop="name"
            label="昵称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="object"
            label="对象"
            width="160">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="注册时间">
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" :enterable="false" placement="top">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    :disabled="scope.row.object !== '普通用户'">
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="设置" :enterable="false" placement="top">
                  <el-button
                    type="warning"
                    size="mini"
                    icon="el-icon-setting"
                    :disabled="scope.row.object !== '普通用户' || scope.row.Email === localPsd.Email">
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" :enterable="false" placement="top">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    :disabled="scope.row.object !== '普通用户'">
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  props: ['localPsd'],
  data () {
    return {
      userList: [],
      page: 0
    }
  },
  methods: {
    // 请求用户列表
    getUserList: function () {
      this.$axios.post(
        '/vue_shop/userList.php',
        this.localPsd + '&page=' + this.page
      )
        .then(res => {
          this.userList = res.data
        })
    },
    // 改变页码
    prev: function () {
      --this.page
      this.getUserList()
    },
    next: function () {
      ++this.page
      this.getUserList()
    }
  },
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
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <template>
        <!-- 表格区域 -->
        <el-table
          border
          :data="powerList"
          style="width: 100%">
          <!-- 索引列 -->
          <el-table-column
            type="index"
            label="#id">
          </el-table-column>
          <!-- 权限名称列 -->
          <el-table-column label="权限名称">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.power>300">{{scope.row.powerName}}</el-tag>
              <el-tag v-else-if="scope.row.power>200" type="success">{{scope.row.powerName}}</el-tag>
              <el-tag v-else-if="scope.row.power>100" type="warning">{{scope.row.powerName}}</el-tag>
              <el-tag v-else type="info">{{scope.row.powerName}}</el-tag>
            </template>
          </el-table-column>
          <!-- 权限等级列 -->
          <el-table-column label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.power>300">{{scope.row.powerLevel}}</el-tag>
              <el-tag v-else-if="scope.row.power>200" type="success">{{scope.row.powerLevel}}</el-tag>
              <el-tag v-else-if="scope.row.power>100" type="warning">{{scope.row.powerLevel}}</el-tag>
              <el-tag v-else type="info">{{scope.row.powerLevel}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="拥有权限">
            <template slot-scope="scope">
              <el-tag type="danger"
                v-for="(item, index) in scope.row.operable"
                :key="index">
                {{item}}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  <!-- 卡片区域 -->
  </div>
</template>

<script>
export default {
  name: 'PowerList',
  data () {
    return {
      powerList: []
    }
  },
  methods: {
    getPowerList: function () {
      this.$axios.get('/vue_shop/powerList.php')
        .then(res => {
          this.powerList = res.data
        })
    }
  },
  mounted () {
    this.getPowerList()
  }
}
</script>

<style scoped>
</style>

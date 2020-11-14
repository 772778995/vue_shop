<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="10">
          <el-input v-model="query" clearable placeholder="请输入搜索内容" @clear="clearQuery">
            <el-button
              @click="searchOrder"
              icon="el-icon-search"
              slot="append">
            </el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table border :data="orderList">
        <el-table-column
          label="#"
          type="index">
        </el-table-column>
        <el-table-column
          label="订单编号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="订单价格"
          prop="price">
        </el-table-column>
        <el-table-column
          label="订单数量"
          prop="num">
        </el-table-column>
        <el-table-column
          label="是否发货">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.shipment != 0">
                已发货
              </el-tag>
              <el-tag type="danger" v-else>
                未发货
              </el-tag>
            </template>
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="createTime">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" :enterable="false" placement="top">
              <el-button
                @click="openEditOrderForm(scope.row)"
                type="primary"
                size="mini"
                icon="el-icon-edit">
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" :enterable="false" placement="top">
              <el-button
                @click="delOrder(scope.row)"
                type="danger"
                size="mini"
                icon="el-icon-delete">
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
          :disabled="orderList.length<7 || !orderList">
            下一页<i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
      <el-tag class="page" type="primary">{{page+1}}</el-tag>
    </el-card>
    <!-- 编辑订单对话框 -->
    <el-dialog
      title="编辑订单"
      :visible.sync="editOrderForm.show"
      width="50%">
      <el-form
        :model="editOrderForm"
        :rules="editOrderFormRules"
        ref="editOrderFormRef">
        <el-form-item prop="price" label="订单价格:">
          <el-input v-model="editOrderForm.price"></el-input>
        </el-form-item>
        <el-form-item prop="num" label="订单数量:">
          <el-input v-model="editOrderForm.num"></el-input>
        </el-form-item>
        <el-form-item label="是否发货:">
          <el-switch
            v-model="editOrderForm.shipment"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderForm.show = false">取 消</el-button>
        <el-button type="primary" @click="subEditOrderForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data () {
    return {
      page: 0,
      query: '',
      orderList: [],
      // 编辑订单表单数据
      editOrderForm: {
        show: false,
        id: '',
        price: '',
        num: '',
        shipment: 0,
        createTime: ''
      },
      // 编辑表单校验规则
      editOrderFormRules: {
        price: [
          { required: true, message: '请输入价格', tirgger: 'blur' },
          { type: 'number', message: '请输入数字', tirgger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入价格', tirgger: 'blur' },
          { type: 'number', message: '请输入数字', tirgger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 搜索订单
    searchOrder () {
      this.getOrderList()
    },
    // 清空搜索框
    clearQuery () {
      this.getOrderList()
    },
    // 打开编辑订单对话框
    openEditOrderForm (orderInfo) {
      this.editOrderForm.show = true
      const { id, price, num, shipment } = orderInfo
      this.editOrderForm.id = id
      this.editOrderForm.price = price
      this.editOrderForm.num = num
      if (shipment) this.editOrderForm.shipment = true
      else this.editOrderForm.shipment = false
    },
    // 提交编辑订单表单
    subEditOrderForm () {
      let { id, price, num, shipment } = this.editOrderForm
      if (shipment) shipment = 1
      else shipment = 0
      this.$axios.get(
        '/vue_shop/editOrder.php', {
          params: { id, price, num, shipment }
        }
      ).then(res => {
        if (res.status === 200) this.$message.success('修改订单成功！')
        else this.$message.error('修改订单失败！')
        this.editOrderForm.show = false
      })
      this.getOrderList()
    },
    // 删除目标订单
    delOrder (orderInfo) {
      const { id } = orderInfo
      this.$axios.get('/vue_shop/delOrder.php', {
        params: { id }
      }).then(res => {
        if (res.status === 200) this.$message.success('删除订单成功！')
        else this.$message.error('删除失败！')
      })
      this.getOrderList()
    },
    // 获取订单列表
    getOrderList () {
      this.$axios.get('/vue_shop/orderList.php', {
        params: { page: this.page, query: this.query }
      }).then(res => {
        if (res.status === 200) {
          if (res.data.length === 0) {
            this.orderList = []
          } else {
            this.orderList = res.data
          }
        }
      })
    },
    // 上一页
    prev () {
      --this.page
      this.getOrderList()
    },
    // 下一页
    next () {
      ++this.page
      this.getOrderList()
    }
  },
  created () {
    this.getOrderList(null)
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
  .page {
    float: right;
  }
</style>

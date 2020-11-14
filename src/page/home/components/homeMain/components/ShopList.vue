<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="10">
           <el-input
            v-model="query"
            clearable
            @clear="getShopList"
            placeholder="请输入内容">
              <el-button
                @click="searchShop"
                slot="append"
                icon="el-icon-search">
              </el-button>
           </el-input>
        </el-col>
        <el-col :span="5">
          <!-- 添加商品按钮 -->
          <el-button
            type="primary"
            @click="openAddShop">
              添加商品
          </el-button>
        </el-col>
      </el-row>
      <el-table
        border
        :data="shopList">
        <el-table-column
        label="#"
        type="index">
        </el-table-column>
        <el-table-column
          label="商品编号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="shop">
        </el-table-column>
        <el-table-column
          label="商品类别"
          prop="title">
        </el-table-column>
        <el-table-column
          label="商品价格(￥)"
          prop="price">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime">
        </el-table-column>
        <el-table-column
          label="操作"
          width="170">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" :enterable="false" placement="top">
              <el-button
                @click="openEditForm(scope.row)"
                type="primary"
                size="mini"
                icon="el-icon-edit">
              </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" :enterable="false" placement="top">
              <el-button
                @click="delShop(scope.row)"
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
          :disabled="shopList.length<7 || !shopList">
            下一页<i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
      <el-tag type="primary">{{page+1}}</el-tag>
    </el-card>
    <el-dialog
      title="添加商品"
      :visible.sync="addShopForm.addShopShow"
      width="50%">
        <!-- 对话框中的编辑表单 -->
        <el-form ref="addShopFormRef" :model="addShopForm" :rules="addShopFormRules" label-width="150px">
          <el-form-item prop="shop" label="商品名称:">
            <el-input placeholder="请输入商品名称" v-model="addShopForm.shop"></el-input>
          </el-form-item>
          <el-form-item prop="lv1" label="一级分类:">
            <el-select @change="changelv1" v-model="addShopForm.lv1" placeholder="请选择">
              <el-option
                v-for="item in addShopForm.lv1List"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="lv2" v-if="addShopForm.lv1" label="二级分类:">
            <el-select @change="changelv2" v-model="addShopForm.lv2" placeholder="请选择">
              <el-option
                v-for="item in addShopForm.lv2List"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="lv3" v-if="addShopForm.lv2" label="三级分类:">
            <el-select v-model="addShopForm.lv3" placeholder="请选择">
              <el-option
                v-for="item in addShopForm.lv3List"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="price" label="商品价格:">
            <el-input placeholder="请输入商品价格" v-model="addShopForm.price"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addShopForm.addShopShow=false">取 消</el-button>
          <el-button @click="subAddForm" type="primary">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="修改商品"
      :visible.sync="editShopForm.editShopFormShow"
      @close="setEditForm"
      width="50%">
        <el-form :model="editShopForm" border :rules="editShopFormRules" ref="editShopFormRef" label-width="40%">
          <el-form-item prop="id" label="商品编号:">
            <el-input v-model="editShopForm.id" readonly disabled></el-input>
          </el-form-item>
          <el-form-item prop="shop" label="商品名称:">
            <el-input v-model="editShopForm.shop"></el-input>
          </el-form-item>
          <el-form-item prop="price" label="商品价格:">
            <el-input v-model="editShopForm.price"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editShopForm.editShopFormShow=false">取 消</el-button>
          <el-button @click="subEditForm" type="primary">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ShopList',
  props: ['userInfo'],
  data () {
    // 检查价格
    const checkPrice = (rule, value, callback) => {
      if (/^[1-9][0-9]*(\.[0-9]{1,2})?$/.test(value)) callback()
      else callback(new Error('请输入整数或者最多带两位小数的数字'))
    }
    return {
      // 商品列表数据
      shopList: [],
      // 当前页数
      page: 0,
      // 搜索框的数据
      query: '',
      // 添加商品列表表单数据
      addShopForm: {
        addShopShow: false,
        shop: '',
        lv1List: [],
        lv1: null,
        lv2List: [],
        lv2: null,
        lv3List: [],
        lv3: null,
        price: null
      },
      // 添加商品表单数据规则
      addShopFormRules: {
        shop: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 30, message: '请输入1-12位字符', trigger: 'blur' }
        ],
        lv1: [
          { required: true, message: '请输入一级分类', trigger: 'blur' }
        ],
        lv2: [
          { required: true, message: '请输入二级分类', trigger: 'blur' }
        ],
        lv3: [
          { required: true, message: '请输入三级分类', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ]
      },
      editShopForm: {
        editShopFormShow: false,
        id: '',
        shop: '',
        price: null
      },
      editShopFormRules: {
        id: [
          { required: true, message: 'id不得为空', trigger: 'blur' }
        ],
        shop: [
          { required: true, message: '商品名称不得为空', trigger: 'blur' },
          { max: 30, message: '最多不过30个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '商品价格不得为空', trigger: 'blur' },
          { validate: checkPrice, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 搜索商品列表
    searchShop () {
      this.$axios.get('/vue_shop/searchShop.php', {
        params: {
          query: this.query
        }
      })
        .then(res => {
          this.shopList = res.data
        })
    },
    // 打开添加商品对话框
    openAddShop () {
      this.addShopForm.addShopShow = true
      this.getCateList(null, res => {
        this.addShopForm.lv1List = res.data
      })
    },
    // 选择一级分类选择器
    changelv1 () {
      this.addShopForm.lv2 = null
      this.getCateList(this.addShopForm.lv1, res => {
        this.addShopForm.lv2List = res.data
      })
    },
    // 选择二级分类选择器
    changelv2 () {
      this.addShopForm.lv3 = null
      this.getCateList(this.addShopForm.lv2, res => {
        this.addShopForm.lv3List = res.data
      })
    },
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
    // 添加商品
    subAddForm () {
      this.$refs.addShopFormRef.validate(val => {
        if (val) {
          while (this.userInfo.id.length < 3) {
            this.userInfo.id = '0' + this.userInfo.id
          }
          const id = `sp${this.userInfo.id}${new Date().getTime()}`
          const { shop, lv1, lv2, lv3, price } = this.addShopForm
          this.$axios.get(
            '/vue_shop/addShop.php', {
              params: {
                id: id,
                shop: shop,
                lv1: lv1,
                lv2: lv2,
                lv3: lv3,
                price: price
              }
            }
          ).then(res => {
            if (res.status === 200) {
              this.getShopList()
              this.$message.success('添加商品分类成功！')
              this.addShopForm.addShopShow = false
              this.$refs.addShopFormRef.resetFields()
            } else {
              this.addShopForm.addShopShow = false
              this.$message.error('添加商品分类失败!')
            }
          })
        }
      })
    },
    // 点击商品修改按钮
    openEditForm (shopInfo) {
      this.editShopForm.editShopFormShow = true
      const { id, shop, price } = shopInfo
      this.editShopForm.id = id
      this.editShopForm.shop = shop
      this.editShopForm.price = price
    },
    // 提交编辑商品表单
    subEditForm () {
      this.$refs.editShopFormRef.validate(valid => {
        if (valid) {
          const { id, shop, price } = this.editShopForm
          this.$axios.get(
            '/vue_shop/editShop.php', {
              params: {
                id: id,
                shop: shop,
                price: price
              }
            }
          ).then(res => {
            if (res.status === 200) {
              this.$message.success('成功修改商品！')
              this.getShopList()
            } else {
              this.$message.error('修改商品失败！')
            }
          })
          this.editShopForm.editShopFormShow = false
        }
      })
    },
    // 重置编辑商品表单
    setEditForm () {
      this.$refs.editShopFormRef.resetFields()
    },
    delShop (shopInfo) {
      this.$messageBox.confirm('删除该用户后无法恢复, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(
          '/vue_shop/delShop.php', {
            params: {
              id: shopInfo.id
            }
          }
        ).then(res => {
          if (res.status === 200) {
            this.$message.success('成功删除商品！')
            this.getShopList()
          } else {
            this.$message.error('成功删除商品！')
          }
        })
      })
    },
    // 获取商品列表
    getShopList: function () {
      this.$axios.get('/vue_shop/shopList.php', {
        params: {
          page: this.page
        }
      })
        .then(res => {
          if (res.status === 200) this.shopList = res.data
          else this.$message.error('获取商品列表失败！')
          if (!res.data) this.shopList = []
        })
    },
    // 上一页
    prev () {
      --this.page
      this.getShopList()
    },
    // 下一页
    next () {
      ++this.page
      this.getShopList()
    }
  },
  created () {
    this.getShopList()
  }
}
</script>

<style scoped>
  .el-card {
    padding-bottom: 40px;
    position: relative;
  }
  .el-form {
    padding: 0 20%;
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

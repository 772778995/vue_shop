<template>
  <el-aside :width="isCollapse ? '64px' : '200px' ">
    <div class="toggle" @click="toggleCollapse">|||</div>
    <!-- 侧边栏菜单 -->
    <el-menu
      router
      id="menu"
      unique-opened
      :default-active="pathActive"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#9dc6ff"
      active-text-color="#009"
      text-color="#fff">
      <!-- 一级菜单 -->
      <el-submenu
        v-for="item in asideMenu"
        :key=item.id
        :index=item.id>
          <template slot="title">
            <!-- 图标 -->
            <i :class="item.icon"></i>
            <!-- 标题 -->
            <span>{{item.menuName}}</span>
          </template>
          <el-menu-item
            v-for="childItem in item.children"
            :key="childItem.id"
            :index="childItem.path">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 标题 -->
                <span>{{childItem.menuName}}</span>
              </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'homeAside',
  data () {
    return {
      asideMenu: [],
      isCollapse: false,
      pathActive: this.$route.path
    }
  },
  methods: {
    toggleCollapse: function () {
      this.isCollapse = !this.isCollapse
    },
    getAsideMenu: function () {
      this.$axios.get('/vue_shop/asideMenu.php')
        .then(res => {
          this.asideMenu = res.data
        })
    }
  },
  mounted () {
    this.getAsideMenu()
  }
}
</script>

<style>
  .el-aside { background-color: #9dc6ff; }
  .toggle {
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 1rem;
    color: #fff;
    font-weight: bolder;
    text-align: center;
    letter-spacing: 0.1rem;
    background-color: cornflowerblue;
    padding: 0.1875rem 0;
    cursor: pointer;
  }
  #menu { border-right: none; }
  .icon-font { color: #fff; }
</style>

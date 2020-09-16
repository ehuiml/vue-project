<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <!-- 黑马logo -->
        <div class="left">
          <img src="../assets/heima.png" alt />
          电商后台管理系统
        </div>
        <!-- 退出按钮 -->
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 下拉菜单 -->
        <div class="toggle_btn" @click="isCollapse=!isCollapse">| | |</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="red"
          :unique-opened="true"
          :default-active="activePath"
          :router="true"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savePath('/'+subItem.path)"
            >
              <span class="el-icon-menu"></span>
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //  左侧菜单数据
      menulist: [],
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      activePath: "",
      isCollapse: false,
    };
  },
  created() {
    //  在钩子函数中调用获取左侧数据方法
    this.getMenuList();
    this.activePath = sessionStorage.getItem("path");
  },
  methods: {
    logout() {
      //  1.跳转到login页面
      this.$router.push("/login");
      //  2.清除token
      sessionStorage.clear();
      //  3.退出成功提示
      this.$message.success("退出成功");
    },
    //  获取左侧菜单列表数据
    async getMenuList() {
      // menus 是接口文档中提供的
      const { data: res } = await this.$http("menus");
      if (res.meta.status != 200)
        return this.$message.error("获取数据失败，请稍后重试");
      console.log(res);
      this.menulist = res.data;
    },
    savePath(path) {
      console.log(path);
      this.activePath = path;
      sessionStorage.setItem("path", path);
    },
  },
};
</script>

<style lang="less" scope>
.home_container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding-left: 0;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .left {
      font-size: 20px;
      color: #fff;
      img {
        vertical-align: middle;
        margin-right: 20px;
      }
    }
  }
  .toggle_btn {
    color: white;
    background-color: #373d41;
    text-align: center;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-aside {
  background-color: #333744;
}
// .el-main {
//   background-color: pink;
// }
</style>
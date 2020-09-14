<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <div class="left">
          <img src="../assets/heima.png" alt />
          电商后台管理系统
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$router.push("/login");
      sessionStorage.clear();
      this.$message.warning("退出成功");
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
      color: #ffffff;
      img {
        vertical-align: middle;
        margin-right: 20px;
      }
    }
  }
}
</style>
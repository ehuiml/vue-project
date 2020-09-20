<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table border style="width: 100%" :data="rightslist">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限层级">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.level=='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scoped.row.level=='1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scoped.row.level=='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return { rightslist: [] };
  },
  created() {
    this.getrightslist();
  },
  methods: {
    async getrightslist() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      } else {
        this.$message.success("获取列表成功");
        this.rightslist = res.data;
        console.log(this.rightslist);
      }
    },
  },
};
</script>

<style lang="less" scope>
</style>
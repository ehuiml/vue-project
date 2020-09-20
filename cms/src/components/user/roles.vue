<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary">添加</el-button>
      <el-table border style="width: 100%" :data="roleslist">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scoped">
            <el-row
              :class="['bdbottom',i1==0?'bdtop':'']"
              v-for="(item1,i1) in scoped.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeUserById(scoped.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2==0?'':'bdtop']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeUserById(scoped.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removeUserById(scoped.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="技术负责人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-share"
              @click="showSetRightDialog(scoped.row)"
            >分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisible"
      width="50%"
      @close="SetRightDialogClosed"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleslist: [],
      SetRightDialogVisible: false,
      rightslist: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleid: "",
    };
  },
  created() {
    this.getroleslist();
  },
  methods: {
    async showSetRightDialog(role) {
      this.roleid = role.id;
      const { data: res } = await this.$http.get("rights/tree");

      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      } else {
        this.$message.success("获取成功");
        this.rightslist = res.data;
        this.getLeafKeys(role, this.defKeys);
        this.SetRightDialogVisible = true;
        console.log(this.rightslist);
      }
    },
    async getroleslist() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      } else {
        this.$message.success("获取成功");
        this.roleslist = res.data;
      }
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        return this.getLeafKeys(item, arr);
      });
    },
    async removeUserById(rolesid, rightid) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      //   console.log(rolesid.id);
      console.log(rolesid);
      //   console.log(res);
      if (res == "confirm") {
        this.$message.success("删除成功");
        const { data: ret } = await this.$http.delete(
          `roles/${rolesid.id}/rights/${rightid}`
        );
        // console.log(ret);
        rolesid.children = ret.data;
        // console.log(rolesid.children);
        // console.log(ret.data);
      } else {
        this.$message.error("删除失败");
      }
      //   console.log(res);
      //   this.getroleslist();
    },
    SetRightDialogClosed() {
      this.defKeys = [];
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      console.log(keys);
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleid}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配失败");
      } else this.$message.success("分配成功");
      this.SetRightDialogVisible = false;
      this.getroleslist();
    },
  },
};
</script>

<style lang="less" scope>
.el-tag {
  margin: 5px;
}
.bdbottom {
  border-bottom: 1px solid rgb(235, 238, 245);
}
.bdtop {
  border-top: 1px solid rgb(235, 238, 245);
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
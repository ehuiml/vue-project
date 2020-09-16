<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="adddialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="权限" prop="role_name"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scoped">
            <!-- {{scope.row}} -->
            <el-switch v-model="scoped.row.mg_state" @change="changeusermsg(scoped.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <!-- {{scoped.row.id}} -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getUserInfoById(scoped.row.id)"
            ></el-button>
            <el-tooltip content="分享" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-share" size="mini"></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scoped.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <span class="demonstration"></span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="用户信息" :visible.sync="adddialogVisible" width="50%" @close="adddialogclosed">
      <el-form :rules="addformrules" label-width="100px" :model="addform" ref="addformref">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户信息" :visible.sync="editdialogVisible" width="50%" @close="editdialogclosed">
      <el-form :rules="editformrules" label-width="100px" :model="editform" ref="editformref">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regmobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regmobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      async getUserInfoById(id) {
        this.editdialogVisible = true;
        const { data: res } = await this.$http.get(`users/${id}`);
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败");
        }
        this.editform = res.data;
      },
      userlist: [],
      total: 0,
      adddialogVisible: false,
      editdialogVisible: false,
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editform: {
        username: "",
        email: "",
        mobile: "",
      },
      addformrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkEmail, message: "请输入正确格式", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            validator: checkMobile,
            message: "请输入正确格式",
            trigger: "blur",
          },
        ],
      },
      editformrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkEmail, message: "请输入正确格式", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            validator: checkMobile,
            message: "请输入正确格式",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async removeUserById(id) {
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
      // console.log(res);
      if (res == "confirm") {
        this.$message.success("删除成功");
        const ret = await this.$http.delete(`users/${id}`);
        console.log(ret);
      } else {
        this.$message.error("删除失败");
      }
      this.getUserList();
    },
    adduser() {
      this.$refs.addformref.validate(async (val) => {
        if (!val) {
          return;
        }
        const { data: res } = await this.$http.post("/users", this.addform);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.getUserList();
        this.adddialogVisible = false;
      });
    },

    edituser() {
      this.$refs.editformref.validate(async (val) => {
        if (!val) {
          return;
        }
        const { data: res } = await this.$http.put(
          `/users/${this.editform.id}`,
          {
            email: this.editform.email,
            mobile: this.editform.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新失败");
        }
        this.$message.success("更新成功");
        this.editdialogVisible = false;
        this.getUserList();
      });
    },
    adddialogclosed() {
      this.$refs.addformref.resetFields();
    },
    editdialogclosed() {
      this.$refs.editformref.resetFields();
    },
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return console.log("获取失败");
      } else {
        (this.userlist = res.data.users), (this.total = res.data.total);
        console.log(res.data.users);
        console.log(this.userlist);
      }
    },
    handleSizeChange(newsize) {
      // console.log(newsize);
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    handleCurrentChange(newpage) {
      // console.log(newpage);
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },
    async changeusermsg(userinfo) {
      // console.log(res.mg_state);
      const data = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      // console.log(data);
      // console.log(res.id);
      // console.log(ret);
      // console.log(ret.status);
      console.log(userinfo.id);
      console.log(userinfo.mg_state);
      console.log(data);
      if (data.status !== 200) {
        return this.$message.error("更新失败");
        userinfo.mg_state = !userinfo.mg_state;
      } else {
        return this.$message.success("更新成功");
      }
    },
    handleClose() {},
  },
};
</script>

<style>
.box-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
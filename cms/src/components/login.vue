<template>
  <div class="login">
    <div class="loginbox">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form class="form" :rules="loginrules" :model="formmsg" ref="loginformref">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="formmsg.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-goods" v-model="formmsg.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formmsg: {
        username: "admin",
        password: "123456",
      },
      loginrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginformref.resetFields();
    },
    login() {
      this.$refs.loginformref.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post("/login", this.formmsg);
          // console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("登陆失败");
          } else {
            this.$message.success("登陆成功");
            sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scope>
.login {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
  .loginbox {
    width: 450px;
    height: 300px;
    background-color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    box-shadow: 2px, 3px, 3px, rgba(255, 255, 255, 0.6);
    .logo {
      width: 130px;
      height: 130px;
      position: absolute;
      left: 50%;
      top: -25%;
      transform: translateX(-50%);
      border: 10px solid gray;
      background-color: black;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .form {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 30px;
      box-sizing: border-box;
    }
    .btns {
      float: right;
    }
  }
}
</style>
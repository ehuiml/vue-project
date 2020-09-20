<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <!-- <el-button type="primary" @click="adddialogVisible=true">添加商品分类</el-button> -->
          <el-button type="primary" @click="showdialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        class="treetable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        stripe
        border
        show-index
        :expand-type="false"
        index-text="#"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <!-- <span class="demonstration"></span> -->
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

    <el-dialog title="添加分类" :visible.sync="adddialogVisible" width="50%" @close="addclose">
      <el-form :model="addform" :rules="addformRules" ref="addformRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="value"
            :options="ParentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      cascaderProps: {
        expandTrigger: "hover",
        children: "children",
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true,
      },
      addform: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addformRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" },
      ],
      adddialogVisible: false,
      catelist: [],
      ParentCateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    addclose() {
      this.$refs.addformRef.resetFields();
      this.value = [];
      this.value.cat_level = 0;
      this.value.cat_pid = 0;
    },
    async addcate() {
      this.$refs.addformRef.validate((valid) => {
        if (!valid) {
          return;
        }
      });
      const { data: res } = await this.$http.post("categories", this.addform);
      if (res.meta.status !== 201) {
        return this.$message.error("失败");
      } else {
        this.$message.success("成功");
        this.getCateList();
        this.adddialogVisible = false;
      }
    },
    parentCateChanged() {
      if (this.value.length > 0) {
        this.addform.cat_pid = this.value[this.value.length - 1];
        this.addform.cat_level = this.value.length;
      } else {
        this.addform.cat_pid = 0;
        this.addform.cat_level = 0;
      }
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      } else {
        this.ParentCateList = res.data;
      }
      console.log(res);
      console.log(this.ParentCateList);
    },
    showdialogVisible() {
      this.adddialogVisible = true;
      this.getParentCateList();
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      } else {
        this.$message.success("获取成功");
        this.catelist = res.data.result;
        this.total = res.data.total;
        console.log(this.catelist);
      }
    },
  },
};
</script>

<style>
.treetable {
  margin-top: 15px;
}
.el-cascader-menu {
  height: 240px;
}
</style>
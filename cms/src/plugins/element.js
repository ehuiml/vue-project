import Vue from 'vue'
import { Button, Input, Form, FormItem, Message, Header, Aside, Main, Container } from 'element-ui'
// import { Checkbox } from 'element-ui'
// import Message from 'element-ui'
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// Vue.use(Footer)
// Vue.use(Checkbox)
Vue.prototype.$message = Message;

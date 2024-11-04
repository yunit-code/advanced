// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue'
import 'ant-design-vue/lib/button/style/css'
import 'ant-design-vue/lib/input/style/css'
import 'ant-design-vue/lib/icon/style/css'
import 'ant-design-vue/lib/radio/style/css'
import 'ant-design-vue/lib/table/style/css'
import 'ant-design-vue/lib/tag/style/css'
import 'ant-design-vue/lib/tabs/style/css'
import 'ant-design-vue/lib/modal/style/css'
import 'ant-design-vue/lib/steps/style/css'
import 'ant-design-vue/lib/upload/style/css'
import 'ant-design-vue/lib/select/style/css'
import 'ant-design-vue/lib/cascader/style/css'
import 'ant-design-vue/lib/input-number/style/css'
import 'ant-design-vue/lib/switch/style/css'
import 'ant-design-vue/lib/form/style/css'
import 'ant-design-vue/lib/form-model/style/css'
import 'ant-design-vue/lib/space/style/css'
import 'ant-design-vue/lib/date-picker/style/css'
import 'ant-design-vue/lib/menu/style/css'
import 'ant-design-vue/lib/tooltip/style/css'
import 'ant-design-vue/lib/popover/style/css'
import 'ant-design-vue/lib/dropdown/style/css'
import {
    Button,
    Icon,
    Radio,
    Table,
    Tag,
    Tabs,
    ConfigProvider,
    Modal,
    Input,
    Steps,
    Select,
    Cascader,
    InputNumber,
    Switch,
    Upload,
    FormModel,
    Space,
    Form,
    DatePicker,
    Menu,
    Tooltip,
    Popover,
    Dropdown
} from 'ant-design-vue'

/* v1.1.3+ registration methods */
Vue.use(Button)
Vue.use(Icon)
Vue.use(Radio)
Vue.use(Table)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(Modal)
Vue.use(Input)
Vue.use(Steps)
Vue.use(Upload)
Vue.use(ConfigProvider)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(InputNumber)
Vue.use(Switch)
Vue.use(FormModel)
Vue.use(FormModel.Item)
Vue.use(Form)
Vue.use(Form.Item)
Vue.use(Space)
Vue.use(DatePicker)
Vue.use(Menu)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.prototype.$confirm = Modal.confirm

import Vue from 'vue';
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

// 减少项目体积，进行按需加载。
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  Tooltip,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  TabPane,
  Form,
  FormItem,
  Tabs,
  Tag,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Header,
  Main,
  Divider,
  Image,
  PageHeader,
  Loading,
  MessageBox,
  Message,
  Avatar,
  InfiniteScroll,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Card,
  Transfer,
  Cascader,
} from 'element-ui';
Vue.use(Cascader);
Vue.use(Transfer);
Vue.use(Tooltip);
Vue.use(Card);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(InfiniteScroll);
Vue.use(Avatar);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Header);
Vue.use(Main);
Vue.use(Divider);
Vue.use(Image);
Vue.use(PageHeader);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

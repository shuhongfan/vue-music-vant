import Vue from 'vue'
import {
  Button,
  NavBar,
  Toast,
  Icon,
  Image as VanImage,
  Swipe,
  SwipeItem,
  Lazyload,
  Tab,
  Tabs,
  Grid,
  GridItem,
  row,
  col,
  Tabbar,
  TabbarItem
} from 'vant'

Vue.use(Button)
Vue.use(NavBar)
Vue.use(Toast)
Vue.use(Icon)
Vue.use(VanImage)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload, {
  lazyComponent: true
})
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(row)
Vue.use(col)
Vue.use(Tabbar)
Vue.use(TabbarItem)

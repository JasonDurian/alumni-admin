import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { parse } from 'qs'
import { query, login, logout, getVerify } from '../services/app'
import { config, queryURL } from '../utils'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    verify: '',
    menus: JSON.parse(localStorage.getItem(`${prefix}menus`)),
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname !== '/login') {
          dispatch({ type: 'queryUser' })
          window.onresize = () => {
            dispatch({ type: 'changeNavbar' })
          }
        } else {
          dispatch({ type: 'getVerify' })
        }
      });
    }
  },
  effects: {
    *login ({
      payload,
    }, { put, call }) {
      const data = yield call(login, payload)
      localStorage.setItem(`${prefix}authKey`, data.data.authKey)
      localStorage.setItem(`${prefix}menus`, JSON.stringify(data.data.menusList[0].child)); // 菜单数据
      const from = queryURL('from')
      yield put({
        type: 'loginSuccess',
        payload:{
          user: data.data.userInfo,
          menus: data.data.menusList[0].child
        }
      })
      if (from) {
        yield put(routerRedux.push(from))
      } else {
        yield put(routerRedux.push('/dashboard'))
      }
    },
    *queryUser ({
      payload,
    }, { call, put }) {
      const data = yield call(query, parse(payload))
      yield put({
        type: 'queryUserSuccess',
        payload:{
          user: data.data,
          // menus: JSON.parse(localStorage.getItem(`${prefix}menus`))
        }
      })
      // if (location.pathname === '/login') {
      //   yield put(routerRedux.push('/dashboard'))
      // }
    },
    *getVerify ({
      payload,
    }, { call, put }) {
      const data = yield call(getVerify, parse(payload));
      yield put({
        type: 'handleVerify',
        payload: {
          verify: data,
        }
      })
    },
    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, payload)
      localStorage.removeItem(`${prefix}authKey`)
      localStorage.removeItem(`${prefix}menus`)
      message.success(data.data)
      if (location.pathname !== '/login') {
        let from = location.pathname
        if (location.pathname === '/dashboard') {
          from = '/dashboard'
        }
        window.location = `${location.origin}/login?from=${from}`
      }
    },
    *switchSider ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchSider',
      })
    },
    *changeTheme ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleChangeTheme',
      })
    },
    *changeNavbar ({
      payload,
    }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showNavbar' })
      } else {
        yield put({ type: 'hideNavbar' })
      }
    },
    *switchMenuPopver ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchMenuPopver',
      })
    },
  },
  reducers: {
    queryUserSuccess (state, { payload: { user } }) {
      return { ...state, user }
    },
    loginSuccess (state, { payload: { user, menus } }) {
      return { ...state, user, menus }
    },
    handleVerify (state, { payload: { verify } }) {
      return { ...state, verify }
    },
    handleSwitchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    handleChangeTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },
    showNavbar (state) {
      return {
        ...state,
        isNavbar: true,
      }
    },
    hideNavbar (state) {
      return {
        ...state,
        isNavbar: false,
      }
    },
    handleSwitchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },
    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}

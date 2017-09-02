import modelExtend from 'dva-model-extend'
import { config } from '../utils'

const { prefix } = config

const model = {
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

const pageModel = modelExtend(model, {

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },
})

const commonModel = (modelName = '', service) => {
  return modelExtend(pageModel, {

    state: {
      currentItem: {},
      modalVisible: false,
      modalType: 'create',
      isMotion: localStorage.getItem(`${prefix}${modelName}IsMotion`) === 'true',
      selectedRowKeys: [],
    },

    subscriptions: {
      setup ({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === `/${modelName}`) {
            dispatch({
              type: 'query',
              payload: location.query,
            })
          }
        })
      },
    },

    effects: {
      *query ({ payload = {} }, { call, put }) {
        /**
         *  由于new过的类不会再次new，所以使用that的话还是最后一个new的url
         *  bind不会马上执行，而apply和call会
         */
        const data = yield call(service.query.bind(service), payload)
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.dataCount,
            },
          },
        })
      },

      *'delete' ({ payload }, { call, put, select }) {
        const data = yield call(service.remove.bind(service), payload)
        const { selectedRowKeys } = yield select(_ => _[modelName])
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      },

      *'multiDelete' ({ payload }, { call, put }) {
        const data = yield call(service.multiRemove.bind(service), payload)
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      },

      *'multiEnable' ({ payload }, { call, put }) {
        const data = yield call(service.multiEnable.bind(service), payload)
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      },

      *create ({ payload }, { call, put }) {
        const data = yield call(service.create.bind(service), payload)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      },

      *update ({ payload }, { select, call, put }) {
        const id = yield select(_ => _[modelName].currentItem.id)
        const data = yield call(service.update.bind(service), id, payload)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      },

    },

    reducers: {

      showModal (state, action) {
        return { ...state, ...action.payload, modalVisible: true }
      },

      hideModal (state) {
        return { ...state, modalVisible: false }
      },

      switchIsMotion (state) {
        localStorage.setItem(`${prefix}${modelName}IsMotion`, !state.isMotion)
        return { ...state, isMotion: !state.isMotion }
      },
    },

  })
}

module.exports = {
  model,
  pageModel,
  commonModel,
}

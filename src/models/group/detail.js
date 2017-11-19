import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import Services from '../../services/common'

const service = new Services('groups')

export default {

  namespace: 'groupDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/group/:id').exec(location.pathname)
        if (match) {
          // if (match[1] > 0) dispatch({ type: 'query', payload: { id: match[1] } });
          dispatch({ type: 'query', payload: { id: parseInt(match[1], 10) } });
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(service.queryOne.bind(service), payload)
      yield put({
        type: 'querySuccess',
        payload: {
          data: data.data,
        },
      })
    },

    *create ({ payload }, { call, put }) {
      const data = yield call(service.create.bind(service), payload)
      message.success(data.data)
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(_ => _.groupDetail.data.id)
      const data = yield call(service.update.bind(service), id, payload)
      message.success(data.data)
      yield put({
        type: 'query',
        payload: {
          id: id,
        },
      })
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}

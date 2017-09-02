import pathToRegexp from 'path-to-regexp'
import Services from '../../services/common'

const service = new Services('square')

export default {

  namespace: 'squareDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/square/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
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

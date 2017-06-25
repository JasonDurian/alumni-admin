import {  } from '../services/dashboard'
import { parse } from 'qs'

export default {
  namespace: 'dashboard',
  state: {

  },
  subscriptions: {
    setup ({ dispatch }) {

    },
  },
  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(query, parse(payload))
      yield put({ type: 'queryWeather', payload: { ...data } })
    }
  },
  reducers: {

  },
}

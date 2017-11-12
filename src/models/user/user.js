import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'
import { config } from '../../utils'

const { prefix } = config

const service = new Services('users')

export default modelExtend(commonModel('user', service), {

  namespace: 'user',

  effects: {
    *query({ payload = {} }, { call, put }) {
      const data = yield call(service.query.bind(service), payload)
      localStorage.setItem(`${prefix}groups`, JSON.stringify(data.data.groupList)); // 用户组数据
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
  }

})

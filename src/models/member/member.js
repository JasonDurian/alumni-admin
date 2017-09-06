import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'

const service = new Services('members')

export default modelExtend(commonModel('member', service), {

  namespace: 'member',

  effects: {
    * update({payload}, {select, call, put}) {
      const id = yield select(_ => _.member.currentItem.member_id)
      const data = yield call(service.update.bind(service), id, payload)
      yield put({type: 'hideModal'})
      yield put({type: 'query'})
    },

    * multiCheck({ payload }, { call, put }) {
      const data = yield call(service.multiCheck.bind(service), payload)
      yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      yield put({ type: 'query' })
    },
  }

})

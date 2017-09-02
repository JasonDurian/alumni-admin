import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'

const service = new Services('members')

export default modelExtend(commonModel('member', service), {

  namespace: 'member',

  effects: {
    * update({payload}, {select, call, put}) {
      const id = yield select(_ => _.member.currentItem.member_id)
      const data = yield call(service.update, id, payload)
      yield put({type: 'hideModal'})
      yield put({type: 'query'})
    },
  }

})

import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'

const service = new Services('message')

export default modelExtend(commonModel('message', service), {

  namespace: 'message',

})

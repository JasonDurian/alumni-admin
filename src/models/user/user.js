import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'

const service = new Services('users')

export default modelExtend(commonModel('user', service), {

  namespace: 'user',

})

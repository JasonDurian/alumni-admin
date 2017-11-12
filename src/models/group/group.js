import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'

const service = new Services('groups')

export default modelExtend(commonModel('group', service), {

  namespace: 'group',

})

import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'

const service = new Services('square')

export default modelExtend(commonModel('square', service), {

  namespace: 'square',

})

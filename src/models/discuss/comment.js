import modelExtend from 'dva-model-extend'
import { commonModel } from '../common'
import Services from '../../services/common'

const service = new Services('comment')

export default modelExtend(commonModel('comment', service), {

  namespace: 'comment',

})

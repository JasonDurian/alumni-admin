import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { FormattedMessage } from 'react-intl'
import styles from './index.less'
import { GroupComponent } from '../../../components'
import messages from '../../../lang/Group/'

const { GroupDetail } = GroupComponent

const Detail = ({ dispatch, groupDetail, loading }) => {
  const { data } = groupDetail

  const groupDetailProps = {
    item: data,
    confirmLoading: loading,
    onOk (value) {
      dispatch({
        type: 'groupDetail/update',
        payload: value,
      })
    },
    onBack () {
      dispatch({
        type: 'user/hideModal',
      })
    },
  }

  return (
    <div className="content-inner">
      <div className={styles.content}>
        <GroupDetail {...groupDetailProps} />
      </div>
    </div>
  )
}

Detail.propTypes = {
  groupDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ groupDetail, loading }) => (
  { groupDetail, loading: loading.models.groupDetail }
))(Detail)

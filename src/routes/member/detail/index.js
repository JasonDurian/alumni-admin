import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ memberDetail }) => {
  const { data } = memberDetail
  const content = []
  let i = 0

  const getChildArray = (item) => {
    for (let key in item) {
      if (Object.prototype.toString.call(item[key]) === '[object Object]' || Array.isArray(item[key])) {
        content.push(
          <h4 key={key}>{key}</h4>
        )
        getChildArray(item[key])
      } else {
        if ({}.hasOwnProperty.call(item, key)) {
          content.push(
            <div key={key + i} className={styles.item}>
              <div>{key}</div>
              <div>{String(item[key])}</div>
            </div>
          )
        }
      }
      i++
    }
  }

  getChildArray(data)
  return (<div className="content-inner">
    <div className={styles.content}>
      {content}
    </div>
  </div>)
}

Detail.propTypes = {
  userDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ memberDetail, loading }) => ({ memberDetail, loading: loading.models.memberDetail }))(Detail)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import styles from './index.less'
import { color } from '../../utils'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

const content = []
for (let key in color) {
  content.push(
    <Row gutter={24} key={key}>
      <Col span={24} style={{ height: '50px', background: color[key] }} />
    </Row>
  )
}

function Dashboard ({ dashboard }) {
  const {  } = dashboard

  return (
    <div>
      { content }
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)

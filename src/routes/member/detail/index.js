import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { FormattedMessage } from 'react-intl'
import styles from './index.less'
import messages from '../../../lang/User/'

/**
 * Todo: 为什么Detail组件会循环多次
 */
const Detail = ({ memberDetail }) => {
  const { data } = memberDetail
  const detailContent = []
  const baseContent = []
  /* 键值转数组 */
  const dataKeys = Object.keys(data)

  if (dataKeys.length > 0 && Object.prototype.toString.call(data.sex) !== '[object Object]') {
    /* 状态码转换 */
    data.sex = parseInt(data.sex, 10) === 1
      ? <FormattedMessage {...messages.male} />
      : <FormattedMessage {...messages.female} />;

    data.type = parseInt(data.type, 10) === 1
      ? <FormattedMessage {...messages.wechat} />
      : <FormattedMessage {...messages.others} />;

    switch (parseInt(data.check_status, 10)) {
      case 0: data.check_status = <FormattedMessage {...messages.unCertified} />; break;
      case 1: data.check_status = <FormattedMessage {...messages.isCertified} />; break;
      case 2: data.check_status = <FormattedMessage {...messages.checking} />; break;
      case 3: data.check_status = <FormattedMessage {...messages.certifyFailed} />; break;
      default: break;
    }

    data.status = parseInt(data.status, 10) === 1
      ? <FormattedMessage {...messages.isEnabled} />
      : <FormattedMessage {...messages.disabled} />;
  }

  /* 取特定键值的索引 */
  const flagKey = dataKeys.indexOf('member_id')
  const baseComponent = (val, key) => (
    <div key={key} className={styles.item}>
      <div>
        <FormattedMessage {...messages[val]} />
      </div>
      <div>{data[val]}</div>
    </div>
  )
  dataKeys.map((val, key) => {
    if ({}.hasOwnProperty.call(data, val)) {
      if (key < flagKey) {
        detailContent.push(baseComponent(val, key));
      } else {
        baseContent.push(baseComponent(val, key));
      }
    }
    return '';
  });

  return (
    <div className="content-inner">
      <div className={styles.content}>
        <div className={styles.info}>
          <h4>
            <FormattedMessage {...messages.detailInfo} />
          </h4>
          {detailContent}
        </div>
        <div className={styles.info}>
          <h4>
            <FormattedMessage {...messages.baseInfo} />
          </h4>
          {baseContent}
        </div>
      </div>
    </div>
  )
}

Detail.propTypes = {
  userDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ memberDetail, loading }) => ({ memberDetail, loading: loading.models.memberDetail }))(Detail)

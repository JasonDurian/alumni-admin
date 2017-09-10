import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import { injectIntl } from 'react-intl'
import classnames from 'classnames'
import AnimTableBody from '../DataTable/AnimTableBody'
import { DropOption } from '../../components'
import messages from '../../lang/User/'
import styles from './UserList.less'

const confirm = Modal.confirm

const list = ({
    loading,
    dataSource,
    pagination,
    onPageChange,
    onDeleteItem,
    onEditItem,
    isMotion,
    rowSelection,
    location,
    intl: {
      formatMessage,
    },
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: formatMessage(messages.deleteRecord),
        onOk () {
          onDeleteItem(record.member_id)
        },
      })
    }
  }

  const handleCheckStatus = (checkStatus) => {
    let certifiedLabel = ''
    switch (checkStatus) {
      case 0: certifiedLabel = formatMessage(messages.unCertified); break;
      case 1: certifiedLabel = formatMessage(messages.isCertified); break;
      case 2: certifiedLabel = formatMessage(messages.checking); break;
      case 3: certifiedLabel = formatMessage(messages.certifyFailed); break;
      default: break;
    }
    return certifiedLabel
  }

  const columns = location.pathname === '/member'
    ? [{
        title: 'ID',
        dataIndex: 'member_id',
        key: 'member_id',
      }, {
        title: formatMessage(messages.avatar),
        dataIndex: 'avatar',
        key: 'avatar',
        width: 64,
        className: styles.avatar,
        render: (text) => <img alt={'avatar'} width={24} src={text} />,
      }, {
        title: formatMessage(messages.username),
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => <Link to={`member/${record.member_id}`}>{text}</Link>,
      }, {
        title: formatMessage(messages.check_status),
        dataIndex: 'check_status',
        key: 'check_status',
        render: (text) => handleCheckStatus(text),
      }, {
        title: formatMessage(messages.status),
        dataIndex: 'status',
        key: 'status',
        render: (text) => text == 1 ? formatMessage(messages.isEnabled) : formatMessage(messages.disabled),
      }, {
        title: formatMessage(messages.create_time),
        dataIndex: 'create_time',
        key: 'create_time',
      }, {
        title: formatMessage(messages.operation),
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
        }
    }] : [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: formatMessage(messages.username),
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
      }, {
        title: formatMessage(messages.realName),
        dataIndex: 'realname',
        key: 'realname',
      }, {
        title: formatMessage(messages.remark),
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: formatMessage(messages.post),
        dataIndex: 'p_name',
        key: 'p_name',
      }, {
        title: formatMessage(messages.structure),
        dataIndex: 's_name',
        key: 's_name',
      }, {
        title: formatMessage(messages.operation),
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
        },
      }]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1250 }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onPageChange}
        pagination={pagination}
        simple
        rowKey={record => location.pathname === '/member'? record.member_id : record.id}
        rowSelection={rowSelection}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

list.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  intl: PropTypes.object,
}

export default injectIntl(list)

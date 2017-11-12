import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { injectIntl } from 'react-intl'
import classnames from 'classnames'
import AnimTableBody from '../DataTable/AnimTableBody'
import { DropOption } from '../../components'
import messages from '../../lang/Group/'
import styles from './GroupList.less'

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
      onEditItem(record.id)
    } else if (e.key === '2') {
      confirm({
        title: formatMessage(messages.deleteRecord),
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: formatMessage(messages.title),
      dataIndex: 'title',
      key: 'title',
    }, {
      title: formatMessage(messages.remark),
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: formatMessage(messages.status),
      dataIndex: 'status',
      key: 'status',
      render: text => text === 1
        ? formatMessage(messages.isEnabled)
        : formatMessage(messages.disabled),
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

  const getBodyWrapper = body => {
    return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body
  }

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
        rowKey={record => record.id}
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

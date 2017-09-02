import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import AnimTableBody from '../DataTable/AnimTableBody'
import { DropOption } from '../../components'
import styles from './DiscussList.less'

const confirm = Modal.confirm

const list = ({ loading, dataSource, pagination, onPageChange, onDeleteItem, onEditItem, isMotion, rowSelection, location }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const special = location.pathname === '/comment' ? ([{
    title: 'Member_id',
    dataIndex: 'member_id',
    key: 'member_id',
    render: (text, record) => <Link to={`member/${record.member_id}`}>{text}</Link>,
  }, {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (text) => text == 2 ? '自己说说' : '他人评价',
  }]) : ([{
    title: 'Square_id',
    dataIndex: 'square_id',
    key: 'square_id',
    render: (text, record) => <Link to={`square/${record.square_id}`}>{text}</Link>,
  }])

  const columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: 'Commenter',
        dataIndex: 'commenter_id',
        key: 'commenter_id',
        render: (text, record) => <Link to={`member/${record.commenter_id}`}>{text}</Link>,
      }, {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
      }, ...special, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text) => text == 1 ? '启用中' : '禁用',
      }, {
        title: 'CreateTime',
        dataIndex: 'create_time',
        key: 'create_time',
      }, {
        title: 'Operation',
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
}

export default list

import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { DiscussComponent } from '../../../components'

const { DiscussList, DiscussFilter, DiscussModal } = DiscussComponent

const Message = ({ location, dispatch, message, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = message
  const { pageSize } = pagination

  const messageModalProps = {
    location,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading,
    title: `${modalType === 'create' ? 'Create Discuss' : 'Update Discuss'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `message/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'message/hideModal',
      })
    },
  }

  const messageListProps = {
    dataSource: list,
    loading,
    pagination,
    location,
    isMotion,
    onPageChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'message/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'message/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'message/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const messageFilterProps = {
    isMotion,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/message',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/message',
      }))
    },
    onAdd () {
      dispatch({
        type: 'message/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'message/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'message/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  let current
  const handleStatus = () => {
    for (let index in list) {
      if (list[index].id == selectedRowKeys[0]) {
        current = !list[index].status ? 1 : 0
        break
      }
    }
  }

  const handleEnableItems = () => {
    handleStatus()

    dispatch({
      type: 'message/multiEnable',
      payload: {
        ids: selectedRowKeys,
        status: current
      },
    })
  }

  return (
    <div className="content-inner">
      <DiscussFilter {...messageFilterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button>
            </Popconfirm>
            <Button size="large" style={{ marginLeft: 8 }} onClick={handleEnableItems}>启用/禁用</Button>
          </Col>
        </Row>
      }
      <DiscussList {...messageListProps} />
      {modalVisible && <DiscussModal {...messageModalProps} />}
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ message, loading }) => ({ message, loading: loading.models.message }))(Message)

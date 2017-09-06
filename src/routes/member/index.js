import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { UserComponent } from '../../components'

const { UserList, UserFilter, UserModal } = UserComponent

const Member = ({ location, dispatch, member, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = member
  const { pageSize } = pagination

  const memberModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading,
    title: `${modalType === 'create' ? 'Create User' : 'Update User'}`,
    wrapClassName: 'vertical-center-modal',
    pathName: location.pathname,
    onOk (data) {
      dispatch({
        type: `member/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'member/hideModal',
      })
    },
  }

  const memberListProps = {
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
        type: 'member/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'member/showModal',
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
          type: 'member/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const memberFilterProps = {
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
        pathname: '/member',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/member',
      }))
    },
    onAdd () {
      dispatch({
        type: 'member/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'member/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'member/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  let current
  const handleStatus = () => {
    for (let index in list) {
      if (list[index].member_id == selectedRowKeys[0]) {
        current = !list[index].status ? 1 : 0
        break
      }
    }
  }

  const handleEnableItems = () => {
    handleStatus()

    dispatch({
      type: 'member/multiEnable',
      payload: {
        ids: selectedRowKeys,
        status: current
      },
    })
  }

  const handleCheckItems = (checkStatus) => {
    dispatch({
      type: 'member/multiCheck',
      payload: {
        ids: selectedRowKeys,
        check_status: parseInt(checkStatus, 10)
      },
    })
  }

  return (
    <div className="content-inner">
      <UserFilter {...memberFilterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button>
            </Popconfirm>
            <Button size="large" style={{ marginLeft: 8 }} onClick={() => handleCheckItems(1)}>审核通过</Button>
            <Button size="large" style={{ marginLeft: 8 }} onClick={() => handleCheckItems(3)}>审核失败</Button>
            <Button size="large" style={{ marginLeft: 8 }} onClick={handleEnableItems}>启用/禁用</Button>
          </Col>
        </Row>
      }
      <UserList {...memberListProps} />
      {modalVisible && <UserModal {...memberModalProps} />}
    </div>
  )
}

Member.propTypes = {
  member: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ member, loading }) => ({ member, loading: loading.models.member }))(Member)

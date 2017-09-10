import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { UserComponent } from '../../components'
import messages from '../../lang/User/'

const { UserList, UserFilter, UserModal } = UserComponent

const User = ({ location, dispatch, user, loading, intl: { formatMessage } }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = user
  const { pageSize } = pagination

  const userModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading,
    title: `${modalType === 'create' ? 'Create User' : 'Update User'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `user/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'user/hideModal',
      })
    },
  }

  const userListProps = {
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
        type: 'user/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'user/showModal',
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
          type: 'user/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const userFilterProps = {
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
        pathname: '/user',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/user',
      }))
    },
    onAdd () {
      dispatch({
        type: 'user/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'user/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'user/multiDelete',
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
      type: 'user/multiEnable',
      payload: {
        ids: selectedRowKeys,
        status: current
      },
    })
  }

  return (
    <div className="content-inner">
      <UserFilter {...userFilterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            <FormattedMessage
              {...messages.selectedItems}
              values={{ selectedRowKeys: selectedRowKeys.length }}
            />
            <Popconfirm title={formatMessage(messages.deleteRecord)} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>
                <FormattedMessage {...messages.remove} />
              </Button>
            </Popconfirm>
            <Button size="large" style={{ marginLeft: 8 }} onClick={handleEnableItems}>
              <FormattedMessage {...messages.enable} />
            </Button>
          </Col>
        </Row>
      }
      <UserList {...userListProps} />
      {modalVisible && <UserModal {...userModalProps} />}
    </div>
  )
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
  intl: PropTypes.object,
}

export default connect(({ user, loading }) => ({ user, loading: loading.models.user }))(injectIntl(User))

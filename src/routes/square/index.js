import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { SquareComponent } from '../../components'

const { SquareList, SquareFilter, SquareModal } = SquareComponent

const Square = ({ location, dispatch, square, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = square
  const { pageSize } = pagination

  const squareModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading,
    title: `${modalType === 'create' ? 'Create Square' : 'Update Square'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `square/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'square/hideModal',
      })
    },
  }

  const squareListProps = {
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
        type: 'square/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'square/showModal',
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
          type: 'square/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const squareFilterProps = {
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
        pathname: '/square',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/square',
      }))
    },
    onAdd () {
      dispatch({
        type: 'square/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'square/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'square/multiDelete',
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
      type: 'square/multiEnable',
      payload: {
        ids: selectedRowKeys,
        status: current
      },
    })
  }

  return (
    <div className="content-inner">
      <SquareFilter {...squareFilterProps} />
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
      <SquareList {...squareListProps} />
      {modalVisible && <SquareModal {...squareModalProps} />}
    </div>
  )
}

Square.propTypes = {
  square: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ square, loading }) => ({ square, loading: loading.models.square }))(Square)

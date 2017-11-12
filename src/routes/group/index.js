import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Row, Col, Button, Popconfirm } from 'antd'
import { GroupComponent } from '../../components'
import messages from '../../lang/User/'

const { GroupFilter, GroupList } = GroupComponent

const Group = ({ location, dispatch, group, loading, intl: { formatMessage } }) => {
  const { list, pagination, isMotion, selectedRowKeys } = group
  const { pageSize } = pagination

  const groupListProps = {
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
        type: 'group/delete',
        payload: id,
      })
    },
    onEditItem(id) {
      dispatch(routerRedux.push({
        pathname: `group/${id}`,
      }));
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'group/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const groupFilterProps = {
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
        pathname: '/group',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/group',
      }))
    },
    onAdd () {
      dispatch(routerRedux.push({
        pathname: 'group/0',
      }));
    },
    switchIsMotion () {
      dispatch({ type: 'group/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'group/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  let current
  const handleStatus = () => {
    for (const index in list) {
      if (list[index].id == selectedRowKeys[0]) {
        current = !list[index].status ? 1 : 0
        break
      }
    }
  }

  const handleEnableItems = () => {
    handleStatus()
    dispatch({
      type: 'group/multiEnable',
      payload: {
        ids: selectedRowKeys,
        status: current
      },
    })
  }

  const handleCheckItems = (checkStatus) => {
    dispatch({
      type: 'group/multiCheck',
      payload: {
        ids: selectedRowKeys,
        check_status: parseInt(checkStatus, 10)
      },
    })
  }

  return (
    <div className="content-inner">
      <GroupFilter {...groupFilterProps} />
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
      <GroupList {...groupListProps} />
    </div>
  )
}

Group.propTypes = {
  group: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
  intl: PropTypes.object,
}

export default connect(({ group, loading }) => ({ group, loading: loading.models.group }))(injectIntl(Group))

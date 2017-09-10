import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import { FilterItem } from '../../components'
import messages from '../../lang/User/'
import { Form, Button, Row, Col, DatePicker, Input, Switch, Select } from 'antd'

const Search = Input.Search
const Option = Select.Option
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const UserFilter = ({
  onAdd,
  isMotion,
  switchIsMotion,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
  intl: {
    formatMessage,
  },
}) => {
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    // console.log(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { keywords, status } = filter
  const selectInitialProps = !!status ? { initialValue: status.toString() } : {}
  const selectProps = {
    size: 'large',
    allowClear: true,
    placeholder: formatMessage(messages.pleaseSelectStatus),
    style: { width: '100%' },
  }

  const initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('keywords', { initialValue: keywords })(
          <Search placeholder={formatMessage(messages.pleaseInputName)} size="large" onSearch={handleSubmit} />
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('status', { ...selectInitialProps })(
          <Select
            {...selectProps}
            onChange={handleChange.bind(null, 'status')}
          >
            <Option value="0"><FormattedMessage {...messages.unCertified} /></Option>
            <Option value="1"><FormattedMessage {...messages.isCertified} /></Option>
            <Option value="2"><FormattedMessage {...messages.checking} /></Option>
            <Option value="3"><FormattedMessage {...messages.certifyFailed} /></Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <FilterItem label={formatMessage(messages.create_time)}>
          {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
            <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createTime')} />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>
              <FormattedMessage {...messages.search} />
            </Button>
            <Button size="large" onClick={handleReset}>
              <FormattedMessage {...messages.reset} />
            </Button>
          </div>
          <div>
            <Switch style={{ marginRight: 16 }} size="large" defaultChecked={isMotion} onChange={switchIsMotion} checkedChildren={'Motion'} unCheckedChildren={'Motion'} />
            <Button size="large" type="ghost" onClick={onAdd}>Create</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

UserFilter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  intl: PropTypes.object,
}

/**
 * Todo: might not the best method, use rc-form?
 */
export default Form.create()(injectIntl(UserFilter))

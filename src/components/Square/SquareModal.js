import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal } from 'antd'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      /* 为了使用radio等组件，将数据库中的字段变成了string类型，现在转变回来 */
      data.type = parseInt(data.type, 10)
      data.status = parseInt(data.status, 10)
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="Title" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: item.title,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Content" hasFeedback {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: item.content,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <FormItem label="Params" hasFeedback {...formItemLayout}>
          {getFieldDecorator('params', {
            initialValue: item.params,
            rules: [
              {
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Type" hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: !!item.type ? item.type.toString() : '1',
            rules: [
              {
                required: true,
              },
            ],
          })(
            <RadioGroup>
              <RadioButton value="1">帮帮忙</RadioButton>
              <RadioButton value="2">活动</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="Status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: !!item.status ? item.status.toString() : '1',
            rules: [
              {
                required: true,
              },
            ],
          })(
            <RadioGroup>
              <RadioButton value="1">启用</RadioButton>
              <RadioButton value="0">禁用</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

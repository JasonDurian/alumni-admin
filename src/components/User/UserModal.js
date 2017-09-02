import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal } from 'antd'

const FormItem = Form.Item

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
        // key: item.key,
      }
      data.groups = ['15']        //默认为普通会员
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
        <FormItem label="UserName" hasFeedback {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: item.username,
            rules: [
              {
                required: true,
              }, {
                pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{6,12}$/, message: '用户名为中英文、数字下划线，长度在6到12位'
              }
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Password" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="RealName" hasFeedback {...formItemLayout}>
          {getFieldDecorator('realname', {
            initialValue: item.realname,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Remark" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: item.remark || '',
            rules: [
              {
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Post" hasFeedback {...formItemLayout}>
          {getFieldDecorator('post_id', {
            initialValue: item.p_name,
            rules: [
              {
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Structure" hasFeedback {...formItemLayout}>
          {getFieldDecorator('structure_id', {
            initialValue: item.s_name,
            rules: [
              {
              },
            ],
          })(<Input />)}
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

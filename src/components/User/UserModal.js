import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Input, Radio, Modal, TreeSelect } from 'antd'
import messages from '../../lang/User/'
import { config } from '../../utils'

const { prefix } = config

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}

const modal = ({
  item = {},
  onOk,
  pathName,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  intl: {
    formatMessage,
  },
  ...modalProps
}) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
        // key: item.key,
      }
      // data.groups = ['15'];        // 默认为普通会员
      onOk(data);
    });
  }

  const treeProps = {
    treeData: JSON.parse(localStorage.getItem(`${prefix}groups`)) || [],
    treeCheckable: true,
    allowClear: true,
    multiple: true,
    treeDefaultExpandAll: true,
    searchPlaceholder: 'Please select',
  };
  // const userGroup = []
  // if ({}.hasOwnProperty.call(item, 'groups'))
  // userGroup.push(item.groups.map(val => val.group_id))

  const content = []
  content.push(
    pathName === '/member' ? (
      <Form layout="horizontal" key={0}>
        <FormItem label="UserName" hasFeedback {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: item.username,
            rules: [
              {
                required: true,
              }, {
                pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{6,12}$/, message: '用户名为中英文、数字下划线，长度在6到12位',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="check_status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('check_status', {
            initialValue: !!item.check_status ? item.check_status.toString() : '0',
            rules: [{ required: true }],
          })(
            <RadioGroup>
              <RadioButton value="0"><FormattedMessage {...messages.unCertified} /></RadioButton>
              <RadioButton value="1"><FormattedMessage {...messages.isCertified} /></RadioButton>
              <RadioButton value="2"><FormattedMessage {...messages.checking} /></RadioButton>
              <RadioButton value="3"><FormattedMessage {...messages.certifyFailed} /></RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="Status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: !!item.status ? item.status.toString() : '1',
            rules: [{ required: true }],
          })(
            <RadioGroup>
              <RadioButton value="1"><FormattedMessage {...messages.isEnabled} /></RadioButton>
              <RadioButton value="0"><FormattedMessage {...messages.disabled} /></RadioButton>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    ) : (
      <Form layout="horizontal" key={1}>
        <FormItem label={formatMessage(messages.username)} hasFeedback {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: item.username,
            rules: [
              {
                required: true,
              }, {
                pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{6,12}$/, message: '用户名为中英文、数字下划线，长度在6到12位',
              },
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
        <FormItem label={formatMessage(messages.name)} hasFeedback {...formItemLayout}>
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
        <FormItem label={formatMessage(messages.groups)} hasFeedback {...formItemLayout}>
          {getFieldDecorator('groups', {
            initialValue: [...item.groups.map(val => val.group_id.toString())],
            rules: [{ required: true }],
          })(<TreeSelect {...treeProps} />)}
        </FormItem>
      </Form>
    )
  )

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      { content }
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
  intl: PropTypes.object,
}

export default Form.create()(injectIntl(modal))

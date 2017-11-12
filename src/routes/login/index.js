import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input } from 'antd'
import { config } from '../../utils'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  app: { verify },
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'app/login', payload: values })
    })
  }

  function handleVerify() {
    dispatch({
      type: 'app/getVerify',
      payload: {
        param: moment().unix(),
      },
    });
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="Username" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="Password" />)}
        </FormItem>
        <FormItem>
          <Row gutter={8}>
            <Col span={10}>
              {getFieldDecorator('verifyCode', {
                rules: [{ required: true, message: 'Please input the captcha you got!' }],
              })(
                <Input size="large" onPressEnter={handleOk} placeholder="Captcha" />
              )}
            </Col>
            <Col span={14}>
              <img src={verify} alt="captcha" onClick={handleVerify} />
            </Col>
          </Row>
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loading}>
            Sign in
          </Button>
        </Row>

      </form>
    </div>
  )
}

Login.propTypes = {
  app: PropTypes.object,
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ app, loading }) => ({ app, loading: loading.models.app }))(Form.create()(Login))

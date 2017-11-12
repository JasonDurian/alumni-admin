import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Link } from 'dva/router'
import { Form, Input, Button, Checkbox, TreeSelect } from 'antd'
import messages from '../../lang/Group/'
import styles from './GroupDetail.less'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const TreeNode = TreeSelect.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 3,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

const detail = ({
 item = {},
 confirmLoading,
 onOk,
 onBack,
 form: {
   getFieldDecorator,
   validateFields,
   getFieldsValue,
 },
 intl: {
   formatMessage,
 },
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
      data.rules = data.hasOwnProperty('rules') && data.rules.toString();
      onOk(data);
    });
  }

  function renderTreeNodes(data) {
    return data.map((list) => {
      if (list.children) {
        return (
          <TreeNode className={styles.rules} title={list.label} key={list.key} value={list.value}>
            {renderTreeNodes(list.children)}
          </TreeNode>
        );
      }
      return <TreeNode className={styles.rules} title={list.label} {...list} />;
    });
  }

  const ruleList = item.hasOwnProperty('ruleList') ? item.ruleList : [{ key: '10' }];
  const defaultExpandedKeys = [];
  defaultExpandedKeys.push(ruleList[0].key);
  const treeProps = {
    // 需要修改treeNode的样式为平铺，所以不使用treeData
    // treeData: item.hasOwnProperty('ruleList') ? item.ruleList : [],
    treeCheckable: true,
    allowClear: true,
    multiple: true,
    treeDefaultExpandedKeys: defaultExpandedKeys,
    // showCheckedStrategy: TreeSelect.SHOW_ALL,
    searchPlaceholder: 'Please select',
  };

  // Todo: 平铺的checkbox格式
  /* const rulesList = [];
  let ruleFlag = 0;
  function rulesHandle(list = [], listKey = 0) {
    const ruleOptions = [];
    list.map(data => {
      // 判断是否为最后一级，是的话使用checkboxGroup
      if (data.hasOwnProperty('children')) {
        // 控制样式
        ruleFlag += 1;
        const topRuleStyle = ruleFlag === 1 ? {} : { paddingLeft: '14px' };
        // 使用push而不是return是因为父级需要出现在子集之前
        rulesList.push(
          <div
            style={{ borderBottom: '1px solid #E9E9E9', ...topRuleStyle }}
            key={`parent${data.key}`}
          >
            <Checkbox key={`checkbox${data.key}`}>{data.label}</Checkbox>
          </div>,
        );
        // 还有子集的话再次循环
        rulesHandle(data.children, data.key);
      } else {
        // 没有子集的话记录checkboxGroup选项
        ruleOptions.push(data);
      }
    });

    if (ruleOptions.length > 0) {
      rulesList.push(
        <div style={{ paddingLeft: '28px', paddingBottom: '10px' }} key={`child${listKey}`}>
          <CheckboxGroup options={ruleOptions} />
        </div>,
      );
    }
  }

  item.hasOwnProperty('ruleList') && rulesHandle(item.ruleList); */

  const content = []
  content.push(
    <Form layout="horizontal" key={1} onSubmit={handleOk}>
      <FormItem label={formatMessage(messages.title)} hasFeedback {...formItemLayout}>
        {getFieldDecorator('title', {
          initialValue: item.title,
          rules: [
            {
              required: true,
            }
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label={formatMessage(messages.remark)} {...formItemLayout}>
        {getFieldDecorator('remark', {
          initialValue: item.remark,
          rules: [
            {
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label={formatMessage(messages.rules)} hasFeedback {...formItemLayout}>
        {getFieldDecorator('rules', {
          initialValue: item.rules && item.rules.split(','),
          rules: [{ required: true }],
        })(
          <TreeSelect {...treeProps}>
            {renderTreeNodes(ruleList)}
          </TreeSelect>
        )}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button type="primary" onClick={handleOk} loading={confirmLoading}>
          <FormattedMessage {...messages.submit} />
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onBack}>
          <Link to={'/group'}>
            <FormattedMessage {...messages.back} />
          </Link>
        </Button>
      </FormItem>
    </Form>
  )

  return (
    <div>
      { content }
    </div>
  )
}

detail.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  confirmLoading: PropTypes.bool,
  onBack: PropTypes.func,
  onOk: PropTypes.func,
  intl: PropTypes.object,
}

export default Form.create()(injectIntl(detail))

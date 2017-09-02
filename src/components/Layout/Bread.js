import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'dva/router'
import styles from './Bread.less'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from '../../utils'

const Bread = ({ menus }) => {
  // 匹配当前路由
  let pathArray = []
  let current
  for (let index in menus) {
    if (menus[index].url && pathToRegexp(menus[index].url).exec(location.pathname)) {
      current = menus[index]
      break
    }
    if (menus[index].child) {
      menus[index].child.forEach((item) => {
        if (item.url && pathToRegexp(item.url).exec(location.pathname)) {
          current = item
          return
        }
      })
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.pid) {
      getPathArray(queryArray(menus, item.pid, 'id'))
    }
  }

  if (!current) {
    pathArray.push(menus[0])
    pathArray.push({
      id: 404,
      name: 'Not Found',
    })
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
          ? <Icon type={item.icon} style={{ marginRight: 4 }} />
          : ''}{item.title}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.url}>
              {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })


  pathToRegexp(location.pathname).exec('/dashboard') || breads.unshift(
    <Breadcrumb.Item key="0">
      <Link to='/dashboard'>
            <span>
              <Icon type='laptop' style={{ marginRight: 4 }} />
              首页
            </span>
      </Link>
    </Breadcrumb.Item>
  )

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menus: PropTypes.array,
}

export default Bread

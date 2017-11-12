import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'user',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user/user'))
              cb(null, require('./routes/user/'))
            }, 'user')
          },
        }, {
          path: 'user/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user/detail'))
              cb(null, require('./routes/user/detail/'))
            }, 'user-detail')
          },
        }, {
          path: 'member',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/member/member'))
              cb(null, require('./routes/member/'))
            }, 'member')
          },
        }, {
          path: 'member/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/member/detail'))
              cb(null, require('./routes/member/detail/'))
            }, 'member-detail')
          },
        }, {
          path: 'group',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/group/group'))
              cb(null, require('./routes/group/'))
            }, 'group')
          },
        }, {
          path: 'group/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/group/detail'))
              cb(null, require('./routes/group/detail/'))
            }, 'group-detail')
          },
        }, {
          path: 'square',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/square/square'))
              cb(null, require('./routes/square/'))
            }, 'square')
          },
        }, {
          path: 'square/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/square/detail'))
              cb(null, require('./routes/square/detail/'))
            }, 'square-detail')
          },
        }, {
          path: 'comment',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/discuss/comment'))
              cb(null, require('./routes/discuss/comment/'))
            }, 'comment')
          },
        }, {
          path: 'message',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/discuss/message'))
              cb(null, require('./routes/discuss/message/'))
            }, 'message')
          },
        }, {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers

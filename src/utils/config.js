module.exports = {
  name: 'Alumni Admin',
  prefix: 'alumniAdmin',
  footerText: 'Alumni Admin  © 2017 Jason',
  logo: 'https://t.alipayobjects.com/images/T1QUBfXo4fXXXXXXXX.png',
  iconFontUrl: '//at.alicdn.com/t/font_c4y7asse3q1cq5mi.js',
  baseURL: 'http://localhost/admin',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7001', 'http://192.168.1.110:8000'],
  openPages: ['/login'],
  // apiPrefix: 'http://api.alumni.app/admin',
  apiPrefix: '/tp/admin',
  api: {
    userLogin: '/user/login',
    userLogout: '/user/logout',
    userInfo: '/userInfo',
    users: '/users',
    user: '/user/:id',
    dashboard: '/dashboard',
  },
}

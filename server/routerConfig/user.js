module.exports = [
  {
    action: 'login',
    path: 'login',
    method: 'post'
  },
  {
    action: 'reg',
    path: 'reg',
    method: 'post'
  },
  {
    action: 'list',
    path: 'list',
    method: 'get'
  },
  {
    action: 'findById',
    path: 'find',
    method: 'get'
  },
  {
    action: 'update',
    path: 'update',
    method: 'post'
  },
  {
    action: 'del',
    path: 'del',
    method: 'post'
  },
  {
    action: 'getLoginStatus',
    path: 'status',
    method: 'get'
  },
  {
    action: 'logout',
    path: 'logout',
    method: 'get'
  },
  {
    action: 'loginByToken',
    path: 'login_by_token',
    method: 'all'
  },
  {
    action: 'getLdapAuth',
    path: 'login_by_ldap',
    method: 'all'
  },
  {
    action: 'upStudy',
    path: 'up_study',
    method: 'get'
  },
  {
    action: 'changePassword',
    path: 'change_password',
    method: 'post'
  },
  {
    action: 'search',
    path: 'search',
    method: 'get'
  },
  {
    action: 'project',
    path: 'project',
    method: 'get'
  },
  {
    action: 'avatar',
    path: 'avatar',
    method: 'get'
  },
  {
    action: 'uploadAvatar',
    path: 'upload_avatar',
    method: 'post'
  }
];

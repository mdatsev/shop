/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function goToOrg (path) {
  location.pathname = location.pathname.split('/').slice(0, 3).join('/') + '/' + path;
}

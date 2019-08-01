/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function goToOrg (path, elem) {
  location.pathname = location.pathname.split('/').slice(0, 3).join('/') + '/' + path;
  console.log(this)
}

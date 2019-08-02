/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function goToOrg (path, elem) {
  location.pathname = location.pathname.split('/').slice(0, 3).join('/') + '/' + path;
}

function goToPage (i) {
  const search = new URLSearchParams(location.search);

  search.set('pageNum', i);
  location.search = search.toString();
}

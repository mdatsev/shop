/* eslint-disable no-undef */

function getRoute (from, to) {
  const body = {
    jsonrpc: '2.0',
    method: 'findRoute',
    params: {
      from,
      to,
      departureStart: '10/07/2019',
      departureEnd: '30/07/2019 12:59:59',
      filter: 'shortest',
    },
    id: 1,
  };

  return fetch('http://10.20.1.138:8080/api', {
    method: 'post',
    headers: {
      'Content-type': 'application/json-rpc; charset=UTF-8',
    },
    body: JSON.stringify(body),
  }).then(r => r.json()).then(r => r.result.route);
}

function getShops () {
  return fetch('/ajax/shopLocations', {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ organizationId: PAGE_GLOBALS.organizationId }),
  }).then(r => r.json());
}
let map;

// eslint-disable-next-line no-unused-vars
function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: { lat: 0, lng: -180 },
    mapTypeId: 'terrain',
  });
}

function displayMap (coords) {
  var flightPlanCoordinates = coords;
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  flightPath.setMap(map);
}

document.getElementById('display-route').addEventListener('click', function displayRoute () {
  navigator.geolocation.getCurrentPosition(async pos => {
    const userCoords = pos.coords;
    const from = {
      lat: userCoords.latitude,
      lng: userCoords.longitude,
    };
    const shops = await getShops();
    const route = await getRoute(from, shops);

    console.log(route);

    const table = document.getElementById('route');
    const tbody = table.getElementsByTagName('tbody')[0];

    this.classList.add('d-none');
    table.classList.remove('d-none');
    const coords = [];

    for (const segment of route) {
      const row = document.createElement('tr');
      const from = document.createElement('td');
      const to = document.createElement('td');
      const weather = document.createElement('td');

      coords.push({ lat: segment.latFrom, lng: segment.lngFrom });
      coords.push({ lat: segment.latTo, lng: segment.lngTo });
      from.innerText = segment.from;
      to.innerText = segment.to;
      weather.innerText = segment.price;
      row.appendChild(from);
      row.appendChild(to);
      row.appendChild(weather);
      tbody.appendChild(row);
    }

    displayMap(coords);
  });
});

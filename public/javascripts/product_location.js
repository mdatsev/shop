/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function getShops () {
  return fetch('/ajax/shopLocations', {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ organizationId: PAGE_GLOBALS.organizationId }),
  }).then(r => r.json());
}

function getRoute (from, to) {
  const body = {
    jsonrpc: '2.0',
    method: 'findRoute',
    params: {
      from,
      to,
      departureStart: '20/07/2019',
      departureEnd: '30/07/2019 12:59:59',
      filter: 'shortest',
    },
    id: 1,
  };

  return fetch('https://10.20.1.138:3000/api', {
    method: 'post',
    headers: {
      'Content-type': 'application/json-rpc; charset=UTF-8',
    },
    body: JSON.stringify(body),
  })
    .then(r => r.json())
    .then(r => r.result.route);
}

const mapElement = document.getElementById('map');
let map;

// eslint-disable-next-line no-unused-vars
function initMap () {
  map = new google.maps.Map(mapElement, {
    zoom: 3,
    center: { lat: 0, lng: -180 },
    mapTypeId: 'hybrid',
  });
}

function displayRoute (coords) {
  const flightPath = new google.maps.Polyline({
    path: coords,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    geodesic: true,
  });

  flightPath.setMap(map);
}

const buttonElement = document.getElementById('display-route');
const ticketsToBasketButton = document.getElementById('tickets-to-basket')
const tickets = [];

buttonElement.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(async pos => {
    const userCoords = pos.coords;
    const from = {
      lat: userCoords.latitude,
      lng: userCoords.longitude,
    };

    map.panTo(new google.maps.LatLng(from.lat, from.lng));

    const table = document.getElementById('route');
    const tbody = table.getElementsByTagName('tbody')[0];

    buttonElement.classList.add('d-none');
    table.classList.remove('d-none');
    mapElement.classList.remove('d-none');
    const coords = [];
    const shops = await getShops();
    const route = await getRoute(from, shops);
    
    for (const segment of route) {
      const row = document.createElement('tr');
      const from = document.createElement('td');
      const to = document.createElement('td');
      const weather = document.createElement('td');
      const ticketTd = document.createElement('td');
      const ticket = document.createElement('a');

      tickets.push(segment.shopId);
      ticket.classList.add('text-dark');
      ticketTd.appendChild(ticket);

      ticket.href = `/products/${segment.shopId}/show`;
      ticket.innerText = segment.airlineId + segment.shopId;
      
      coords.push({ lat: segment.latFrom, lng: segment.lngFrom });
      coords.push({ lat: segment.latTo, lng: segment.lngTo });
      from.innerText = segment.from;
      to.innerText = segment.to;
      weather.innerText = segment.price;
      row.appendChild(from);
      row.appendChild(to);
      row.appendChild(weather);
      row.appendChild(ticketTd);
      tbody.appendChild(row);
    }
    ticketsToBasketButton.classList.remove('d-none');
    displayRoute(coords);
  });
});

ticketsToBasketButton.addEventListener('click', () => {
  for (const ticket of tickets) {
    addToBasket('product', ticket);
  }
});

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const iframe = $('<iframe>');

function initBasketButton () {
  const basketButton = $('#basket-button');

  basketButton.popover({
    title: 'Basket',
    placement: 'bottom',
    trigger: 'manual',
    animation: false,
    template: `<div class="popover" role="tooltip">
                <div class="arrow">
                </div>
                <div class="popover-body" id="basket">
                </div>
              </div>`,
  });

  basketButton.click(() => {
    basketButton.popover('toggle');
  });

  $('body').keyup(ev => {
    if (ev.which === 27) { // Escape key
      basketButton.popover('hide');
    }
  });

  updateBasketPreview();
  basketButton.on('inserted.bs.popover', () => {
    $('#basket').html(iframe);
    // updateBasketPreview();
  });
}

function addToBasket (type, id) {
  const current = getItems();

  const len = current.length;
  const basketId = len ? len + 1 : 1;

  current.push({
    type,
    id,
    basketId,
  });
  setItems(current);
  updateBasketPreview();
}

function removeFromBasket (basketId) {
  const current = getItems().filter(e => e.basketId !== basketId);

  setItems(current);
  updateBasketPreview();
}

function updateBasketPreview () {
  iframe.attr('src',
    `http://localhost:3000/basket?items=${
      encodeURIComponent(getItemsRaw())}`);
}

function getItems () {
  return JSON.parse(getItemsRaw());
}

function getItemsRaw () {
  return localStorage.getItem('basketItems') || '[]';
}

function setItems (items) {
  localStorage.setItem('basketItems', JSON.stringify(items));
}

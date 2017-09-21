'use strict';

let $form = $('#the-form');

function listInventory (response) {
  $('#inventory ul').empty();
  $.get('/api/inventory', function(response){
    let $theTemplate = $('#list-template').html();
    let compiled = Handlebars.compile($theTemplate);
    for (var i = 0; i < response.length; i++) {
      let $theHTML = $(compiled(response[i]));
      $theHTML.find('a').on('click', seeMore);
      $('#inventory ul').append($theHTML);
    }
  })
}
$form.on('submit', function(event){
  event.preventDefault();
  // if my form is submitting a new item, then do the post request.
  // if my form is updating an existing item, then do the $.ajax request with the method of "put"
  if ($form.attr('doing') === 'new') {
    $.post('/api/inventory', {
      name: $form.find('[name="name"]').val(),
      category: $form.find('[name="category"]').val(),
      quantity: $form.find('[name="quantity"]').val(),
      price: $form.find('[name="price"]').val()
    }, function(response){
      listInventory(response);
    });
  } else if ($form.attr('doing') === 'update') {
    $.ajax({
      method: 'PUT',
      url: `/api/inventory/${ $form.find('[name="id"]').val() }`,
      data: {
        name: $form.find('[name="name"]').val(),
        category: $form.find('[name="category"]').val(),
        quantity: $form.find('[name="quantity"]').val(),
        price: $form.find('[name="price"]').val()
      }
    }).done(function(response){
      listInventory(response);
      $('#inventory').show();
    });
  }
  $form[0].reset();
});

$('#show-inventory').on('click', function(){
  $('#inventory ul').empty();
  $.get('/api/inventory', function(response){
    let $theTemplate = $('#list-template').html();
    let compiled = Handlebars.compile($theTemplate);
    for (var i = 0; i < response.length; i++) {
      let $theHTML = $(compiled(response[i]));
      $theHTML.find('a').on('click', seeMore);
      $('#inventory ul').append($theHTML);
    }
  });
  $('#inventory').show();
});

// When a "see more" link is clicked, clear out all the HTML, GET the one item we want and render that item to the page.
function seeMore(){
  // hide the form and the inventory section
  $form.hide();
  $('#inventory').hide();
  // get id for the one item we want from the link
  let target = $(this).attr('item-id');
  // use the info from the link to get data from the database
  $.get('/api/inventory/' + target, function(response){
    // render that one item into HTML
      // get the data from the response
      // put that data into a template
    let theItem = response[0];
    let $theTemplate = $('#item-template').html();
    let compiled = Handlebars.compile($theTemplate);
    let $thePtag = $(compiled(theItem));
    $thePtag.find('a').on('click', function(){
      $form.show();
      $form.attr('doing', 'update');
      $form.find('[name="id"]').val(theItem.id);
      $form.find('[name="name"]').val(theItem.name);
      $form.find('[name="category"]').val(theItem.category);
      $form.find('[name="quantity"]').val(theItem.quantity);
      $form.find('[name="price"]').val(theItem.price);
    });
      // append that template to somewhere in the DOM
    $('#one-item').append($thePtag);
  });
}

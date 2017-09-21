'use strict';

let $form = $('#the-form');
$form.on('submit', function(event){
  event.preventDefault();
  $.post('/api/inventory', {
    name: $form.children().find('[name="name"]').val(),
    category: $form.children().find('[name="category"]').val(),
    quantity: $form.children().find('[name="quantity"]').val(),
    price: $form.children().find('[name="price"]').val()
  }, function(response){
    $('#inventory ul').empty();
    $.get('/api/inventory', function(response){
      let $theTemplate = $('#template').html();
      let compiled = Handlebars.compile($theTemplate);
      for (var i = 0; i < response.length; i++) {
        $('#inventory ul').append(compiled(response[i]));
      }
    })
  });
  $form[0].reset();
});

'use strict';
var $ = require('jquery');
require('github/Semantic-Org/Semantic-UI@1.11.6/dist/semantic');


$(document).ready(function () {

  $('i.caret.left').on('click', function () {

    var numberInput = parseInt($(event.target).closest('td').find('#number').val());

    if (numberInput !== 1) {
      $(event.target).closest('td').find('#number').val(numberInput - 1);
    }
  });

  $('i.caret.right').on('click', function () {

    var numberInput = parseInt($(event.target).closest('td').find('#number').val());

    var inventory = $('#leftNumber').text();
    //console.log(inventory);
    if (inventory > numberInput) {

      $(event.target).closest('td').find('#number').val(numberInput + 1);
    }


  });

  $('input').on('change', function () {

    var id = $(event.target).closest('tr').data('id');
    var num = $('#number').val();
    var price = $('#price').text();
    var total = $('#total').text();

    $.ajax({
      url: 'cart/' + id,
      type: 'POST',
      data: {number: num, price: price, total: total},

      success: function (data) {
        $('#subtotal').text(data.subtotal);
        $('#total').text(data.total);
      }
    })
  });

  $('input').on('blur', function () {

    $(event.target).closest('td').find('#inventory').hide();

    var numberInput = parseInt($(event.target).closest('td').find('#number').val());
    numberInput = numberInput.toString();
    var number = numberInput.replace(/\b(0+)/gi, '');
    $('#number').val(number);

    verifyNumber(number);

    if (isShorted()) {
      $(event.target).closest('td').find('#inventory').show();
    }
  });

  function verifyNumber(number) {

    var reg = /^(0|[1-9][0-9]*)$/;

    if (!reg.exec(number)) {
      parseInt($(event.target).closest('td').find('#number').val(1));
    }
  }

  function isShorted() {

    var inputNumber = parseInt($(event.target).closest('td').find('#number').val());
    var leftNumber = $('#leftNumber').text();

    if (inputNumber > leftNumber) {
      return true;
    }

    return false;
  }


  $('.delete_cartItem').on('click', function (event) {

    var delete_cartItem = this;

    $('.first.modal')
      .modal('show');

    $('.yes').on('click', function (event) {
      var id = delete_cartItem.closest('td').id;

      $.ajax({
        url: 'cart/' + id,
        type: 'DELETE',

        success: function (data) {
          $(delete_cartItem.closest('tr')).replaceWith(
            "<tr><td colspan='7'> " + "<div class='ui teal message delete-massage'>" + "删除成功" + "</div></td></tr>");
          jump(2, delete_cartItem);
        }
      })
    })
  });

  function jump(count, self) {

    window.setTimeout(function () {
      count--;

      if (count > 0) {
        jump(count, self);

      } else {
        $('.delete-massage').closest('tr').remove();
      }

    }, 1000);
  }

});



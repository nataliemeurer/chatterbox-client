// YOUR CODE HERE:

var app = {
  init: function() {

  },
  send: function(message) {
    console.log(message);
    $.ajax({
      url: "https://api.parse.com/1/classes/chatterbox",
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: function(data) {
        console.log(data);
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function() {
    $.ajax({
      type: 'GET',
      data: {order: "-createdAt"},
      contentType: "application/jsonp",
      url: "https://api.parse.com/1/classes/chatterbox",
      success: function(data){
        console.log(data);
        app.displayMessages(data);
      },
      error: function(data){
        console.log("error");
      }
    });
  },
  clearMessages: function() {
    $("#chats").empty();
  },
  addMessage: function(message) {
    $(".message")[0].remove();
    $("#chats").append("<li class='message'><span class='username'>"+message.username+"</span>: "+
        message.text+"</li>");
    app.send(message);
  },
  addRoom: function(roomName) {
    $("#roomSelect").append("<li class='room'>"+roomName+"</li>");
  },
  addFriend: function() {
    console.log("added friend");
  },
  displayMessages: function(data) {
    var messages = data.results;
    app.clearMessages();
    for (var x = 0; x < 10; x++) {
        $("#chats").append("<li class='message'><span class='username'>"+messages[x].username+"</span>: "+ messages[x].text+"</li>");
    };

  },
  server: "https://api.parse.com/1/classes/chatterbox"
};

app.fetch();
setInterval(app.fetch, 3000);

$(document).ready( function() {
  $('input:submit').on('click', function() {
    app.addMessage({roomname: 'lobby', text: $('#message').val(), username: 'Kevin'})
  });
  $('.username').on('click', function(){
    console.log("called");
    app.addFriend();
  });
});

// document.body.innerHTML = ''
// window.location = 'http://www.google.com'

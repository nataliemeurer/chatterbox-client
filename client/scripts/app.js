// YOUR CODE HERE:

var app = {
  init: function() {
    $('.username').on('click', function(){
      console.log("called");
      app.addFriend();
    });
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
        app.displayMessages(data);
      },
      error: function(data){
        console.log("error");
      }
    });
    app.init();
  },
  clearMessages: function() {
    $("#chats").empty();
    $("#rooms").empty();
  },
  addMessage: function(message) {
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
  handleSubmit: function() {
    var idx = window.location.search.indexOf('=') + 1;
    var username = window.location.search.slice(idx);
    var message = {
      roomname: 'lobby',
      text: $('#message').val(),
      username: username
    }
    app.addMessage(message);
    $('#message').val('');
  },
  displayMessages: function(data) {
    var messages = data.results;
    app.clearMessages();
    var messageCount = 0;
    for (var i = 0; messageCount < 10; i++) {
      messages[i].text.replace(/<script>|<\/script>/g, '');

      $("#chats").prepend("<li class='message'><span class='username'>" + messages[i].username + "</span>: " + messages[i].text+"</li>");
        messageCount++;
      if(app.roomList.indexOf(messages[i].roomname) === -1 && messages[i].roomname !== undefined) {
        app.roomList.push(messages[i].roomname);
      }
    }
    for (var i = 0; i < app.roomList.length; i++) {
      $("#rooms").prepend("<li class='room'>"+app.roomList[i]+"</li>");
    }

  },
  server: "https://api.parse.com/1/classes/chatterbox",
  currentRoom: "lobby",
  roomList: []
};

app.fetch();
setInterval(app.fetch, 3000);

$(document).ready( function() {
  $('input:submit').on('click', function() {
    app.handleSubmit();
  });
  $('body').on('keypress', function(e){
    var code = e.keyCode || e.which;
    if(code === 13 && $('input:submit').val()!== ''){
      app.handleSubmit();
    }
  })
  var idx = window.location.search.indexOf('=') + 1;
  var username = window.location.search.slice(idx);
  $('#username').html(username);
});

// document.body.innerHTML = ''
// window.location = 'http://www.google.com'

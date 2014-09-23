// YOUR CODE HERE:

var app = {
  init: function() {
    $('.username').on('click', function(e){
      app.addFriend(e.currentTarget.innerHTML);
    });
    $('.room').on('click', function(e) {
      app.changeRoom(e.currentTarget.innerHTML);
    });
  },
  send: function(message) {
    $.ajax({
      url: "https://api.parse.com/1/classes/chatterbox",
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
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
  },
  clearMessages: function() {
    $("#chats").empty();
    $("#roomSelect").empty();
  },
  addMessage: function(message) {
    $("#chats").append("<li class='message user'><span class='username'>"+message.username+"</span>: "+
        message.text+"</li>");
    app.send(message);
  },
  addRoom: function(roomName) {
    $("#roomSelect").append("<li class='room'>"+roomName+"</li>");
    app.roomList.push(roomName);
  },
  addFriend: function(name) {
    $("#friends").append("<li class='friend'>"+name+"</li>");
    if (app.friendsList.indexOf(name) === -1) {
      app.friendsList.push(name);
    }
  },
  changeRoom: function(name) {
    var oldRoom = app.currentRoom;
    app.currentRoom = name;
    app.roomList.push(oldRoom);
    app.roomList.splice(app.roomList.indexOf(name),1);
    $('#currentroom').html(app.currentRoom);
    app.fetch();
  },
  handleSubmit: function() {
    var idx = window.location.search.indexOf('=') + 1;
    var username = window.location.search.slice(idx);
    var message = {
      roomname: app.currentRoom,
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
      if(app.currentRoom === messages[i].roomname) {
        if(app.username === messages[i].username){
          $("#chats").prepend("<li class='message user'><span class='username'>" + messages[i].username + "</span>: " + messages[i].text+"</li>");
        } else{
          if (app.friendsList.indexOf(messages[i].username) > -1) {
            $("#chats").prepend("<li class='message'><span class='username'>" + messages[i].username + "</span>: <strong>" + messages[i].text+"</strong></li>");
          } else {
            $("#chats").prepend("<li class='message'><span class='username'>" + messages[i].username + "</span>: " + messages[i].text+"</li>");
          }
        }
      }
      messageCount++;
      if(app.roomList.indexOf(messages[i].roomname) === -1 && messages[i].roomname !== undefined
         && app.currentRoom !== messages[i].roomname ) {
        app.roomList.push(messages[i].roomname);
      }
    }
    for (var i = 0; i < app.roomList.length; i++) {
      $("#roomSelect").append("<li class='room'>"+app.roomList[i]+"</li>");
    }
    app.init();
  },
  server: "https://api.parse.com/1/classes/chatterbox",
  currentRoom: "lobby",
  roomList: [],
  username: null,
  friendsList: []
};

app.fetch();
setInterval(app.fetch, 3000);

$(document).ready( function() {
  $('input:submit').on('click', function() {
    app.handleSubmit();
  });
  $("#roomAdd").on('click', function(){
    if($('#room').val() !== ''){
      app.addRoom($('#room').val());
    }
    $('#room').val('');
  })
  $('#main').on('keypress', function(e){
    var code = e.keyCode || e.which;
    if(code === 13 && $('input:submit').val()!== ''){
      app.handleSubmit();
    }
  })
  var idx = window.location.search.indexOf('=') + 1;
  var username = window.location.search.slice(idx);
  app.username = username;
  $('#username').html(username);
  $('#currentroom').html(app.currentRoom);
});

// document.body.innerHTML = ''
// window.location = 'http://www.google.com'

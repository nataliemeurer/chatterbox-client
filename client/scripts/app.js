// YOUR CODE HERE:

var app = {
  init: function() {
    // Creates event listeners when new users and rooms get added to the chatterbox client
    $('.username').on('click', function(e){
      app.addFriend(e.currentTarget.innerHTML);
    });

    $('.room').on('click', function(e) {
      console.log("hello");
      app.changeRoom(e.currentTarget.innerHTML);
    });
  },

  send: function(message) {
    // Send a message to the parse server in the form of {object}
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
    // Fetches new messages from the parse server
    $.ajax({
      type: 'GET',
      data: {order: "-createdAt"},
      contentType: "application/jsonp",
      url: "https://api.parse.com/1/classes/chatterbox",
      success: function(data){
        app.clearMessages();
        app.displayMessages(data);
        app.displayRooms(data);
        app.init();
      },
      error: function(data){
        console.log("error");
      }
    });
  },

  clearMessages: function() {
    // clears chat messages and rooms
    $("#chats").empty();
    $("#roomSelect").empty();
  },

  addMessage: function(message) {
    // adds a message to the existing message list and sends it to the server
    message.text.replace(/<script>|<\/script>/g, '');
    if(app.currentRoom === message.roomname) {
      if(app.username === message.username){
        $("#chats").prepend("<li class='message user'><span class='username'>" + message.username + "</span>: " + message.text+"</li>");
      } else{
        if (app.friendsList.indexOf(message.username) > -1) {
          $("#chats").prepend("<li class='message friendly'><span class='username'>" + message.username + "</span>: <strong>" + message.text+"</strong></li>");
        } else {
          $("#chats").prepend("<li class='message'><span class='username'>" + message.username + "</span>: " + message.text+"</li>");
        }
      }
    }
  },

  displayMessages: function(data) {
    // inserts the new messages into the existing message list
    var messages = data.results;
    // app.clearMessages();
    var messageCount = 0;
    for (var i = 0; messageCount < 10; i++) {
      app.addMessage(messages[i]);
      app.newRoom(messages[i]);
      messageCount++;
    }
  },

  displayRooms: function(data) {
    // inserts the room to the existing room list
    for (var i = 0; i < app.roomList.length; i++) {
      $("#roomSelect").append("<li class='room'>"+app.roomList[i]+"</li>");
    }
  },

  newRoom: function(message) {
    // adds the message room to the room list if it doesn't already exist
    if(app.roomList.indexOf(message.roomname) === -1 && message.roomname !== undefined
       && app.currentRoom !== message.roomname ) {
      app.roomList.push(message.roomname);
    }
  },

  addRoom: function(roomName) {
    $("#roomSelect").append("<li class='room'>"+roomName+"</li>");
    app.roomList.push(roomName);
  },

  changeRoom: function(name) {
    var oldRoom = app.currentRoom;
    app.currentRoom = name;
    app.roomList.push(oldRoom);
    app.roomList.splice(app.roomList.indexOf(name),1);
    $('#currentroom').html(app.currentRoom);
    app.fetch();
  },

  addFriend: function(name) {
    if (app.friendsList.indexOf(name) === -1 && app.username !== name) {
      $("#friends").append("<li class='friend'>"+name+"</li>");
      app.friendsList.push(name);
    }
  },

  handleSubmit: function() {
    var idx = window.location.search.indexOf('=') + 1;
    var username = window.location.search.slice(idx);
    var message = {
      roomname: app.currentRoom,
      text: $('#message').val(),
      username: username
    };
    app.send(message);
    $('#message').val('');
  },
  server: "https://api.parse.com/1/classes/chatterbox",
  currentRoom: "lobby",
  roomList: [],
  username: null,
  friendsList: []
};

app.fetch();
setInterval(app.fetch, 100);

$(document).ready( function() {
  $('input:submit').on('click', function() {
    app.handleSubmit();
  });
  $("#roomAdd").on('click', function(){
    if($('#room').val() !== ''){
      app.addRoom($('#room').val());
    }
    $('#room').val('');
  });
  $('#main').on('keypress', function(e){
    var code = e.keyCode || e.which;
    if(code === 13 && $('#message').val()!== ''){
      console.log($('input:submit').val());
      app.handleSubmit();
    }
  });
  var idx = window.location.search.indexOf('=') + 1;
  var username = window.location.search.slice(idx);
  app.username = username;
  $('#username').html(username);
  $('#currentroom').html(app.currentRoom);
});

// setInterval(function(){ var r = Math.floor(Math.random()*255), g = Math.floor(Math.random()*255), b = Math.floor(Math.random()*255);
//   app.addMessage({username: "Nobody", roomname: "lobby",
//     text: "<style> body {background: rgba(" + r +", " + g + ", " + b + ",  1);}</style>" })}, 300
//   );
// document.body.innerHTML = ''
// window.location = 'http://www.google.com'

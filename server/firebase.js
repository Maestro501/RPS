var myRootRef = new Firebase('https://rsp.firebaseio.com/');
$('#messageInput').keypress(function (e) {
  if (e.keyCode == 13) {
    var name = $('#nameInput').val();
    var text = $('#messageInput').val();
    myRootRef.push({name: name, text: text});
    $('#messageInput').val('');
  }
});

$( "#refresh" ).submit(function( event ) {
  myRootRef.set(null);
});

var newRef = myRootRef.push();

//newRef.push('hello');

myRootRef.on('child_added', function(snapshot) {
  var message = snapshot.val();
  displayChatMessage(message.name, message.text);
});
function displayChatMessage(name, text) {
  $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
  $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};
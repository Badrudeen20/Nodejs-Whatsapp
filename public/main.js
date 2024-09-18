const socket = io();
let contactList = []
$(document).ready(function() { 
    
      $(window).resize(function() { 
         windowResize()
      });
      windowResize()
      
      $(document).on('click','#user-list li',function(event){
        event.preventDefault();
        let friend =  $(this).attr('data-friend')
        let user =  $(this).attr('data-user')
        let contact =  $(this).attr('data-contact')
        loadMsg(user,friend,contact)
        windowResize($(this)) 
      })

      $(document).on('click','#user-list li i.edit',function(event){
        event.preventDefault();
        event.stopPropagation();
        $('#addUsermobile').val($(this).attr('data-friend'))
        $('#addUsername').val($(this).attr('data-username'))
        $('#add-tab').click()
        
      })
      $(document).on('click','#user-list li i.delete',function(event){
        event.preventDefault();
        event.stopPropagation();
        deleteContact($(this).attr('data-friend'))
        
      })

  
      $(document).on('click','#myTab li',function(){
          loadContact()    
      })
      loadContact()
      
      $('#add-btn').click(function(){
        const username =  $('#addUsername').val()
        const mobile = $('#addUsermobile').val()
        addContact(mobile,username)
      })



      $(document).on('submit','#chat-form', function(e){
        e.preventDefault();
        const message = $(this).find('#message-box').val();
        const friend = $(this).find('#message-box').attr('data-friend');
        const user = $(this).find('#message-box').attr('data-user');
        const contact = $(this).find('#message-box').attr('data-contact');
        
        if(message && friend && user && contact){
          socket.emit("send",{friend:friend,msg:message,user:user,contact:contact,status:'send'}); 
          $('#chat-list').find(`#chat-${friend}`).append(`<div class="d-flex justify-content-end mx-1 my-1"><span class="badge text-bg-secondary">${message}</span></div>`)
          $(this).find('#message-box').val('');
          $('#chat-list').find(`#chat-${friend}`).scrollTop($(`#chat-${friend}`)[0].scrollHeight)
        }
      })

      socket.on("send",function(msg){
        
        if(contactList.includes(parseInt(msg.user))){
          if($('#chat-list').find(`#chat-${msg.user}`).length){
            $('#chat-list').find(`#chat-${msg.user}`).append(`<div class="d-flex justify-content-start mx-1 my-1"><span class="badge text-bg-secondary">${msg.msg}</span></div>`)
            $('#chat-list').find(`#chat-${msg.user}`).scrollTop($(`#chat-${msg.user}`)[0].scrollHeight)
          }
          
        }else{
          loadContact()
        }
        
        
      }); 

     /*  socket.on("join", (msg) => {
        console.log(msg)
      }); */

      socket.on("destroy", (msg) => {
        console.log(msg)
      });

}); 
  

  
    function windowResize(event){
         
          if($(window).width() < 576){
            $('#chat-box').hide()
          
            if(event){
              $('#home-tab-pane').html($('#chat-box').html())
              $('#user-list').empty()
            }
          }else{
            $('#chat-box').show()
            loadContact()
          }
    }
  
    function loadContact(){
      $.ajax({
            method:'GET',
            url: url+"contact-list",
            success: function (result) {
             
                if(result.status==200){
                  let html = `<ul class="list-group my-2" id="user-list" tabindex="-1">`
                  
                  let contact = result.data.map(function(item){
                      html+=`<li class="list-group-item my-1 d-flex justify-content-between" data-user="${item.user_mobile}" 
                      data-contact="${item.id}" data-friend="${item.friend_mobile}">
                      <span>${(item.username) ? item.username:item.friend_mobile}</span>
                      <span>
                      <i data-friend="${item.friend_mobile}" data-username="${item.username}" class="btn btn-sm btn-primary edit">Edit</i>
                      <i data-friend="${item.friend_mobile}" data-username="${item.username}" class="btn btn-sm btn-danger delete">Delete</i>
                      </span>
                      </li>`
                      return item.friend_mobile
                  })
                  contactList = [...contact]
                  html+=`</ul>`
                  $('#home-tab-pane').html(html)
                  socket.emit("join",result.room)
                  userStatus(contact)
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
      });
    }

    function loadMsg(user,friend,contact){
      $.ajax({
          method:'GET',
          url: url+"chat-list?friend="+friend,
          success: function (result) {
             let html = `<div id="chat-${friend}" style="height:90vh;overflow-y: auto;">`
            if(result.status==200){
              $(document).find('#message-box').attr("data-friend",friend)
              $(document).find('#message-box').attr("data-user",user)
              $(document).find('#message-box').attr("data-contact",contact)
              
              result.msg.forEach(item => {
                if(item.status == 'send'){
                  html+=`<div class="d-flex justify-content-end mx-1 my-1"><span class="badge text-bg-secondary">${item.msg}</span></div>` 
                }else{
                  html+=`<div class="d-flex justify-content-start mx-1 my-1"><span class="badge text-bg-secondary">${item.msg}</span></div>`
                }
              });
              html+=`</div>`
            }
            $(document).find('#chat-list').html(html)
            $('#chat-list').find(`#chat-${friend}`).scrollTop($(`#chat-${friend}`)[0].scrollHeight)

          },
          error: function (xhr, status, error) {
              console.log(error);
          }
      });
    }

    function addContact(mobile,username){  
      $.ajax({
        method:'POST',
        url: url+"add-user",
        data:{username:username,mobile:mobile},
        success: function (result) {
            
            if(result.status==400){
              let msg = ''
              result.msg.errors.forEach(element => {
                msg+=element.msg+', '
              });
              $('#message').html(`<div class="alert alert-danger">
                ${msg}
              </div>`)
            }else if(result.status==200){
              $('#add-form').trigger("reset");
              $('#message').html(`<div class="alert alert-success">
                User add successfully
              </div>`)
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
      });
    }

    function userStatus(contact){
      $.ajax({
        method:'POST',
        url: url+"load-status",
        data:{contact:contact},
        success: function (result) {
            
          if(result.status==200){
            let html = ``
            result.data.map(function(item){
              html+=`<li class="list-group-item">
              <img src="${item.link}" />
              </li>`
            })
            $('#user-status').html(html)
          }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
      });
    }

    function deleteContact(friend_mobile){
     
      $.ajax({
        method:'GET',
        url: url+"delete-user?friend="+friend_mobile,
        success: function (result) {
            if(result.status==200){
              loadContact()
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
      });
    }


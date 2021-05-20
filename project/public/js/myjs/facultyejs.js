 // modal  toi
 var modal = document.getElementById("modalNewNotif");
 var btn = document.getElementById("btn-new-notification");
 var span = document.getElementsByClassName("close")[0];
 
 span.onclick = function () {
     modal.style.display = "none";
 }
 window.onclick = function (event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }
 $( ".close" ).click(function() {
         $("#modalNewNotif").modal('hide');
 });
// modal  toi



 let btnCreateNewNoti = document.getElementById('btn-new-notification')
 let btnConfirmCreate = document.getElementById('btn-confirm-create')
 let notiUpdateForm = document.getElementById('noti-update-form')
 let deleteNotiForm = document.getElementById('delete-noti-form')
 if (btnCreateNewNoti) {
     btnCreateNewNoti.onclick = (e) => {
         $('#modalNewNotif').modal('show');
     }
 }
 function doCreateNoti(form){
     $('#modalNewNotif').modal('hide');
     var ajax = new XMLHttpRequest();
     ajax.open("POST", "/notifications/create", true);
     ajax.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
             var response = JSON.parse(this.responseText);
             alert(response.message);
             if (response.status == "success") {
                 socket.emit("id_post",response.data);
                 location.reload();
             }
         }
     };
     var formData = new FormData(form);
     ajax.send(formData);
     return false;

 }
 // if (btnConfirmCreate) {
 //     btnConfirmCreate.onclick = (e) => {
 //         $('#modalNewNotif').modal('hide');
 //     }
 // }
 $('.action-icon').on('click', (e) => {
     $(e.target).siblings('ul').toggle();
 })
 $('.btn-update').on('click', (e) => {
     $('#modal-update').modal('show');
     const { id, owner, title, briefText, content, categories } = e.target.dataset
     $('#owner').val(owner)
     $('#title').val(title)
     $('#briefText').val(briefText)
     $('#content').val(content)
     $('#categories').val(categories)
     $('#btn-confirm-update').attr('data-id', id)
 })
 $('#btn-confirm-update').click(e => {
     $('#modal-update').modal('hide');
     const { id } = e.target.dataset
     notiUpdateForm.action = '/notifications/update/' + id;
     notiUpdateForm.submit()
 })
 $('.btn-cancel').click(e => {
     $('.modal').modal('hide');
 })
 $('.btn-delete').click(e => {
     const { id } = e.target.dataset
     $('#btn-delete-confirmed').attr('data-id', id)
     $('#confirm-delete-dialog').modal('show');
 })
 $('#btn-delete-confirmed').click(e => {
     const { id } = e.target.dataset
     deleteNotiForm.action = '/notifications/delete/' + id;
     deleteNotiForm.submit()
     $('#confirm-delete-dialog').modal('hide')
 })
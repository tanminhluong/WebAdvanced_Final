$('.user-delete').click((e) => {

    $('#comFirmDeleteUser a').attr("id",e.target.id)
    $('#comFirmDeleteUser').modal('show')
})
$('.delete-user-yes').click((e) => {
    $('#comFirmDeleteUser').modal('hide')
    doDeleteUser(e.target.id);
})
$('.fa-user-edit').click((e) => {
    $('#modalUpdateUser').modal('show');
    const { username, password, id, email, name} = e.target.dataset
    $('#username').val(username)
    $('#password').val(password)
    $('#email').val(email)
    $('#name').val(name)
    $('.btnUpdateUser').attr('data-id', id)
})
function doDeleteUser(id){
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "/admin/remove", true);
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            alert(response.message);
            if (response.status == "success") {
                location.reload();
            }
        }
    };
    var formData = new FormData();
    formData.append("id_noti",id)
    ajax.send(formData);

}

var notiUpdateForm = document.getElementById("userFacul-update-form");
var modal = document.getElementById("modalAddFacul");
var btn = document.getElementById("btn-new-notification");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
$('.btnUpdateUser').click((e) => {
    $('#modalUpdateUser').modal('hide');
    const { id } = e.target.dataset
    notiUpdateForm.action = '/admin/update/' + id;
    notiUpdateForm.submit()
})
function changeFaculname(self){
console.log($(self).find('.selected').html())
$('#hello1').html($(self).html());
}
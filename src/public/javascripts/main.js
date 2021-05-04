
let btnCreateFaculty = document.getElementById('btn-new');
let btnCreateNewNoti = document.getElementById('btn-new-notification')
let btnConfirmCreate = document.getElementById('btn-confirm-create')
let btnConfirmUpdate = document.getElementById('btn-confirm-update')


let btnFilter = document.getElementById('btn-filter')
let searchForm = document.forms['search-form']
let notiUpdateForm = document.forms['noti-update-form']
let deleteNotiForm = document.forms['delete-noti-form']

let filterSelect = document.getElementById('filter-select');
// console.log(filterSelect)
let modal = document.getElementsByClassName('modal');

var span = document.getElementsByClassName('close')[0];
let actionMenu = document.getElementsByClassName('action-menu')[0];
let actionIcon = document.getElementsByClassName('action-icon')[0];



if(btnCreateFaculty){
    btnCreateFaculty.onclick = () => {  
        modal[0].style.display = 'block'
    }
}

if(btnCreateNewNoti){
    btnCreateNewNoti.onclick =  (e) => {
        let owner = e.target.dataset.owner
        $("input[name='owner']").val("Khoa " + owner)
        modal[0].style.display = 'block'
    }
}

if(btnConfirmCreate) {
    btnConfirmCreate.onclick = (e) => {
        
        modal.style.display = 'none';
    }
}


if(span) {
    span.onclick = function() {
        modal[0].style.display = 'none';
    }
}



// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal[0].style.display = 'none';
//         modal[1].style.display = 'none';

//     }
    
// }

window.onscroll = () => {
    scrollFunction();
}

const scrollFunction = () => {
    if(document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("header").classList.add("scoll-down")
        document.getElementById("header").style.borderBottom = 'none';
    } else {
        document.getElementById("header").classList.remove("scoll-down")
        document.getElementById("header").style.borderBottom = '3px solid #0061ad';

    }
}

$(document).click( (e) => {
    if($(e.target) == modal) {
        modal[0].style.display = 'none';
        modal[1].style.display = 'none';
    }

})

$('.btn-cancel').click(e => {
    $('.modal').hide();
})

// filter section

$('#btn-filter').on('click', (e) => {   
    let optionVal = $('#filter-select option:selected').val();
    
    searchForm.action = '/notifications/filter/pages/1' ;
    searchForm.submit();
})

$('.action-icon').on('click', (e) => {
    const menu = $(e.target).siblings('ul')  
    menu.toggle()
})

$('.btn-update').on('click', (e) => {
    $('#modal-update').show();
    const {id, owner, title, briefText, content, categories} = e.target.dataset
    $('#owner').val(owner)
    $('#title').val(title)
    $('#briefText').val(briefText)
    $('#content').val(content)
    $('#categories').val(categories)
    $('#btn-confirm-update').attr('data-id',id)
})

$('#btn-confirm-update').click(e => {
    $('#modal-update').hide();
    const {id} = e.target.dataset
    notiUpdateForm.action = '/notifications/'+ id +'?_method=PUT'
    notiUpdateForm.submit()

})

$('.btn-delete').click( e => {
    const {id} = e.target.dataset
    $('#btn-delete-confirmed').attr('data-id', id)
    $('#confirm-delete-dialog').show()
})

$('#btn-delete-confirmed').click(e => {
    const {id} = e.target.dataset

    deleteNotiForm.action = '/notifications/'+ id +'?_method=DELETE'
    deleteNotiForm.submit()
    $('#confirm-delete-dialog').hide()
})

/* socket */

let socket;

window.onload = () => {
    socket = io();
    socket.on('connect', () => console.log('kết nối với id: ' + socket.id))

    socket.on('new-user', (user) => console.log('một user vừa kết nối: ' + user ))
}


    

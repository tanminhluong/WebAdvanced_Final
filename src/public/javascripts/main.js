
let btnCreateFaculty = document.getElementById('btn-new');
let btnCreateNewNoti = document.getElementById('btn-new-notification')
let btnConfirmCreate = document.getElementById('btn-confirm-create')

let modal = document.getElementsByClassName('modal')[0];
var span = document.getElementsByClassName('close')[0];


if(btnCreateFaculty){
    btnCreateFaculty.onclick = () => {  
        modal.style.display = 'block'
    }
}

if(btnCreateNewNoti){
    btnCreateNewNoti.onclick =  (e) => {
        let owner = e.target.dataset.owner
        $("input[name='owner']").val("Khoa " + owner)
        modal.style.display = 'block'
    }
}

if(btnConfirmCreate) {
    btnConfirmCreate.onclick = (e) => {
        // e.preventDefault();
        modal.style.display = 'none';
    }
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
   

    

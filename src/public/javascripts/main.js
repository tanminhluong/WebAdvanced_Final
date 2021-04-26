
let btnCreateFaculty = document.getElementById('btn-new');

let modal = document.getElementsByClassName('modal')[0];
var span = document.getElementsByClassName("close")[0];
console.log(btnCreateFaculty)

btnCreateFaculty.onclick = () => {  
    modal.style.display = 'block'
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
}
}
   

    

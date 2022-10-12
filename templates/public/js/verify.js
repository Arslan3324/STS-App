
const input = document.getElementById('user_id');



function store(){
    //store input value in local storage
    localStorage.setItem('test_id', input.value);
    window.location.href = "../HTML/faceVerification.html";}

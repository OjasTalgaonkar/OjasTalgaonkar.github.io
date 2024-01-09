document.querySelector("button").addEventListener("click",()=>{
    let side=document.querySelector(".sidebar");
    if (side.classList.contains("active")){
        side.classList.remove("active");
        console.log(".hello");
    }
    else{
        side.classList.add("active");
        console.log("no");
    }
});


function expandDiv(clickedDiv){
    let allDivs= document.querySelectorAll('.projectTemplate');
    allDivs.forEach(function(div){
        div.classList.remove('grow');
    })
    clickedDiv.classList.add('grow');
}
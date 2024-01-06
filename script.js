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
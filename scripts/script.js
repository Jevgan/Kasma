"use strict";

let form = document.getElementById('user-form'),
    gallery = document.querySelector('.gallery_list'),
    addImageBtn = document.querySelector('.add'),
    removeImageBtn = document.querySelector('.remove'),
    logo = document.querySelector('picture');   

function getGalleryLength(){
    return gallery.querySelectorAll("li").length;
}

function getImagesCount(){
    const imagesCount = parseInt(localStorage.getItem("imageCount"));
    if(imagesCount && imagesCount < 10 && imagesCount > 0){
        return imagesCount;
    }

    return 10;
    
}

function updateImageCount(newCount) {
    if(newCount <= 10){
        let imageCount = newCount;
        localStorage.setItem("imageCount", imageCount);
    }   
}

addEventListeners();

function isValidByInputRole(inputText, role){         
    if(!role)return "Invalid role"; 

    if(role === "username")return isNameValid(inputText);
    else if(role === "age")return isAgeValid(inputText);
    else if(role === "email")return isEmailValid(inputText);
}

function isNameValid(name){
    return name && name.trim().length != 0 && name.length >= 3 && name.length <= 20;
}

function isAgeValid(age){
    return age && typeof +age == "number" && age >= 18 && age < 100; 
}

function isEmailValid(email){    
    if(!email && email.trim().length == 0){
        return false;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
    const isValid = regex.test(email);

    return isValid;
}

function insertImgInGallery(imageNumber){
    const imageLi = document.createElement("li");
    const image = document.createElement("img");

    image.alt = `Image ${imageNumber}`;
    image.src = `./img/gallery/${imageNumber}.jpg`;

    imageLi.appendChild(image);
    gallery.appendChild(imageLi);
}

function addEventListeners(){
    logo.addEventListener("click",() => location['reload']());  

    form.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", function() { 
            
            let inputParent = input.parentElement;
            
            let errorElement = inputParent.querySelector('.error_message'); 

            if(!errorElement){
                errorElement = document.createElement("div");
                errorElement.classList.add("error_message");
            } 

            if(!isValidByInputRole(input.value, input.name)){ 
                errorElement.textContent = `${input.name} is not valid`;
                if(!inputParent.contains(errorElement)){
                    inputParent.insertAdjacentElement("beforeend", errorElement);              
                } 
            } else{
                if(errorElement){
                    errorElement.remove();                
                } 
            }     
        });     
      
    });

    form.addEventListener("submit", function(event)  {
        event.preventDefault();
        const submitBtn = document.querySelector('button[type="submit"]');
        const errorMessages = this.querySelectorAll(".error_message");
        if(errorMessages.length == 0){ 
            setTimeout(() => {
                this.submit();
            }, 1000); 
        }
        else{
            errorMessages.forEach(message => {
                submitBtn.insertAdjacentElement("beforebegin", message);
            });            
        }    
    });

    document.addEventListener("DOMContentLoaded", () => {
        for (let i = 1; i <= getImagesCount(); i++) {
            insertImgInGallery(i);
        }
    });

    addImageBtn.addEventListener("click", () => {
        if (getGalleryLength() < 10) {            
        insertImgInGallery(getGalleryLength() + 1);
          updateImageCount(getGalleryLength());
        }         
    });    

    removeImageBtn.addEventListener("click",( )=>{ 
        if(getGalleryLength() > 0){    
            gallery.lastElementChild?.remove();
            updateImageCount(getGalleryLength());
        } 
    });
}
const previewImage = (e, targetElement) => {
    let reader = new FileReader();

    reader.onload = () => {
        let output = targetElement;
        output.src = reader.result;
    }
    if (e.target.files[0]) {
        showImageHideChoose()
        reader.readAsDataURL(e.target.files[0]);
    } else {
        showChooseHideImage()
    }
}

const overlayOn = () => {
    overlay = document.getElementById("image-overlay");
    deleteButton = document.getElementById("delete-button");
    if (overlay.classList.contains("hide")) {
        overlay.classList.remove("hide");
    }
    if (deleteButton.classList.contains("hide")) {
        deleteButton.classList.remove("hide");
    }
}

const overlayOff = () => {
    overlay = document.getElementById("image-overlay");
    deleteButton = document.getElementById("delete-button");
    if (!overlay.classList.contains("hide")) {
        overlay.classList.add("hide");
    }
    if (!deleteButton.classList.contains("hide")) {
        deleteButton.classList.add("hide");
    }
}

const showChooseHideImage = () => {
    document.getElementById("image-button").classList.remove("hide");
    document.getElementById("preview-div").classList.add("hide");
}

const showImageHideChoose = () => {
    document.getElementById("image-button").classList.add("hide");
    document.getElementById("preview-div").classList.remove("hide");
}

let element = document.getElementsByClassName("image-upload")[0];

element.addEventListener('change', (e) => previewImage(e, document.getElementById("image-to-upload")));

let addButton = document.getElementById("image-button");
addButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementsByClassName("image-upload")[0].click();
})

let deleteButton = document.getElementById("delete-button");
deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    let imageUpload = document.getElementsByClassName("image-upload")[0];
    imageUpload.value = null;
    document.getElementById("image-button").classList.remove("hide");
    document.getElementById("preview-div").classList.add("hide");
})

document.getElementById("preview-div").addEventListener('mouseover', (e) => {
    overlayOn();
})

document.getElementById("preview-div").addEventListener('mouseleave', (e) => {
    console.log("mouseleave!")
    overlayOff();
})

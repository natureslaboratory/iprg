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
    let overlay = document.getElementById("image-overlay");
    let deleteButton = document.getElementById("delete-button");
    if (overlay.classList.contains("hide")) {
        overlay.classList.remove("hide");
    }
    if (deleteButton.classList.contains("hide")) {
        deleteButton.classList.remove("hide");
    }
}

const overlayOff = () => {
    let overlay = document.getElementById("image-overlay");
    let deleteButton = document.getElementById("delete-button");
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

export const implementPreviewImage = () => {
    let element = document.getElementsByClassName("image-upload")[0];

    let imageToUpload = document.getElementById("image-to-upload");
    if (imageToUpload) {
        element.addEventListener('change', (e) => previewImage(e, document.getElementById("image-to-upload")));
    }

    let addButton = document.getElementById("image-button");
    if (addButton) {
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementsByClassName("image-upload")[0].click();
        })
    }

    let deleteButton = document.getElementById("delete-button");
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            let imageUpload = document.getElementsByClassName("image-upload")[0];
            imageUpload.value = null;
            document.getElementById("image-button").classList.remove("hide");
            document.getElementById("preview-div").classList.add("hide");
        })
    }

    // To show delete option

    let previewDiv = document.getElementById("preview-div");
    if (previewDiv) {
        previewDiv.addEventListener('mouseover', (e) => {
            overlayOn();
        })

        previewDiv.addEventListener('mouseleave', (e) => {
            overlayOff();
        })
        // For mobile users

        document.getElementById("preview-div").addEventListener('touchstart', (e) => {
            overlayOn();
        }, { passive: true })

        document.addEventListener('touchstart', (e) => {
            if (!hasParent(e.target, document.getElementById("preview-div"))) {
                overlayOff();
            }
        })
    }
}



const onLoadStoreNav = () => {
    nav = document.getElementById("dynamic_nav");
    return nav.cloneNode(true);
}

const handleResize = (e) => {
    let oldNav = document.getElementById("dynamic_nav");
    let parent = oldNav.parentElement;
    let newNav = originalNav.cloneNode(true);

    for (let index = 0; index < parent.children.length; index++) {
        parent.children[index].remove();
    }
    
    // var newNav = originalNav.cloneNode(true);
    
    parent.appendChild(newNav);
    
    let navBox = newNav.getBoundingClientRect();
    if (navBox.right > window.innerWidth) {
        if (!hamburgerExists(newNav)) {
            createHamburger(newNav);
        }
        let hamburger = document.getElementById('hamburger');

        while (newNav.getBoundingClientRect().right > window.innerWidth) {
            let lastChild = newNav.lastChild.previousSibling;

            let newHamburger = lastChild.cloneNode(true);
            hamburger.insertBefore(newHamburger, hamburger.firstChild);
            lastChild.remove();
        }

    }
    // originalNav = newNav;
    
    // hamburgerButton = document.getElementById("hamburgerButton");
    // if (hamburgerButton) {
    //     hamburgerButton.addEventListener('click')
    // }


}

const hamburgerExists = (nav) => {
    return document.getElementById('hamburger');
}

const createHamburger = (navigation) => {
    let hamburger = document.createElement('li');

    let hamburgerButton = document.createElement('div');
    hamburgerButton.id = "hamburgerButton";

    let hamburgerIcon = document.createElement('i')
    hamburgerIcon.classList.add("fas");
    hamburgerIcon.classList.add("fa-bars");
    hamburgerButton.appendChild(hamburgerIcon);

    hamburgerButton.addEventListener('click', (e) => {
        let ham = document.getElementById("hamburger");
        if (ham.classList.contains("show")) {
            ham.classList.remove("show");
        } else {
            ham.classList.add("show");
        }
    })

    let hamburgerList = document.createElement('ul');
    hamburgerList.id = "hamburger";
    hamburger.classList.add("hamburgerWrapper");
    hamburger.appendChild(hamburgerButton);
    hamburger.appendChild(hamburgerList);
    navigation.appendChild(hamburger);
}

const originalNav = onLoadStoreNav();

handleResize();
setTimeout(() => handleResize(), 5);


window.addEventListener('resize', handleResize);



const onLoadStoreNav = () => {
    nav = document.getElementById("dynamic_nav");
    return nav.cloneNode(true);
}

const handleResize = (e) => {
    let oldNav = document.getElementById("dynamic_nav");
    let parent = oldNav.parentElement;
    let newNav = buildNav(navObj);
    parent.appendChild(newNav);

    for (let index = 0; index < parent.children.length; index++) {
        if (parent.children[index] != newNav) {
            parent.children[index].remove();
        }
    }

    

    let navBox = newNav.getBoundingClientRect();

    console.log(`Before - NavBox Right Edge: ${navBox.right} Width Of Page: ${document.documentElement.clientWidth}`)
    if (navBox.right > document.documentElement.clientWidth) {
        let hamburger = createHamburger(newNav);

        while (newNav.getBoundingClientRect().right > document.documentElement.clientWidth) {
            let lastLink = newNav.lastChild.previousSibling;

            let newHamburgerLink = lastLink.cloneNode(true);
            hamburger.insertBefore(newHamburgerLink, hamburger.firstChild);
            lastLink.remove();
            //console.log(`NavBox Right Edge: ${navBox.right} Width Of Page: ${document.documentElement.clientWidth}`)
        }
        console.log(`After - NavBox Right Edge: ${newNav.getBoundingClientRect().right} Width Of Page: ${document.documentElement.clientWidth}`)

    }
}

const calculateInnerWidth = () => {
    return window.innerWidth && document.documentElement.clientWidth ?
        Math.min(window.innerWidth, document.documentElement.clientWidth) :
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.getElementsByTagName('body')[0].clientWidth;
}

const moveLinkToHamburger = (nav, hamburger) => {
    let lastLink = nav.lastChild.previousSibling;
    let newHamburgerLink = lastLink.cloneNode(true);
    hamburger.insertBefore(newHamburgerLink, hamburger.firstChild);
    lastLink.remove();
}

const hamburgerExists = (nav) => {
    return document.getElementById('hamburger');
}

const createHamburger = (navigation) => {
    let hamburger = document.createElement('li');

    let hamburgerButton = document.createElement('button');
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
    return hamburgerList;
}

// Store the original nav to revert back to on each resize before calculating new nav.
let originalNav = null;
setTimeout(() => {
    originalNav = onLoadStoreNav();
}, 5)

const getClassList = (elem) => {
    let classList = elem.classList;
    let classArray = [];
    for (let i = 0; i < classList.length; i++) {
        classArray = [...classArray, classList[i]];
    }
    return classArray
}

const getChildren = (elem) => {
    let children = elem.children;
    let childArray = [];
    for (let i = 0; i < children.length; i++) {
        childArray = [...childArray, children[i]];
    }
    return childArray
}

const buildNavObject = (elem) => {
    if (!(elem.children.length > 0)) {
        return {
            tagName: elem.tagName,
            id: elem.id,
            classList: getClassList(elem),
            href: elem.href,
            innerHTML: elem.innerHTML,
            children: []
        }
    }

    let elemObj = {
        tagName: elem.tagName,
        id: elem.id,
        classList: getClassList(elem),
        children: []
    }

    let children = getChildren(elem);
    for (let i = 0; i < children.length; i++) {
        elemObj.children = [...elemObj.children, buildNavObject(children[i])]
    }

    return elemObj;
}

const buildNav = (navObj) => {
    let element = document.createElement(navObj.tagName);
    if (navObj.innerHTML) {
        element.innerHTML = navObj.innerHTML;
    }
    if (navObj.href) {
        element.href = navObj.href;
    }
    element.id = navObj.id;
    if (navObj.classList.length > 0) {
        for (let i = 0; i < navObj.classList.length; i++) {
            element.classList.add(navObj.classList[i])
        }
    }

    if (!navObj.children.length > 0) {
        return element;
    }

    for (let i = 0; i < navObj.children.length; i++) {
        element.appendChild(buildNav(navObj.children[i]));
    }
    return element;
}

let navObj = buildNavObject(document.getElementById('dynamic_nav'));



// called twice since there's a slight problem on the first calculation
setTimeout(() => handleResize(), 10);
setTimeout(() => handleResize(), 15);


window.addEventListener('resize', handleResize);


const handleResize = (e) => {

    // Grabs the current nav, and replaces it with the original nav
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

    if (areChildrenWrapped(newNav)) {
        let hamburger = createHamburger(newNav);

        while (areChildrenWrapped(newNav)) {
            moveLinkToHamburger(newNav, hamburger);
        }

        // The menu looks wierd with one item
        if (hamburger.children.length == 1) {
            moveLinkToHamburger(newNav, hamburger);
        }
    }

    setTimeout(() => showNav(), 30);
}

const moveLinkToHamburger = (nav, hamburger) => {
    let lastLink = nav.lastChild.previousSibling;
    let newHamburgerLink = lastLink.cloneNode(true);
    hamburger.insertBefore(newHamburgerLink, hamburger.firstChild);
    lastLink.remove();
}

const createHamburger = (navigation) => {
    // element that's added to the end of the current nav list
    let hamburger = document.createElement('li');
    hamburger.classList.add("hamburgerWrapper");

    // create button
    let hamburgerButton = document.createElement('button');
    hamburgerButton.id = "hamburgerButton";

    // create and append icon to button
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

    // the actual hamburger menu
    let hamburgerList = document.createElement('ul');
    hamburgerList.id = "hamburger";

    hamburger.appendChild(hamburgerButton);
    hamburger.appendChild(hamburgerList);

    navigation.appendChild(hamburger);
    return hamburgerList;
}

// Helper functions

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

const isChildWrapped = (currentChild) => {
    if (!currentChild.previousSibling) {
        return false;
    }
    let currentChildRect = currentChild.getBoundingClientRect();
    let prevChildRect = currentChild.previousSibling.getBoundingClientRect();
    if (currentChildRect.left < prevChildRect.right) {
        return true;
    }
    return false
}

const areChildrenWrapped = (nav) => {
    for (let i = 0; i < nav.children.length; i++) {
        const element = nav.children[i];
        if (isChildWrapped(element)) {
            return true
        }
    }
    return false;
}

const showNav = () => {
    let nav = document.getElementsByClassName('navigation');
    for (let i = 0; i < nav.length; i++) {
        const element = nav[i];
        if (!element.classList.contains("show")) {
            element.classList.add("show");
        }
    }
}

// End of Helper Functions

// Recursive function to construct an object full of element details.

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

// Recursive function to build the original nav element

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
navObj.classList = [...navObj.classList, "show"];


// initial nav calulation
handleResize();

//setTimeout(() => showNav(), 30);
window.addEventListener('resize', handleResize);

const hideHamburger = () => {
    let ham = document.getElementById("hamburger");
    if (ham.classList.contains("show")) {
        ham.classList.remove("show");
    }
}

const getParents = (elem) => {
    if (elem.tagName == "HTML") {
        return [elem];
    }
    return [elem.parentElement, ...getParents(elem.parentElement)]
}

const hasParent = (elem, parent) => {
    let parents = getParents(elem);
    for (let i = 0; i < parents.length; i++) {
        const item = parents[i];
        if (parent == item) {
            return true;
        }
    }
    return false;
}

const handleClick = (e) => {
    let hamburger = document.getElementsByClassName("hamburgerWrapper")[0];
    if (!hasParent(e.target, hamburger)) {
        hideHamburger();
    }
}

document.addEventListener('click', handleClick);


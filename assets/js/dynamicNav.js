/*

Detect which links to show in hamburger, which links to show in main nav.

Apply appropriate classes.

*/

let interval = null;

const isChildWrapped = (currentChild) => {
    if (!currentChild.previousSibling || currentChild.classList.contains("hide")) {
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

const handleResize = () => {
    let nav = document.getElementById("dynamic_nav");
    let hamburger = document.getElementById("hamburger");
    moveAllToNav(nav, hamburger);
    while (areChildrenWrapped(nav)) {
        moveOneToHamburger(nav, hamburger);
    }

}

const moveAllToNav = (nav, hamburger) => {

    document.getElementById("hamburgerButton").classList.add("hide");

    for (let i = 0; i < nav.children.length; i++) {
        const child = nav.children[i];
        if (child.classList.contains("hide")) {
            child.classList.remove("hide");
        }
    }

    for (let i = 0; i < hamburger.children.length; i++) {
        const child = hamburger.children[i];
        if (!child.classList.contains("hide")) {
            child.classList.add("hide");
        }
    }
}

const moveOneToHamburger = (nav, hamburger) => {
    const button = document.getElementById("hamburgerButton");
    if (button.classList.contains("hide")) {
        button.classList.remove("hide");
    }
    for (let i = nav.children.length - 1; i >= 0; i--) {
        const child = nav.children[i];
        if (!child.classList.contains("hide")) {
            child.classList.add("hide");
            break;
        }
    }

    for (let i = hamburger.children.length - 1; i >= 0; i--) {
        const child = hamburger.children[i];
        if (child.classList.contains("hide")) {
            child.classList.remove("hide");
            break;
        }
    }
}

const hideHamburger = () => {
    let ham = document.getElementById("hamburger");
    if (!ham) {
        return;
    }
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

const hasChildLinks = (navItem) => {
    let navItemNode;
    if (navItem.tagName == "A") {
        navItemNode = navItem.parentElement;
    } else {
        navItemNode = navItem;
    }
    for (let i = 0; i < navItemNode.children.length; i++) {
        const child = navItemNode.children[i];
        if (child.tagName == "UL") {
            return true;
        }
    }
    return false;
}

const getChildLinks = (navItem) => {
    let navItemNode;
    if (navItem.tagName == "A") {
        navItemNode = navItem.parentElement;
    } else {
        navItemNode = navItem;
    }
    for (let i = 0; i < navItemNode.children.length; i++) {
        const child = navItemNode.children[i];
        if (child.tagName == "UL") {
            return child;
        }
    }
    return null;
}

const handleMouseOver = (e) => {
    if (hasChildLinks(e.target)) {
        const childLinksWrapper = getChildLinks(e.target);
        let element = e.target;
        if (element.tagName == "A") {
            element = element.parentElement;
        }
        const linkBox = element.getBoundingClientRect();
        const height = linkBox.bottom - linkBox.top;
        childLinksWrapper.style.top = `${height}px`;
        childLinksWrapper.classList.add("show");
    }
}

const handleMouseLeave = (e) => {
    for (let i = 0; i < e.target.children.length; i++) {
        const child = e.target.children[i];
        if (child.tagName == "UL") {
            child.classList.remove("show");
        }
        
    }
}

let dynamic_nav = document.getElementById("dynamic_nav");
if (dynamic_nav) {
    window.onload = () => {
        handleResize()
        document.getElementsByClassName("navigation")[0].classList.add("show");
    };

    window.addEventListener("resize", handleResize);

    document.addEventListener('click', handleClick);
    

    for (let i = 0; i < dynamic_nav.children.length; i++) {
        const child = dynamic_nav.children[i];
        child.addEventListener("mouseover", handleMouseOver);
        child.addEventListener("mouseleave", handleMouseLeave);
    }

    let hamburgerButton = document.getElementById("hamburgerButton");
    document.getElementById("hamburgerButton").addEventListener('click', (e) => {
        let ham = document.getElementById("hamburger");
        if (ham.classList.contains("show")) {
            ham.classList.remove("show");
        } else {
            ham.classList.add("show");
        }
    })


}
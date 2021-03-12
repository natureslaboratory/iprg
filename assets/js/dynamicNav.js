/*

Detect which links to show in hamburger, which links to show in main nav.

Apply appropriate classes.

*/

let interval = null;

// const isChildWrapped = (currentChild) => {
//     if (!currentChild.previousSibling || currentChild.classList.contains("hide")) {
//         return false;
//     }
//     let currentChildRect = currentChild.getBoundingClientRect();
//     let prevChildRect = currentChild.previousSibling.getBoundingClientRect();
//     if (currentChildRect.left < prevChildRect.right) {
//         return true;
//     }
//     return false
// }

// const areChildrenWrapped = (nav) => {
//     for (let i = 0; i < nav.children.length; i++) {
//         const element = nav.children[i];
//         if (isChildWrapped(element)) {
//             return true
//         }
//     }
//     return false;
// }

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
    let total = 0;
    let navigationRect = document.getElementsByClassName("navigation")[0].getBoundingClientRect();
    let navWidth = navigationRect.right - navigationRect.left;
    for (let i = 0; i < nav.children.length; i++) {
        const childRect = nav.children[i].getBoundingClientRect();
        total += childRect.right - childRect.left;
    }
    if (total > navWidth - 50) {
        return true;
    }
    return false;
}

const handleResize = () => {
    let nav = document.getElementById("dynamic_nav");
    let hamburger = document.getElementById("hamburger");
    if (document.documentElement.clientWidth <= 768) {
        moveAllToHamburger(nav, hamburger);
        formatForMobile(hamburger);
        return;
    }
    else {
        moveAllToNav(nav, hamburger);
        formatForDesktop(hamburger);
        while (areChildrenWrapped(nav)) {
            moveOneToHamburger(nav, hamburger);
        }
    }

}

const formatForMobile = (hamburger) => {
    hamburger.classList.add("mobile");
    for (let i = 0; i < hamburger.children.length; i++) {
        const link = hamburger.children[i];
        const icons = findIcons(link);
        if (icons.length > 0) {
            icons.forEach(icon => {
                if (icon.classList.contains("mobile") && icon.classList.contains("hide")) {
                    icon.classList.remove("hide");
                }
                if (!icon.classList.contains("mobile")) {
                    icon.classList.add("hide");
                }
            });
        }


    }
}

const formatForDesktop = (hamburger) => {
    hamburger.classList.remove("mobile");
    for (let i = 0; i < hamburger.children.length; i++) {
        const link = hamburger.children[i];
        const icons = findIcons(link);
        if (icons.length > 0) {
            icons.forEach(icon => {
                if (icon.classList.contains("mobile")) {
                    icon.classList.add("hide");
                }
                if (!icon.classList.contains("mobile") && icon.classList.contains("hide")) {
                    icon.classList.remove("hide");
                }
            });
        }
    }
}

const findIcons = (node) => {
    if (node.tagName == "I") {
        return [node];
    }

    let icons = [];
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        icons = [...icons, ...findIcons(child)];
    }

    return icons;
}

const moveAllToHamburger = (nav, hamburger) => {
    for (let i = 0; i < nav.children.length; i++) {
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
    for (let i = nav.children.length - 1; i > -1; i--) {
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

const handleMouseOverNav = (e) => {
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

const handleMouseLeaveNav = (e) => {
    for (let i = 0; i < e.target.children.length; i++) {
        const child = e.target.children[i];
        if (child.tagName == "UL") {
            child.classList.remove("show");
        }
    }
}

const handleMouseOverHamburger = (e) => {
    const hamburger = document.getElementById("hamburger");
    if (hasChildLinks(e.target)) {
        const childLinksWrapper = getChildLinks(e.target);
        let element = e.target;
        if (element.tagName == "A") {
            element = element.parentElement;
        }
        const linkBox = element.getBoundingClientRect();

        if (!hamburger.classList.contains("mobile")) {
            const width = linkBox.right - linkBox.left;
            childLinksWrapper.style.right = `${width}px`;
            childLinksWrapper.classList.add("show");
        }
    }
}

const handleMouseLeaveHamburger = (e) => {
    for (let i = 0; i < e.target.children.length; i++) {
        const child = e.target.children[i];
        if (child.tagName == "UL") {
            child.classList.remove("show");
            child.style.right = "0px";
        }
    }
}

const handleHamburgerExpand = (e) => {
    let listItem = e.target;
    if (e.target.tagName == "I") {
        listItem = e.target.parentElement;
    }
    const icons = findIcons(listItem);
    let mobileIcon;
    for (let j = 0; j < icons.length; j++) {
        const icon = icons[j];
        if (icon.classList.contains("mobile")) {
            mobileIcon = icon;
        }
    }

    for (let i = 0; i < listItem.children.length; i++) {
        const child = listItem.children[i];

        if (child.tagName == "UL") {
            if (child.style.maxHeight) {
                mobileIcon.classList.remove("spin");
                child.style.maxHeight = null;
            } else {
                mobileIcon.classList.add("spin");
                child.style.maxHeight = child.scrollHeight + "px";
            }
        }

        
        
    }
}

const attachIconListeners = () => {
    let hamburger = document.getElementById("hamburger");
    for (let i = 0; i < hamburger.children.length; i++) {
        const link = hamburger.children[i];
        let icons = findIcons(link);
        icons.forEach(icon => {
            if (icon.classList.contains("mobile")) {
                icon.addEventListener("click", handleHamburgerExpand)
            }
        })
        
    }
}

let dynamic_nav = document.getElementById("dynamic_nav");
let hamburger = document.getElementById("hamburger");
if (dynamic_nav) {
    window.onload = () => {
        handleResize()
        setTimeout(() => {
            document.getElementsByClassName("navigation")[0].classList.add("show");
        }, 20)
    };

    window.addEventListener("resize", handleResize);
    //document.getElementsByClassName("navigation")[0].classList.add("show");

    document.addEventListener('click', handleClick);


    for (let i = 0; i < dynamic_nav.children.length; i++) {
        const child = dynamic_nav.children[i];
        child.addEventListener("mouseover", handleMouseOverNav);
        child.addEventListener("mouseleave", handleMouseLeaveNav);
    }

    for (let i = 0; i < hamburger.children.length; i++) {
        const child = hamburger.children[i];
        child.addEventListener("mouseover", handleMouseOverHamburger);
        child.addEventListener("mouseleave", handleMouseLeaveHamburger);
    }

    attachIconListeners();

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
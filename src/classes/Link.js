import Icon from './Icon';

class Link {
    node; // HTMLElement
    labelMappings = {};

    constructor(link, labelMappings = {}) {
        this.node = link;
        this.labelMappings = labelMappings;
        this.hide = this.hide.bind(this)
        this.show = this.show.bind(this)
        this.isHidden = this.isHidden.bind(this)
    }

    // Public Null
    hide() {
        if (!this.node.classList.contains("hide")) {
            this.node.classList.add("hide");
        }
    }

    // Public Null
    show() {
        if (this.node.classList.contains("hide")) {
            this.node.classList.remove("hide");
        }
    }

    // Public Bool
    isHidden() {
        if (this.node.classList.contains("hide")) {
            return true;
        }
        return false;
    }
}

export class TopNavLink extends Link {
    link; // HTMLElement
    hasChildren = false; // Bool
    icon; // Icon
    childLinksNode; // HTMLElement
    childLinks = []; // Array<HTMLElement>

    // Public Int
    get width() {
        const linkRect = this.node.getBoundingClientRect();
        return linkRect.right - linkRect.left;
    }

    constructor(link, labelMappings = {}) {
        super(link, labelMappings);
        for (let i = 0; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            // child is HTMLElement

            if (child.classList.contains("navLink")) {
                this.link = child;
            } else if (child.classList.contains("navChildItems")) {
                this.childLinksNode = child;
                this.hasChildren = true;
            } else if (child.classList.contains("linkIcon")) {
                this.icon = new Icon(child);
            }
        }

        if (this.hasChildren) {
            for (let i = 0; i < this.childLinksNode.children.length; i++) {
                const link = this.childLinksNode.children[i];
                this.childLinks = [...this.childLinks, link];
            }
        }

        // create new li in .navChildItems at beginning of list
        // append a element from topNav to new li
        // append new div to original .navItem

        if (this.hasChildren) {
            // this.formatLink();
        }
    }

    formatLink() {
        let mainLinkInnerHtml = this.link.innerHTML.trim();
        let label = "Label";
        for (const title in this.labelMappings) {
            if (Object.hasOwnProperty.call(this.labelMappings, title)) {
                if (title == mainLinkInnerHtml) {
                    label = this.labelMappings[title];
                }
            }
        }
        const newNavChildItem = document.createElement("LI");
        newNavChildItem.classList.add("navChildItem");
        this.childLinksNode.prepend(newNavChildItem);
        newNavChildItem.appendChild(this.link);

        const newLabel = document.createElement("DIV");
        newLabel.innerHTML = label;
        newLabel.classList.add("navLink");
        newLabel.classList.add("navLabel");
        this.node.prepend(newLabel);
    }

    toggle() {
        if (this.childLinksNode.classList.contains("hide")) {
            this.open();
        } else {
            this.close();
        }
    }

    open() {
        const linkBox = this.node.getBoundingClientRect();
        const height = linkBox.bottom - linkBox.top;
        this.childLinksNode.style.top = `${height}px`;
        this.childLinksNode.classList.remove("hide");
        this.node.classList.add("open");
    }

    close() {
        if (this.childLinksNode) {
            this.childLinksNode.classList.add("hide");
            this.node.classList.remove("open");
        }
    }

}

export class HamburgerNavLink extends Link {
    link; // HTMLElement
    hasChildren = false; // Bool
    desktopIcon; // Icon
    mobileIcon; // Icon
    childLinksNode; // HTMLElement
    childLinks = []; // Array<HTMLElement>

    get isMenuOpen() {
        if (this.childLinksNode.style.maxHeight) {
            return true;
        }
        return false;
    }

    constructor(link) {
        super(link);
        for (let i = 0; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            if (child.classList.contains("hamburgerLink")) {
                this.link = child;
                for (let j = 0; j < child.children.length; j++) {
                    const subChild = child.children[j];
                    if (subChild.classList.contains("linkIcon")) {
                        this.hasChildren = true;
                        this.desktopIcon = new Icon(subChild);
                    }
                }
            } else if (child.classList.contains("hamburgerChildItems")) {
                this.childLinksNode = child;
            } else if (child.classList.contains("linkIcon")) {
                this.mobileIcon = new Icon(child);
                this.mobileIcon.hide()
            }
        }

        if (this.hasChildren) {
            for (let i = 0; i < this.childLinksNode.children.length; i++) {
                const link = this.childLinksNode.children[i];
                this.childLinks = [...this.childLinks, link];
            }
        }
    }

    toggle() {
        if (this.isMenuOpen) {
            // this.mobileIcon.node.classList.remove("spin");
            this.close();
        } else {
            // this.mobileIcon.node.classList.add("spin");
            this.open();
        }
    }

    close() {
        if (this.childLinksNode) {
            this.childLinksNode.style.maxHeight = null;
        }
    }

    open() {
        if (this.childLinksNode) {
            this.childLinksNode.style.maxHeight = this.childLinksNode.scrollHeight + "px";
        }
    }
}
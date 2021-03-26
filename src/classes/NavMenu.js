import {HamburgerNavLink, TopNavLink} from './Link';

class NavMenu {
    node; // HTMLElement
    links = []; // Array<Link>
    labelMappings = {};
    constructor(menu, labelMappings = {}) {
        this.node = menu;
        this.labelMappings = labelMappings;
        this.hideAll = this.hideAll.bind(this)
        this.showAll = this.showAll.bind(this)
    }

    // Public Null
    hideAll() {
        this.links.forEach(link => link.hide());
    }

    // Public Null
    showAll() {
        this.links.forEach(link => link.show());
    }
}

export class Hamburger extends NavMenu {

    // Public Bool
    get isMobile() {
        if (this.node.classList.contains("mobile")) {
            return true;
        }
        return false;
    }

    // Public Bool
    get isHidden() {
        if (this.node.classList.contains("hide")) {
            return true;
        }
        return false;
    }

    constructor(menu) {
        super(menu);
        for (let i = 0; i < this.node.children.length; i++) {
            const link = this.node.children[i];
            let newLink = new HamburgerNavLink(link);
            this.links = [...this.links, newLink];
        }

        this.addEventListeners();

        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
        this.toMobile = this.toMobile.bind(this)
        this.toDesktop = this.toDesktop.bind(this)
        this.showOne = this.showOne.bind(this);
    }

    // Public Null
    show() {
        this.node.classList.remove("hide");
    }

    // Public Null
    hide() {
        this.node.classList.add("hide");
        setTimeout(() => {
            this.closeAllMenus();
        }, 150);
            
    }

    // Public Null
    toMobile() {
        this.node.classList.add("mobile");
        this.links.forEach(link => {
            if (link.desktopIcon) {
                link.desktopIcon.hide()
            }
            if (link.mobileIcon) {
                link.mobileIcon.show()
            }
        })
    }

    // Public Null
    toDesktop() {
        this.node.classList.remove("mobile");
        this.links.forEach(link => {
            if (link.desktopIcon) {
                link.desktopIcon.show()
            }
            if (link.mobileIcon) {
                link.mobileIcon.hide()
            }
        })
    }

    // Public Null
    showOne() {
        for (let i = this.links.length - 1; i >= 0; i--) {
            const link = this.links[i];
            if (link.isHidden()) {
                link.show()
                break;
            }
        }
    }

    handleLinks(link) {
        console.log(link.isMenuOpen)
        if (!link.isMenuOpen) {
            this.closeAllMenus();
            link.open();
        } else {
            link.close();
        }
    }
    
    addEventListeners() {
        this.links.forEach(link => {
            if (link.hasChildren) {
                link.node.addEventListener("click", () => {
                    console.log("click");
                    this.handleLinks(link);
                })
            }
        })
    }

    closeAllMenus() {
        this.links.forEach(link => {
            link.close();
        })
    }


}

export class TopNav extends NavMenu {

    // Public Int
    get totalWidth() {
        let width = 0;
        this.links.forEach(link => {
            width += link.width;
        });
        return width;
    }

    constructor(menu, labelMappings = {}) {
        super(menu, labelMappings)
        for (let i = 0; i < this.node.children.length; i++) {
            const link = this.node.children[i];
            let newLink = new TopNavLink(link, this.labelMappings, this.closeAllMenus);
            this.links = [...this.links, newLink];
        }

        this.hideOne = this.hideOne.bind(this);
        this.closeAllMenus = this.closeAllMenus.bind(this);
        this.addEventListeners();

    }

    // Public Null
    hideOne() {
        for (let i = this.links.length - 1; i >= 0; i--) {
            const link = this.links[i];
            if (!link.isHidden()) {
                link.hide()
                break;
            }
        }
    }

    handleLinks(link) {
        if (link.childLinksNode.classList.contains("hide")) {
            this.closeAllMenus();
            link.open();
        } else {
            link.close();
        }
    }
    
    addEventListeners() {
        this.links.forEach(link => {
            if (link.hasChildren) {
                link.node.addEventListener("click", () => {
                    this.handleLinks(link);
                })
            }
        })
    }

    closeAllMenus() {
        this.links.forEach(link => {
            link.close();
        })
    }
}
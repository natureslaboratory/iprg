/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/previewImage.js":
/*!*****************************!*\
  !*** ./src/previewImage.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "implementPreviewImage": () => (/* binding */ implementPreviewImage)
/* harmony export */ });
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

const implementPreviewImage = () => {
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



/***/ }),

/***/ "./src/wordCounter.js":
/*!****************************!*\
  !*** ./src/wordCounter.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "implementWordCount": () => (/* binding */ implementWordCount)
/* harmony export */ });
// Helper functions

const getMaxWordCount = (element) => {
    let classList = element.classList;
    for (let index = 0; index < classList.length; index++) {
        if (classList[index].includes("cw-")) {
            return parseInt(classList[index].split("-")[1]);
        }
    }

    return 500;
}

const convertStringToArray = (str) => {
    return str.split(" ");
}

const sanitiseArray = (strArray) => {
    return strArray.filter(d => d != "");
}

const getCleanStringArray = (str) => {
    const strArray = convertStringToArray(str);
    return sanitiseArray(strArray);
}

const isStringWithinWordCount = (str, maxCount) => {
    const cleanStrArray = getCleanStringArray(str);
    let count = cleanStrArray.length;
    return count <= maxCount;
}

const getCountElement = (counterWrapper) => {
    const children = counterWrapper.children;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.classList.contains("count")) {
            return child;
        }
    }
}

const trimStringToMaxCount = (str, maxCount) => {
    const cleanStrArray = getCleanStringArray(strArray);
    const trimmedStrArray = cleanStrArray.slice(0, maxCount);
    const newStr = trimmedStrArray.join(" ");
    return newStr;
}

const createCounter = (maxCount) => {
    let counterWrapper = document.createElement("p");
    counterWrapper.innerHTML = `Word Count: <span class="count">0</span>/<span>${maxCount}</span>`;
    return counterWrapper
}

const insertCounter = (wordsCounted, counterWrapper) => {
    wordsCounted.parentNode.insertBefore(counterWrapper, wordsCounted.nextSibling);
}

// End of helper functions


const updateWordCount = (e, counterWrapper) => {
    let count = 0;
    let maxCount = getMaxWordCount(e.target);

    if (isStringWithinWordCount(e.target.value, maxCount)) {
        count = getCleanStringArray(e.target.value).length;
    } else {
        e.target.value = trimStringToMaxCount(e.target.value, maxCount);
        count = maxCount;
    }

    let countElement = getCountElement(counterWrapper);
    countElement.innerHTML = count;
}

const implementWordCount = () => {
    let wordCountElements = document.getElementsByClassName("countWords");
    
    for (let index = 0; index < wordCountElements.length; index++) {
        const wordsCounted = wordCountElements[index];
        if (wordsCounted.tagName != "TEXTAREA") {
            continue;
        }

        let maxCount = getMaxWordCount(wordsCounted);
        let counterWrapper = createCounter(maxCount);
        insertCounter(wordsCounted, counterWrapper);
        
        wordsCounted.addEventListener('input', (e) => updateWordCount(e, counterWrapper));
    }
}

/***/ }),

/***/ "./src/classes/Icon.ts":
/*!*****************************!*\
  !*** ./src/classes/Icon.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Icon = /** @class */ (function () {
    function Icon(icon) {
        this.node = icon;
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }
    // Public Null
    Icon.prototype.show = function () {
        if (this.node.classList.contains("hide")) {
            this.node.classList.remove("hide");
        }
    };
    // Public Null
    Icon.prototype.hide = function () {
        if (!this.node.classList.contains("hide")) {
            this.node.classList.add("hide");
        }
    };
    return Icon;
}());
exports.default = Icon;


/***/ }),

/***/ "./src/classes/Link.ts":
/*!*****************************!*\
  !*** ./src/classes/Link.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HamburgerNavLink = exports.TopNavLink = void 0;
var Icon_1 = __importDefault(__webpack_require__(/*! ./Icon */ "./src/classes/Icon.ts"));
var Link = /** @class */ (function () {
    function Link(link, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        this.labelMappings = {};
        this.node = link;
        this.labelMappings = labelMappings;
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.isHidden = this.isHidden.bind(this);
    }
    // Public Null
    Link.prototype.hide = function () {
        if (!this.node.classList.contains("hide")) {
            this.node.classList.add("hide");
        }
    };
    // Public Null
    Link.prototype.show = function () {
        if (this.node.classList.contains("hide")) {
            this.node.classList.remove("hide");
        }
    };
    // Public Bool
    Link.prototype.isHidden = function () {
        if (this.node.classList.contains("hide")) {
            return true;
        }
        return false;
    };
    return Link;
}());
var TopNavLink = /** @class */ (function (_super) {
    __extends(TopNavLink, _super);
    function TopNavLink(link, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        var _this = _super.call(this, link, labelMappings) || this;
        _this.hasChildren = false; // Bool
        _this.childLinks = []; // Array<HTMLElement>
        for (var i = 0; i < _this.node.children.length; i++) {
            var child = _this.node.children[i];
            // child is HTMLElement
            if (child.classList.contains("navLink")) {
                _this.link = child;
            }
            else if (child.classList.contains("navChildItems")) {
                _this.childLinksNode = child;
                _this.hasChildren = true;
            }
            else if (child.classList.contains("linkIcon")) {
                _this.icon = new Icon_1.default(child);
            }
        }
        if (_this.hasChildren) {
            for (var i = 0; i < _this.childLinksNode.children.length; i++) {
                var link_1 = _this.childLinksNode.children[i];
                _this.childLinks = __spreadArray(__spreadArray([], __read(_this.childLinks)), [link_1]);
            }
        }
        // create new li in .navChildItems at beginning of list
        // append a element from topNav to new li
        // append new div to original .navItem
        if (_this.hasChildren) {
            // this.formatLink();
        }
        return _this;
    }
    Object.defineProperty(TopNavLink.prototype, "width", {
        // Public Int
        get: function () {
            var linkRect = this.node.getBoundingClientRect();
            return linkRect.right - linkRect.left;
        },
        enumerable: false,
        configurable: true
    });
    TopNavLink.prototype.formatLink = function () {
        var mainLinkInnerHtml = this.link.innerHTML.trim();
        var label = "Label";
        for (var title in this.labelMappings) {
            if (Object.hasOwnProperty.call(this.labelMappings, title)) {
                if (title == mainLinkInnerHtml) {
                    label = this.labelMappings[title];
                }
            }
        }
        var newNavChildItem = document.createElement("LI");
        newNavChildItem.classList.add("navChildItem");
        this.childLinksNode.prepend(newNavChildItem);
        newNavChildItem.appendChild(this.link);
        var newLabel = document.createElement("DIV");
        newLabel.innerHTML = label;
        newLabel.classList.add("navLink");
        newLabel.classList.add("navLabel");
        this.node.prepend(newLabel);
    };
    TopNavLink.prototype.toggle = function () {
        if (this.childLinksNode.classList.contains("hide")) {
            this.open();
        }
        else {
            this.close();
        }
    };
    TopNavLink.prototype.open = function () {
        var linkBox = this.node.getBoundingClientRect();
        var height = linkBox.bottom - linkBox.top;
        this.childLinksNode.style.top = height + "px";
        this.childLinksNode.classList.remove("hide");
        this.node.classList.add("open");
    };
    TopNavLink.prototype.close = function () {
        if (this.childLinksNode) {
            this.childLinksNode.classList.add("hide");
            this.node.classList.remove("open");
        }
    };
    return TopNavLink;
}(Link));
exports.TopNavLink = TopNavLink;
var HamburgerNavLink = /** @class */ (function (_super) {
    __extends(HamburgerNavLink, _super);
    function HamburgerNavLink(link) {
        var _this = _super.call(this, link) || this;
        _this.hasChildren = false; // Bool
        _this.childLinks = []; // Array<HTMLElement>
        for (var i = 0; i < _this.node.children.length; i++) {
            var child = _this.node.children[i];
            if (child.classList.contains("hamburgerLink")) {
                _this.link = child;
                for (var j = 0; j < child.children.length; j++) {
                    var subChild = child.children[j];
                    if (subChild.classList.contains("linkIcon")) {
                        _this.hasChildren = true;
                        _this.desktopIcon = new Icon_1.default(subChild);
                    }
                }
            }
            else if (child.classList.contains("hamburgerChildItems")) {
                _this.childLinksNode = child;
            }
            else if (child.classList.contains("linkIcon")) {
                _this.mobileIcon = new Icon_1.default(child);
                _this.mobileIcon.hide();
            }
        }
        if (_this.hasChildren) {
            for (var i = 0; i < _this.childLinksNode.children.length; i++) {
                var link_2 = _this.childLinksNode.children[i];
                _this.childLinks = __spreadArray(__spreadArray([], __read(_this.childLinks)), [link_2]);
            }
        }
        return _this;
    }
    Object.defineProperty(HamburgerNavLink.prototype, "isMenuOpen", {
        get: function () {
            if (this.childLinksNode.style.maxHeight) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    HamburgerNavLink.prototype.toggle = function () {
        if (this.isMenuOpen) {
            // this.mobileIcon.node.classList.remove("spin");
            this.close();
        }
        else {
            // this.mobileIcon.node.classList.add("spin");
            this.open();
        }
    };
    HamburgerNavLink.prototype.close = function () {
        if (this.childLinksNode) {
            this.childLinksNode.style.maxHeight = null;
        }
    };
    HamburgerNavLink.prototype.open = function () {
        if (this.childLinksNode) {
            this.childLinksNode.style.maxHeight = this.childLinksNode.scrollHeight + "px";
        }
    };
    return HamburgerNavLink;
}(Link));
exports.HamburgerNavLink = HamburgerNavLink;


/***/ }),

/***/ "./src/classes/NavMenu.ts":
/*!********************************!*\
  !*** ./src/classes/NavMenu.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TopNav = exports.Hamburger = void 0;
var Link_1 = __webpack_require__(/*! ./Link */ "./src/classes/Link.ts");
var NavMenu = /** @class */ (function () {
    function NavMenu(menu, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        this.links = []; // Array<Link>
        this.labelMappings = {};
        this.node = menu;
        this.labelMappings = labelMappings;
        this.hideAll = this.hideAll.bind(this);
        this.showAll = this.showAll.bind(this);
    }
    // Public Null
    NavMenu.prototype.hideAll = function () {
        this.links.forEach(function (link) { return link.hide(); });
    };
    // Public Null
    NavMenu.prototype.showAll = function () {
        this.links.forEach(function (link) { return link.show(); });
    };
    return NavMenu;
}());
var Hamburger = /** @class */ (function (_super) {
    __extends(Hamburger, _super);
    function Hamburger(menu) {
        var _this = _super.call(this, menu) || this;
        for (var i = 0; i < _this.node.children.length; i++) {
            var link = _this.node.children[i];
            var newLink = new Link_1.HamburgerNavLink(link);
            _this.links = __spreadArray(__spreadArray([], __read(_this.links)), [newLink]);
        }
        _this.addEventListeners();
        _this.show = _this.show.bind(_this);
        _this.hide = _this.hide.bind(_this);
        _this.toMobile = _this.toMobile.bind(_this);
        _this.toDesktop = _this.toDesktop.bind(_this);
        _this.showOne = _this.showOne.bind(_this);
        return _this;
    }
    Object.defineProperty(Hamburger.prototype, "isMobile", {
        // Public Bool
        get: function () {
            if (this.node.classList.contains("mobile")) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hamburger.prototype, "isHidden", {
        // Public Bool
        get: function () {
            if (this.node.classList.contains("hide")) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    // Public Null
    Hamburger.prototype.show = function () {
        this.node.classList.remove("hide");
    };
    // Public Null
    Hamburger.prototype.hide = function () {
        var _this = this;
        this.node.classList.add("hide");
        setTimeout(function () {
            _this.closeAllMenus();
        }, 150);
    };
    // Public Null
    Hamburger.prototype.toMobile = function () {
        this.node.classList.add("mobile");
        this.links.forEach(function (link) {
            if (link.desktopIcon) {
                link.desktopIcon.hide();
            }
            if (link.mobileIcon) {
                link.mobileIcon.show();
            }
        });
    };
    // Public Null
    Hamburger.prototype.toDesktop = function () {
        this.node.classList.remove("mobile");
        this.links.forEach(function (link) {
            if (link.desktopIcon) {
                link.desktopIcon.show();
            }
            if (link.mobileIcon) {
                link.mobileIcon.hide();
            }
        });
    };
    // Public Null
    Hamburger.prototype.showOne = function () {
        for (var i = this.links.length - 1; i >= 0; i--) {
            var link = this.links[i];
            if (link.isHidden()) {
                link.show();
                break;
            }
        }
    };
    Hamburger.prototype.handleLinks = function (link) {
        console.log(link.isMenuOpen);
        if (!link.isMenuOpen) {
            this.closeAllMenus();
            link.open();
        }
        else {
            link.close();
        }
    };
    Hamburger.prototype.addEventListeners = function () {
        var _this = this;
        this.links.forEach(function (link) {
            if (link.hasChildren) {
                link.node.addEventListener("click", function () {
                    console.log("click");
                    _this.handleLinks(link);
                });
            }
        });
    };
    Hamburger.prototype.closeAllMenus = function () {
        this.links.forEach(function (link) {
            link.close();
        });
    };
    return Hamburger;
}(NavMenu));
exports.Hamburger = Hamburger;
var TopNav = /** @class */ (function (_super) {
    __extends(TopNav, _super);
    function TopNav(menu, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        var _this = _super.call(this, menu, labelMappings) || this;
        for (var i = 0; i < _this.node.children.length; i++) {
            var link = _this.node.children[i];
            var newLink = new Link_1.TopNavLink(link, _this.labelMappings);
            _this.links = __spreadArray(__spreadArray([], __read(_this.links)), [newLink]);
        }
        _this.hideOne = _this.hideOne.bind(_this);
        _this.closeAllMenus = _this.closeAllMenus.bind(_this);
        _this.addEventListeners();
        return _this;
    }
    Object.defineProperty(TopNav.prototype, "totalWidth", {
        // Public Int
        get: function () {
            var width = 0;
            this.links.forEach(function (link) {
                width += link.width;
            });
            return width;
        },
        enumerable: false,
        configurable: true
    });
    // Public Null
    TopNav.prototype.hideOne = function () {
        for (var i = this.links.length - 1; i >= 0; i--) {
            var link = this.links[i];
            if (!link.isHidden()) {
                link.hide();
                break;
            }
        }
    };
    TopNav.prototype.handleLinks = function (link) {
        if (link.childLinksNode.classList.contains("hide")) {
            this.closeAllMenus();
            link.open();
        }
        else {
            link.close();
        }
    };
    TopNav.prototype.addEventListeners = function () {
        var _this = this;
        this.links.forEach(function (link) {
            if (link.hasChildren) {
                link.node.addEventListener("click", function () {
                    _this.handleLinks(link);
                });
            }
        });
    };
    TopNav.prototype.closeAllMenus = function () {
        this.links.forEach(function (link) {
            link.close();
        });
    };
    return TopNav;
}(NavMenu));
exports.TopNav = TopNav;


/***/ }),

/***/ "./src/classes/Navigation.ts":
/*!***********************************!*\
  !*** ./src/classes/Navigation.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var NavMenu_1 = __webpack_require__(/*! ./NavMenu */ "./src/classes/NavMenu.ts");
var Navigation = /** @class */ (function () {
    function Navigation(nav, labelMapping) {
        if (labelMapping === void 0) { labelMapping = {}; }
        // HTMLElement nav
        this.getNavItems = this.getNavItems.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.moveAllToHamburger = this.moveAllToHamburger.bind(this);
        this.moveAllToNav = this.moveAllToNav.bind(this);
        this.moveOneToHamburger = this.moveOneToHamburger.bind(this);
        this.isNavWrapped = this.isNavWrapped.bind(this);
        this.handleMouseOverHamburger = this.handleMouseOverHamburger.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.labelMappings = labelMapping;
        this.fullNav = nav;
        this.getNavItems();
        this.addEventListeners();
    }
    // Private Null
    Navigation.prototype.getNavItems = function () {
        for (var i = 0; i < this.fullNav.children.length; i++) {
            var child = this.fullNav.children[i];
            // child is HTMLElement
            if (child.classList.contains("topNav")) {
                this.topNav = new NavMenu_1.TopNav(child, this.labelMappings);
            }
            else if (child.classList.contains("hamburgerWrapper")) {
                this.hamburgerWrapper = child;
            }
        }
        if (!this.topNav || !this.hamburgerWrapper) {
            throw new Error("Invalid Navigation Structure");
        }
        for (var i = 0; i < this.hamburgerWrapper.children.length; i++) {
            var child = this.hamburgerWrapper.children[i];
            // child is HTMLElement
            if (child.classList.contains("hamburgerButton")) {
                this.hamburgerButton = child;
            }
            else if (child.classList.contains("hamburger")) {
                this.hamburger = new NavMenu_1.Hamburger(child);
            }
        }
        if (!this.hamburgerButton || !this.hamburger) {
            throw new Error("Invalid Hamburger Navigation Structure");
        }
    };
    // Public Null
    Navigation.prototype.handleResize = function () {
        // for mobile
        if (document.documentElement.clientWidth <= 768) {
            this.moveAllToHamburger();
            // this.hamburger.toMobile();
        }
        // for desktop
        else {
            this.moveAllToNav();
            this.hamburger.toDesktop();
            while (this.isNavWrapped()) {
                this.moveOneToHamburger();
            }
        }
    };
    // Private Null
    Navigation.prototype.moveAllToHamburger = function () {
        this.hamburger.showAll();
        this.topNav.hideAll();
    };
    // Private Null
    Navigation.prototype.moveAllToNav = function () {
        this.hamburgerWrapper.classList.add("hide");
        this.hamburger.hideAll();
        this.topNav.showAll();
    };
    // Private Null
    Navigation.prototype.moveOneToHamburger = function () {
        this.hamburgerWrapper.classList.remove("hide");
        this.topNav.hideOne();
        this.hamburger.showOne();
    };
    // Private Bool
    Navigation.prototype.isNavWrapped = function () {
        var navigationRect = this.fullNav.getBoundingClientRect();
        var navWidth = navigationRect.right - navigationRect.left;
        var linksWidth = this.topNav.totalWidth;
        // 50 is icon width, refactor later to use actual icon width
        if (linksWidth > navWidth - 50) {
            return true;
        }
        return false;
    };
    // Private HTMLElement
    Navigation.prototype.getParentIfTagMatchesNode = function (node, excludedTag) {
        // HTMLElement node, String excludedTag
        if (node.tagName == excludedTag) {
            return node.parentElement;
        }
        else {
            return node;
        }
    };
    // Private Null
    Navigation.prototype.handleMouseOverHamburger = function (link) {
        // Link link
        if (link.hasChildren) {
            var linkBox = link.node.getBoundingClientRect();
            if (!this.hamburger.isMobile) {
                var width = linkBox.right - linkBox.left;
                link.childLinksNode.style.right = width + "px";
                link.childLinksNode.classList.remove("hide");
            }
        }
    };
    // Private Null
    Navigation.prototype.handleMouseLeaveHamburger = function (link) {
        // Link link
        if (link.hasChildren) {
            link.childLinksNode.style.right = "0px";
            link.childLinksNode.classList.add("hide");
        }
    };
    // Private Null
    Navigation.prototype.handleMouseOverNav = function (link) {
        // Link link
        if (link.hasChildren) {
            var linkBox = link.node.getBoundingClientRect();
            var height = linkBox.bottom - linkBox.top;
            link.childLinksNode.style.top = height + "px";
            link.childLinksNode.classList.remove("hide");
        }
    };
    // Private Null
    Navigation.prototype.handleMouseLeaveNav = function (link) {
        // Link link
        if (link.hasChildren) {
            link.childLinksNode.classList.add("hide");
        }
    };
    // Private Null
    Navigation.prototype.handleHamburgerButton = function () {
        // Hamburger hamburger
        if (this.hamburger.isHidden) {
            this.hamburger.show();
        }
        else {
            this.hamburger.hide();
        }
    };
    // Private Null
    Navigation.prototype.handleExpandSubMenuButton = function (link) {
        // Link link
        if (link.childLinksNode.style.maxHeight) {
            link.mobileIcon.node.classList.remove("spin");
            link.childLinksNode.style.maxHeight = null;
        }
        else {
            link.mobileIcon.node.classList.add("spin");
            link.childLinksNode.style.maxHeight = link.childLinksNode.scrollHeight + "px";
        }
    };
    Navigation.prototype.getParents = function (elem) {
        if (elem.tagName == "HTML") {
            return [elem];
        }
        return __spreadArray([elem.parentElement], __read(this.getParents(elem.parentElement)));
    };
    Navigation.prototype.hasParent = function (elem, parentElement) {
        var parents = this.getParents(elem);
        for (var i = 0; i < parents.length; i++) {
            var parent_1 = parents[i];
            if (parent_1 == parentElement) {
                return true;
            }
        }
        return false;
    };
    // Private Null
    Navigation.prototype.handlePageClick = function (e) {
        if (!this.hasParent(e.target, this.hamburgerWrapper)) {
            this.hamburger.hide();
        }
        if (!this.hasParent(e.target, this.topNav.node)) {
            this.topNav.closeAllMenus();
        }
    };
    // Private Null
    Navigation.prototype.show = function () {
        this.fullNav.classList.add("show");
    };
    // Private Null
    Navigation.prototype.addEventListeners = function () {
        var _this = this;
        this.hamburger.links.forEach(function (link) {
            // link.node.addEventListener("click", () => {
            //     this.handleMouseOverHamburger(link);
            // })
            // link.node.addEventListener("mouseleave", () => {
            //     this.handleMouseLeaveHamburger(link);
            // })
            // if (link.hasChildren) {
            //     link.mobileIcon.node.addEventListener("click", () => {
            //         this.handleExpandSubMenuButton(link);
            //     })
            // }
        });
        // this.topNav.links.forEach(link => {
        //     link.node.addEventListener("click", () => {
        //         this.handleMouseOverNav(link)
        //     })
        // link.node.addEventListener("mouseleave", () => {
        //     this.handleMouseLeaveNav(link)
        // })
        // })
        this.hamburgerButton.addEventListener("click", function (e) {
            _this.handleHamburgerButton();
        });
        window.addEventListener("click", function (e) {
            _this.handlePageClick(e);
        });
    };
    return Navigation;
}());
exports.default = Navigation;


/***/ }),

/***/ "./src/classes/Video.ts":
/*!******************************!*\
  !*** ./src/classes/Video.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Video = /** @class */ (function () {
    function Video(node, page) {
        console.log(node);
        this.node = node;
        this.page = page;
        this.getURL();
        this.getUrlDomain();
        this.getUrlSlug();
        this.createVideoDiv();
    }
    Video.prototype.getURL = function () {
        if (this.node.dataset.url) {
            this.url = this.node.dataset.url;
        }
        else {
            console.error("No URL");
            return;
        }
    };
    Video.prototype.getUrlDomain = function () {
        var _this = this;
        var domains = [
            "youtube.com",
            "vimeo.com"
        ];
        this.domain = domains.find(function (d) {
            return _this.url.includes(d);
        });
    };
    Video.prototype.getUrlSlug = function () {
        if (this.node.dataset.slug) {
            this.slug = this.node.dataset.slug;
        }
        else {
            console.error("No Slug");
        }
    };
    Video.prototype.formatVideoURL = function () {
        switch (this.domain) {
            case "youtube.com":
                var youtubeSplit = this.url.split("?v=");
                var youtubeVideoID = youtubeSplit[youtubeSplit.length - 1];
                return "https://youtube.com/embed/" + youtubeVideoID;
            case "vimeo.com":
                var urlSplit = this.url.split("/");
                var videoID = "";
                for (var i = urlSplit.length - 1; i >= 0; i--) {
                    var element = urlSplit[i];
                    if (element) {
                        videoID = element;
                        break;
                    }
                }
                return "https://player.vimeo.com/video/" + videoID;
            default:
                throw new Error("What");
        }
    };
    Video.prototype.getIFrame = function () {
        var url = this.formatVideoURL();
        switch (this.domain) {
            case "youtube.com":
                return ("<iframe \n                        src=" + url + "\n                        title=\"YouTube video player\" \n                        frameBorder=\"0\" \n                        allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" \n                        allowFullScreen>\n                    </iframe>");
            case "vimeo.com":
                return ("<iframe \n                        src=" + url + "\n                        frameBorder=\"0\" \n                        allow=\"autoplay; fullscreen; picture-in-picture\" \n                        allowFullScreen>\n                    </iframe>");
            default:
                console.error("Unknown video type");
        }
    };
    Video.prototype.createVideoDiv = function () {
        var iframe = this.getIFrame();
        var iframeWrapper = document.createElement("div");
        iframeWrapper.classList.value = "c-talk__video-wrapper";
        iframeWrapper.innerHTML = iframe;
        this.node.classList.value = "c-talk__video";
        this.node.style.display = "block";
        this.node.appendChild(iframeWrapper);
        var params = new URLSearchParams(window.location.search);
        if (!params.has("v")) {
            var link = document.createElement("a");
            link.classList.value = "c-talk__video-link";
            var linkSlug = this.page + "?v=" + this.slug;
            link.href = linkSlug;
            this.node.appendChild(link);
        }
    };
    return Video;
}());
exports.default = Video;


/***/ }),

/***/ "./src/dynamicNav.ts":
/*!***************************!*\
  !*** ./src/dynamicNav.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Navigation_1 = __importDefault(__webpack_require__(/*! ./classes/Navigation */ "./src/classes/Navigation.ts"));
var implementNav = function () {
    var navigationItems = document.getElementsByClassName("navigation");
    var navigationArray = [];
    for (var i = 0; i < navigationItems.length; i++) {
        var nav = navigationItems[i];
        var navigation = new Navigation_1.default(nav, { "Abstract Submission": "Abstract", "Scientific Committee": "Science" });
        navigationArray = __spreadArray(__spreadArray([], __read(navigationArray)), [navigation]);
    }
    if (navigationArray) {
        window.addEventListener("DOMContentLoaded", function () {
            navigationArray.forEach(function (nav) {
                nav.handleResize();
            });
            setTimeout(function () {
                navigationArray.forEach(function (nav) {
                    nav.show();
                });
            }, 20);
        });
        window.addEventListener("resize", function () {
            navigationArray.forEach(function (nav) {
                nav.handleResize();
            });
        });
    }
};
exports.default = implementNav;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var dynamicNav_1 = __importDefault(__webpack_require__(/*! ./dynamicNav */ "./src/dynamicNav.ts"));
var previewImage_1 = __webpack_require__(/*! ./previewImage */ "./src/previewImage.js");
var wordCounter_1 = __webpack_require__(/*! ./wordCounter */ "./src/wordCounter.js");
__webpack_require__(/*! ./videos */ "./src/videos.ts");
dynamicNav_1.default();
previewImage_1.implementPreviewImage();
wordCounter_1.implementWordCount();


/***/ }),

/***/ "./src/videos.ts":
/*!***********************!*\
  !*** ./src/videos.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Video_1 = __importDefault(__webpack_require__(/*! ./classes/Video */ "./src/classes/Video.ts"));
var videos = Array.from(document.getElementsByClassName("c-talk__URL"));
videos.forEach(function (v) {
    var relativePath = window.location.pathname;
    if (relativePath.includes("index.php")) {
        relativePath = relativePath.split("index.php")[0];
    }
    new Video_1.default(v, relativePath);
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map
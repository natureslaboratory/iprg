import Navigation from './classes/Navigation';

const implementNav = () => {
    let navigationItems = document.getElementsByClassName("navigation");
    let navigationArray = [];
    for (let i = 0; i < navigationItems.length; i++) {
        const nav = navigationItems[i];
        let navigation = new Navigation(nav, {"Abstract Submission": "Abstract", "Scientific Committee": "Science"});
        navigationArray = [...navigationArray, navigation];
    }
    if (navigationArray) {
        window.addEventListener("DOMContentLoaded", () => {
            navigationArray.forEach(nav => {
                nav.handleResize()
            })
            setTimeout(() => {
                navigationArray.forEach(nav => {
                    nav.show();
                })
            }, 20)
        })

        window.addEventListener("resize", () => {
            navigationArray.forEach(nav => {
                nav.handleResize();
            })
        });
    }
}

export default implementNav;
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");
let scrollY = 0;

function setMenuOpen(isOpen) {
    if (isOpen) {
        scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
        document.documentElement.classList.add("nav-open");
        document.body.classList.add("nav-open");
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        menu.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-label", "Close menu");
    } else {
        menu.classList.remove("is-open");
        document.documentElement.classList.remove("nav-open");
        document.body.classList.remove("nav-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
        toggle.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-label", "Open menu");
    }
}

if (toggle && menu) {
    toggle.addEventListener("click", () => {
        setMenuOpen(!menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", (event) => {
        if (event.target === menu) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu.classList.contains("is-open")) {
            setMenuOpen(false);
            toggle.focus();
        }
    });
}

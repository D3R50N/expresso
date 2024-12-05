let routerSignal = 0;
let currentPathName;

async function loadView(viewPath) {
    if (!viewPath.startsWith("/")) viewPath = "/" + viewPath;

    routerSignal = 1;
    const response = await fetch("/client-router" + viewPath);
    routerSignal = 0;
    if (response.ok)
        return response.text();

    return errorView(response.status)
}

const errorView = (code) => {
    return `<div id="router-content" class="router-error">
        <h1 class="code">${code}</h1>
        <p class="message">${code == 404 ? "Page not found" : "Something went wrong."}</p>
    </div>`
}

const loadingView = () => {
    return `<div id="router-content" class="router-load">
        <div class="loading"></div>
    </div>`
}


async function navigateTo(url,target) {
    if (!url || routerSignal || window.location.href == url) return;
    history.pushState(null, null, url);
    await renderRoute(target);
}

async function renderRoute(target) {
    if (window.location.pathname + window.location.search == currentPathName) return;
    currentPathName = window.location.pathname;

    const appDiv = target ?? document.querySelector('[router-app]');
    if (!appDiv) return;
    const appBase = appDiv.getAttribute("router-base") ?? "";
    const route = window.location.pathname.replaceAll(appBase, "").replaceAll("//", "") + window.location.search;

    document.querySelectorAll("[router-nav]").forEach(n => n.classList.remove("active"));
    document.querySelectorAll("[router-nav]").forEach(n => {
        var link = n.getAttribute("href") ?? n.getAttribute("route");
        if (link) {
            let isActive = false;
            let basePaths = [appBase + "/", appBase]
           
            link = link.split("?")[0];
            if (link === "/") isActive = currentPathName == "/";
            else if (basePaths.includes(link)) isActive = basePaths.includes(currentPathName);
            else isActive = currentPathName.startsWith(link);

            if (isActive) {
                n.classList.add("active");
            }
        }
    });

    currentPathName += window.location.search;

    appDiv.innerHTML = loadingView()

    if (route) {
        const viewContent = await loadView(route);
        appDiv.innerHTML = viewContent;
        const scripts = appDiv.querySelectorAll("script");
        for (let script of scripts) {
            let content = script.innerHTML;
            if (script.getAttribute("src")) {
                console.log(script.getAttribute("src"));
                content = await (await fetch(script.getAttribute("src"))).text();
            }
            eval(content);
        }
    } else {
        appDiv.innerHTML = errorView(404);
    }

    setListener();
}


function setListener() {
    document.querySelectorAll("[route]").forEach(r => {
        r.style.cursor="pointer"
        r.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(r.href ?? r.getAttribute("route"), document.getElementById(r.getAttribute("router-target")));
        });
    })
}

setListener();

window.addEventListener('popstate', renderRoute);

// Charger la route initiale
renderRoute();
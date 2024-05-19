String.prototype.capitalize = (str) => {
    return (str.charAt(0).toUpperCase() + str.substring(1, str.length));
}

Array.prototype.shuffle = (arr) => {
    let array = arr;
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

const themes = {
    dark: {
        bg: "#222",
        col: "white",
        navbar: "#111"
    },
    light: {
        bg: "#eee",
        col: "black",
        navbar: "#fff"
    }
}

const fetchData = (filename) => {
    return new Promise((resolve, reject) => {
        fetch(`./data/${filename}.json`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

const fill = (data, fileIndex) => {
    data.forEach(item => {
        var box = document.createElement("div");
        box.classList.add("box");
        box.setAttribute("data-file", fileIndex);
        var children = {};
        children["logo"] = document.createElement("img");
        children["logo"].classList.add("logo");
        children["logo"].src = `./assets/${item["gorsel"]["logo"]}.png`;
        children["title"] = document.createElement("span");
        children["title"].classList.add("title");
        children["title"].innerText = item["isim"];
        children["desc"] = document.createElement("span");
        children["desc"].classList.add("desc");
        children["desc"].innerText = `${item["sinif"]} | ${item["tur"]}\n\n${item["ozet"]["kisa"]}\n\n${item["yapimci"] ? (item["yapimci"].includes(",") ? "Yapımcılar: " : "Yapımcı: ") + item["yapimci"] : (item["yazar"] ? "Yazar: " + item["yazar"] : "")}`;
        children["more"] = document.createElement("span");
        children["more"].classList.add("more");
        children["more"].innerText = "Daha fazla bilgi";
        children["more"].addEventListener("click", () => {
            localStorage.setItem("ansiklopedi.file", fileIndex);
            location.href = `${location.origin}/makale/?i=${item["isim"].toLocaleLowerCase().replaceAll(" ", "-")}`;
        });
        Object.keys(children).forEach(child => box.appendChild(children[child]));
        document.querySelector(`.main [data-page=${item["sinif"].toLocaleLowerCase().replaceAll(" ", "-")}]`).appendChild(box);
    });
    lastLoadedFile++;
}

var filesArray = Array.prototype.shuffle(Array.from({ length: 1 }, (_, i) => (i + 1)));
var lastLoadedFile = 0;

window.addEventListener("load", () => {
    if (!localStorage.getItem("ansiklopedi.loggedBefore") && !checkMobileView(screen.width, screen.height)) location.href = "/hosgeldin";
    fetchData(`index${filesArray[lastLoadedFile]}`)
        .then(data => fill(data, filesArray[lastLoadedFile]));
    if (localStorage.getItem("ansiklopedi.theme")) {
        setTheme(localStorage.getItem("ansiklopedi.theme"));
    }
    if (localStorage.getItem("ansiklopedi.showSpoilerAlert") == "false") {
        document.querySelector("#spoiler-alert").setAttribute("data-active", "true");
    }
    document.querySelector(".modal span.close").addEventListener("click", hideModal);
    document.addEventListener("click", (event) => {
        if (event.target == document.querySelector(".mask")) hideModal();
        console.log(event.target);
        if (event.target.parentElement == document.querySelector(":has(.navbar.mobile) .topbar span.item#filterSwitch")) document.querySelector(":has(.navbar.mobile) .topbar #expand").click();
    });
});

document.querySelectorAll(".navbar span.group").forEach(item => {
    item.addEventListener("click", () => {
        if (!item.getAttribute("data-open")) {
            item.setAttribute("data-open", "true");
            if (document.querySelectorAll(`.navbar span.item[data-parent=${item.getAttribute("data-group")}]`).length > 0) {
                document.querySelectorAll(`.navbar span.item[data-parent=${item.getAttribute("data-group")}]`).forEach(child => {
                    setTimeout(() => {
                        child.style.visibility = "visible";
                    }, 100);
                });
            }
            return;
        }
        item.removeAttribute("data-open");
        if (document.querySelectorAll(`.navbar span.item[data-parent=${item.getAttribute("data-group")}]`).length > 0) {
            document.querySelectorAll(`.navbar span.item[data-parent=${item.getAttribute("data-group")}]`).forEach(child => {
                setTimeout(() => {
                    child.style.visibility = "hidden";
                }, 100);
            });
        }
    });
});

document.querySelectorAll(".navbar span.item").forEach(item => {
    item.addEventListener("click", () => {
        if (item.getAttribute("data-open")) {
            document.querySelector(".main .categories hr#fillAll").style.display = "none";
            document.querySelectorAll(".main [data-page]").forEach(page => page.style.display = "none");
            document.querySelector(`.main [data-page=${item.getAttribute("data-open")}]`).style.display = "flex";
            document.querySelectorAll(`.main [data-page=${item.getAttribute("data-open")}] .box`).forEach(box => {
                box.setAttribute("data-active", "true");
            });
            document.querySelectorAll(`.main :not([data-page=${item.getAttribute("data-open")}]) .box`).forEach(box => {
                box.removeAttribute("data-active");
            });
        }
        else {
            document.querySelector(".main .categories hr#fillAll").style.display = "block";
            document.querySelectorAll(".main [data-page]").forEach(page => page.style.display = "flex");
        }
        if (!item.getAttribute("data-active")) {
            document.querySelectorAll(".navbar span.item").forEach(child => {
                child.removeAttribute("data-active");
            });
            item.setAttribute("data-active", "true");
            return;
        }
        item.removeAttribute("data-active");
    });
});

const setTheme = (theme) => {
    localStorage.setItem("ansiklopedi.theme", theme);
    Object.keys(themes[localStorage.getItem("ansiklopedi.theme")]).forEach(item => {
        document.querySelector(":root").style.setProperty(`--${item}`, themes[localStorage.getItem("ansiklopedi.theme")][item]);
    });
    document.querySelector(".topbar span.item#theme i.fa").classList.add(`fa-${localStorage.getItem("ansiklopedi.theme") == "dark" ? "sun" : "moon"}`);
}

const switchTheme = () => {
    if (!localStorage.getItem("ansiklopedi.theme")) {
        localStorage.setItem("ansiklopedi.theme", "dark");
    }
    localStorage.setItem("ansiklopedi.theme",
        localStorage.getItem("ansiklopedi.theme") == "dark" ?
        "light" : "dark"
    );
    Object.keys(themes[localStorage.getItem("ansiklopedi.theme")]).forEach(item => {
        document.querySelector(":root").style.setProperty(`--${item}`, themes[localStorage.getItem("ansiklopedi.theme")][item]);
    });
    let faIcons = { light: "moon", dark: "sun" }
    document.querySelector(".topbar span.item#theme i.fa").classList.remove(`fa-${faIcons[localStorage.getItem("ansiklopedi.theme") == "dark" ? "light" : "dark"]}`);
    document.querySelector(".topbar span.item#theme i.fa").classList.add(`fa-${faIcons[localStorage.getItem("ansiklopedi.theme")]}`);
}

document.querySelector(".topbar span.item#theme").addEventListener("click", switchTheme);

const updateResults = (filters) => {
    document.querySelector("datalist#suggested").innerHTML = "";
    var all = [];
    var anyItem = false;
    document.querySelectorAll(".main * .box").forEach(item => {
        item.style.display = "none";
        item.removeAttribute("data-active");
        if (item.querySelector("span.title").innerText.toLocaleLowerCase().includes(filters["name"].toLocaleLowerCase())) {
            document.querySelector("span.error").style.display = "none";
            document.querySelectorAll(".main .categories [data-page] h1, .main .categories hr#fillAll, .main button#show-more").forEach(header => header.style.display = "block");
            item.style.display = "flex";
            anyItem = true;
        }
        all.push(item.querySelector("span.title").innerText);
    });
    all.forEach(item => {
        document.querySelector("datalist#suggested").innerHTML += `<option value="${item}">`;
    });
    if (!anyItem) {
        document.querySelector("span.error").style.display = "block";
        document.querySelectorAll(".main .categories [data-page] h1, .main .categories hr#fillAll, .main button#show-more").forEach(header => header.style.display = "none");
    }
}

const setFilterActivity = (bool) => {
    if (bool) {
        document.querySelector(".main .filter").style.display = "flex";
        document.querySelector("hr#fillAll").style.width = "97vw";
        document.querySelector(".main").style.marginTop = "15%";
        return;
    }
    document.querySelector(".main .filter").style.display = "none";
    document.querySelector("hr#fillAll").style.width = "100%";
    document.querySelector(".main").style.marginTop = (!document.querySelector("#spoiler-alert").getAttribute("data-active") ? "6.5rem" : "9rem");
    document.querySelector(".topbar span.item#filterSwitch").removeAttribute("data-active");
}

window.addEventListener("keydown", (event) => {
    if (event.key == "f" && document.activeElement == document.body) {
        document.querySelector(".topbar span.item#filterSwitch").click();
    }
});

document.querySelector(".filter .close").addEventListener("click", () => { setFilterActivity(false) });

document.querySelector(".topbar span.item#filterSwitch").addEventListener("click", () => {
    if (document.querySelector(".topbar span.item#filterSwitch").getAttribute("data-active")) {
        document.querySelector(".topbar span.item#filterSwitch").removeAttribute("data-active");
        setFilterActivity(false);
    }
    else {
        document.querySelector(".topbar span.item#filterSwitch").setAttribute("data-active", "true");
        setFilterActivity(true);
    }
});

document.querySelector(".filter input#name").addEventListener("input", () => {
    updateResults({
        name: document.querySelector(".filter input#name").value
    });
});

document.querySelector("#spoiler-alert span.close").addEventListener("click", (event) => {
    localStorage.setItem("ansiklopedi.showSpoilerAlert", document.querySelector("#spoiler-alert * input[type=checkbox]").checked);
    event.target.parentElement.removeAttribute("data-active");
    event.target.parentElement.innerText = "";
});

document.querySelector(".topbar span.item#info").addEventListener("click", () => {
    window.open("./bilgi");
});

const checkMobileView = (x, y) => (x < y * .8);

if (checkMobileView(window.innerWidth, window.innerHeight)) {
    document.querySelector(".navbar").classList.add("mobile");
}

window.addEventListener("resize", () => {
    if (checkMobileView(window.innerWidth, window.innerHeight)) {
        document.querySelector(".navbar").classList.add("mobile");
    }
    else {
        document.querySelector(".navbar").classList.remove("mobile");
    }
});

document.querySelector(".navbar .header").addEventListener("click", () => {
    if (!document.querySelector(".navbar.mobile")) return;
    if (!document.querySelector(".navbar.mobile .header #expand").classList.contains("open")) {
        document.querySelector(".navbar.mobile .header #expand").classList.add("open");
        document.querySelectorAll(".navbar.mobile span.item span").forEach(item => {
            item.style.display = "block";
        });
    }
    else {
        document.querySelector(".navbar.mobile .header #expand").classList.remove("open");
        document.querySelectorAll(".navbar.mobile span.item span").forEach(item => {
            item.style.display = "none";
        });
    }
});

document.querySelector(".topbar #expand").addEventListener("click", () => {
    if (!document.querySelector(".navbar.mobile")) return;
    if (!document.querySelector(".topbar #expand").classList.contains("open")) {
        document.querySelector(".topbar #expand").classList.add("open");
        document.querySelectorAll(".topbar span.item span").forEach(item => {
            item.style.display = "block";
        });
        setFilterActivity(false);
    }
    else {
        document.querySelector(".topbar #expand").classList.remove("open");
        document.querySelectorAll(".topbar span.item span").forEach(item => {
            item.style.display = "none";
        });
    }
});

document.querySelector("button#show-more").addEventListener("click", () => {
    fetchData(`index${filesArray[lastLoadedFile]}`)
        .then(data => fill(data))
        .catch((err) => {
            console.error(err);
            document.querySelector("button#show-more").innerText = "Hepsi bu kadar..."
        });
});



const showModal = (data) => {
    document.querySelector(".modal img.thumbnail").style.display = "block";
    if (!data["thumbnail"]) document.querySelector(".modal img.thumbnail").style.display = "none";
    else document.querySelector(".modal img.thumbnail").src = data["thumbnail"];
    document.querySelector(".modal .title").innerText = data["title"];
    document.querySelector(".modal .desc").innerHTML = data["desc"];
    document.querySelector(".modal").style.left = "50%";
    document.querySelector(".mask").style.display = "block";
}
const hideModal = () => {
    document.querySelector(".modal").style.left = "200%";
    document.querySelector(".mask").style.display = "none";
}

document.querySelector(".topbar span.item#feedback").addEventListener("click", () => {
    showModal({
        thumbnail: "",
        title: "Geri Bildirim",
        desc: `
            <input placeholder="İsminiz" />
            <input placeholder="Mail adresiniz (isteğe bağlı)" />
            <textarea placeholder="Demek istediğim şu ki falan filan..."></textarea>
            <button onclick="feedback(this.parentElement.querySelectorAll('input')[0], this.parentElement.querySelectorAll('input')[1], this.parentElement.querySelector('textarea'))">Gönder</button>
        `
    })
});

const feedback = (name, email, content) => {
    if (!name.value) {
        name.style.border = "2px solid red";
        return;
    }
    else {
        name.style.border = "2px solid var(--col)";
        content.style.border = "2px solid var(--col)";
    }
    if (!content.value) {
        content.style.border = "2px solid red";
        return;
    }
    else {
        name.style.border = "2px solid var(--col)";
        content.style.border = "2px solid var(--col)";
    }
    const req = new XMLHttpRequest();
    req.open("POST", "https://discord.com/api/webhooks/1240345475568373850/Vv83hfnqhJi_7ALL3TcLSO20yVY6-k2ZONvXp_NH_g7whDPwjHK7SHWR5ENyzj2Zw6qb");
    req.setRequestHeader("Content-type", "application/json");
    const opt = {
        username: name.value,
        avatar_url: "",
        content: `${content.value} | ${(email.value && email.value != "Gizli") ? email.value : "Gizli"}`
    }
    req.send(JSON.stringify(opt))
    hideModal();
    showModal({
        thumbnail: "",
        title: "Teşekkürler!",
        desc: "Geri bildiriminiz başarıya iniş gerçekleştirdi!"
    });
}
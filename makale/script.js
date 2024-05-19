window.addEventListener("load", () => {
    const srcParams = new URLSearchParams(location.search);
    const fill = (data) => {
        const container = document.querySelector(".main.article");
        container.querySelector(".title").innerText = data["isim"];
        container.querySelector("#header .desc").innerText = data["ozet"]["orta"];
        container.querySelector("img.thumbnail").src = `../assets/${data["gorsel"]["afis"]}.png`;
        const tableTopper = container.querySelector("#chars table tr#topper");
        var nameRow = document.createElement("th");
        nameRow.innerText = "İsim";
        tableTopper.appendChild(nameRow);
        Object.keys(data["karakterler"][Object.keys(data["karakterler"])[0]]).forEach(topperKey => {
            var cell = document.createElement("th");
            cell.innerText = topperKey;
            tableTopper.appendChild(cell);
        });
        Object.keys(data["karakterler"]).forEach(item => {
            var row = document.createElement("tr");
            var nameColumn = document.createElement("td");
            nameColumn.innerText = item;
            row.appendChild(nameColumn);
            Object.keys(data["karakterler"][item]).forEach(key => {
                var column = document.createElement("td");
                column.innerText = data["karakterler"][item][key] ? data["karakterler"][item][key] : "-";
                row.appendChild(column);
            });
            document.querySelector(".main.article #chars table").appendChild(row);
        });
        document.querySelectorAll("#home details .home-data p").forEach(item => {
            item.querySelector("span").innerText = data[item.getAttribute("data-prop")];
        });
        document.querySelector("#story details .text").innerHTML = data["ozet"]["uzun"] ? data["ozet"]["uzun"] : "Bu hikâye henüz hazır değil!..";
        writePerson(data["yazar"].split(",") ? data["yazar"].split(",")[0] : data["yazar"]);
        if (data["basarilar"]["galibiyetler"]) {
            data["basarilar"]["galibiyetler"].forEach((item) => {
                var node = document.createElement("div");
                node.classList.add("award");
                var children = [
                    document.createElement("img"),
                    document.createElement("div"),
                    document.createElement("p"),
                    document.createElement("p")
                ];
                children[0].src = "../assets/odul.png";
                children[1].classList.add("texts");
                children[2].classList.add("topic");
                children[2].innerText = `${item["konu"]} | Kazanan`;
                children[3].classList.add("content");
                children[3].innerText = `${item["veren"]}, ${item["yil"]}`;
                node.appendChild(children[0]);
                children[1].appendChild(children[2]);
                children[1].appendChild(children[3]);
                node.appendChild(children[1]);
                document.querySelector("#awards details").appendChild(node);
            });
        }
        if (data["basarilar"]["adayliklar"]) {
            data["basarilar"]["adayliklar"].forEach((item) => {
                var node = document.createElement("div");
                node.classList.add("award");
                var children = [
                    document.createElement("img"),
                    document.createElement("div"),
                    document.createElement("p"),
                    document.createElement("p")
                ];
                children[0].src = "../assets/aday.png";
                children[1].classList.add("texts");
                children[2].classList.add("topic");
                children[2].innerText = `${item["konu"]} | Aday`;
                children[3].classList.add("content");
                children[3].innerText = `${item["veren"]}, ${item["yil"]}`;
                node.appendChild(children[0]);
                children[1].appendChild(children[2]);
                children[1].appendChild(children[3]);
                node.appendChild(children[1]);
                document.querySelector("#awards details").appendChild(node);
            });
        }
        if (data["basarilar"]["ilkler"]) {
            data["basarilar"]["ilkler"].forEach((item) => {
                var node = document.createElement("div");
                node.classList.add("award");
                var children = [
                    document.createElement("img"),
                    document.createElement("div"),
                    document.createElement("p")
                ];
                children[0].src = "../assets/ilk.png";
                children[1].classList.add("texts");
                children[2].classList.add("topic");
                children[2].innerText = `İlk ${item}`;
                node.appendChild(children[0]);
                children[1].appendChild(children[2]);
                node.appendChild(children[1]);
                document.querySelector("#awards details").appendChild(node);
            });
        }
    }
    const writePerson = (name) => {
        fetch("../data/authors.json")
            .then(res => res.json())
            .then(data => {
                var node = data[name];
                document.querySelectorAll("#author details p").forEach(item => {
                    var defaultPropFill = item.getAttribute("data-prop-fill") ? item.getAttribute("data-prop-fill") : "innerText";
                    item.querySelector("#value")[defaultPropFill] = node[item.getAttribute("data-prop")];
                });
            })
    }
    if (!srcParams.get("i")) {
        location.href = "../";
        return;
    }
    else {
        fetch(`../data/index${localStorage.getItem("ansiklopedi.file")}.json`)
            .then(res => res.json())
            .then(data => {
                let JSONObject = data.find(item => item["isim"]?.toLocaleLowerCase().replaceAll(" ", "-") == srcParams.get("i"));
                if (!JSONObject) {
                    location.href = `../eksik/?madde=${srcParams.get("i")}`;
                    return;
                }
                else {
                    fill(JSONObject);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
    document.querySelectorAll("[data-redirect]").forEach(item => {
        item.addEventListener("click", () => {
            location.href = item.getAttribute("data-redirect");
        });
    });
    document.querySelectorAll("img").forEach((item) => {
        item.addEventListener("error", (event) => {
            event.target.src = `https://placehold.co/1000x200`;
        });
    });
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
    const showModal = (data) => {
        document.querySelector(".modal img.thumbnail").src = data["thumbnail"];
        document.querySelector(".modal .title").innerText = data["title"];
        document.querySelector(".modal .desc").innerHTML = data["desc"];
        document.querySelector(".modal").style.left = "50%";
        document.querySelector(".mask").style.display = "block";
    }
    const hideModal = () => {
        document.querySelector(".modal").style.left = "200%";
        document.querySelector(".mask").style.display = "none";
    }
    window.shareTo = (origin) => {
        switch (origin) {
            case "whatsapp":
                location.href = `whatsapp://send?text=${document.querySelector('.main.article .title').innerText + ', ' + location.href}`;
                break;
            case "twitter":
                window.open(`https://x.com/intent/tweet?text=${document.querySelector('.main.article .title').innerText + ', '}&url=${location.href}`)
                break;
            default:
                break;
        }
    }
    document.addEventListener("click", (event) => {
        if (event.target == document.querySelector(".mask")) hideModal();
    });
    if (localStorage.getItem("ansiklopedi.theme")) {
        setTheme(localStorage.getItem("ansiklopedi.theme"));
    }
    document.querySelector(".topbar span.item#theme").addEventListener("click", switchTheme);
    document.querySelector(".topbar span.item#share button").addEventListener("click", () => {
        showModal({
            thumbnail: "../assets/paylas.png",
            title: "Sayfayı Paylaş",
            desc: `
            <div class="socials">
                <button onclick="window.shareTo('whatsapp')" class="social"><i class="fab fa-whatsapp"></i></button>
                <button onclick="window.shareTo('twitter')" class="social"><i class="fab fa-x-twitter"></i></button>
                <button onclick="navigator.clipboard.writeText(document.querySelector('.main.article .title').innerText + ', ' + location.href).then(() => {});" class="social"><i class="fa fa-copy"></i></button>
            </div>
            `
        });
    });
    document.querySelector(".modal span.close").addEventListener("click", hideModal);
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
    }
    else {
        document.querySelector(".topbar #expand").classList.remove("open");
        document.querySelectorAll(".topbar span.item span").forEach(item => {
            item.style.display = "none";
        });
    }
});
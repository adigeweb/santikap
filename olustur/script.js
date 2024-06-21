const checkValidity = (query) => {
    document.querySelectorAll(query).forEach(item => {
        if (!item.getAttribute("data-format")) return;
        const format = item.getAttribute("data-format").replaceAll(" ", "").split(",");
        item.addEventListener("input", () => {
            const isValid = new Promise((resolve, reject) => {
                if (item.value.length < format[0]) reject("cok-kisa");
                if (item.value.length > format[1]) reject("cok-uzun");
                resolve();
            });
            isValid
                .then(() => item.removeAttribute("data-invalid"))
                .catch(() => item.setAttribute("data-invalid", true));
        });
    });
}

checkValidity(".form input, .form textarea");

document.querySelector("button#send-article").addEventListener("click", () => {
    var res = true;
    document.querySelectorAll(".form input").forEach(item => {
        if ((!(item.value || item.getAttribute("data-optional"))) || item.getAttribute("data-invalid")) res = false;
    });
    if (res) {
        const req = new XMLHttpRequest();
        req.open("POST", "https://discord.com/api/webhooks/1240345475568373850/Vv83hfnqhJi_7ALL3TcLSO20yVY6-k2ZONvXp_NH_g7whDPwjHK7SHWR5ENyzj2Zw6qb");
        req.setRequestHeader("Content-type", "application/json");
        var opt = {};
        document.querySelectorAll(".form input, .form textarea").forEach(item => {
            opt[item.id] = item.value;
        });
        req.send(JSON.stringify(opt))
        alert("Girdiniz başarıyla gönderildi!");
    }
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
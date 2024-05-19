window.addEventListener("load", () => {
    var rand = Math.floor(Math.random() * document.querySelectorAll("svg").length);
    var wave;
    document.querySelectorAll("svg").forEach((item, index) => {
        if (index == rand) {
            item.style.display = "block";
            wave = item;
        }
    });
    document.querySelector("button#start").addEventListener("click", () => {
        localStorage.setItem("ansiklopedi.loggedBefore", "true");
        location.href = "../";
    })
});
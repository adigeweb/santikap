window.addEventListener("load", () => {
    document.querySelector("span#time").innerText = "10";
    setInterval(() => {
        document.querySelector("span#time").innerText--;
        if (document.querySelector("span#time").innerText == 0) location.href = "../";
    }, 1000);
});
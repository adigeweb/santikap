window.addEventListener("load", () => {
    const srcParams = new URLSearchParams(location.search);
    if (!srcParams.get("madde")) {
        location.href = "../";
    }
    document.querySelector(".error-404 #name").innerText = `"${srcParams.get("madde")}"`;
});
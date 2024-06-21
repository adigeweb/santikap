document.querySelectorAll("input, textarea").forEach(item => {
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
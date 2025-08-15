console.log("Hello from Deno serve static file example!");

document.addEventListener("DOMContentLoaded", () => {
    const p = document.querySelector("p");
    p.innerHTML += "<br>JavaScript loaded successfully!";
});
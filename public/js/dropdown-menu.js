function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("active");
}

// Fecha menu ao clicar fora
window.onclick = function(event) {
  if (!event.target.closest('.navbar-hamburger')) {
    document.getElementById("dropdownMenu").classList.remove("active");
  }
}
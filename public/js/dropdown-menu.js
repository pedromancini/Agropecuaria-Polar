document.addEventListener('DOMContentLoaded', function() {
  window.toggleMenu = function() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) {
      menu.classList.toggle("active");
    }
  }

  window.addEventListener('click', function(event) {
    const menu = document.getElementById("dropdownMenu");
    const hamburger = document.querySelector('.navbar-hamburger');
    
    if (menu && hamburger) {

      if (!hamburger.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove("active");
      }
    }
  });


  const hamburgerBtn = document.querySelector('.hamburger-btn');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});
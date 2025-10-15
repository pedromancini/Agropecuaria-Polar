function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('active');
}

// Fechar o menu ao clicar fora dele
document.addEventListener('click', function(event) {
    const wrapper = document.querySelector('.navbar-user-wrapper');
    const menu = document.getElementById('dropdownMenu');
    
    if (!wrapper.contains(event.target)) {
        menu.classList.remove('active');
    }
});
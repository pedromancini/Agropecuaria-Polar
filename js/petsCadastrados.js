document.addEventListener("DOMContentLoaded", () => {
    const petCards = document.querySelectorAll('.pet-card');
    const botaoServico = document.getElementById('btnSelecionarServico');
  
    petCards.forEach(card => {
      card.addEventListener('click', () => {
        petCards.forEach(c => c.classList.remove('selecionado'));
  

        card.classList.add('selecionado');
  

        botaoServico.classList.remove('d-none');

        const nomePet = card.dataset.pet;
        localStorage.setItem('petSelecionado', nomePet);
      });
    });
  
    botaoServico.addEventListener('click', () => {
      window.location.href = "SelecionaServico.html";
    });
  });
    document.querySelectorAll('.pet-card').forEach(card => {
      card.addEventListener('click', function() {
        const petNome = this.querySelector('.info-pet strong').textContent;
        const petFoto = this.querySelector('.icone-pet').innerHTML;
  

        localStorage.setItem('petNome', petNome);
        localStorage.setItem('petFoto', petFoto);
  

        const botaoSelecionarServico = document.getElementById('btnSelecionarServico');
        botaoSelecionarServico.classList.remove('d-none');
  

      });
    });

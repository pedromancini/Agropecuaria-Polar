document.addEventListener("DOMContentLoaded", () => {
  // Lógica para destacar serviço selecionado
  const servicos = document.querySelectorAll(".servico-item");

  servicos.forEach(card => {
    card.addEventListener("click", () => {
      servicos.forEach(c => c.classList.remove("border-primary"));
      card.classList.add("border-primary");

      // Armazena o serviço principal selecionado no localStorage
      const nomeServico = card.querySelector('.fw-bold').textContent;
      localStorage.setItem('servicoSelecionado', nomeServico);
    });
  });

  // Exibir informações do pet armazenadas no localStorage
  const petNome = localStorage.getItem('petNome');
  const petFoto = localStorage.getItem('petFoto');

  if (petNome && petFoto) {
    const petNomeElemento = document.querySelector('.pet-selecionado .fw-semibold');
    const petFotoElemento = document.querySelector('.pet-selecionado .icone-pet');
    petNomeElemento.textContent = petNome;
    petFotoElemento.innerHTML = petFoto;
  }

  // Avançar para a próxima página ao clicar no botão
  const btnAvancar = document.getElementById('btn-avancar');
  btnAvancar.addEventListener('click', () => {
    // Armazenar os serviços adicionais selecionados
    const adicionaisSelecionados = [];
    const adicionais = document.querySelectorAll('.adicional-item input[type="checkbox"]');
    adicionais.forEach(checkbox => {
      if (checkbox.checked) {
        const nomeAdicional = checkbox.closest('.adicional-item').querySelector('span').textContent;
        adicionaisSelecionados.push(nomeAdicional);
      }
    });
    localStorage.setItem('servicosAdicionais', JSON.stringify(adicionaisSelecionados));

    // Redirecionar
    window.location.href = 'confirmarAgendamento.html';
  });
});

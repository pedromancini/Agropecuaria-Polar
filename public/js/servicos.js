document.addEventListener('DOMContentLoaded', () => {
  const servicosGrid = document.getElementById('servicosGrid');
  const resumoContainer = document.getElementById('resumoContainer');
  const servicosSelecionadosDiv = document.getElementById('servicosSelecionados');
  const valorTotalSpan = document.getElementById('valorTotal');
  const btnContinuar = document.getElementById('btnContinuar');

  let servicosSelecionados = [];

  // Adicionar evento de clique em cada card de serviço
  const servicoCards = document.querySelectorAll('.servico-card');

  servicoCards.forEach(card => {
    card.addEventListener('click', () => {
      const produtoId = parseInt(card.dataset.produtoId);
      const valor = parseFloat(card.dataset.valor);

      if (card.classList.contains('selected')) {
        // Remover seleção
        card.classList.remove('selected');
        servicosSelecionados = servicosSelecionados.filter(s => s.id !== produtoId);
      } else {
        // Adicionar seleção
        card.classList.add('selected');
        const nome = card.querySelector('.servico-nome').textContent;
        servicosSelecionados.push({ id: produtoId, nome, valor });
      }

      atualizarResumo();
    });
  });

  // Atualizar resumo
  function atualizarResumo() {
    if (servicosSelecionados.length === 0) {
      resumoContainer.style.display = 'none';
      btnContinuar.disabled = true;
      return;
    }

    resumoContainer.style.display = 'block';
    btnContinuar.disabled = false;

    // Renderizar lista de serviços selecionados
    servicosSelecionadosDiv.innerHTML = servicosSelecionados.map(servico => `
      <div class="servico-item">
        <span class="servico-item-nome">${servico.nome}</span>
        <span class="servico-item-valor">R$ ${servico.valor.toFixed(2).replace('.', ',')}</span>
      </div>
    `).join('');

    // Calcular e exibir total
    const total = servicosSelecionados.reduce((sum, s) => sum + s.valor, 0);
    valorTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  // Continuar para agendamento
  btnContinuar.addEventListener('click', () => {
    if (servicosSelecionados.length === 0) return;

    const petId = new URLSearchParams(window.location.search).get('petId');
    const produtoIds = servicosSelecionados.map(s => s.id).join(',');

    window.location.href = `/agendar?petId=${petId}&produtoIds=${produtoIds}`;
  });
});
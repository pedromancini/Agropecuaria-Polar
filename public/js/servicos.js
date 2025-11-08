// Array para armazenar os serviços selecionados
let servicosSelecionados = [];

document.addEventListener('DOMContentLoaded', () => {
  const servicosGrid = document.getElementById('servicosGrid');
  const resumoContainer = document.getElementById('resumoContainer');
  const servicosSelecionadosDiv = document.getElementById('servicosSelecionados');
  const valorTotalSpan = document.getElementById('valorTotal');
  const btnContinuar = document.getElementById('btnContinuar');

  // Event listener para os cards de serviço
  servicosGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.servico-card');
    if (!card) return;

    const produtoId = parseInt(card.dataset.produtoId);
    const valor = parseFloat(card.dataset.valor);
    const nome = card.querySelector('.servico-nome').textContent;
    const duracao = card.querySelector('.detalhe-valor:last-child').textContent;

    // Toggle seleção
    if (card.classList.contains('selected')) {
      // Remover seleção
      card.classList.remove('selected');
      servicosSelecionados = servicosSelecionados.filter(s => s.id !== produtoId);
    } else {
      // Adicionar seleção
      card.classList.add('selected');
      servicosSelecionados.push({
        id: produtoId,
        nome: nome,
        valor: valor,
        duracao: duracao
      });
    }

    atualizarResumo();
  });

  function atualizarResumo() {
    if (servicosSelecionados.length === 0) {
      resumoContainer.style.display = 'none';
      btnContinuar.disabled = true;
      return;
    }

    resumoContainer.style.display = 'block';
    btnContinuar.disabled = false;

    // Atualizar lista de serviços
    servicosSelecionadosDiv.innerHTML = servicosSelecionados.map(servico => `
      <div class="servico-item">
        <span class="servico-item-nome">${servico.nome}</span>
        <span class="servico-item-valor">R$ ${servico.valor.toFixed(2).replace('.', ',')}</span>
      </div>
    `).join('');

    // Calcular e atualizar total
    const total = servicosSelecionados.reduce((sum, s) => sum + s.valor, 0);
    valorTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  // Continuar para página de agendamento
  btnContinuar.addEventListener('click', () => {
    if (servicosSelecionados.length === 0) return;

    // Extrair petId da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('petId');

    // Montar URL com os serviços selecionados
    const servicosIds = servicosSelecionados.map(s => s.id).join(',');
    window.location.href = `/finalizar-agendamento?petId=${petId}&servicos=${servicosIds}`;
  });
});
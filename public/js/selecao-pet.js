document.addEventListener('DOMContentLoaded', () => {
  const btnVerPets = document.getElementById('btnVerPets');
  const btnFecharModal = document.getElementById('btnFecharModal');
  const modal = document.getElementById('modalPets');
  const listaPets = document.getElementById('listaPets');

  let petSelecionado = null;

  // Abrir modal
  btnVerPets.addEventListener('click', async (e) => {
    e.preventDefault();
    modal.classList.add('show');
    await carregarPets();
  });

  // Fechar modal
  btnFecharModal.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Fechar ao clicar fora do modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });

  // Carregar pets do usuário
  async function carregarPets() {
    listaPets.innerHTML = '<div class="loading">Carregando pets...</div>';

    try {
      const response = await fetch('/api/meus-pets');
      const data = await response.json();

      if (data.pets && data.pets.length > 0) {
        renderizarPets(data.pets);
      } else {
        mostrarSemPets();
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      listaPets.innerHTML = '<div class="loading">❌ Erro ao carregar pets. Tente novamente.</div>';
    }
  }

  // Renderizar lista de pets
  function renderizarPets(pets) {
    const html = `
      <div class="pets-list">
        ${pets.map(pet => `
          <div class="pet-item" data-pet-id="${pet.id}">
            ${pet.Imagem 
              ? `<img src="/uploads/pets/${pet.Imagem}" alt="${pet.Nome}" class="pet-item-image">`
              : `<div class="pet-item-icon">${pet.Tipo === 'Cachorro' ? '🐶' : pet.Tipo === 'Gato' ? '🐱' : '🐾'}</div>`
            }
            <div class="pet-item-info">
              <div class="pet-item-name">${pet.Nome}</div>
              <div class="pet-item-details">
                <span class="pet-detail">🐾 ${pet.Tipo}</span>
                <span class="pet-detail">${pet.Sexo === 'Macho' ? '♂️' : '♀️'} ${pet.Sexo}</span>
                <span class="pet-detail">📏 ${pet.Porte}</span>
                <span class="pet-detail">🎂 ${pet.Idade} anos</span>
              </div>
            </div>
            <div class="pet-item-check"></div>
          </div>
        `).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn-continuar" id="btnContinuar" disabled>
          Continuar para Serviços →
        </button>
      </div>
    `;

    listaPets.innerHTML = html;
    adicionarEventosPets();
  }

  // Adicionar eventos de clique nos pets
  function adicionarEventosPets() {
    const petItems = document.querySelectorAll('.pet-item');
    const btnContinuar = document.getElementById('btnContinuar');

    petItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove seleção anterior
        petItems.forEach(p => p.classList.remove('selected'));
        
        // Adiciona seleção atual
        item.classList.add('selected');
        petSelecionado = item.dataset.petId;
        
        // Habilita botão continuar
        btnContinuar.disabled = false;
      });
    });

    btnContinuar.addEventListener('click', () => {
      if (petSelecionado) {
        // Redirecionar para página de serviços com o pet selecionado
        window.location.href = `/servicos?petId=${petSelecionado}`;
      }
    });
  }

  // Mostrar mensagem quando não há pets
  function mostrarSemPets() {
    listaPets.innerHTML = `
      <div class="no-pets-modal">
        <div class="icon">🐾</div>
        <p>Você ainda não possui pets cadastrados.</p>
        <a href="/cadastrarPet" class="btn-cadastrar">
          ➕ Cadastrar Meu Primeiro Pet
        </a>
      </div>
    `;
  }
});
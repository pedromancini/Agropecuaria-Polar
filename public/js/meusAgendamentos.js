
document.addEventListener('DOMContentLoaded', () => {
  console.log('📅 Sistema de Agendamentos Inicializado');
  
  inicializarFiltros();
  inicializarBotoesCancelar();
  carregarEstatisticas();
});


function inicializarFiltros() {
  const filtros = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.agendamento-card');
  
  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active de todos
      filtros.forEach(b => b.classList.remove('active'));
      
      // Adiciona active no clicado
      btn.classList.add('active');
      
      const filtro = btn.dataset.filtro;
      
      // Filtra cards
      cards.forEach(card => {
        if (filtro === 'todos' || card.dataset.status === filtro) {
          card.style.display = 'block';
          // Animação de entrada
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Verificar se há resultados
      verificarResultados(filtro);
    });
  });
}

// Verificar se há resultados após filtrar
function verificarResultados(filtro) {
  const cards = document.querySelectorAll('.agendamento-card');
  const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
  
  const grid = document.querySelector('.agendamentos-grid');
  const mensagemVazia = document.getElementById('mensagemVazia');
  
  // Remove mensagem anterior se existir
  if (mensagemVazia) {
    mensagemVazia.remove();
  }
  
  if (visibleCards.length === 0) {
    const mensagem = document.createElement('div');
    mensagem.id = 'mensagemVazia';
    mensagem.className = 'empty-state';
    mensagem.innerHTML = `
      <span class="empty-icon">📭</span>
      <h3>Nenhum agendamento encontrado</h3>
      <p>Não há agendamentos com status "${filtro}"</p>
    `;
    grid.parentNode.insertBefore(mensagem, grid);
    grid.style.display = 'none';
  } else {
    grid.style.display = 'grid';
  }
}

// ==================== CANCELAR AGENDAMENTO ====================
function inicializarBotoesCancelar() {
  const botoesCancelar = document.querySelectorAll('.btn-cancelar');
  
  botoesCancelar.forEach(btn => {
    btn.addEventListener('click', function() {
      const agendamentoId = this.getAttribute('onclick').match(/\d+/)[0];
      cancelarAgendamento(agendamentoId);
    });
  });
}

async function cancelarAgendamento(id) {
  // Confirmação personalizada
  const confirmacao = await mostrarConfirmacao(
    '⚠️ Cancelar Agendamento',
    'Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.',
    'Sim, cancelar',
    'Não, manter'
  );
  
  if (!confirmacao) return;
  
  // Mostrar loading
  mostrarLoading('Cancelando agendamento...');
  
  try {
    const response = await fetch(`/agendamento/cancelar/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    esconderLoading();

    if (result.sucesso) {
      mostrarNotificacao('sucesso', '✅ ' + result.mensagem);
      
      // Aguardar 1 segundo antes de recarregar
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      mostrarNotificacao('erro', '❌ ' + result.erro);
    }
  } catch (error) {
    esconderLoading();
    console.error('Erro ao cancelar:', error);
    mostrarNotificacao('erro', '❌ Erro ao cancelar agendamento. Tente novamente.');
  }
}

//
async function carregarEstatisticas() {
  try {
    const response = await fetch('/agendamento/estatisticas');
    const data = await response.json();
    
    if (data.sucesso) {
      console.log('📊 Estatísticas:', data.estatisticas);
      
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

// 
function mostrarConfirmacao(titulo, mensagem, btnConfirmar, btnCancelar) {
  return new Promise((resolve) => {
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal-confirmacao';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="fecharModalConfirmacao()"></div>
      <div class="modal-content-confirmacao">
        <h3>${titulo}</h3>
        <p>${mensagem}</p>
        <div class="modal-actions">
          <button class="btn-modal-cancelar" onclick="fecharModalConfirmacao(false)">${btnCancelar}</button>
          <button class="btn-modal-confirmar" onclick="fecharModalConfirmacao(true)">${btnConfirmar}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Função global para fechar modal
    window.fecharModalConfirmacao = (confirmado = false) => {
      modal.remove();
      resolve(confirmado);
    };
    
    // Adicionar estilos se ainda não existirem
    if (!document.getElementById('modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'modal-styles';
      styles.textContent = `
        .modal-confirmacao {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        
        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
        }
        
        .modal-content-confirmacao {
          position: relative;
          background: white;
          padding: 30px;
          border-radius: 15px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }
        
        .modal-content-confirmacao h3 {
          color: #2c3e50;
          font-size: 1.5rem;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .modal-content-confirmacao p {
          color: #6c757d;
          margin-bottom: 25px;
          line-height: 1.6;
        }
        
        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .btn-modal-cancelar,
        .btn-modal-confirmar {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-modal-cancelar {
          background: #6c757d;
          color: white;
        }
        
        .btn-modal-cancelar:hover {
          background: #5a6268;
        }
        
        .btn-modal-confirmar {
          background: #dc3545;
          color: white;
        }
        
        .btn-modal-confirmar:hover {
          background: #c82333;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styles);
    }
  });
}

// lloading
function mostrarLoading(mensagem = 'Carregando...') {
  const loading = document.createElement('div');
  loading.id = 'loading-overlay';
  loading.innerHTML = `
    <div class="loading-content">
      <div class="spinner"></div>
      <p>${mensagem}</p>
    </div>
  `;
  
  document.body.appendChild(loading);
  
  // Adicionar estilos
  if (!document.getElementById('loading-styles')) {
    const styles = document.createElement('style');
    styles.id = 'loading-styles';
    styles.textContent = `
      #loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .loading-content {
        text-align: center;
        color: white;
      }
      
      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      
      .loading-content p {
        font-size: 1.1rem;
        font-weight: 600;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styles);
  }
}

function esconderLoading() {
  const loading = document.getElementById('loading-overlay');
  if (loading) {
    loading.remove();
  }
}

// notificações
function mostrarNotificacao(tipo, mensagem) {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.textContent = mensagem;
  
  document.body.appendChild(notificacao);
  
  // Adicionar estilos
  if (!document.getElementById('notificacao-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notificacao-styles';
    styles.textContent = `
      .notificacao {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
      
      .notificacao-sucesso {
        background: #28a745;
      }
      
      .notificacao-erro {
        background: #dc3545;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styles);
  }
  
  setTimeout(() => {
    notificacao.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
}

// Exportar funções para uso global
window.cancelarAgendamento = cancelarAgendamento;
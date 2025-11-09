
    document.querySelectorAll('.filtro-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Remover classe active de todos
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
        
        // Adicionar classe active no clicado
        btn.classList.add('active');
        
        const filtro = btn.dataset.filtro;
        const cards = document.querySelectorAll('.agendamento-card');
        
        cards.forEach(card => {
          if (filtro === 'todos' || card.dataset.status === filtro) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });


    async function cancelarAgendamento(id) {
      if (!confirm('⚠️ Tem certeza que deseja cancelar este agendamento?')) {
        return;
      }

      try {
        const response = await fetch(`/agendamento/cancelar/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.sucesso) {
          alert('✅ ' + result.mensagem);
          location.reload();
        } else {
          alert('❌ ' + result.erro);
        }
      } catch (error) {
        console.error('Erro ao cancelar:', error);
        alert('❌ Erro ao cancelar agendamento. Tente novamente.');
      }
    }
  
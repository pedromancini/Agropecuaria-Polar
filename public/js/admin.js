async function atualizarStatus(id, novoStatus) {
    if (!confirm(`Deseja alterar o status para ${novoStatus}?`)) return;

    try {
        const response = await fetch(`/admin/agendamento/status/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert('✅ ' + data.mensagem);
            location.reload();
        } else {
            alert('❌ ' + data.erro);
        }
    } catch (error) {
        console.error(error);
        alert('❌ Erro ao atualizar status');
    }
}

async function verDetalhes(id) {
    const modal = document.getElementById('modalDetalhes');
    const conteudo = document.getElementById('conteudoModal');
    
    modal.style.display = 'flex';
    conteudo.innerHTML = '<p style="text-align: center;">Carregando...</p>';

    try {
        const response = await fetch(`/admin/agendamento/detalhes/${id}`);
        const data = await response.json();

        if (data.sucesso) {
            const ag = data.agendamento;
            conteudo.innerHTML = `
                <div class="detalhes-section">
                    <h4>👤 Cliente</h4>
                    <p><strong>Nome:</strong> ${ag.Usuario.Nome}</p>
                    <p><strong>CPF:</strong> ${ag.Usuario.Cpf}</p>
                    <p><strong>Email:</strong> ${ag.Usuario.Email}</p>
                    <p><strong>Telefone:</strong> ${ag.Usuario.Telefone || 'Não informado'}</p>
                </div>
                <div class="detalhes-section">
                    <h4>🐾 Pet</h4>
                    <p><strong>Nome:</strong> ${ag.Pet.Nome}</p>
                    <p><strong>Tipo:</strong> ${ag.Pet.Tipo}</p>
                    <p><strong>Porte:</strong> ${ag.Pet.Porte}</p>
                    <p><strong>Idade:</strong> ${ag.Pet.Idade} anos</p>
                </div>
                <div class="detalhes-section">
                    <h4>📋 Serviços</h4>
                    ${ag.servicos.map(s => `<p>• ${s.Nome} - R$ ${parseFloat(s.Valor).toFixed(2).replace('.', ',')}</p>`).join('')}
                    <p><strong>Total: R$ ${parseFloat(ag.valorTotal).toFixed(2).replace('.', ',')}</strong></p>
                </div>
                ${ag.observacoes ? `
                <div class="detalhes-section">
                    <h4>📝 Observações</h4>
                    <p>${ag.observacoes}</p>
                </div>
                ` : ''}
            `;
        }
    } catch (error) {
        conteudo.innerHTML = '<p style="color: red;">Erro ao carregar detalhes</p>';
    }
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
}
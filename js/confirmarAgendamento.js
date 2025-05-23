document.addEventListener('DOMContentLoaded', () => {
    // Dados do PET
    const petNome = localStorage.getItem('petNome');
    const petFoto = localStorage.getItem('petFoto');
    const servicoSelecionado = localStorage.getItem('servicoSelecionado');
    const servicosAdicionais = JSON.parse(localStorage.getItem('servicosAdicionais')) || [];
  
    // Preencher informações no card
    if (petNome && petFoto) {
      document.getElementById('pet-nome').textContent = petNome;
      document.getElementById('pet-foto').textContent = petFoto;
    }
  
    if (servicoSelecionado) {
      document.getElementById('servico-principal').textContent = servicoSelecionado;
    }
  
    // Listar serviços adicionais (se existirem)
    const adicionaisContainer = document.getElementById('lista-adicionais');
    if (servicosAdicionais.length > 0) {
      servicosAdicionais.forEach(serv => {
        const li = document.createElement('li');
        li.textContent = serv;
        adicionaisContainer.appendChild(li);
      });
    } else {
      adicionaisContainer.innerHTML = "<li class='text-muted'>Nenhum adicional selecionado.</li>";
    }
  
    // Flatpickr
    flatpickr("#inputDataHora", {
      enableTime: true,
      dateFormat: "d/m/Y H:i",
      minDate: "today",
      locale: "pt"
    });
  
    // Mostrar modal
    const opcaoData = document.getElementById("data_horario");
    opcaoData.addEventListener("click", () => {
      const modal = new bootstrap.Modal(document.getElementById('modalAgendamento'));
      modal.show();
    });
  
    // Salvar data e hora
    document.getElementById("btnSalvarData").addEventListener("click", () => {
      const dataHora = document.getElementById("inputDataHora").value;
      if (dataHora) {
        localStorage.setItem("dataHoraSelecionada", dataHora);
        alert("Data e hora selecionadas: " + dataHora);
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgendamento'));
        modal.hide();
      } else {
        alert("Por favor, selecione uma data e hora.");
      }
    });
  });
  
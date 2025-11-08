let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let dataSelecionada = null;
let horarioSelecionado = null;

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

document.addEventListener('DOMContentLoaded', () => {
  // Contador de caracteres
  const observacoes = document.getElementById('observacoes');
  const charCount = document.getElementById('charCount');
  
  observacoes.addEventListener('input', () => {
    charCount.textContent = observacoes.value.length;
  });

  // Navegação do calendário
  document.getElementById('mesAnterior').addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) {
      mesAtual = 11;
      anoAtual--;
    }
    renderizarCalendario();
  });

  document.getElementById('proximoMes').addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual++;
    }
    renderizarCalendario();
  });

  // Botão finalizar
  document.getElementById('btnFinalizar').addEventListener('click', finalizarAgendamento);

  // Renderizar calendário inicial
  renderizarCalendario();
});

function renderizarCalendario() {
  const calendarioDias = document.getElementById('calendarioDias');
  const mesAnoSpan = document.getElementById('mesAno');
  
  mesAnoSpan.textContent = `${meses[mesAtual]} ${anoAtual}`;
  
  // Primeiro dia do mês
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  
  // Último dia do mês
  const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
  
  // Dias do mês anterior
  const diasMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();
  
  let html = '';
  
  // Dias do mês anterior (cinza)
  for (let i = primeiroDia - 1; i >= 0; i--) {
    html += `<div class="dia outro-mes">${diasMesAnterior - i}</div>`;
  }
  
  // Dias do mês atual
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const dataAtual = new Date(anoAtual, mesAtual, dia);
    dataAtual.setHours(0, 0, 0, 0);
    
    const isPast = dataAtual < hoje;
    const isDomingo = dataAtual.getDay() === 0;
    const isSelected = dataSelecionada && 
                       dataSelecionada.getDate() === dia && 
                       dataSelecionada.getMonth() === mesAtual &&
                       dataSelecionada.getFullYear() === anoAtual;
    
    let classes = 'dia';
    if (isPast || isDomingo) classes += ' disabled';
    if (isSelected) classes += ' selected';
    
    const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    html += `<div class="${classes}" data-data="${dataStr}" onclick="selecionarData('${dataStr}')">${dia}</div>`;
  }
  
  calendarioDias.innerHTML = html;
}

async function selecionarData(dataStr) {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  
  // Verificar se é dia passado ou domingo
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);
  
  if (data < hoje || data.getDay() === 0) return;
  
  dataSelecionada = data;
  horarioSelecionado = null;
  
  renderizarCalendario();
  
  // Mostrar container de horários
  const horariosContainer = document.getElementById('horariosContainer');
  const loadingHorarios = document.getElementById('loadingHorarios');
  const horariosGrid = document.getElementById('horariosGrid');
  
  horariosContainer.style.display = 'block';
  loadingHorarios.style.display = 'block';
  horariosGrid.innerHTML = '';
  
  // Buscar horários disponíveis
  try {
    const response = await fetch(`/api/horarios-disponiveis?data=${dataStr}&duracao=${duracaoTotal}`);
    const horarios = await response.json();
    
    loadingHorarios.style.display = 'none';
    
    if (horarios.length === 0) {
      horariosGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Nenhum horário disponível para esta data.</p>';
      return;
    }
    
    horariosGrid.innerHTML = horarios.map(h => `
      <div class="horario ${h.disponivel ? '' : 'ocupado'}" 
           data-horario="${h.horario}"
           onclick="selecionarHorario('${h.horario}', ${h.disponivel})">
        ${h.horario}
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    loadingHorarios.style.display = 'none';
    horariosGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Erro ao carregar horários. Tente novamente.</p>';
  }
}

function selecionarHorario(horario, disponivel) {
  if (!disponivel) return;
  
  // Remover seleção anterior
  document.querySelectorAll('.horario').forEach(h => h.classList.remove('selected'));
  
  // Adicionar seleção atual
  event.target.classList.add('selected');
  horarioSelecionado = horario;
  
  // Habilitar botão finalizar
  document.getElementById('btnFinalizar').disabled = false;
}

async function finalizarAgendamento() {
  if (!dataSelecionada || !horarioSelecionado) {
    alert('Por favor, selecione data e horário');
    return;
  }
  
  const btnFinalizar = document.getElementById('btnFinalizar');
  btnFinalizar.disabled = true;
  btnFinalizar.textContent = 'Processando...';
  
  const observacoes = document.getElementById('observacoes').value;
  
  const dados = {
    petId,
    servicosIds,
    data: dataSelecionada.toISOString().split('T')[0],
    horario: horarioSelecionado,
    observacoes
  };
  
  try {
    const response = await fetch('/api/criar-agendamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert('✅ Agendamento realizado com sucesso!');
      window.location.href = '/meus-agendamentos';
    } else {
      throw new Error(result.erro || 'Erro ao criar agendamento');
    }
    
  } catch (error) {
    console.error('Erro:', error);
    alert('❌ Erro ao criar agendamento: ' + error.message);
    btnFinalizar.disabled = false;
    btnFinalizar.textContent = 'Confirmar Agendamento';
  }
}
 
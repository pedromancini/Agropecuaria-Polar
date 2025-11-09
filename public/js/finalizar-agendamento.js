
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let dataSelecionada = null;
let horarioSelecionado = null;

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Sistema de agendamento inicializado');
  console.log('Dados recebidos:', { petId, servicosIds, duracaoTotal });

  // Contador de caracteres
  const observacoes = document.getElementById('observacoes');
  const charCount = document.getElementById('charCount');
  
  observacoes.addEventListener('input', () => {
    charCount.textContent = observacoes.value.length;
  });

  // Navegação do calendário
  document.getElementById('mesAnterior').addEventListener('click', () => {
    const hoje = new Date();
    const mesMinimo = hoje.getMonth();
    const anoMinimo = hoje.getFullYear();
    
    mesAtual--;
    if (mesAtual < 0) {
      mesAtual = 11;
      anoAtual--;
    }
    
    // Não permite navegar para meses anteriores ao atual
    if (anoAtual < anoMinimo || (anoAtual === anoMinimo && mesAtual < mesMinimo)) {
      mesAtual = mesMinimo;
      anoAtual = anoMinimo;
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

  document.getElementById('btnFinalizar').addEventListener('click', finalizarAgendamento);

  renderizarCalendario();
});

//calendario renderizador 
function renderizarCalendario() {
  const calendarioDias = document.getElementById('calendarioDias');
  const mesAnoSpan = document.getElementById('mesAno');
  
  mesAnoSpan.textContent = `${meses[mesAtual]} ${anoAtual}`;
  
  // Primeiro dia do mês (0 = domingo, 1 = segunda, ...)
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  
  // Último dia do mês
  const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
  
  // Dias do mês anterior (para preencher início)
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
    
    const onclick = (isPast || isDomingo) ? '' : `onclick="selecionarData('${dataStr}')"`;
    
    html += `<div class="${classes}" data-data="${dataStr}" ${onclick}>${dia}</div>`;
  }
  

  const totalDias = primeiroDia + ultimoDia;
  const diasRestantes = 7 - (totalDias % 7);
  if (diasRestantes < 7) {
    for (let i = 1; i <= diasRestantes; i++) {
      html += `<div class="dia outro-mes">${i}</div>`;
    }
  }
  
  calendarioDias.innerHTML = html;
}

// selecao de data
async function selecionarData(dataStr) {
  console.log('📅 Data selecionada:', dataStr);
  
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);
  
  if (data < hoje || data.getDay() === 0) {
    console.log('⚠️ Data inválida');
    return;
  }
  
  dataSelecionada = data;
  horarioSelecionado = null;
  
  renderizarCalendario();
  

  const horariosContainer = document.getElementById('horariosContainer');
  const loadingHorarios = document.getElementById('loadingHorarios');
  const horariosGrid = document.getElementById('horariosGrid');
  
  horariosContainer.style.display = 'block';
  loadingHorarios.style.display = 'block';
  horariosGrid.innerHTML = '';

  document.getElementById('btnFinalizar').disabled = true;
  
 // busca d horarios disponiveis
  try {
    console.log('🔍 Buscando horários disponíveis...');
    console.log('Parâmetros:', { data: dataStr, duracao: duracaoTotal });
    
    const response = await fetch(`/api/horarios-disponiveis?data=${dataStr}&duracao=${duracaoTotal}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const horarios = await response.json();
    console.log('✅ Horários recebidos:', horarios);
    
    loadingHorarios.style.display = 'none';
    
    if (horarios.length === 0) {
      horariosGrid.innerHTML = `
        <p style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">
          Nenhum horário disponível para esta data.
        </p>
      `;
      return;
    }
    
    horariosGrid.innerHTML = horarios.map(h => `
      <div class="horario ${h.disponivel ? '' : 'ocupado'}" 
           data-horario="${h.horario}"
           onclick="${h.disponivel ? `selecionarHorario('${h.horario}', true)` : ''}">
        ${h.horario}
      </div>
    `).join('');
    
  } catch (error) {
    console.error('❌ Erro ao buscar horários:', error);
    loadingHorarios.style.display = 'none';
    horariosGrid.innerHTML = `
      <p style="grid-column: 1/-1; text-align: center; color: #dc3545; padding: 20px;">
        Erro ao carregar horários. Tente novamente.
      </p>
    `;
  }
}

//selecao de horario
function selecionarHorario(horario, disponivel) {
  if (!disponivel) {
    console.log('⚠️ Horário não disponível:', horario);
    return;
  }
  
  console.log('⏰ Horário selecionado:', horario);
  

  document.querySelectorAll('.horario').forEach(h => h.classList.remove('selected'));
  
  const horarioElement = document.querySelector(`[data-horario="${horario}"]`);
  if (horarioElement) {
    horarioElement.classList.add('selected');
  }
  
  horarioSelecionado = horario;
  
  document.getElementById('btnFinalizar').disabled = false;
}
//finalizar agendamento
async function finalizarAgendamento() {
  if (!dataSelecionada || !horarioSelecionado) {
    alert('⚠️ Por favor, selecione data e horário');
    return;
  }
  
  const btnFinalizar = document.getElementById('btnFinalizar');
  btnFinalizar.disabled = true;
  btnFinalizar.textContent = 'Processando...';
  
  const observacoes = document.getElementById('observacoes').value;
  
  const dados = {
    petId: petId,
    servicosIds: servicosIds,
    data: dataSelecionada.toISOString().split('T')[0],
    horario: horarioSelecionado,
    observacoes: observacoes
  };
  
  console.log('📤 Enviando agendamento:', dados);
  
  try {
    const response = await fetch('/api/criar-agendamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });
    
    const result = await response.json();
    console.log('📥 Resposta do servidor:', result);
    
    if (response.ok && result.sucesso) {
      alert('✅ Agendamento realizado com sucesso!');
      window.location.href = '/meus-agendamentos';
    } else {
      throw new Error(result.erro || 'Erro ao criar agendamento');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
    alert('❌ Erro ao criar agendamento: ' + error.message);
    btnFinalizar.disabled = false;
    btnFinalizar.textContent = 'Confirmar Agendamento';
  }
}


window.selecionarData = selecionarData;
window.selecionarHorario = selecionarHorario;
window.finalizarAgendamento = finalizarAgendamento;
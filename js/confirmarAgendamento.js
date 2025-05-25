// confirmarAgendamento.js
document.addEventListener("DOMContentLoaded", () => {
    // Dados do PET
    const petNome = localStorage.getItem("petNome");
    const petFoto = localStorage.getItem("petFoto");
    const servicoSelecionado = localStorage.getItem("servicoSelecionado");
    const precoServicoPrincipal = localStorage.getItem("precoServicoPrincipal");
    const servicosAdicionaisComPreco = JSON.parse(localStorage.getItem("servicosAdicionaisComPreco")) || [];
    const precoTotalAdicionais = localStorage.getItem("precoTotalAdicionais");

    if (petNome && petFoto) {
        document.getElementById("pet-nome").textContent = petNome;
        document.getElementById("pet-foto").textContent = petFoto;
    }

    if (servicoSelecionado && precoServicoPrincipal) {
        document.getElementById("servico-principal").textContent = `${servicoSelecionado} (R$ ${precoServicoPrincipal})`;

        const badgePreco = document.querySelector('.badge.bg-light.text-success.fs-6');
        if (badgePreco) {
            badgePreco.textContent = `R$ ${precoServicoPrincipal}`;
        }
    } else if (servicoSelecionado) {
        document.getElementById("servico-principal").textContent = servicoSelecionado;
        const badgePreco = document.querySelector('.badge.bg-light.text-success.fs-6');
        if (badgePreco) {
            badgePreco.textContent = `R$ 0,00`;
        }
    }

    const adicionaisContainer = document.getElementById("lista-adicionais");
    let valorTotal = parseFloat(precoServicoPrincipal || 0) + parseFloat(precoTotalAdicionais || 0);

    if (servicosAdicionaisComPreco.length > 0) {
        servicosAdicionaisComPreco.forEach(adicional => {
            const li = document.createElement("li");
            li.textContent = `${adicional.nome} (R$ ${adicional.preco})`;
            adicionaisContainer.appendChild(li);
        });
        if (precoTotalAdicionais) {
            const liTotalAdicionais = document.createElement("li");
            liTotalAdicionais.classList.add("fw-bold", "mt-2");
            liTotalAdicionais.textContent = `Total Adicionais: R$ ${precoTotalAdicionais}`;
            adicionaisContainer.appendChild(liTotalAdicionais);
            valorTotal = parseFloat(precoServicoPrincipal || 0) + parseFloat(precoTotalAdicionais);
        }
    } else {
        adicionaisContainer.innerHTML = "<li class='text-muted'>Nenhum adicional selecionado.</li>";
    }

    const badgePreco = document.querySelector('.badge.bg-light.text-success.fs-6');
    if (badgePreco) {
        badgePreco.textContent = `R$ ${valorTotal.toFixed(2)}`;
    }

    // LISTA TEMPORARIA, IMPLEMENTAR API APÓS COMEÇAR BANCO E BACK-END
    const horariosDisponiveisPorDia = {
        "2025-05-25": ["10:00", "11:00", "14:00"],
        "2025-05-26": ["09:00", "15:00", "16:00"],
        "2025-05-30": ["10:30", "13:00", "17:30"], 
        "2025-05-30": ["10:30", "13:00", "18:30"], 
        "2025-05-30": ["10:30", "13:00", "19:30"],
        
        "2025-06-01": ["10:30", "13:00", "19:30"],
        "2025-06-02": ["10:30", "13:00", "19:30"],
        "2025-06-03": ["10:30", "13:00", "19:30"], 
        "2025-06-04": ["10:30", "13:00", "19:30"], 
        "2025-06-05": ["10:30", "13:00", "19:30"], 
    };

    let horariosReservados = JSON.parse(localStorage.getItem("horariosReservados")) || [];

    const seletorData = document.getElementById("seletor-data");
    const seletorHorario = document.getElementById("seletor-horario");
    const containerHorarios = document.getElementById("container-horarios");
    const botaoAgendar = document.getElementById("botao-agendar");
    const modalAgendamentoConcluido = new bootstrap.Modal(document.getElementById("modalAgendamentoConcluido"));
    const contadorRedirecionamento = document.getElementById("contador-redirecionamento");

    const datasDisponiveis = Object.keys(horariosDisponiveisPorDia).sort();
    datasDisponiveis.forEach(data => {
        const option = document.createElement("option");
        const partesData = data.split('-');
        option.value = data;
        option.textContent = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
        seletorData.appendChild(option);
    });

    function atualizarHorariosDisponiveis(dataSelecionada) {
        seletorHorario.innerHTML = '<option value="" disabled selected>Selecione o horário</option>';
        containerHorarios.innerHTML = '';
        if (horariosDisponiveisPorDia[dataSelecionada]) {
            const horariosFiltrados = horariosDisponiveisPorDia[dataSelecionada].filter(hora =>
                !horariosReservados.includes(`${dataSelecionada} ${hora}`)
            );

            if (horariosFiltrados.length > 0) {
                horariosFiltrados.forEach(hora => {
                    const option = document.createElement("option");
                    option.value = `${dataSelecionada} ${hora}`;
                    option.textContent = hora;
                    seletorHorario.appendChild(option);
                });
                seletorHorario.disabled = false;
                botaoAgendar.disabled = false;
            } else {
                const mensagem = document.createElement("p");
                mensagem.classList.add("text-muted", "mt-2");
                mensagem.textContent = "Não há horários disponíveis para este dia.";
                containerHorarios.appendChild(mensagem);
                seletorHorario.disabled = true;
                botaoAgendar.disabled = true;
            }
        } else {
            const mensagem = document.createElement("p");
            mensagem.classList.add("text-muted", "mt-2");
            mensagem.textContent = "Selecione uma data para ver os horários.";
            containerHorarios.appendChild(mensagem);
            seletorHorario.disabled = true;
            botaoAgendar.disabled = true;
        }
    }

    seletorData.addEventListener("change", (event) => {
        atualizarHorariosDisponiveis(event.target.value);
    });

    function redirecionarParaInicio() {
        let tempoRestante = 3;
        const intervalo = setInterval(() => {
            contadorRedirecionamento.textContent = tempoRestante;
            tempoRestante--;
            if (tempoRestante < 0) {
                clearInterval(intervalo);
                window.location.href = "/"; 
            }
        }, 1000);
    }


    botaoAgendar.addEventListener("click", () => {
        const horarioSelecionado = seletorHorario.value;
        if (horarioSelecionado) {
            if (!horariosReservados.includes(horarioSelecionado)) {
                horariosReservados.push(horarioSelecionado);
                localStorage.setItem("horariosReservados", JSON.stringify(horariosReservados));

                modalAgendamentoConcluido.show();
                redirecionarParaInicio();
            } else {
                alert("Este horário já está reservado.");
            }
        } else {
            alert("Por favor, selecione um horário.");
        }
    });


    if (datasDisponiveis.length > 0) {
        atualizarHorariosDisponiveis(datasDisponiveis[0]);
    } else {
        const mensagem = document.createElement("p");
        mensagem.classList.add("text-muted", "mt-2");
        mensagem.textContent = "Nenhum horário disponível no momento.";
        containerHorarios.appendChild(mensagem);
        seletorHorario.disabled = true;
        botaoAgendar.disabled = true;
    }
});
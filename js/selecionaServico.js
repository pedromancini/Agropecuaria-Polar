// selecionaServico.js
document.addEventListener("DOMContentLoaded", () => {
    // Lógica para destacar serviço selecionado e armazenar preço
    const servicos = document.querySelectorAll(".servico-item");
    let precoServicoPrincipal = 0;

    servicos.forEach(card => {
        card.addEventListener("click", () => {
            servicos.forEach(c => c.classList.remove("border-primary"));
            card.classList.add("border-primary");


            const nomeServico = card.querySelector('.fw-bold').textContent;
            precoServicoPrincipal = parseFloat(card.dataset.preco);
            localStorage.setItem('servicoSelecionado', nomeServico);
            localStorage.setItem('precoServicoPrincipal', precoServicoPrincipal.toFixed(2));
        });
    });

    const petNome = localStorage.getItem('petNome');
    const petFoto = localStorage.getItem('petFoto');

    if (petNome && petFoto) {
        const petNomeElemento = document.querySelector('.pet-selecionado .fw-semibold');
        const petFotoElemento = document.querySelector('.pet-selecionado .icone-pet');
        petNomeElemento.textContent = petNome;
        petFotoElemento.innerHTML = petFoto;
    }


    const btnAvancar = document.getElementById('btn-avancar');
    btnAvancar.addEventListener('click', () => {

        const adicionaisSelecionadosComPreco = [];
        let precoTotalAdicionais = 0;
        const adicionais = document.querySelectorAll('.adicional-item input[type="checkbox"]');
        adicionais.forEach(checkbox => {
            if (checkbox.checked) {
                const nomeAdicional = checkbox.closest('.adicional-item').querySelector('span').textContent;
                const precoAdicional = parseFloat(checkbox.closest('.adicional-item').dataset.preco);
                adicionaisSelecionadosComPreco.push({ nome: nomeAdicional, preco: precoAdicional.toFixed(2) });
                precoTotalAdicionais += precoAdicional;
            }
        });
        localStorage.setItem('servicosAdicionaisComPreco', JSON.stringify(adicionaisSelecionadosComPreco));
        localStorage.setItem('precoTotalAdicionais', precoTotalAdicionais.toFixed(2));

        // Redirecionar
        window.location.href = 'confirmarAgendamento.html';
    });
});
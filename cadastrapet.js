$(document).ready(function () {
    const tiposPet = $(".btn[data-tipo]");
    const campoDescricaoOutro = $("#outroDescricao");
    const selectRaca = $("#raca");
    const imagemPreview = $("#imagem-preview");

    let cropper;

    // Lida com a seleção do tipo de pet (Cachorro, Gato, Outro)
    tiposPet.on("click", function () {
        const tipo = $(this).data("tipo");

        // Remove destaque anterior e adiciona ao atual
        tiposPet.removeClass("selected");
        $(this).addClass("selected");

        // Esconde o campo "Outro" e reseta raças
        campoDescricaoOutro.hide();
        selectRaca.empty().append('<option value="">Selecione a raça</option>');

        // Exibe campo descrição ou busca raças via API
        if (tipo === "outro") {
            campoDescricaoOutro.show();
        } else {
            fetchRacas(tipo);
        }
    });

    // Função para buscar as raças do pet via API
    function fetchRacas(tipo) {
        let apiUrl = "";

        if (tipo === "cachorro") {
            apiUrl = "https://api.thedogapi.com/v1/breeds";
        } else if (tipo === "gato") {
            apiUrl = "https://api.thecatapi.com/v1/breeds";
        } else if (tipo === "coelho") {
            const racasCoelho = ["Lionhead", "Dutch", "Lop", "Rex"];
            racasCoelho.forEach(function (raca) {
                selectRaca.append('<option value="' + raca + '">' + raca + '</option>');
            });
            return;
        }

        if (apiUrl) {
            $.get(apiUrl, function (data) {
                data.forEach(function (item) {
                    selectRaca.append('<option value="' + item.name + '">' + item.name + '</option>');
                });
            });
        }
    }

    // Tratamento do campo de nascimento (não sei)
    $("#nao-sei").on("change", function () {
        const dataInput = $("#data-nascimento");
        const desabilitar = $(this).is(":checked");
        dataInput.prop("disabled", desabilitar);
        if (desabilitar) {
            dataInput.val("");
        }
    });

    // Validação de peso
    const pesoInput = document.getElementById("peso");

    pesoInput.addEventListener("input", function () {
        this.value = this.value.replace(",", ".");
        this.value = this.value.replace(/[^0-9.]/g, "");

        const parts = this.value.split(".");
        if (parts.length > 2) {
            this.value = parts[0] + "." + parts.slice(1).join("");
        }

        if (parseFloat(this.value) > 199) {
            this.value = "199";
        }

        if (parseFloat(this.value) < 0) {
            this.value = "0";
        }
    });

    // Função para abrir o modal de recorte
    function abrirModalRecorte(imagemSrc) {
        const modalImagem = $("#imagemRecorte");
        modalImagem.attr("src", imagemSrc);
        $("#modalRecorte").modal("show");

        // Destruir a instância anterior do cropper, se houver
        if (cropper) {
            cropper.destroy();
        }

        // Inicializar o Cropper.js na nova imagem com ajustes para o círculo
        cropper = new Cropper(modalImagem[0], {
            aspectRatio: 1, // Proporção quadrada
            viewMode: 2, // Modo de visualização
            autoCropArea: 0.8, // Tamanho inicial da área de corte
            responsive: true,
            zoomable: true,
            // Adiciona uma borda para indicar a área de recorte
            cropBoxResizable: true,
            cropBoxMovable: true,
            guides: true, // Exibe guias para a área de recorte
            background: true, // Permite fundo visível
            center: true,
            highlight: true, 
            dragMode: 'move' 
        });
    }

    // Carregar imagem e abrir modal
    document.getElementById('fotoInput').addEventListener('change', function (event) {
        const input = event.target;
        const imagem = document.getElementById('previewImagem');
        const icone = document.getElementById('iconeCamera');
        const texto = document.getElementById('textoFoto');

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imagem.src = e.target.result;
                imagem.style.display = 'block'; // Mostrar imagem na prévia
                icone.style.display = 'none';
                texto.style.display = 'none';

                // Abre o modal de recorte
                abrirModalRecorte(e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    });

    // Função para salvar o recorte
    $("#salvarRecorte").on("click", function () {
        const canvas = cropper.getCroppedCanvas();
        const imagemRecortada = canvas.toDataURL(); // Imagem recortada em base64

        // Atualiza a imagem de pré-visualização com a imagem recortada
        const imagemPreview = $("#previewImagem");
        imagemPreview.attr("src", imagemRecortada);
        imagemPreview.show();

        // Fecha o modal
        $("#modalRecorte").modal("hide");
        // Reseta o input para permitir reenviar a mesma imagem
        $('#fotoInput').val('');

    });
});

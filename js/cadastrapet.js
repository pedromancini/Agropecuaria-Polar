$(document).ready(function () {
    const tiposPet = $(".btn[data-tipo]");
    const campoDescricaoOutro = $("#outroDescricao");
    const selectRacaContainer = $("#raca-container");
    const selectRaca = $("#raca");
    const imagemPreview = $("#previewImagem");
    const icone = $("#iconeCamera");
    const texto = $("#textoFoto");

    let cropper;

    tiposPet.on("click", function () {
        const tipo = $(this).data("tipo");

        tiposPet.removeClass("selected");
        $(this).addClass("selected");

        campoDescricaoOutro.hide();
        selectRacaContainer.hide();
        selectRaca.empty().append('<option value="">Selecione a raça</option>');

        if (tipo === "outro") {
            campoDescricaoOutro.show();
        } else {
            selectRacaContainer.show();
            fetchRacas(tipo);
        }
    });

    function fetchRacas(tipo) {
        let apiUrl = "";

        if (tipo === "cachorro") {
            apiUrl = "https://api.thedogapi.com/v1/breeds";
        } else if (tipo === "gato") {
            apiUrl = "https://api.thecatapi.com/v1/breeds";
        }

        if (apiUrl) {
            $.get(apiUrl, function (data) {
                data.forEach(function (item) {
                    selectRaca.append(`<option value="${item.name}">${item.name}</option>`);
                });
            });
        }
    }

    $("#nao-sei").on("change", function () {
        const dataInput = $("#data-nascimento");
        const desabilitar = $(this).is(":checked");
        dataInput.prop("disabled", desabilitar);
        if (desabilitar) dataInput.val("");
    });

    $("#peso").on("input", function () {
        this.value = this.value.replace(",", ".").replace(/[^0-9.]/g, "");

        const parts = this.value.split(".");
        if (parts.length > 2) {
            this.value = parts[0] + "." + parts.slice(1).join("");
        }

        let valor = parseFloat(this.value);
        if (valor > 199) this.value = "199";
        if (valor < 0) this.value = "0";
    });

    function abrirModalRecorte(imagemSrc) {
        const modalImagem = $("#imagemRecorte");
        modalImagem.attr("src", imagemSrc);
        const modal = new bootstrap.Modal(document.getElementById('modalRecorte'));
        modal.show();

        modal._element.addEventListener('shown.bs.modal', function () {
            if (cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(modalImagem[0], {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                responsive: true,
                background: false,
                center: true,
                movable: true,
                zoomable: true,
                rotatable: false,
                scalable: false,
                dragMode: 'move'
            });
        }, { once: true });
    }

    $('#fotoInput').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            abrirModalRecorte(url);
        }
    });

    $("#salvarRecorte").on("click", function () {
        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300,
        });
        const imagemRecortada = canvas.toDataURL();

        imagemPreview.attr("src", imagemRecortada).show();
        icone.hide();
        texto.hide();

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRecorte'));
        modal.hide();

        cropper.destroy();
        cropper = null;

        $('#fotoInput').val('');
    });

    $(".btn-img-voltar").on("click", function () {
        window.location.href = "/pages/agendamento.html";
    });

    $(".pet-form").on("submit", function (e) {
        e.preventDefault();

        // Validações (imagem não é mais obrigatória)
        const nome = $("#nome").val().trim();
        const tipoSelecionado = $(".btn[data-tipo].selected").length > 0;
        const sexoSelecionado = $("input[name='sexo']:checked").length > 0;
        const peso = $("#peso").val().trim();

        if (!nome || !tipoSelecionado || !sexoSelecionado || !peso) {
            alert("Por favor, preencha todos os campos obrigatórios: Nome, Tipo, Sexo e Peso.");
            return;
        }

        const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));
        modalSucesso.show();

        let contador = 3;
        const contadorSpan = document.getElementById('contador-redirecionamento');

        const intervalId = setInterval(() => {
            contador--;
            contadorSpan.textContent = contador;

            if (contador === 0) {
                clearInterval(intervalId);
                modalSucesso.hide();
                window.history.back();
            }
        }, 1000);
    });


});

 AOS.init();
document.addEventListener("DOMContentLoaded", function () {
    // Inicialização dos modais
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    const registroModal = new bootstrap.Modal(document.getElementById("registroModal"));

    // Alternar visibilidade da senha no login
    const togglePasswordLogin = document.getElementById("togglePassword");
    const passwordLogin = document.getElementById("password");

    if (togglePasswordLogin && passwordLogin) {
        togglePasswordLogin.addEventListener("click", function () {
            const type = passwordLogin.type === "password" ? "text" : "password";
            passwordLogin.type = type;
            this.innerHTML = type === "password"
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';
        });
    }

    const toggleSenhaRegistro = document.getElementById("toggleSenha");
    const senhaRegistro = document.getElementById("senha");

    if (toggleSenhaRegistro && senhaRegistro) {
        toggleSenhaRegistro.addEventListener("click", function () {
            const type = senhaRegistro.type === "password" ? "text" : "password";
            senhaRegistro.type = type;
            this.innerHTML = type === "password"
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Alternar visibilidade da confirmação de senha
    const toggleConfirmarSenhaRegistro = document.getElementById("toggleConfirmarSenha");
    const confirmarSenhaRegistro = document.getElementById("confirmarSenha");

    if (toggleConfirmarSenhaRegistro && confirmarSenhaRegistro) {
        toggleConfirmarSenhaRegistro.addEventListener("click", function () {
            const type = confirmarSenhaRegistro.type === "password" ? "text" : "password";
            confirmarSenhaRegistro.type = type;
            this.innerHTML = type === "password"
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // masscara automática para CPF
    const cpfInput = document.getElementById("cpf");
    if (cpfInput) {
        cpfInput.addEventListener("input", function (e) {
            let value = e.target.value.replace(/\D/g, "").slice(0, 11);
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
            } else if (value.length >= 7) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
            } else if (value.length >= 4) {
                value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
            }
            e.target.value = value;
        });
    }


    const registroForm = document.getElementById("registroForm");
    const mensagemCadastro = document.getElementById("mensagemCadastro");

    if (registroForm) {
        registroForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const senha = senhaRegistro.value;
            const confirmarSenha = confirmarSenhaRegistro.value;
            const cpf = cpfInput.value;

            if (!validarCPF(cpf)) {
                mensagemCadastro.classList.remove("d-none", "alert-success");
                mensagemCadastro.classList.add("alert", "alert-danger");
                mensagemCadastro.textContent = "CPF inválido. Verifique e tente novamente.";
                return;
            }

            if (senha !== confirmarSenha) {
                mensagemCadastro.classList.remove("d-none", "alert-success");
                mensagemCadastro.classList.add("alert", "alert-danger");
                mensagemCadastro.textContent = "As senhas não correspondem!";
            } else {
                mensagemCadastro.classList.remove("d-none", "alert-danger");
                mensagemCadastro.classList.add("alert", "alert-success");
                mensagemCadastro.textContent = "Cadastro realizado com sucesso!";

                registroForm.reset();

                setTimeout(() => {
                    registroModal.hide();
                    mensagemCadastro.classList.add("d-none");
                }, 1500);
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            loginMessage.classList.remove("d-none", "alert-danger");
            loginMessage.classList.add("alert", "alert-success");
            loginMessage.textContent = "Login realizado com sucesso!";

            loginForm.reset();

            setTimeout(() => {
                loginModal.hide();
                loginMessage.classList.add("d-none");
            }, 1500);
        });
    }


    const formRecuperacao = document.getElementById("esqueciSenhaForm");
    const mensagemRecuperacao = document.getElementById("mensagemRecuperacao");

    if (formRecuperacao) {
        formRecuperacao.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("emailRecuperacao").value;

            if (email) {
                mensagemRecuperacao.classList.remove("d-none", "alert-danger");
                mensagemRecuperacao.classList.add("alert-success");
                mensagemRecuperacao.textContent = `Se um cadastro com o e-mail ${email} existir, você receberá um link para recuperar sua senha.`;

                formRecuperacao.reset();

                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById("esqueciSenhaModal"));
                    modal.hide();
                    mensagemRecuperacao.classList.add("d-none");
                }, 5000);
            } else {
                mensagemRecuperacao.classList.remove("d-none", "alert-success");
                mensagemRecuperacao.classList.add("alert-danger");
                mensagemRecuperacao.textContent = "Por favor, insira um e-mail válido.";
            }
        });
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let resto = 11 - (soma % 11);
        if (resto >= 10) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        resto = 11 - (soma % 11);
        if (resto >= 10) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("tituloPrincipal");
  const texto = titulo.textContent;
  titulo.textContent = ""; // Limpa o conteúdo original

  [...texto].forEach((letra, i) => {
    const span = document.createElement("span");
    span.textContent = letra;
    span.className = "letra";
    span.style.animationDelay = `${i * 0.05}s`;
    titulo.appendChild(span);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const subtitulo = document.getElementById("subtituloPrincipal");
  const texto = subtitulo.textContent;
  subtitulo.textContent = "";

  [...texto].forEach((letra, i) => {
    const span = document.createElement("span");
    span.textContent = letra;
    span.className = "letra-onda";
    span.style.animationDelay = `${i * 0.09}s`;
    subtitulo.appendChild(span);
  });
});
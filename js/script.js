document.addEventListener("DOMContentLoaded", function() {
    // Inicialização dos modais usando o Bootstrap
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    const registroModal = new bootstrap.Modal(document.getElementById("registroModal"));

    // Funções para abrir e fechar o modal
    function abrirModal() {
        loginModal.show();
    }

    function fecharModal() {
        loginModal.hide();
    }

    // Alternar visibilidade da senha no modal de login
    const togglePasswordLogin = document.getElementById("togglePassword");
    const passwordLogin = document.getElementById("password");

    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener("click", function() {
            const type = passwordLogin.type === "password" ? "text" : "password";
            passwordLogin.type = type;
            this.innerHTML = type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Alternar visibilidade da senha no modal de registro
    const toggleSenhaRegistro = document.getElementById("toggleSenha");
    const senhaRegistro = document.getElementById("senha");

    if (toggleSenhaRegistro) {
        toggleSenhaRegistro.addEventListener("click", function() {
            const type = senhaRegistro.type === "password" ? "text" : "password";
            senhaRegistro.type = type;
            this.innerHTML = type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Alternar visibilidade da confirmação de senha no modal de registro
    const toggleConfirmarSenhaRegistro = document.getElementById("toggleConfirmarSenha");
    const confirmarSenhaRegistro = document.getElementById("confirmarSenha");

    if (toggleConfirmarSenhaRegistro) {
        toggleConfirmarSenhaRegistro.addEventListener("click", function() {
            const type = confirmarSenhaRegistro.type === "password" ? "text" : "password";
            confirmarSenhaRegistro.type = type;
            this.innerHTML = type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Verificação das senhas no formulário de registro
    const registroForm = document.getElementById("registroForm");
    const mensagemCadastro = document.getElementById("mensagemCadastro");

    if (registroForm) {
        registroForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Impede o envio do formulário

            const senha = senhaRegistro.value;
            const confirmarSenha = confirmarSenhaRegistro.value;

            if (senha !== confirmarSenha) {
                // Exibe mensagem de erro
                mensagemCadastro.classList.remove("d-none", "alert-success");
                mensagemCadastro.classList.add("alert", "alert-danger");
                mensagemCadastro.textContent = "As senhas não correspondem!";
            } else {
                // Exibe mensagem de sucesso
                mensagemCadastro.classList.remove("d-none", "alert-danger");
                mensagemCadastro.classList.add("alert", "alert-success");
                mensagemCadastro.textContent = "Cadastro realizado com sucesso!";

                // Limpa os campos do formulário
                registroForm.reset();

                //Fecha o modal após alguns segundos
                setTimeout(() => {
                    registroModal.hide();
                    mensagemCadastro.classList.add("d-none");
                }, 1500);
            }
        });
    }

    // Manipulação do formulário de login
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Impede o envio do formulário

// implementar logica de login

            // Exibe mensagem de sucesso
            loginMessage.classList.remove("d-none", "alert-danger");
            loginMessage.classList.add("alert", "alert-success");
            loginMessage.textContent = "Login realizado com sucesso!";

            // Limpa os campos do formulário
            loginForm.reset();

            //Fecha o modal após alguns segundos
            setTimeout(() => {
                loginModal.hide();
                loginMessage.classList.add("d-none");
            }, 1500);
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
  const formRecuperacao = document.getElementById("esqueciSenhaForm");
  const mensagemRecuperacao = document.getElementById("mensagemRecuperacao");

  if (formRecuperacao) {
    formRecuperacao.addEventListener("submit", function(event) {
      event.preventDefault();

      const email = document.getElementById("emailRecuperacao").value;

      // Aqui você faria a requisição para backend para enviar email de recuperação
      // Exemplo simples de feedback visual:

      if (email) {
        mensagemRecuperacao.classList.remove("d-none", "alert-danger");
        mensagemRecuperacao.classList.add("alert-success");
        mensagemRecuperacao.textContent = `Se um cadastro com o e-mail ${email} existir, você receberá um link para recuperar sua senha.`;

        // Limpa o campo e desabilita o botão temporariamente, por exemplo:
        formRecuperacao.reset();

        // Opcional: fecha o modal depois de alguns segundos
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
});

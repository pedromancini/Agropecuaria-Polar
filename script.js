document.addEventListener("DOMContentLoaded", function() {

    // Para abrir e fechar o modal usando o Bootstrap
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    const registroModal = new bootstrap.Modal(document.getElementById("registroModal"));

    // Funções para abrir e fechar o modal (usando o Bootstrap)
    function abrirModal() {
        loginModal.show();
    }

    function fecharModal() {
        loginModal.hide();
    }

    // Para o modal de login
    const togglePasswordLogin = document.getElementById("togglePassword");
    const passwordLogin = document.getElementById("password");

    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener("click", function() {
            const type = passwordLogin.type === "password" ? "text" : "password";
            passwordLogin.type = type;
            this.innerHTML = type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Para o modal de registro
    const toggleSenhaRegistro = document.getElementById("toggleSenha");
    const senhaRegistro = document.getElementById("senha");

    if (toggleSenhaRegistro) {
        toggleSenhaRegistro.addEventListener("click", function() {
            const type = senhaRegistro.type === "password" ? "text" : "password";
            senhaRegistro.type = type;
            this.innerHTML = type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Para o campo de confirmar senha no modal de registro
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

    if (registroForm) {
        registroForm.addEventListener("submit", function(event) {
            const senha = senhaRegistro.value;
            const confirmarSenha = confirmarSenhaRegistro.value;

            if (senha !== confirmarSenha) {
                event.preventDefault(); // Impede o envio do formulário
                alert("As senhas não correspondem!");
            }
        });
    }
});

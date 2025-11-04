// Alteração de foto de perfil
const profilePhoto = document.getElementById('profilePhoto');
const photoInput = document.getElementById('photoInput');

profilePhoto.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imagemBase64 = e.target.result;
            
            try {
                const response = await fetch('/perfil/atualizar-foto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ imagemBase64 })
                });

                const data = await response.json();
                
                if (data.sucesso) {
                    profilePhoto.src = imagemBase64;
                    alert('✅ ' + data.mensagem);
                } else {
                    alert('❌ ' + data.erro);
                }
            } catch (error) {
                alert('❌ Erro ao atualizar foto');
            }
        };
        reader.readAsDataURL(file);
    }
});

// Toggle entre visualização e edição
function toggleEdit(section) {
    const viewElement = document.getElementById(`view${section.charAt(0).toUpperCase() + section.slice(1)}`);
    const editElement = document.getElementById(`edit${section.charAt(0).toUpperCase() + section.slice(1)}`);
    
    viewElement.classList.toggle('hidden');
    editElement.classList.toggle('hidden');
}

// Salvar informações pessoais
async function savePessoais() {
    const nome = document.getElementById('editNome').value;
    const email = document.getElementById('editEmail').value;
    const telefone = document.getElementById('editTelefone').value;

    try {
        const response = await fetch('/perfil/atualizar-dados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, telefone })
        });

        const data = await response.json();

        if (data.sucesso) {
            document.getElementById('viewNome').textContent = nome;
            document.getElementById('viewEmail').textContent = email;
            document.getElementById('viewTelefone').textContent = telefone;
            document.getElementById('displayName').textContent = nome;
            document.getElementById('displayEmail').textContent = email;
            
            toggleEdit('pessoais');
            alert('✅ ' + data.mensagem);
        } else {
            alert('❌ ' + data.erro);
        }
    } catch (error) {
        alert('❌ Erro ao atualizar dados');
    }
}

// Salvar endereço
async function saveEndereco() {
    const cep = document.getElementById('editCep').value;
    const rua = document.getElementById('editRua').value;
    const numero = document.getElementById('editNumero').value;
    const bairro = document.getElementById('editBairro').value;
    const cidade = document.getElementById('editCidade').value;
    const estado = document.getElementById('editEstado').value;

    try {
        const response = await fetch('/perfil/atualizar-endereco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cep, rua, numero, bairro, cidade, estado })
        });

        const data = await response.json();

        if (data.sucesso) {
            document.getElementById('viewCep').textContent = cep;
            document.getElementById('viewRua').textContent = rua;
            document.getElementById('viewNumero').textContent = numero;
            document.getElementById('viewBairro').textContent = bairro;
            document.getElementById('viewCidade').textContent = cidade;
            document.getElementById('viewEstado').textContent = estado;
            
            toggleEdit('endereco');
            alert('✅ ' + data.mensagem);
        } else {
            alert('❌ ' + data.erro);
        }
    } catch (error) {
        alert('❌ Erro ao atualizar endereço');
    }
}

// Alterar senha
async function alterarSenha() {
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        alert('⚠️ Por favor, preencha todos os campos!');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert('⚠️ As senhas não coincidem!');
        return;
    }

    if (novaSenha.length < 6) {
        alert('⚠️ A nova senha deve ter no mínimo 6 caracteres!');
        return;
    }

    try {
        const response = await fetch('/perfil/alterar-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senhaAtual, novaSenha, confirmarSenha })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert('✅ ' + data.mensagem);
            document.getElementById('senhaAtual').value = '';
            document.getElementById('novaSenha').value = '';
            document.getElementById('confirmarSenha').value = '';
        } else {
            alert('❌ ' + data.erro);
        }
    } catch (error) {
        alert('❌ Erro ao alterar senha');
    }
}

// Logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        window.location.href = '/logout';
    }
}
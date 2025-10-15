const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const cepError = document.getElementById('cep-error');

// Máscara para CEP
cepInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;

    // Buscar CEP quando tiver 8 dígitos
    if (value.replace(/\D/g, '').length === 8) {
        buscarCEP(value.replace(/\D/g, ''));
    }
});

async function buscarCEP(cep) {
    cepError.textContent = '';
    
    // Desabilitar campos enquanto busca
    ruaInput.disabled = true;
    bairroInput.disabled = true;
    cidadeInput.disabled = true;
    estadoInput.disabled = true;
    
    cepInput.classList.add('loading');

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            cepError.textContent = 'CEP não encontrado';
            limparCampos();
        } else {
            ruaInput.value = data.logradouro || '';
            bairroInput.value = data.bairro || '';
            cidadeInput.value = data.localidade || '';
            estadoInput.value = data.uf || '';
            
            // Habilitar campos
            ruaInput.disabled = false;
            bairroInput.disabled = false;
            cidadeInput.disabled = false;
            estadoInput.disabled = false;
        }
    } catch (error) {
        cepError.textContent = 'Erro ao buscar CEP. Tente novamente.';
        limparCampos();
    } finally {
        cepInput.classList.remove('loading');
    }
}

function limparCampos() {
    ruaInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
    
    ruaInput.disabled = false;
    bairroInput.disabled = false;
    cidadeInput.disabled = false;
    estadoInput.disabled = false;
}

// Validação de senha
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    const senha = document.getElementById('senha').value;
    const senhaConfirmacao = document.getElementById('senha_confirmacao').value;

    if (senha !== senhaConfirmacao) {
        e.preventDefault();
        alert('As senhas não coincidem!');
    }
});
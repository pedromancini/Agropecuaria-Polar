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

// CPF MASC
const cpfInput = document.getElementById('cpf');
const cpfError = document.getElementById('cpf-error');

cpfInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
        if (value.length > 11) {
        value = value.substring(0, 11);
    }

    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    }
});

cpfInput.addEventListener('blur', function(e) {
    const cpf = e.target.value.replace(/\D/g, '');
    
    if (cpf.length === 0) {
        cpfError.style.display = 'none';
        return;
    }
    
    if (!validarCPF(cpf)) {
        cpfError.textContent = 'CPF inválido';
        cpfError.style.display = 'block';
        e.target.setCustomValidity('CPF inválido');
    } else {
        cpfError.style.display = 'none';
        e.target.setCustomValidity('');
    }
});

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}


//TELEFONE!!
const telefoneInput = document.getElementById('telefone');
const telefoneError = document.getElementById('telefone-error');

telefoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    if (value.length === 0) {
        e.target.value = '';
    } else if (value.length <= 2) {
        value = `(${value}`;
        e.target.value = value;
    } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        e.target.value = value;
    } else if (value.length <= 10) {
        // Telefone fixo: (00) 0000-0000
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        e.target.value = value;
    } else {
        // Celular: (00) 00000-0000
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        e.target.value = value;
    }
});

telefoneInput.addEventListener('blur', function(e) {
    const telefone = e.target.value.replace(/\D/g, '');
    
    if (telefone.length === 0) {
        telefoneError.style.display = 'none';
        return;
    }
    
    // Valida se tem 10 (fixo) ou 11 (celular) dígitos
    if (telefone.length < 10 || telefone.length > 11) {
        telefoneError.textContent = 'Telefone inválido';
        telefoneError.style.display = 'block';
        e.target.setCustomValidity('Telefone inválido');
    } else {
        telefoneError.style.display = 'none';
        e.target.setCustomValidity('');
    }
});
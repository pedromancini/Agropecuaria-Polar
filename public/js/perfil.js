const profilePhoto = document.getElementById("profilePhoto");
const photoInput = document.getElementById("photoInput");

// Upload de foto
photoInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  
  if (!file) return;

  // Validação do tipo de arquivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert("❌ Por favor, selecione apenas imagens (JPG, PNG, GIF ou WEBP)");
    photoInput.value = ""; // Limpa o input
    return;
  }

  // Validação do tamanho (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("❌ A imagem deve ter no máximo 5MB");
    photoInput.value = "";
    return;
  }

  const formData = new FormData();
  formData.append("foto", file);

  try {
    const response = await fetch("/perfil/atualizar-foto", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.sucesso) {
      // Atualiza a imagem com cache bust
      profilePhoto.src = `/uploads/perfil/${result.novaImagem}?t=${Date.now()}`;
      alert("✅ Foto atualizada com sucesso!");
    } else {
      alert("❌ " + (result.erro || "Erro ao atualizar foto."));
    }
  } catch (err) {
    console.error("Erro no upload:", err);
    alert("❌ Erro ao enviar a foto. Tente novamente.");
  } finally {
    // Limpa o input para permitir selecionar a mesma foto novamente se necessário
    photoInput.value = "";
  }
});

function toggleEdit(section) {
  const viewElement = document.getElementById(`view${section.charAt(0).toUpperCase() + section.slice(1)}`);
  const editElement = document.getElementById(`edit${section.charAt(0).toUpperCase() + section.slice(1)}`);
  viewElement.classList.toggle('hidden');
  editElement.classList.toggle('hidden');
}

async function savePessoais() {
  const nome = document.getElementById('editNome').value;
  const email = document.getElementById('editEmail').value;
  const telefone = document.getElementById('editTelefone').value;

  try {
    const response = await fetch('/perfil/atualizar-dados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone })
    });

    const data = await response.json();

    if (data.sucesso) {
      document.getElementById('viewNome').textContent = nome;
      document.getElementById('viewEmail').textContent = email;
      document.getElementById('viewTelefone').textContent = telefone;
      document.getElementById('displayName').textContent = nome;
      toggleEdit('pessoais');
      alert('✅ ' + data.mensagem);
    } else {
      alert('❌ ' + data.erro);
    }
  } catch {
    alert('❌ Erro ao atualizar dados');
  }
}

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
      headers: { 'Content-Type': 'application/json' },
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
  } catch {
    alert('❌ Erro ao atualizar endereço');
  }
}

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
      headers: { 'Content-Type': 'application/json' },
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
  } catch {
    alert('❌ Erro ao alterar senha');
  }
}

function logout() {
  if (confirm('Tem certeza que deseja sair?')) {
    window.location.href = '/logout';
  }
}
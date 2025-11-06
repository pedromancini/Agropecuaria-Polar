async function toggleStatus(id) {
  if (!confirm("Deseja alterar o status deste serviço?")) return;

  try {
    const response = await fetch(`/admin/servicos/toggle/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.sucesso) {
      alert("✅ " + data.mensagem);
      location.reload();
    } else {
      alert("❌ " + (data.erro || "Erro ao alterar status"));
    }
  } catch (error) {
    console.error(error);
    alert("❌ Erro ao processar requisição");
  }
}

// Excluir Serviço
async function excluirServico(id) {
  if (
    !confirm(
      "⚠️ ATENÇÃO: Deseja realmente excluir este serviço?\n\nEsta ação não pode ser desfeita!"
    )
  )
    return;

  try {
    const response = await fetch(`/admin/servicos/excluir/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.sucesso) {
      alert("✅ " + data.mensagem);
      location.reload();
    } else {
      alert("❌ " + (data.erro || "Erro ao excluir"));
    }
  } catch (error) {
    console.error(error);
    alert("❌ Erro ao processar requisição");
  }
}

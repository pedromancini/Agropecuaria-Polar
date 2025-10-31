document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalMensagem");
  if (!modal) return;

  modal.style.display = "block";

  // Fechar ao clicar no X
  modal.querySelector(".close").onclick = () => {
    modal.style.display = "none";
  };

  // Fechar ao clicar fora do modal
  window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
  };

  // Redirect aut.
  const mensagem = modal.querySelector("p").textContent;
  if (mensagem.includes("Login válido")) {
    setTimeout(() => {
      window.location.href = "/";
    }, 2000); // 1 s
  }
});

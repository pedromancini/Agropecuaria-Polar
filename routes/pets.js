router.get("/pets", verificarLogin, async (req, res) => {
  try {
    const pets = await petModel.findAll({
      where: { idUsuario: req.session.usuario.id }
    });
    
    res.render("pets", { pets });
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).send("Erro ao buscar pets");
  }
});
const {router} = require("../config")

router.get("/", (req, res) => {
    res.render("main")
})

module.exports = router
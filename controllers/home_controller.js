
module.exports.home = async function (req, res) {
  return res.render("home_page", {
    title: "Authenticator APP | Home",
  });
};


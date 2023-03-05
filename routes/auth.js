const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUSer = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUSer.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Invalid credentials !!!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Invalid credentials !!!");
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

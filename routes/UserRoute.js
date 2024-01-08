const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Register = require("../Model/Register");
const Login = require("../Model/Login");
const JWT_SECRET = "rahul";

//  Register Page
router.post(
  "/register",
  [
    body("firstname", "Enter a valid first name").isLength({ min: 2 }),
    body("lastname", "Enter a valid last name").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("contact", "Enter a valid contact").isLength({ min: 10 }),
    body("gender", "Enter a valid gender").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const { firstname, lastname, email, password, contact, gender } =
        req.body;

      // Check if the user is already registered or not
      let checkuser = await Login.findOne({ email: email });
      if (checkuser) return res.status(409).send("Email Already Exists");

      // Generate a salt and hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new Register({
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashedPassword, // Use the hashed password
        contact: contact,
        gender: gender,
      });

      // Save the user to the database

      const data = {
        user: {
          id: user._id,
          admin: firstname + lastname,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken);

      const success = true;
      await user.save();
      const Logindata = new Login({
        email: email,
        password: hashedPassword,
      });

      await Logindata.save();
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ msg: "Internal server error occurred", error: error.message });
    }
  }
);

//  2. Authenticating a user using POST: "/api/auth/login". NO login required
// login Route

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a password").exists(),
    body("role", "Enter a role").exists(),
  ],
  async (req, res) => {
    // if there are errors return bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;
    console.log(email, password, role);

    try {
      let user = await Login.findOne({ email });

      if (!user) {
        success = false;
        res
          .status(404)
          .json({ errors: "Please login with correct credential" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credential" });
      }

      const data = {
        user: {
          id: user._id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.cookie("token", authtoken);

      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

router.get("/logout", (req, res) => {
  try {
    res.json("Logout SuccessFull");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error occured");
  }
});

module.exports = router;

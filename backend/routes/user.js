import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { Users } from "../models/users.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Signup route=======================================
router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;
  const user = await Users.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "Email already exists." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new Users({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return res.json({ status: true, message: "User created successfully." });
});

// Signin route=======================================

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    return res.json({ status: false, message: "User does not exist." });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json({ status: false, message: "Invalid Password." });
  }

  // Generate a verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Save the verification code to the user's record (you might want to save this in a different field or table)
  user.verificationCode = verificationCode;
  await user.save();

  // Send verification code to the user's email
  const transporter = nodemailer.createTransport({
    service: "gmail", // replace with your email provider
    auth: {
      user: process.env.MY_EMAIL, // your email address
      pass: process.env.MY_PASSWORD, // your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ status: false, message: "Error sending email." });
    } else {
      return res.json({
        status: true,
        message: "Verification code sent to email.",
      });
    }
  });
});

// Verify User route=======================================
router.post("/verifyuser", async (req, res) => {
  const { email, verificationCode } = req.body;
  const user = await Users.findOne({ email });

  if (!user) {
    return res.json({ status: false, message: "User does not exist." });
  }

  if (user.verificationCode !== verificationCode) {
    return res.json({ status: false, message: "Invalid verification code." });
  }

  // Generate token and set cookie
  const token = jwt.sign(
    { firstname: user.firstname, role: user.role },
    process.env.KEY,
    {
      expiresIn: "1h",
    }
  );
  res.cookie("token", token, {
    maxAge: 3600000,
    httpOnly: false,
    secure: false,
  }); // Set httpOnly and secure to false for testing
  return res.json({
    status: true,
    message: "User verified successfully.",
    role: user.role,
  });
});

// Forgot password route=======================================
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ message: "User does not exist." });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const ecodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
    var mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Reset Password",
      text: "http://localhost:5173/resetpassword/" + ecodedToken,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "Error sending email." });
      } else {
        return res.json({ status: true, message: "Email sent." });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Reset password route=======================================
router.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.json({ message: "Passwords do not match." });
  }

  try {
    const decodedToken = await jwt.verify(token, process.env.KEY);
    const id = decodedToken.id;

    // Retrieve the user from the database
    const user = await Users.findById(id);

    // Check if the new password is the same as the old password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({
        message: "New password must be different from the old password.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Users.findByIdAndUpdate(id, { password: hashedPassword });

    return res.json({ status: true, message: "Password reset successfully." });
  } catch (error) {
    return res.json({ message: "Error resetting password." });
  }
});

// Verify route=======================================
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "no token" });
    }
    const decoded = await jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    return res.json(err);
  }
};

router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "authorized" });
});

router.get("/signout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
});

export { router as userRouter };

//show user details=======================================
router.get("/dashboard", async (req, res) => {
  const user = await Users.find();
  return res.json(user);
});

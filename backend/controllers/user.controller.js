const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");

//////////////////////////////////////////////////
// SIGNUP
//////////////////////////////////////////////////
exports.signup = async (req, res) => {
  console.log("Signup request body:", req.body);

  const {
    name,
    firstSurname,
    secondSurname,
    username,
    email,
    password,
    confirmPassword
  } = req.body;

  try {
    if (!name || !firstSurname || !username || !email || !password || !confirmPassword) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("Validated input: All required fields present");

    if (password !== confirmPassword) {
      console.log("Validation failed: Passwords do not match");
      return res.status(400).json({ message: "Passwords do not match" });
    }
    console.log("Validated input: Passwords match");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation failed: Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }
    console.log("Validated input: Email format is valid");

    if (password.length < 6) {
      console.log("Validation failed: Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    console.log("Validated input: Password length is sufficient");

    const existingUser = await userModel.findByUsernameOrEmail(username, email);
    console.log("Checked existing user:", existingUser);

    if (existingUser) {
      console.log("User with this username or email already exists");
      return res.status(409).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const newPendingUser = await userModel.createPendingUser({
      name,
      firstSurname,
      secondSurname,
      username,
      email,
      password: hashedPassword
    });
    console.log("Created pending user:", newPendingUser);

    res.status(201).json({
      message: "Registration submitted. Awaiting admin approval.",
      pendingUser: newPendingUser
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar en la tabla de usuarios aprobados
    const user = await userModel.findByUsername(username);
    
    // Si no existe en users, verificar si está en pending_users
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.approved === false) {
      return res.status(403).json({ message: "Tu cuenta aún está pendiente de aprobación por un administrador." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, name: user.name, surname: user.first_surname },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//////////////////////////////////////////////////
// RECUPERACIÓN DE CONTRASEÑA
//////////////////////////////////////////////////
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar solo en la tabla de usuarios aprobados
    const user = await userModel.findByEmail(email);

    // Si no existe, verificar si está en pending_users
    if (!user) {
      const pending = await userModel.getPendingUserByEmail?.(email);
      if (pending) {
        return res.status(403).json({ message: "Your account is pending approval by an administrator." });
      }

      return res.status(404).json({ message: "If this email exists in our system, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hora

    await userModel.saveResetToken(user.id, resetToken, resetTokenExpiration);

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetUrl}`,
    });

    res.json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await userModel.findByResetToken(token);
    if (!user || user.reset_token_expiration < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePassword(user.id, hashedPassword);
    await userModel.clearResetToken(user.id);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//////////////////////////////////////////////////
// ADMINISTRACIÓN DE USUARIOS PENDIENTES
//////////////////////////////////////////////////
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await userModel.getAllPendingUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Error retrieving pending users" });
  }
};

exports.approveUser = async (req, res) => {
  const id = req.params.id;
  try {
    const pendingUser = await userModel.getPendingUserById(id);
    if (!pendingUser) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    const { username } = pendingUser;

    // Llama al procedimiento almacenado para aprobar al usuario
    await userModel.createUser({ username });

    // Opcionalmente puedes volver a obtener el usuario ya aprobado
    const approvedUser = await userModel.findByUsername(username);

    res.status(201).json({
      message: "User approved and added to users",
      user: approvedUser,
    });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Error approving user" });
  }
};


exports.rejectUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.getPendingUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    await userModel.deletePendingUser(id);
    res.json({ message: "User registration request rejected" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ message: "Error rejecting user" });
  }
};

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const mongoose =  require('mongoose')
const blogRoutes = require('./routes/blog')
const serviceRoutes = require('./routes/service.js');
require('dotenv').config();
const app = express();
app.use(cors({origin: "https://next-tog-final.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.urlencoded({extended: true}));
app.use('/api/services', serviceRoutes);
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/blogs', blogRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const SECRET_KEY = 'your_jwt_secret_key'; // use dotenv in production

// Dummy user
const user = {
  name: 'admin',
  password: 'password123'
};

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  otp: String,
  otpExpires: Date,
});
const Admin = mongoose.model("Admin", adminSchema);

// login
 app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).send("Admin not found");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).send("Invalid credentials");

  res.send("Login successful");
});

// Forgot Password
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).send("Email not registered");

  const otp = crypto.randomInt(100000, 999999).toString();
  admin.otp = otp;
  admin.otpExpires = Date.now() + 10 * 60 * 1000;
  await admin.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: 'shuvosarakar50@gmail.com',
      pass: 'rtvc jopk xepl eezn',
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  });

  res.send("OTP sent to email");
});
// Verify OTP
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || admin.otp !== otp || Date.now() > admin.otpExpires)
    return res.status(400).send("Invalid or expired OTP");

  res.send("OTP verified");
});
// Reset Password
app.post("/api/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || admin.otp !== otp || Date.now() > admin.otpExpires)
    return res.status(400).send("Invalid or expired OTP");

  admin.password = await bcrypt.hash(newPassword, 10);
  admin.otp = null;
  admin.otpExpires = null;
  await admin.save();

  res.send("Password reset successful");
});

app.listen(5000, () => console.log("Server started on port 5000"));


async function createDefaultAdmin() {
  const email = "md.sirforce@gmail.com";      // Default email
  const password = "Admin@123";            // Default password

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    console.log("Default admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ email, password: hashedPassword });
  await newAdmin.save();
  console.log("Default admin created:", email);
}

createDefaultAdmin();


// constact form to email
app.post('/contact', async (req, res) => {
  const {name, email, message} = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shuvosarakar50@gmail.com',
      pass: 'rtvc jopk xepl eezn',
    }
  })


const mailOptions = {
  from: email,
  to: 'shuvosarakar50@gmail.com',
  subject: `Contact Form Submission from ${name}`,
  text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
};

try {
  await transporter.sendMail(mailOptions);
  res.status(200).send('Message sent successfully!');
} catch (err) {
      res.status(500).send('Failed to send message.');
}
})
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;

  if (name === user.name && password === user.password) {
    const token = jwt.sign({ name }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

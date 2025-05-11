const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const mongoose =  require('mongoose')
const blogRoutes = require('./routes/blog')

require('dotenv').config();
const app = express();
app.use(cors({origin: "https://next-tog-final.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
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

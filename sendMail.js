import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",  // For local development
    "https://enkelteknik.netlify.app"  // Your deployed Netlify app
  ],
  methods: ["GET", "POST"],  // Ensure the right HTTP methods are allowed
  allowedHeaders: ["Content-Type"],  // Specify allowed headers (e.g., Content-Type for JSON)
}));

app.use(express.json());


app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_TO,
      subject: `Meddalde från kund ${name}`,
      text:` ${name}\n,${email},\n ${message},` ,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Meddelande skickat!' });
  } catch (err) {
    console.error("Error in sending email:", err);  // This will show the error in your logs
    res.status(500).json({ success: false, message: 'Något gick fel.' });
  }
});

app.listen(PORT, () => console.log(`Servern körs på port ${PORT}`));

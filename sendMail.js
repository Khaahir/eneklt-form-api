import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
      subject: `Meddelande från backend`,
      text:` ${name}\n,${email},\n ${message},` ,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Meddelande skickat!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Något gick fel.' });
  }
});

app.listen(PORT, () => console.log(`Servern körs på port ${PORT}`));

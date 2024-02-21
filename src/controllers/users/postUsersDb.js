const moment = require('moment-timezone');
const { User } = require("../../db");
const nodemailer = require("nodemailer");

const postUser = async (name, surName, email, password, rol) => {
  try {
    const maxId = await User.max("id");
    const newId = maxId + 1;
    const now = moment().tz('America/Argentina/Buenos_Aires').format(); // Obtiene la fecha y hora actual en el huso horario especificado
    const user = await User.create({
      id: newId,
      name,
      surName,
      email,
      password,
      rol,
      createdAt: now, // Asigna la fecha y hora actual al campo createdAt
    });

    await sendWelcomeEmail(name, surName, email);

    return user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

const sendWelcomeEmail = async (name, surName, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "runnersparadisecompany@gmail.com",
      pass: "uorm sckl nuoo zfcc",
    },
  });

  try {
    const message = {
      from: "hostelspremium@gmail.com",
      to: email,
      subject: "¡Bienvenido a Hostel Premium!",
      html: `
        <div style="font-family: 'Arial', sans-serif; padding: 20px; background-color: #f8f8f8;">
          <h2 style="text-align: center; color: #282c36; margin-top: 20px;">¡Bienvenido a Hostel Premium, ${name} ${surName}!</h2>
          <p style="text-align: center; color: #333; font-size: 16px;">Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte como parte de Hostel Premium, donde encontrarás los mejores alojamientos y experiencias para tus viajes.</p>
          <p style="text-align: center; color: #333; font-size: 16px;">Explora nuestra amplia selección de hostales, hoteles y casas de huéspedes en destinos increíbles de todo el mundo. ¡Encuentra el lugar perfecto para tu próximo viaje!</p>
          <p style="text-align: center; color: #333; font-size: 16px;">Si necesitas ayuda para encontrar el alojamiento ideal o tienes alguna pregunta sobre nuestros servicios, nuestro equipo de soporte está aquí para ayudarte. ¡Esperamos que disfrutes de tu experiencia en Hostel Premium!</p>
          <p style="text-align: center; color: #333; font-size: 16px;">¡Bienvenido y que tengas un viaje increíble!</p>
          <p style="text-align: center; color: #555; font-size: 14px;">Atentamente,<br>El equipo de Hostel Premium</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(message);
    console.log("Correo electrónico de bienvenida enviado:", info);
  } catch (error) {
    console.error("Error al enviar el correo electrónico de bienvenida:", error);
    throw error;
  } finally {
    transporter.close();
  }
};

module.exports = { postUser };
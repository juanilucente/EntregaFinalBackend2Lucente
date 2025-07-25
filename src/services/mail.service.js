import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

export const sendRecoveryMail = async (email, token) => {
  const link = `${process.env.BASE_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `<p>Click para restablecer tu contraseña (válido por 1 hora): <a href="${link}">${link}</a></p>`
  })
}
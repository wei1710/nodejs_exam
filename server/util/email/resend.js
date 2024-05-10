
import { Resend } from 'resend';
import "dotenv/config"
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(recipient) {
  const { data, error } = await resend.emails.send({
    from: 'yougotmail@jacobtkristensen.dk',
    to: 'jacobtkristensen@gmail.com',
    subject: 'Mandatory II mail',
    html: '<!DOCTYPE html><html><head><title>Celebration Email</title></head><body><div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9;'
    + 'padding: 20px; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);"><header style="text-align: center; padding-bottom: 20px;">'
    + '<h1 style="color: #4CAF50;">Congratulations!</h1></header><section><p style="font-size: 16px; line-height: 1.6;">Congrats on your email</strong>!</p>'
    + '<p style="text-align: center;"><img src="https://t3.ftcdn.net/jpg/02/95/44/22/360_F_295442295_OXsXOmLmqBUfZreTnGo9PREuAPSLQhff.jpg" alt="Congratulations!" style="max-width: 100%; height: auto; border-radius: 5px;">'
    + '</p></section></div></body></html>'
  });

  if (error) {
    return console.log(error);
  }

  console.log(data);
};


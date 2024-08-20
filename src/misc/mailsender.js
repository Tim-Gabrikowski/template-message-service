import { createTransport } from "nodemailer";

// import and init dotenv (for environment files)
import dotenv from "dotenv";
dotenv.config();

const smtpConfig = {
	host: process.env.SMTP_SERVER || "",
	port: process.env.SMTP_PORT || 465,
	secure: true,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
};

// Create an SMTP transporter
const transporter = createTransport(smtpConfig);

// Create an email message

export async function sendMail(content, title, to, copy) {
	const mailOptions = {
		from: process.env.MAIL_SENDER,
		to: to,
		cc: copy,
		subject: title,
		html: content,
	};

	// Send the email
	transporter.sendMail(mailOptions, (sendMailErr, info) => {
		if (sendMailErr) {
			return console.log(sendMailErr);
		}
		console.log("Email sent:", info.response);
	});
}

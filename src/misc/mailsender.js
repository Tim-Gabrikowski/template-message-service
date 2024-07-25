import { createTransport } from "nodemailer";

const smtpConfig = {
	host: "smtp.eduport.hamburg.de",
	port: 465,
	secure: true,
	auth: {
		user: "tim.gabrikowski@kkg.hamburg.de",
		pass: "T!Ga2007!?",
	},
};

// Create an SMTP transporter
const transporter = createTransport(smtpConfig);

// Create an email message

export async function sendMail(content, to, copy) {
	console.log("Sending:", content, "to:", to, "and:", copy);
	const mailOptions = {
		from: "TiBoLi <tim.gabrikowski@kkg.hamburg.de>",
		to: to,
		cc: copy,
		subject: "Test Email",
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

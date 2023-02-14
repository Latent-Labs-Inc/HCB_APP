import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export const useCreateTransporter = () => {
	const config = useRuntimeConfig().private;

	let transporter = nodemailer.createTransport({
		host: config.EMAIL_HOST,
		port: 587,
		secure: false,
		auth: {
			user: config.EMAIL_USER,
			pass: config.EMAIL_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	transporter.use(
		'compile',
		hbs({
			viewEngine: {
				extname: '.hbs',
				partialsDir: path.resolve('./views'),
				defaultLayout: false,
			},
			viewPath: path.resolve('./views'),
			extName: '.hbs',
		})
	);

	return transporter;
};

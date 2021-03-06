import express from 'express'
import next from 'next';
import helmet from 'helmet'

import logger from './logs'
import getRootUrl from '../lib/api/getRootUrl'

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 8000;
const ROOT_URL = getRootUrl()

const app = next({ dev });
const handle = app.getRequestHandler();

const URL_MAP = {
	// example URL_MAP
	// '/login': '/public/login',
	// '/my-endpoint': '/folder/my-endpoint',
};

app.prepare().then(() => {
	const server = express()
	server.use(helmet())

	server.get('*', (req, res) => {
		const url = URL_MAP[req.path];
		if (url) {
			const {query} = req.query
			app.render(req, res, url, query);
		} else {
			handle(req, res);
		}
	});

	server.listen(port, (err) => {
		if (err) throw err;
		logger.info(`> Ready on ${ROOT_URL}`);
	});

});



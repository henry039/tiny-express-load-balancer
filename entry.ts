import request from 'request';
import express, { Request, Response, NextFunction } from 'express';

const servers = [ 'http://localhost:3000', 'http://localhost:3001' ];
let cur = 0;

const profilerMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();
	res.on('finish', () => {
		console.log('Completed', req.method, req.url, Date.now() - start);
	});
	next();
};

const handler = (req: Request, res: Response) => {
	const _req = request({ url: servers[cur] + req.url }).on('error', (error) => {
		res.status(500).send(error.message);
	});
	req.pipe(_req).pipe(res);
	cur = (cur + 1) % servers.length;
};

const server = express().use(profilerMiddleware).get('*', handler).post('*', handler);

server.listen(8080);

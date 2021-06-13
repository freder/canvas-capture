import fs from 'fs';
import path from 'path';

import express from 'express';
import cors from 'cors';


const port = 3000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/', (req, res) => {
	const frameNumber = req.body.frameNumber;
	const base64Data = req.body.dataUrl.replace(/^data:image\/png;base64,/, '');
	const fileName = String(frameNumber).padStart(5, '0') + '.png';
	fs.writeFileSync(
		path.join('output', fileName),
		base64Data,
		'base64'
	);
	res.send({});
});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

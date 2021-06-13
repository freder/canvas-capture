/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');


const port = 3000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/', (req, res) => {
	const { frameNumber, dataUrl } = req.body;
	const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
	const fileName = String(frameNumber).padStart(10, '0') + '.png';
	console.log(fileName);
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

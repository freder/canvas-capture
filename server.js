#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');
const mkdirp = require('mkdirp');


const port = 3000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/', (req, res) => {
	const {
		format,
		frameNumber,
		dataUrl,
		name: subdir,
	} = req.body;
	const base64Data = dataUrl.replace(
		new RegExp(`^data:image\\/${format};base64,`),
		''
	);
	const ext = { png: '.png', jpeg: '.jpg' }[format];
	const fileName = String(frameNumber).padStart(10, '0') + ext;
	const outputDir = (subdir)
		? path.join('output', subdir)
		: 'output';
	mkdirp.sync(outputDir);
	const filePath = path.join(outputDir, fileName);
	console.log(filePath);
	fs.writeFileSync(filePath, base64Data, 'base64');
	res.send({});
});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

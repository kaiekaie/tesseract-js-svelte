import { writeFileSync } from 'fs';
import path from 'path';

import Tesseract, { createWorker } from 'tesseract.js';

const tessToFile = async (file: { image: string; fileName: string }) => {
	const worker = createWorker({
		logger: (m) => {
			console.log(m);
		}
	});

	await worker.load(); // 1
	await worker.loadLanguage('eng'); // 2
	await worker.initialize('eng');

	const { data } = await worker.recognize(file.image);

	return data;
};

export const get = () => {
	return {
		body: { example: 'test' }
	};
};

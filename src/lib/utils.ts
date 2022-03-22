import { progress } from '$app/store';
import { createWorker } from 'tesseract.js';

const smalltextnocaps = (text: string) => {
	if (text[0] === ' ') {
		text = text.substring(1);
	}
	text = text.replaceAll('\n', '');
	text = text.replaceAll(' ', '_');

	return text.toLowerCase();
};

export const generateSVG = (words: Tesseract.Word[], lines: Tesseract.Line[], type: string) => {
	let texter = '';

	switch (type) {
		case 'line':
			texter = lines.reduce((acc, curr) => {
				acc += `<text x="${curr.bbox.x0}" id="${smalltextnocaps(curr.text)}" y="${curr.bbox.y0}">${curr.text.replaceAll(
					'\n',
					''
				)}</text>\n`;
				return acc;
			}, '');
			break;
		case 'rectangle':
			texter = words.reduce((acc, curr) => {
				acc += `<g id="${curr.text}"><rect x="${curr.bbox.x0}" y="${curr.bbox.y0}"  width="110" height="20"/></g>\n`;
				return acc;
			}, '');
			break;
		case 'text':
			texter = lines.reduce((acc, curr) => {
				acc += `${curr.text.replaceAll('\n', '')}\n`;
				return acc;
			}, '');
			break;
		case 'json':
			let json = lines.reduce((acc, curr) => {
				acc = [...acc, { [smalltextnocaps(curr.text)]: curr.text.replaceAll('\n', '') }];
				return acc;
			}, [] as Record<string, string>[]);
			texter = JSON.stringify(json);

			break;
		default:
			break;
	}

	return texter;
};
export const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)/i;
export const downloadImage = async (url: string) => {
	let response = await fetch(url);
	return response.blob();
};

export const fileToBlob = (image: File | string): Promise<{ element: HTMLImageElement; url: string }> => {
	return new Promise(async (resolve, reject) => {
		try {
			progress.set({ progress: 0, status: 'loading image', finished: false });
			const reader = new FileReader();
			let imageElement: HTMLImageElement | null = null;
			let imageUrl: string | ArrayBuffer | null = '';

			if (typeof image === 'string') {
				imageElement = new Image();

				let isImage = imageReg.test(image);

				if (isImage) {
					progress.set({ progress: 0.25, status: 'downloading image', finished: false });
					let response = await downloadImage(image);
					progress.set({ progress: 0.5, status: 'downloading complete', finished: false });
					if (response) reader.readAsDataURL(response);
				} else {
					progress.set({ progress: 1, status: 'not an image', finished: true });
					reject('not a image');
					return;
				}
			} else {
				console.log('no here');
				progress.set({ progress: 0.5, status: 'Reading Image to url', finished: false });
				reader.readAsDataURL(image);
				progress.set({ progress: 0.6, status: 'Reading Image to url done', finished: false });
			}
			progress.set({ progress: 0.6, status: 'convert image to Url', finished: false });
			reader.onload = function () {
				imageElement = new Image();
				imageUrl = reader.result as string;
				imageElement.src = imageUrl;
				progress.set({ progress: 1, status: 'converted image to Url', finished: true });
				resolve({ element: imageElement, url: imageUrl });
			};
			reader.onerror = function (error) {
				reject(error);
			};
		} catch (error) {
			progress.set({ progress: 1, status: error.message, finished: false });
			console.log(error);
		}
	});
};

export const getImageText = async (image: string | File, rectangle?: Tesseract.Rectangle) => {
	try {
		progress.set({ progress: 0, status: null });
		const worker = createWorker({
			logger: (m) => {
				progress.set(m);
			}
		});

		await worker.load();
		await worker.loadLanguage('eng+fin');
		await worker.initialize('eng+fin');
		await worker.setParameters({
			tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzæøåäö-:. ',
			tessjs_create_hocr: '0',
			tessjs_create_tsv: '0',
			preserve_interword_spaces: '1'
		});
		const data = await worker.recognize(image, { rectangle: rectangle });
		progress.update((processs) => (processs = { status: 'finished', finished: false, progress: 1 }));
		await worker.terminate();

		progress.update((processs) => (processs = { status: 'finished', finished: true, progress: 1 }));
		return data;
	} catch (error) {
		progress.set({ progress: 0, status: null });
	}
};

export const getImageColor = (img: HTMLImageElement) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.width = img.width;
	canvas.height = img.height;
	context?.drawImage(img, 0, 0);
	let rgba = [];
	const myData = context?.getImageData(0, 0, img.width, img.height);
	if (myData) {
		let data = myData.data;
		// rgba = data.reduce((acc, curr, i, arr) => {
		// 	// if (i && i % 4 === 0) {

		// 	// }
		// 	if (arr[i + 3]) {
		// 		if (arr[i + 0] === 0 && arr[i + 1] === 0 && arr[i + 2] === 0) {
		// 			acc.push({
		// 				color: `rgba(${arr[i + 0]}, ${arr[i + 1]}, ${arr[i + 2]}, ${arr[i + 3] / 255})`,
		// 				x: (i / 4) % myData.width,
		// 				y: Math.floor(i / 4 / myData.width)
		// 			});
		// 		} else if (arr[i + 0] < 255 && arr[i + 1] < 255 && arr[i + 2] < 255) {
		// 			acc.push({
		// 				color: `rgba(0, 0, 0, 1})`,
		// 				x: (i / 4) % myData.width,
		// 				y: Math.floor(i / 4 / myData.width)
		// 			});
		// 		}
		// 	}

		// 	return acc;
		// }, []);
		rgba = data.reduce((acc, curr, i, arr) => {
			// if (i && i % 4 === 0) {

			// }
			if (arr[i + 3]) {
				if (arr[i + 0] < 255 && arr[i + 1] < 255 && arr[i + 2] < 255) {
					acc.push({
						r: arr[i + 0],
						g: arr[i + 1],
						b: arr[i + 2],
						a: arr[i + 3] / 255
					});
				}
			}

			return acc;
		}, []);
	}

	return rgba;
};

export const uploadImage = async (e: CustomEvent<Event | string>) => {
	let image = null;
	if (typeof e.detail === 'string') {
		image = e.detail;
	} else {
		const target = e.detail.target as unknown as { files: FileList; value: string };
		if (target?.files) {
			image = target?.files[0] as File;
		}
	}

	try {
		if (image) {
			return await fileToBlob(image);
		}
	} catch (error) {
		console.log(error);
	}
};

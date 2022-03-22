export async function handle({ event, resolve }) {
	// let data;
	// if (event.request.method === 'POST') {
	// 	data = await event.request.json();
	// }

	const response = await resolve(event);

	return response;
}

export function getSession(event) {
	console.log(event);
	console.log(processs.env);
	return { hello: 'sessionhello' };
}

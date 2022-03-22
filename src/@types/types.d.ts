interface TypeTest {
	data: string;
}

type ResponseHeaders = Record<string, string | string[]>;
interface RequestEvent<Locals = Record<string, any>> {
	request: Request; // https://developer.mozilla.org/en-US/docs/Web/API/Request
	url: URL; // https://developer.mozilla.org/en-US/docs/Web/API/URL
	params: Record<string, string>;
	locals: Locals;
}

interface ResolveOpts {
	ssr?: boolean;
}

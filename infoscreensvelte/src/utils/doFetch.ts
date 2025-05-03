import { API_CONFIG } from '../config/api.config.js';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FetchOptions {
	method?: RequestMethod;
	body?: unknown;
	headers?: HeadersInit;
}

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export async function doFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
	const { method = 'GET', body, headers = {} } = options;
	const baseUrl = API_CONFIG.BASE_URL;
	const url = `${baseUrl}${endpoint}`;

	try {
		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				apikey: API_CONFIG.API_KEY,
				...headers
			},
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
		}

		return (await response.json()) as T;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
	}
}



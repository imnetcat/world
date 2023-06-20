/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Metacom } from 'metacom';
import { EventEmitter } from 'utils/eventEmitter';
import retry from 'utils/retry';
import { FirstParameter } from '../utils/types';
import { Filter } from './filter';
import { Schema } from './schemas';
import { User, UserBase } from './user';
import { Biomes, World, WorldBase, WorldListItem } from './world';

export type Tree<T> = {
	children: Tree<T>[];
} & T;

export type ModuleTree = Tree<{
	id?: string | null;
	name: string;
	options: string[];
	lookupOptions: string[];
}>[];

export type QueryParams = {
	filters?: (Filter | Filter[])[];
	offset?: number;
	limit?: number;
	orderBy?: { field: string; desc?: boolean; order?: 'ascend' | 'descend' }[];
	distinct?: string[];
};

export type ListResponse<T> = { data: T[]; total: number };
export type ResponseWithBenchmark<T> = { data: T, time: number };
export type Response<T> = { data: T };
// all requested api interfaces should have typings
export type AbastractMetaApi = {
	auth: { restore: (args: { token: string }) => Promise<unknown> };
} & {
		[Interface in typeof INTERFACES[number]]: {
			[Method in string]: (arg: never) => Promise<unknown>;
		};
	};

export type CrudApi<
	EntityBase,
	Entity extends EntityBase,
	ExtraQueryParams = unknown
> = {
	create: (args: EntityBase) => Promise<Response<string>>;
	update: (args: {
		id: string;
		delta: Partial<EntityBase>;
	}) => Promise<Response<string>>;
	delete: (args: { id: string }) => Promise<Response<string>>;
	get: (args: { id: string }) => Promise<Response<Entity>>;
	getList: (
		args: QueryParams & ExtraQueryParams
	) => Promise<ListResponse<Entity>>;
};

type ApiBase = {
	auth: {
		signin: (args: {
			login: string;
			password: string;
		}) => Promise<{ status: string; token: string; user: User }>;
		restore: (args: {
			token: string;
		}) => Promise<{ status: string; token: string; user: User }>;
		signOut: (args: { token?: string }) => Promise<{ status: string }>;
		validatePassword: (args: {
			password: string;
		}) => Promise<{ status: 'correct' | 'incorrect' }>;
		reset: (args: {
			email: string;
			link: string;
			action: 'reset' | 'invite';
			userId?: string;
		}) => Promise<{ error?: string }>;
		check: (args: { token: string }) => Promise<Response<string>>;
		changePassword: (args: {
			userId: string;
			token: string;
			password: string;
		}) => Promise<string>;
	};

	upload: {
		presignedUrl: (args: { name: string }) => Promise<string>;
	};

	user: CrudApi<UserBase, User>;

	schema: {
		get: (args: { schema?: string }) => Promise<Response<Schema>>;
		getList: (args: { schema?: string }) => Promise<Response<Schema[]>>;
	};

	world: {
		generate: (args: WorldBase) => Promise<ResponseWithBenchmark<World>>;
		get: (args: { id: string }) => Promise<ResponseWithBenchmark<World>>;
		getList: (args: QueryParams) => Promise<ListResponse<WorldListItem>>;
		delete: (args: { id: string }) => Promise<Response<string>>;
		getLastSave: (args: Record<string, never>) => Promise<ResponseWithBenchmark<World | null>>;
		getBiomes: (args: Record<string, never>) => Promise<{ data: Biomes, indexed: Record<string, string> }>;
		setBiomes: (args: { biomes: Biomes }) => Promise<Response<string>>;
	};
};

export const INTERFACES: Array<keyof ApiBase> = [
	'auth',
	'upload',
	'user',
	'schema',
	'world',
];

// typing valid only if all interfaces in api are in interfaces array
export type Api = Readonly<
	keyof ApiBase extends typeof INTERFACES[number] ? ApiBase : unknown
>;

const restoreSession = async (
	restore: (args: { token: string }) => Promise<unknown>
) => {
	const token = localStorage.getItem('token');
	if (!token) return;
	return restore({ token });
};

export class MetaAPI<A extends AbastractMetaApi = Api> extends EventEmitter {
	private static instance: MetaAPI;
	private api: A = {} as A;
	private initialized = false;

	static getInstance(): MetaAPI<Api> {
		if (this.instance) return this.instance;
		this.instance = new MetaAPI();
		this.instance.initialize(INTERFACES).catch(console.error);
		return this.instance;
	}

	async ready(): Promise<void> {
		return new Promise<void>((resolve) => {
			if (this.initialized) {
				resolve();
			} else {
				this.once('initialized', resolve);
			}
		});
	}

	async initialize(interfaces: typeof INTERFACES): Promise<void> {
		if (!process.env.REACT_APP_METACOM_PORT) {
			throw Error('process.env.REACT_APP_METACOM_PORT is not defined');
		}
		// eslint-disable-next-line no-restricted-globals
		const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
		const metacom = Metacom.create(
			// eslint-disable-next-line no-restricted-globals
			`${protocol}://${location.hostname}:${process.env.REACT_APP_METACOM_PORT}`,
			{
				callTimeout: 20000,
				reconnectTimeout: 3000,
			}
		);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		metacom.on('error', (args) => {
			console.error(args);
			this.initialized = false;
		});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		metacom.on('close', () => {
			this.initialized = false;
		});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		metacom.on('open', async () => {
			if (this.initialized) {
				return void console.error(
					'WS opened over already initialized socket'
				);
			}
			await retry(() => metacom.load(...interfaces), 5, 2000);
			this.api = metacom.api as A;
			await retry(() => restoreSession(this.api.auth.restore), 5, 2000);
			this.initialized = true;
			this.emit('initialized');
		});
	}

	async call<I extends keyof A, M extends keyof A[I], F extends A[I][M]>(
		iface: I,
		method: M,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		args: FirstParameter<F>
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
	): Promise<ReturnType<F> & { error?: unknown }> {
		await this.ready();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		return this.api[iface][method](args);
	}
}

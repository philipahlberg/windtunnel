export type Module<F> = Record<string, F>;

export type Fn = SyncFn | AsyncFn;

export type SyncFn = () => void;

export type AsyncFn = () => Promise<void>;

export type Entry<F> = [string, F];

export const getEntries = <F>(module: Module<F>): Entry<F>[] => {
	return Object.entries(module);
};

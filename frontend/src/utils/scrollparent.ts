const regex = /(auto|scroll)/;

const getStyle = (node: HTMLElement, prop: string): string =>
	getComputedStyle(node, null).getPropertyValue(prop);

const isScroll = (node: HTMLElement): boolean =>
	regex.test(
		getStyle(node, 'overflow') +
			getStyle(node, 'overflow-y') +
			getStyle(node, 'overflow-x')
	);

const getScrollparent = (node: HTMLElement | null): HTMLElement =>
	!node || node === document.body
		? document.body
		: isScroll(node)
		? node
		: getScrollparent(node.parentElement);

export default getScrollparent;

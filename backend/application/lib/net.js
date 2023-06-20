({
	htonl: (number) => {
		const { htonl } = npm['network-byte-order'];
		const buffer = Buffer.from([0, 0, 0, 0]);
		htonl(buffer, 0, number);
		return Buffer.from(buffer);
	},
	ntohl: (buffer) => {
		const { ntohl } = npm['network-byte-order'];
		return ntohl(buffer, 0);
	},
});

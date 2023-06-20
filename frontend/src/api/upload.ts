import { MetaAPI } from './metaApi';

export const getUploadPresignedUrl = async (
	filename: string
): Promise<string> => {
	return MetaAPI.getInstance().call('upload', 'presignedUrl', {
		name: String(filename),
	});
};

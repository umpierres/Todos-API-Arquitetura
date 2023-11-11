import config from './jest.config';

const configJestIntegration = {
	...config,
	testMatch: ['**/*.test.ts'],
};

export default configJestIntegration;
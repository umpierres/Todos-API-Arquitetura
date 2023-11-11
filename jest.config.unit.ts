import config from './jest.config';

const configJestUnit = {
	...config,
	testMatch: ['**/*.spec.ts'],
};

export default configJestUnit;
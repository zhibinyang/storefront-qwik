import type { CodegenConfig } from '@graphql-codegen/cli';
const DEV_API = process.env.VITE_VENDURE_DEV_URL || 'https://readonlydemo.vendure.io';
const PROD_API = process.env.VITE_VENDURE_PROD_URL || 'https://readonlydemo.vendure.io';
const LOCAL_API = process.env.VITE_VENDURE_LOCAL_URL || 'http://localhost:3000';

let GRAPHQL_API = process.env.IS_DEV ? DEV_API : process.env.IS_LOCAL ? LOCAL_API : PROD_API;

GRAPHQL_API = `${GRAPHQL_API}/shop-api`;

const config: CodegenConfig = {
	schema: [
		GRAPHQL_API,
		'type Mutation { createStripePaymentIntent: String }',
		'type Query { generateBraintreeClientToken(orderId: ID, includeCustomerId: Boolean): String }',
	],
	documents: ['"src/providers/shop/**/*.{ts,tsx}"', '!src/generated/*'],
	generates: {
		'src/generated/graphql-shop.ts': {
			config: {
				enumsAsConst: true,
			},
			plugins: ['typescript', 'typescript-operations', 'typescript-generic-sdk'],
		},
		'src/generated/schema-shop.graphql': {
			plugins: ['schema-ast'],
		},
	},
};

export default config;

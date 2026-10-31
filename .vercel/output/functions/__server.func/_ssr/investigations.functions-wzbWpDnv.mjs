import { c as stringType, i as literalType, l as unionType, o as numberType, r as enumType, s as objectType, t as arrayType } from "../_libs/zod.mjs";
import { a as visualSourceSchema } from "./visual-EuFN5w1X.mjs";
import { l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BLoCzgET.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-mC0fD6Ng.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investigations.functions-wzbWpDnv.js
var binaryInfo = objectType({
	format: enumType([
		"ELF",
		"PE",
		"Mach-O",
		"unknown"
	]),
	arch: stringType(),
	bits: numberType().nullable(),
	sizeBytes: numberType(),
	sections: arrayType(objectType({
		name: stringType(),
		size: numberType(),
		offset: numberType()
	})),
	imports: arrayType(stringType()),
	strings: arrayType(stringType())
});
var createInput = objectType({
	question: stringType().min(5).max(500),
	source: unionType([
		objectType({
			type: literalType("github"),
			url: stringType().url()
		}),
		objectType({
			type: literalType("upload"),
			name: stringType(),
			files: arrayType(objectType({
				path: stringType(),
				content: stringType()
			})).max(1500)
		}),
		objectType({
			type: literalType("web"),
			url: stringType().url()
		}),
		objectType({
			type: literalType("runtime"),
			url: stringType().url()
		}),
		objectType({
			type: literalType("binary"),
			name: stringType(),
			info: binaryInfo
		}),
		visualSourceSchema
	]),
	maxSteps: numberType().int().min(3).max(20).default(10)
});
var createInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createInput.parse(d)).handler(createSsrRpc("3a53225380182d86c91560fa56f6c448662987000c285e1c760c8b0d2f04f472"));
var advanceInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("a6b089f511fe4215441fc2e7eac53f639034e54471540d2c68b58689d54b16d9"));
var saveGithubToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ token: stringType().min(10).max(200) }).parse(d)).handler(createSsrRpc("d750d6bd3b711ee53ea063781ef85bde32ebece97440a67a0c9f4e0d83522211"));
var removeGithubToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("229a1906aedf1fd9713be878e5557dc72e7942734ee01a2d1b3d36866c610ab9"));
var hasGithubToken = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("046a1712478fea619dbd2838109b20488d579bb2ee0700790b604ec0c4626daf"));
//#endregion
export { saveGithubToken as a, removeGithubToken as i, createInvestigation as n, hasGithubToken as r, advanceInvestigation as t };

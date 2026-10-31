//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-C-TpZI95.js
var manifest = {
	"046a1712478fea619dbd2838109b20488d579bb2ee0700790b604ec0c4626daf": {
		functionName: "hasGithubToken_createServerFn_handler",
		importer: () => import("./_ssr/investigations.functions-C8Qx0ZlF.mjs")
	},
	"229a1906aedf1fd9713be878e5557dc72e7942734ee01a2d1b3d36866c610ab9": {
		functionName: "removeGithubToken_createServerFn_handler",
		importer: () => import("./_ssr/investigations.functions-C8Qx0ZlF.mjs")
	},
	"38982f6354443e8d3c582756e13c5abf6626a0d8e0c24075dda5aa0388d660ad": {
		functionName: "deleteAllInvestigations_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"3a53225380182d86c91560fa56f6c448662987000c285e1c760c8b0d2f04f472": {
		functionName: "createInvestigation_createServerFn_handler",
		importer: () => import("./_ssr/investigations.functions-C8Qx0ZlF.mjs")
	},
	"5b2d5560ce0b0569da1ff5e192bed2bffa2cd43cd6e37f975a4fe55774dfd686": {
		functionName: "manageInvestigation_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"7742e3c275680092cc117a3df0d4a964a3cb8e17c05a44dbf7af0ae6df6e0fb9": {
		functionName: "savePreferences_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"7cc1f994a4d1e05160b9c807aa41848461182237778f40a47506b7b04e6c7802": {
		functionName: "saveChecklist_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"85f398f1c9e1a5a997f159f394ca7633f583e289c8977fdea67cebdc318e4e66": {
		functionName: "setChecklistItem_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"a6b089f511fe4215441fc2e7eac53f639034e54471540d2c68b58689d54b16d9": {
		functionName: "advanceInvestigation_createServerFn_handler",
		importer: () => import("./_ssr/investigations.functions-C8Qx0ZlF.mjs")
	},
	"b4271e566523f893491d2a739a164b961c8b23c6c0939f995564ca2d79c76529": {
		functionName: "deleteInvestigation_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"ce899095a6c629c8105c7c5dbcc5ec1387e052719b7754d4be3c7128cf4a41a0": {
		functionName: "generateArtifact_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"d750d6bd3b711ee53ea063781ef85bde32ebece97440a67a0c9f4e0d83522211": {
		functionName: "saveGithubToken_createServerFn_handler",
		importer: () => import("./_ssr/investigations.functions-C8Qx0ZlF.mjs")
	},
	"da0a94581bb79c7965827b7926cb30ea2cb59587ecad5f9bf310487761d34a6f": {
		functionName: "renameInvestigation_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	},
	"e1fb30616ef365e3672c008390a2f5f751f9d6d227243c60014b46b4994a5181": {
		functionName: "getPreferences_createServerFn_handler",
		importer: () => import("./_ssr/product.functions-CvPaZvDf.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };

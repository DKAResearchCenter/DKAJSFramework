import _ from "lodash";
import Options from "./../Options";

const Utils = {
    /**
     *
     * @param {Object} settings
     * @param {Object} settings.data
     * @return {Promise<void>}
     */
    estimationCostFromTime : async (settings) => {
        let mCostConfig = _.merge({
            data: {},
            settings: {
                minutes: {
                    enabled: true,
                    cost: 100,
                    costMax: 500
                },
                hours: {
                    enabled: true,
                    cost: 2000,
                    costMax: 10000
                },
                days: {
                    enabled: true,
                    cost: 10000,
                    costMax: 100000
                }
            }
        }, settings);

        let costBase = {};

        let mSettings = mCostConfig.settings;
        Object.keys(mSettings).map(async (key) => {
            if (mSettings[key].enabled && mCostConfig.data[key]) {
                let mBaseKey = mCostConfig.data[key] * mSettings[key].cost;
                let mTempContentBase = {};
                mTempContentBase.data = mCostConfig.data[key];
                mTempContentBase.type = key;
                mTempContentBase.summationCost = mBaseKey;
                mTempContentBase.unitCost = mSettings[key].cost;
                mTempContentBase.maxCost = mSettings[key].costMax;
                mTempContentBase.costCategory = (mSettings[key].costMax !== Infinity) ? ((mBaseKey > mSettings[key].costMax) ? "MAX" : "REMAINING") : "INFINITY";
                mTempContentBase.estimationCost = (mSettings[key].costMax !== Infinity) ? ((mBaseKey > mSettings[key].costMax) ? mSettings[key].costMax : mBaseKey) : mBaseKey;
                costBase[key] = mTempContentBase
            }
        })

        let finalCost = {
            allCostRemaining: 0
        };
        Object.keys(costBase).map(async (key, index) => {
            finalCost.allCostRemaining += costBase[key].estimationCost;
        });
        console.log(_.merge(costBase, {finalCost}));

    },
    estimationCostTaxFromTime : async (settings) => {
        let mSettings = await _.merge({
            data : {
                
            }
        },settings)
    }
}


export default Utils;
import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var circleCard04EFA0D339114A8893E0D3357EBC5827_DEBUG: IVisualPlugin = {
    name: 'circleCard04EFA0D339114A8893E0D3357EBC5827_DEBUG',
    displayName: 'CircleCard',
    class: 'Visual',
    apiVersion: '5.1.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["circleCard04EFA0D339114A8893E0D3357EBC5827_DEBUG"] = circleCard04EFA0D339114A8893E0D3357EBC5827_DEBUG;
}
export default circleCard04EFA0D339114A8893E0D3357EBC5827_DEBUG;
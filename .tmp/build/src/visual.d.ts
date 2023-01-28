import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private visualSettings;
    private formattingSettingsService;
    ƒ: any;
    private host;
    private svg;
    private logger;
    private container;
    private circle;
    private path;
    private path2;
    private path3;
    private textValue;
    private textLabel;
    private settings;
    private recSelection;
    constructor(options: VisualConstructorOptions);
    private clearAttr;
    private createProductIcon;
    update(options: VisualUpdateOptions): void;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}

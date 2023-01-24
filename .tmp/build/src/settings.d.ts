import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
export declare class CircleSettings {
    circleColor: string;
    circleThickness: number;
}
export declare class VisualSettings extends dataViewObjectsParser.DataViewObjectsParser {
    circle: CircleSettings;
}

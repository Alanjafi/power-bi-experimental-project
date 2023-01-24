import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class CircleSettings extends FormattingSettingsCard{
    public circleColor = new formattingSettings.ColorPicker({
        name: "circleColor",
        displayName: "Color",
        value: { value: "#ffffff" }
    });

    public circleThickness = new formattingSettings.NumUpDown({
        name: "circleThickness",
        displayName: "Stroke thickness",
        value: 2
    });
    // add a new field here with displayName "Stroke color" and initial value of black "#000000"

    public strokeColor = new formattingSettings.ColorPicker({
        name: "strokeColor",
        displayName: "Stroke color",
        value: { value: "#000000" }
    });

    public name: string = "circle";
    public displayName: string = "Circle";
    public slices: FormattingSettingsSlice[] = [this.circleColor, this.circleThickness, this.strokeColor]
}

export class VisualSettings extends FormattingSettingsModel {
    public circle: CircleSettings = new CircleSettings();
    public cards: FormattingSettingsCard[] = [this.circle];
}
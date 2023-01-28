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
    public strokeColor = new formattingSettings.ColorPicker({
        name: "strokeColor",
        displayName: "Stroke color",
        value: { value: "#000000" }
    }); 
    public circleOpacity = new formattingSettings.AutoDropdown({
        name: "circleOpacity",
        displayName: "Circle opacity",
        value: 0.4
    });

    

    public fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font",
        value: "Arial"
    });


    //2 - add new setting for font of value and label

    

    //new formattingSettings. I will check the options 

    public name: string = "circle";
    public displayName: string = "Circle";
    public slices: FormattingSettingsSlice[] = [this.circleColor, this.circleThickness, this.strokeColor, this.fontFamily, this.circleOpacity ]
}

export class VisualSettings extends FormattingSettingsModel {
    public circle: CircleSettings = new CircleSettings();
    public cards: FormattingSettingsCard[] = [this.circle];
    static parse: any;
}
/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";
import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from "d3";
import { VisualSettings } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
  private visualSettings: VisualSettings;
  private formattingSettingsService: FormattingSettingsService;
  private svg: Selection<SVGElement>;
  private iconSvg: Selection<SVGElement>;
  private logger: Selection<HTMLDivElement>;
  private container: Selection<SVGElement>;
  private circle: Selection<SVGElement>;
  private rect: Selection<SVGElement>;
  private path: Selection<SVGElement>;
  private path2: Selection<SVGElement>;
  private path3: Selection<SVGElement>;
  private textValue: Selection<SVGElement>;
  private textLabel: Selection<SVGElement>;

  constructor(options: VisualConstructorOptions) {
    this.formattingSettingsService = new FormattingSettingsService();
    this.logger = d3.select(options.element).append("div");
    this.initiateIconSvg(options.element);
    this.initiateDataSvg(options.element);
  }

  public update(options: VisualUpdateOptions) {
    this.clearAttr();
    let dataView: DataView | any = options.dataViews[0];
    const itemType =
      dataView.metadata.columns[0].expr.arg.source.entity.toLowerCase();
    const val = dataView.single.value;

    this.visualSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualSettings,
        options.dataViews
      );

    this.visualSettings.circle.circleThickness.value = Math.max(
      0,
      this.visualSettings.circle.circleThickness.value
    );

    this.visualSettings.circle.circleThickness.value = Math.min(
      10,
      this.visualSettings.circle.circleThickness.value
    );

    let width: number = options.viewport.width;
    let height: number = options.viewport.height;
    this.generateIconSVG(itemType, width, height);
    this.generateDataSvg(itemType, width, height, val);
  }

  public generateIconSVG(itemType: string, w: number, h: number) {
    // this.logger.text(itemType);
    this.iconSvg.attr("width", w);
    this.iconSvg.attr("height", h / 4);
    this.path
      .style("fill", this.visualSettings.circle.circleColor.value.value)
      .style("fill-opacity", this.visualSettings.circle.circleOpacity.value);

    if (itemType === "product") {
      this.createProductIcon();
    }
     else if (itemType === "region") {
        this.createRegionIcon();
      } 
    else if (itemType === "date") {
        this.createDatesIcon();  
    } 
    
    else if (itemType === "sales") {
       this.createSalesIcon();
    }

     else if (itemType === "state") {
        this.createStateIcon();
    }
  }

  private initiateIconSvg(element: Element) {
    this.iconSvg = d3.select(element).append("svg");
    this.path = this.iconSvg.append("path");
    this.path2 = this.iconSvg.append("path");
    this.path3 = this.iconSvg.append("path");
  }
  private initiateDataSvg(element: Element) {
    this.svg = d3.select(element).append("svg").classed("circleCard", true);
    this.container = this.svg.append("g").classed("container", true);
    this.circle = this.container.append("circle").classed("circle", true);
    this.textValue = this.container.append("text").classed("textValue", true);
    this.textLabel = this.container.append("text").classed("textLabel", true);
    this.rect = this.container.append("rect").classed("rect", true);
  }

  public generateDataSvg(name: string, x: number, y: number, val: number) {
    this.svg.attr("width", x);
    this.svg.attr("height", y);

    let radius: number = Math.min(x, y) / 4.9;
    this.circle
      .style("fill", this.visualSettings.circle.circleColor.value.value)
      .style("fill-opacity", this.visualSettings.circle.circleOpacity.value)
      .style("stroke", "blue")
      .style("stroke-width", this.visualSettings.circle.circleThickness.value)
      .attr("r", radius)
      .attr("cx", x / 2)
      .attr("cy", y / 2)
      .on("mouseover", () => {
        this.circle.style("fill", "blue");
        this.rect.transition().duration(300).style("opacity", 1);
        this.textLabel.transition().duration(300).style("opacity", 1);
      })
      .on("mouseleave", () => {
        this.circle.style(
          "fill",
          this.visualSettings.circle.circleColor.value.value
        );
        this.rect.transition().duration(300).style("opacity", 0);
        this.textLabel.transition().duration(300).style("opacity", 0);
      });

    this.rect
      .style("opacity", 0)
      .style("fill", this.visualSettings.circle.circleColor.value.value)
      .style("fill-opacity", this.visualSettings.circle.circleOpacity.value)
      .style("stroke", "blue")
      .style("stroke-width", this.visualSettings.circle.circleThickness.value)
      .attr("x", x / 2 - 200)
      .attr("y", 20)
      .attr("width", 400)
      .attr("height", 100);

    let fontSizeValue: number = Math.min(x, y) / 20;

    this.textValue
      .text(<string>val.toString())
      .attr("x", x / 2)
      .attr("y", "50%")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-family", this.visualSettings.circle.fontFamily.value)
      .style("font-size", fontSizeValue + "px")
      .on("mouseover", () => {
        this.circle.style("fill", "blue");
        this.rect.transition().duration(300).style("opacity", 1);
        this.textLabel.transition().duration(300).style("opacity", 1);
      });

    this.textLabel
      .style("opacity", 0)
      .text(<string>name)
      .attr("x", x / 2)
      .attr("y", "70")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-family", this.visualSettings.circle.fontFamily.value)
      .style("font-size", fontSizeValue + "px");
  }
  private clearAttr() {
    this.path.attr("d", "");
    this.path2.attr("d", "");
    this.path3.attr("d", "");
  }

  private createProductIcon() {
    this.iconSvg.attr("viewBox", "0 0 512 512");
    this.path.attr(
      "d",
      "M192,7.10542736e-15 L384,110.851252 L384,332.553755 L192,443.405007 L1.42108547e-14,332.553755 L1.42108547e-14,110.851252 L192,7.10542736e-15 Z M127.999,206.918 L128,357.189 L170.666667,381.824 L170.666667,231.552 L127.999,206.918 Z M42.6666667,157.653333 L42.6666667,307.920144 L85.333,332.555 L85.333,182.286 L42.6666667,157.653333 Z M275.991,97.759 L150.413,170.595 L192,194.605531 L317.866667,121.936377 L275.991,97.759 Z M192,49.267223 L66.1333333,121.936377 L107.795,145.989 L233.374,73.154 L192,49.267223 Z"
    );
  }

  private createStateIcon() {
    this.iconSvg.attr("viewBox", "0 0 24 24");
    this.path.attr(
      "d",
      "M4,1A1,1,0,0,0,3,2V22a1,1,0,0,0,2,0V15H20a1,1,0,0,0,.781-1.625L17.281,9l3.5-4.375A1,1,0,0,0,20,3H5V2A1,1,0,0,0,4,1ZM17.919,5l-2.7,3.375a1,1,0,0,0,0,1.25L17.919,13H5V5Z"
    );
  }

  private createSalesIcon() {
    this.iconSvg.attr("viewBox", "0 0 296.41 296.41");
    this.path.attr(
      "d",
      "m268.115,109.241l-.007-48.16-45.821-14.862-28.274-39.001-45.808,14.944-45.809-14.943-28.273,39-45.821,14.862-.007,48.161-28.295,38.963 28.296,38.964 .006,48.16 45.821,14.862 28.274,39.001 45.808-14.944 45.809,14.943 28.273-39 45.821-14.862 .007-48.161 28.295-38.963-28.295-38.964zm-171.548,25.239c-4.941-4.971-7.695-11.228-7.695-18.772v-6.753c0-7.602 2.739-13.903 7.651-18.903 4.913-4.999 12.041-7.498 21.106-7.498 9.18,0 16.095,2.499 21.006,7.498 4.913,5 7.237,11.302 7.237,18.903v6.753c0,7.603-2.254,13.874-7.167,18.813-4.912,4.943-11.94,7.412-21.003,7.412-9.122,0.001-16.193-2.484-21.135-7.453zm26.026,68.062l-13.77-6.93 62.363-99.814 13.772,6.93-62.365,99.814zm84.279-14.997c0,7.66-2.392,13.961-7.275,18.902-4.883,4.941-11.83,7.409-20.894,7.409-9.121,0-16.257-2.483-21.258-7.454-4.997-4.97-7.573-11.256-7.573-18.857v-6.754c0-7.543 2.573-13.815 7.544-18.815 4.969-5.001 12.031-7.499 21.093-7.499 9.18,0 16.183,2.487 21.066,7.454 4.883,4.972 7.297,11.258 7.297,18.86v6.754z"
    );

    this.path2.attr(

        "d","m124.645,122.965c1.608-1.947 2.227-4.373 2.227-7.279v-6.711c0-2.903-0.635-5.357-2.272-7.362-1.639-2.005-3.884-3.008-6.924-3.008-2.981,0-5.504,1.003-7.14,3.008-1.637,2.005-2.664,4.459-2.664,7.362v6.711c0,2.906 1.074,5.332 2.71,7.279 1.637,1.945 4.041,2.918 7.142,2.918 2.981-1.42109e-14 5.312-0.973 6.921-2.918z"
    );

    this.path3.attr(

        "d","m178.554,170.527c-3.041,0-5.485,1.005-7.12,3.008-1.641,2.005-2.562,4.432-2.562,7.278v6.708c0,2.792 1.039,5.201 2.912,7.236 1.871,2.033 4.203,3.048 6.893,3.048 3.625,0 6.03-0.899 7.318-2.702 1.284-1.8 1.877-4.327 1.877-7.582v-6.708c0-2.847-0.755-5.273-2.422-7.278-1.667-2.003-3.915-3.008-6.896-3.008z"        );
  }

  private createDatesIcon() {
    this.iconSvg.attr("viewBox", "0 0 24 24");
    this.path.attr(
      "d",
      "M3,22H21a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H3A1,1,0,0,0,2,6V21A1,1,0,0,0,3,22ZM4,7H20v3H4Zm0,5H20v8H4Z"
    );

  }

  private createRegionIcon() {
    this.iconSvg.attr("viewBox", "0 0 512 512");
    this.path.attr(
      "d",
      "M360.439,57.731c-22.739,0-41.239,18.5-41.239,41.239s18.5,41.239,41.239,41.239s41.239-18.5,41.239-41.239S383.178,57.731,360.439,57.731z M360.439,109.792c-5.967,0-10.821-4.855-10.821-10.821s4.855-10.821,10.821-10.821	s10.821,4.855,10.821,10.821C371.26,104.937,366.406,109.792,360.439,109.792z"
    );
    this.path2.attr(
      "d",
      "M436.999,131.423c3.01-10.952,4.55-21.82,4.55-32.453c0-44.724-36.386-81.111-81.111-81.111s-81.111,36.386-81.111,81.111c0,10.633,1.54,21.501,4.55,32.453H0v362.717h512V131.423H436.999z M413.098,181.64c0.323-0.477,0.649-0.954,0.967-1.431  c0.423-0.632,0.842-1.27,1.26-1.911c0.213-0.327,0.427-0.655,0.638-0.982c0.504-0.781,1.004-1.569,1.501-2.363 c0.064-0.102,0.127-0.204,0.19-0.306c2.552-4.096,5.018-8.363,7.324-12.806h56.603v151.212l-97.046-97.046  c0.32-0.395,0.642-0.795,0.963-1.196c0.306-0.382,0.611-0.763,0.919-1.152c0.6-0.76,1.201-1.528,1.803-2.309    c0.02-0.025,0.039-0.052,0.058-0.077c0.336-0.436,0.669-0.884,1.005-1.326c0.421-0.555,0.844-1.109,1.256-1.665    c0.252-0.339,0.503-0.687,0.754-1.03c0.481-0.654,0.961-1.308,1.432-1.963c0.285-0.396,0.567-0.801,0.851-1.201    c0.421-0.595,0.843-1.19,1.255-1.785C412.401,182.667,412.75,182.153,413.098,181.64z M481.582,356.069v27.963L348.493,250.941   l13.981-13.981L481.582,356.069z M360.439,48.277c27.952,0,50.693,22.741,50.693,50.693c0,14.642-3.855,28.691-9.603,41.518   c-1.341,2.996-2.79,5.921-4.313,8.775c-0.16,0.299-0.321,0.597-0.483,0.894c-0.613,1.132-1.24,2.25-1.877,3.356c-0.159,0.277-0.316,0.558-0.477,0.833c-0.767,1.315-1.546,2.613-2.339,3.889c-0.169,0.273-0.343,0.537-0.513,0.808   c-0.611,0.972-1.228,1.934-1.851,2.883c-0.317,0.484-0.638,0.963-0.958,1.441c-0.49,0.731-0.982,1.452-1.478,2.168       c-0.349,0.504-0.696,1.011-1.046,1.507c-0.559,0.791-1.12,1.565-1.682,2.336c-0.623,0.854-1.246,1.693-1.873,2.523        c-0.355,0.47-0.71,0.943-1.065,1.406c-0.497,0.647-0.993,1.283-1.489,1.913c-0.288,0.366-0.575,0.727-0.862,1.087        c-0.534,0.67-1.07,1.339-1.602,1.99c-0.046,0.056-0.091,0.109-0.137,0.165c-1.303,1.591-2.597,3.122-3.872,4.593  c-0.07,0.08-0.14,0.163-0.21,0.244c-0.618,0.712-1.232,1.406-1.84,2.089c-0.109,0.123-0.218,0.244-0.328,0.366      c-2.603,2.907-5.097,5.54-7.39,7.866c-0.029,0.029-0.059,0.059-0.087,0.089c-1.161,1.176-2.27,2.275-3.315,3.29         c-8.915-8.656-22.454-23.318-33.3-41.568c-0.134-0.226-0.272-0.446-0.405-0.674c-0.365-0.622-0.721-1.256-1.079-1.886         c-0.444-0.782-0.886-1.568-1.319-2.362c-0.259-0.474-0.516-0.949-0.771-1.427c-0.659-1.241-1.308-2.491-1.937-3.76         c-0.042-0.084-0.085-0.167-0.128-0.252c-0.741-1.505-1.458-3.031-2.149-4.573c-5.752-12.831-9.609-26.885-9.609-41.531       C309.746,71.018,332.487,48.277,360.439,48.277z M295.9,161.84c2.308,4.443,4.773,8.709,7.324,12.806        c0.064,0.102,0.127,0.204,0.19,0.306c0.497,0.795,0.997,1.583,1.501,2.363c0.211,0.328,0.424,0.655,0.638,0.982      c0.419,0.641,0.837,1.28,1.26,1.911c0.318,0.478,0.644,0.954,0.967,1.431c0.349,0.513,0.698,1.028,1.048,1.534        c0.413,0.596,0.834,1.191,1.255,1.786c0.284,0.401,0.566,0.805,0.851,1.201c0.47,0.655,0.951,1.309,1.432,1.963        c0.251,0.343,0.503,0.69,0.754,1.03c0.413,0.556,0.835,1.11,1.256,1.665c0.335,0.442,0.669,0.89,1.005,1.326        c0.019,0.025,0.039,0.052,0.058,0.077c0.601,0.781,1.203,1.549,1.803,2.309c0.306,0.388,0.612,0.769,0.919,1.152        c0.321,0.401,0.642,0.801,0.963,1.196c0.372,0.458,0.742,0.916,1.113,1.366c0.156,0.191,0.312,0.376,0.468,0.565       c6.42,7.756,12.599,14.25,17.683,19.223L223.251,333.167L118.413,228.328l66.488-66.488H295.9z M141.886,161.84l-44.98,44.98        l-44.981-44.98H141.886z M30.417,463.724v-91.047c47.038,6.702,84.344,44.008,91.046,91.047H30.417z M152.119,463.72          c-7.043-63.832-57.87-114.659-121.701-121.702v-20.386c75.023,7.198,134.891,67.065,142.088,142.088H152.119z M203.042,463.723       c-7.367-91.808-80.817-165.258-172.625-172.625v-107.75l280.374,280.375H203.042z M481.583,463.723H353.807L244.759,354.675       l82.226-82.226l154.598,154.598V463.723z"
    );
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.visualSettings
    );
  }
}

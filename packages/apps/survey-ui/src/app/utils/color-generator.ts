import { isNullOrUndefined } from "@survey-tool/core";

import { RgbaParts } from "../surveys/types/colors";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return isNullOrUndefined(result)
    ? null
    : {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
      };
}

/** Generate a gradient from the start color to the end color represented in RGB notation */
export function generateRgbGradient(
  startColor: string,
  endColor: string,
  steps: number,
): RgbaParts[] {
  const startRgb = hexToRgb(startColor);
  const endRgb = hexToRgb(endColor);
  if (isNullOrUndefined(startRgb) || isNullOrUndefined(endRgb)) {
    throw new Error(
      `Invalid color(s); cannot parse RGB values. Start: ${startColor}, End: ${endColor}`,
    );
  }
  const colors = [];

  const stepRed = (endRgb.red - startRgb.red) / steps;
  const stepGreen = (endRgb.green - startRgb.green) / steps;
  const stepBlue = (endRgb.blue - startRgb.blue) / steps;

  for (let stepIndex = 0; stepIndex <= steps; stepIndex++) {
    const red = Math.round(startRgb.red + stepRed * stepIndex);
    const green = Math.round(startRgb.green + stepGreen * stepIndex);
    const blue = Math.round(startRgb.blue + stepBlue * stepIndex);
    colors.push({ red, green, blue });
  }

  return colors;
}

const simpleGradientColors = [
  { red: 204, green: 50, blue: 50 },
  { red: 219, green: 123, blue: 43 },
  { red: 231, green: 180, blue: 22 },
  { red: 153, green: 193, blue: 64 },
  { red: 45, green: 201, blue: 55 },
];

export function getSimpleGradient(colorCount: number): RgbaParts[] {
  switch (colorCount) {
    case 1:
      return [simpleGradientColors[2]];
    case 2:
      return [simpleGradientColors[0], simpleGradientColors[4]];
    case 3:
      return [
        simpleGradientColors[0],
        simpleGradientColors[2],
        simpleGradientColors[4],
      ];
    case 4:
      return [
        simpleGradientColors[0],
        simpleGradientColors[1],
        simpleGradientColors[3],
        simpleGradientColors[4],
      ];
    case 5:
      return simpleGradientColors;
    default:
      throw new Error(
        `Unsupported gradient color count; 1-5 colors are supported. ${colorCount} colors were requested.`,
      );
  }
}

/** Convert the given RGBA parts into an RGBA string for CSS */
export function asRgbaCssString({
  red,
  green,
  blue,
  alpha,
}: RgbaParts): string {
  return isNullOrUndefined(alpha)
    ? `rgba(${red} ${green} ${blue})`
    : `rgba(${red} ${green} ${blue} / ${alpha})`;
}

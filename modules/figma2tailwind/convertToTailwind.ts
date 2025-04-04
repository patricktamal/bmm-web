// @ts-nocheck - This script should fail if anything is wrong and someone needs to have a look at it manually anyways.

import { promises as fs } from "fs";

const shouldNotHaveSuffix = (theme) => ["light", "global"].includes(theme);

async function writeTailwindConfig(_content: string) {
  // Simplifies class names so bg-info-default becomes bg-info
  const content = _content.replaceAll("default", "DEFAULT");

  await fs.writeFile(
    "./tailwind.config.ts",
    `/**
 * ---------------------------------------------------
 * 👷 Generated by figma2tailwind. Do not modify !
 * ---------------------------------------------------
 * */
import type { Config } from "tailwindcss";

${content}

const config: Partial<Config> = {
  darkMode: "class",
  theme: {
    colors,
  },
};

export default config;
`,
    "utf8"
  );
}

async function writeColors(figmaInput) {
  const { color } = figmaInput;
  const transformedColors = {};

  Object.entries(color).forEach(([theme, themeValue]) => {
    Object.entries(themeValue).forEach(([colorKey, colorValue]) => {
      const suffixedKey = shouldNotHaveSuffix(theme)
        ? colorKey
        : `${colorKey}-${theme}`;

      if (!colorValue.value) {
        transformedColors[suffixedKey] ||= {};

        Object.entries(colorValue).forEach(
          ([innerColorWeight, innerColorValue]) => {
            transformedColors[suffixedKey][innerColorWeight] =
              innerColorValue.value;
          }
        );
      } else {
        transformedColors[suffixedKey] = colorValue.value;
      }
    });
  });

  const content = `const colors = ${JSON.stringify(
    transformedColors,
    null,
    2
  )};`;
  await writeTailwindConfig(content);
}

async function getFigmaInput() {
  const content = await fs.readFile(
    "./assets/design-tokens/tokens.json",
    "utf-8"
  );
  return JSON.parse(content);
}

export default async function main() {
  const figmaInput = await getFigmaInput();
  await writeColors(figmaInput);
}

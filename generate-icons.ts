import fs from "fs";
import path from "path";

type IconDefinition = {
  src: string;
  sizes: string;
  type: string;
};

const folders = ["public/windows11", "public/android", "public/ios"];
const outputPath = "src/assets/icons.ts";

function getSizeFromFilename(filename: string): string | null {
  const match = filename.match(/(\d+x\d+)/);
  return match ? match[1] : null;
}

function buildIconsArray(): IconDefinition[] {
  const allIcons: IconDefinition[] = [];

  folders.forEach((folder) => {
    const fullPath = path.resolve(folder);
    if (!fs.existsSync(fullPath)) return;

    const files = fs.readdirSync(fullPath);
    files.forEach((file) => {
      const size = getSizeFromFilename(file);
      if (size && /\.(png|jpe?g|webp)$/i.test(file)) {
        const relativePath = path
          .relative("public", path.join(folder, file))
          .replace(/\\/g, "/");
        allIcons.push({
          src: `/${relativePath}`,
          sizes: size,
          type: "image/png",
        });
      }
    });
  });

  return allIcons;
}

function writeIconsFile(icons: IconDefinition[]): void {
  const content = `export const allIcons: { src: string; sizes: string; type: string }[] = ${JSON.stringify(
    icons,
    null,
    2
  )};\n`;
  fs.writeFileSync(outputPath, content, "utf-8");
  console.log(`✅ icons.ts generated at ${outputPath}`);
}

const icons = buildIconsArray();
writeIconsFile(icons);

import fs from "node:fs/promises";
import path from "node:path";

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
}

export async function writeBrandKit(targetDir, answers) {
  const brandKitPath = path.join(targetDir, "brand", "brand-kit.json");
  const configPath = path.join(targetDir, "scenepipe.config.json");

  const brandKit = await readJson(brandKitPath);
  const config = await readJson(configPath);

  if (answers) {
    brandKit.name = answers.brandName;
    brandKit.colors.primary = answers.primaryColor;
    brandKit.colors.secondary = answers.secondaryColor;
    config.voice.provider = answers.voiceProvider;
  }

  await writeJson(brandKitPath, brandKit);
  await writeJson(configPath, config);
}

/** Fills in whichever env vars the user typed during setup (from
 * .env.example's structure), so a chosen paid provider works immediately
 * instead of requiring a manual .env edit right after scaffolding. Any
 * field left blank stays blank — .env.example's comments explain what to
 * fill in later. */
export async function writeEnvFile(targetDir, envValues) {
  const examplePath = path.join(targetDir, ".env.example");
  const envPath = path.join(targetDir, ".env");

  const template = await fs.readFile(examplePath, "utf8");
  const filled = template
    .split("\n")
    .map((line) => {
      const match = line.match(/^([A-Z0-9_]+)=$/);
      if (!match) return line;
      const [, key] = match;
      const value = envValues?.[key];
      return value ? `${key}=${value}` : line;
    })
    .join("\n");

  await fs.writeFile(envPath, filled);
}

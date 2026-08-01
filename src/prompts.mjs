import path from "node:path";
import prompts from "prompts";

const VOICE_CHOICES = [
  {
    title: "On-device (macOS say) — free, no API key. Whisper (~1.5GB) downloads once, on your first render, to generate captions.",
    value: "macos-say",
  },
  {
    title: "ElevenLabs — needs an API key. Skips the Whisper download entirely (captions come from ElevenLabs directly).",
    value: "elevenlabs",
  },
  {
    title: "Sarvam AI — needs an API key, strong Indian-language support. Whisper (~1.5GB) still downloads once for captions.",
    value: "sarvam",
  },
  {
    title: "Azure Speech — needs an API key + region. Whisper (~1.5GB) still downloads once for captions.",
    value: "azure",
  },
  {
    title: "Google Cloud TTS — needs an API key. Whisper (~1.5GB) still downloads once for captions.",
    value: "google",
  },
];

async function providerEnvFields(packageRoot, providerId) {
  if (providerId === "macos-say") return [];
  const mod = await import(path.join(packageRoot, "template", "scripts", "voice", "providers", `${providerId}.mjs`));
  return mod.capabilities.requiresEnv;
}

export async function askBrandQuestions(packageRoot) {
  console.log("\nQuick brand setup (press enter to accept defaults — you can edit brand/brand-kit.json anytime):\n");

  const answers = await prompts(
    [
      {
        type: "text",
        name: "brandName",
        message: "Brand / channel name",
        initial: "My Brand",
      },
      {
        type: "text",
        name: "primaryColor",
        message: "Primary accent color (hex)",
        initial: "#38bdf8",
        validate: (v) => /^#[0-9a-fA-F]{6}$/.test(v) || "Enter a hex color like #38bdf8",
      },
      {
        type: "text",
        name: "secondaryColor",
        message: "Secondary accent color (hex)",
        initial: "#f472b6",
        validate: (v) => /^#[0-9a-fA-F]{6}$/.test(v) || "Enter a hex color like #f472b6",
      },
      {
        type: "select",
        name: "voiceProvider",
        message: "Default voice provider",
        choices: VOICE_CHOICES,
        initial: 0,
      },
    ],
    {
      onCancel: () => {
        console.log("\nSkipped — using neutral placeholder defaults.");
        return true;
      },
    },
  );

  if (!answers.brandName) return null;

  const envFields = await providerEnvFields(packageRoot, answers.voiceProvider);
  const envValues = {};

  if (envFields.length > 0) {
    console.log(`\n${answers.voiceProvider} needs the following — leave blank to fill in .env later:\n`);
    const envAnswers = await prompts(
      envFields.map((name) => ({
        type: name.toUpperCase().includes("KEY") ? "password" : "text",
        name,
        message: name,
      })),
      { onCancel: () => true },
    );
    Object.assign(envValues, envAnswers);
  }

  return { ...answers, envValues };
}

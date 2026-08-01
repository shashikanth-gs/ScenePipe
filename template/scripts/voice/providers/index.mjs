import * as macosSay from "./macos-say.mjs";
import * as elevenlabs from "./elevenlabs.mjs";
import * as sarvam from "./sarvam.mjs";
import * as azure from "./azure.mjs";
import * as google from "./google.mjs";

// The full set of providers scenepipe ships with. Adding a new one means
// writing a module with the same shape (id, capabilities, isAvailable,
// synthesize) and registering it here — never something the AI does at
// runtime.
export const PROVIDERS = {
  [macosSay.id]: macosSay,
  [elevenlabs.id]: elevenlabs,
  [sarvam.id]: sarvam,
  [azure.id]: azure,
  [google.id]: google,
};

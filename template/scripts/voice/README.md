# Voice providers

Deterministic, config-driven — the AI never picks a provider or touches this
code. It only ever writes narration *text*. Which provider runs is decided by
`scenepipe.config.json`'s `voice` block:

```json
"voice": {
  "provider": "elevenlabs",
  "fallback": ["sarvam", "macos-say"],
  "voice": "Rachel",
  "language": "en-US",
  "preferNativeTimestamps": true
}
```

At synthesis time, `resolveProvider()` walks `[provider, ...fallback]` and uses
the first one whose required env vars are actually set — so a misconfigured
primary provider degrades gracefully instead of failing the whole job.

## Providers & env vars

| Provider | Env vars needed | Offline | Native timestamps | Notes |
|---|---|---|---|---|
| `macos-say` | none | yes | no | macOS only. Always available as the safety-net fallback. |
| `elevenlabs` | `ELEVENLABS_API_KEY` | no | **yes** | Skips Whisper entirely when `preferNativeTimestamps: true`. |
| `sarvam` | `SARVAM_API_KEY` | no | no | Best option for Indian-language narration. |
| `azure` | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` | no | no | REST-only implementation; the full SDK supports word-boundary streaming but isn't wired in here. |
| `google` | `GOOGLE_TTS_API_KEY` | no | no | Simple API-key auth; swap for a service-account token if your setup needs it. |

Providers marked "no" for native timestamps always get their captions from
**Whisper**, which runs on-device via `@remotion/install-whisper-cpp` — this
is what guarantees captions work no matter which voice vendor you pick.

## Caching

`.cache/voice/<hash>.wav` + `.captions.json`, keyed by
`sha256(text + voice + provider + language)`. Editing one line of narration
only re-synthesizes that line; switching providers can never accidentally
reuse another vendor's cached audio.

## Adding a provider

Create `providers/<name>.mjs` exporting `id`, `capabilities`, `isAvailable()`,
and `synthesize({ text, voice, language, outPath })`, then register it in
`providers/index.mjs`. That's the whole contract.

# THREADLY Virtual Try-On Architecture

## Overview
Virtual Try-On is Threadly's premier technological differentiator. It bridges e-commerce browsing with personal fit visualization.

## Architectural Principles
1. **Never Fake as Image Overlay**: Simple transparency overlays create distorted proportions and poor user trust. Threadly's pipeline is architected around neural generative rendering.
2. **Provider Agnostic**: The system uses `IVirtualTryOnService`. In development, `MockVirtualTryOnService` returns deterministic, ultra-realistic renders with simulated neural latency. When deploying to production, plug in a specialized diffusion service (e.g. Gemini Vision or Stable Diffusion Inpainting) without changing any mobile code.

```
Mobile App (Expo)
   │
   ├─ 1. User captures upper-body torso photo
   ├─ 2. Submits photo + Product ID (POST /api/try-on)
   ▼
Backend TryOnController
   │
   ├─ 3. Uploads input image to StorageService
   ├─ 4. Creates TryOnSession (Status: PENDING -> PROCESSING)
   ├─ 5. Invokes IVirtualTryOnService.generateTryOnLook()
   ▼
VirtualTryOnService
   │
   ├─ Mock: Simulates 1.5s neural processing and selects styled look
   └─ Future AI: Pose keypoints -> Garment alignment -> Latent diffusion render
   ▼
TryOnResult
   │
   └─ Saves generated image -> Session Status: COMPLETED
```

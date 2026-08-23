# Free/local AI benchmark plan

## Objective

Remove mandatory paid AI API dependency while preserving reliable user outcomes. “Free” refers to open/local software and no per-call third-party AI bill; infrastructure and operations still have measurable cost.

## Execution order

1. deterministic rules, calculators and templates;
2. retrieval from approved versioned sources;
3. browser-native features;
4. in-browser open models where device capability permits;
5. self-hosted open models behind an internal service;
6. optional enterprise/BYOK provider only after separate approval.

## Use-case benchmarks

| Use case | Baseline | Candidate class | Required measures |
|---|---|---|---|
| GROW diagnostic | existing deterministic UJU rules | no model needed for score; local model for narrative | score reproducibility, source use, action quality, latency |
| GOVERN legal retrieval | citation/rules | multilingual embeddings + reranker + compact grounded model | citation precision/recall, unsupported claim rate, safety |
| Document extraction | parser/OCR | open OCR/layout model | field accuracy by document type, PII handling, CPU time |
| ACADEMY tutor | approved course retrieval | compact browser/self-host instruction model | grounded answer rate, learning quality, unsafe answer rate |
| Translation | no honest fallback currently | open multilingual model | human review by language, semantic accuracy, device cost |
| Speech-to-text | browser speech where available | Whisper-compatible local model | word error rate, Gambian accent/noise tests, real-time factor |
| Text-to-speech | browser speech | commercially licensed local TTS | intelligibility, voice rights, latency and resource use |
| Ikenga content | templates/rules | compact self-host instruction model | brand adherence, moderation, platform fit and cost |

## Candidate runtime evaluation

Evaluate, without committing prematurely:

- Transformers.js / ONNX Runtime Web for browser inference;
- WebLLM where WebGPU support and model licences permit;
- llama.cpp for CPU/edge inference;
- vLLM for shared GPU throughput;
- open OCR/layout, embedding, reranking, speech and TTS implementations.

## Gates

- commercially compatible model/data licence;
- pinned model hash and software bill of materials;
- representative Gambian evaluation set with lawful data;
- quality threshold per task;
- source citations for factual output;
- privacy and retention controls;
- queue/capacity/cancellation and timeout;
- low-spec device fallback;
- human review for legal, financial, credential and compliance outcomes;
- actual infrastructure cost per outcome.

If no candidate passes, the feature uses deterministic/retrieval workflows or remains unavailable. It never returns mock AI output.

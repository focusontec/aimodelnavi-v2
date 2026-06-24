---
title: "Qwen3.7-Max 발표: 35시간 자율적 커널 최적화로 추론 성능 10배 향상"
date: "2026-05-22"
tag: "벤치마크"
excerpt: "Qwen3.7-Max은 에이전트 시나리오에 최적화된 Alibaba의 최신 플래그십 모델로, 프로그래밍 및 추론 분야에서 세계 최고 모델과 견줄 수 있는 성능을 발휘합니다. 특히, 35시간 동안 자율적으로 커널을 최적화하여 추론 성능을 10배 향상시킨 실험이 주목할 만합니다."
---

## 개요

Qwen3.7-Max은 에이전트 시나리오에 깊이 최적화된 Alibaba의 최신 플래그십 모델입니다. 프로그래밍, 추론, 오피스 자동화, 장시간 태스크 실행 등에서 최고 수준의 성능을 발휘하며, GPT, Claude, Gemini 등 국제적인 최고 모델에 필적하는 종합 능력을 실현했습니다.

![Qwen3.7-Max Arena AI 순위](https://i.qbitai.com/wp-content/uploads/2026/05/60ae40faa7aa1115b102dd11ef764d74.webp)

![Qwen3.7-Max 서브카테고리 순위](https://i.qbitai.com/wp-content/uploads/2026/05/a0f852571527fd9dd8b9c3856839942f.webp)

---

## 주요 벤치마크 결과

### 프로그래밍 에이전트

| 벤치마크 | Qwen3.7-Max | DeepSeek-v4-Pro Max | Claude Opus 4.7 Max |
|---|---|---|---|
| TerminalBench 2.0-Terminus | **69.7** | 67.9 | 65.4 |
| SWE-Multilingual | **78.3** | - | - |
| SWE-Pro | 60.6 | - | - |

### 범용 에이전트

| 벤치마크 | Qwen3.7-Max | Claude Opus 4.6 | GLM 5.1 |
|---|---|---|---|
| MCP-Atlas | **76.4** | 75.8 | - |
| MCP-Mark | **60.8** | - | 57.5 |
| SpreadSheetBench-v1 | **87.0** | - | - |

### 추론 능력

| 벤치마크 | Qwen3.7-Max | Claude Opus 4.6 |
|---|---|---|
| GPQA Diamond | **92.4** | 91.3 |
| HLE | **41.4** | 40.0 |

---

## 35시간 자율적 커널 최적화 실험

Qwen3.7-Max의 가장 주목할 만한 성과는 35시간에 걸친 완전 자율적인 하드웨어 최적화 태스크입니다.

Alibaba는 Qwen3.7-Max에 훈련 시 한 번도 본 적 없는 칩(Pingtou Ge Zenwu M890)에서 추론 커널을 최적화하게 했습니다. 인간의 개입 없이 모델은 35시간 연속 작업하여, 최종적으로 Triton 연산자의 성능을 **10배** 향상시켰습니다.

### 실험 세부 사항

- **칩**: Pingtou Ge Zenwu M890 (훈련 데이터 없음)
- **작업 시간**: 35시간 연속
- **도구 호출 횟수**: 1,158회
- **커널 평가 횟수**: 432회
- **최종 결과**: 공식 참조 구현 대비 10배 성능 향상

### 다른 모델과의 비교

| 모델 | 기하 평균 가속 비율 |
|---|---|
| **Qwen3.7-Max** | **10.0x** |
| GLM 5.1 | 7.3x |
| Kimi K2.6 | 5.0x |
| DeepSeek V4 Pro | 3.3x (중도 중단) |

---

## Artificial Analysis 순위

제3자 평가 기관 Artificial Analysis의 최신 순위에 따르면:

- **종합 점수**: 56.6점
- **세계 순위**: 5위
- **국산 모델**: 1위
- **이전 세대 대비 진보**: +4.8점

상위에는 GPT-5.4(xhigh), Gemini 3.1 Pro Preview, Claude-Opus4.7(max) 등 소수의 모델이 랭크인되어 있습니다.

---

## 릴리스 속도

Qwen 시리즈는 빠른 반복 속도를 유지하고 있습니다.

![Qwen3.7-Max 릴리스 타임라인](https://i.qbitai.com/wp-content/uploads/2026/05/e7b41a582b5ac9f61aebf1a71708a4e4.webp)

| 날짜 | 모델 | 주제 |
|---|---|---|
| 2026년 3월 20일 | Qwen3.5-Max-Preview | 원시 멀티모달 에이전트로 |
| 2026년 4월 20일 | Qwen3.6-Max-Preview | 현실 세계 에이전트로 |
| 2026년 5월 20일 | Qwen3.7-Max | 에이전트 시대의 새로운 기준 |

매달 한 세대의 플래그십 모델을 출시하며, 그때마다 국산 모델의 성능 상한을 갱신하고 있습니다.

---

## 결론

Qwen3.7-Max은 에이전트 능력에 특화된 차세대 플래그십 모델로, 프로그래밍, 추론, 오피스 자동화 분야에서 최고 수준의 성능을 실현했습니다. 특히 35시간의 자율적 커널 최적화 실험은 AI 모델의 장기 자율 작업 능력을 보여주는 중요한 이정표입니다.

---

## 관련 기사

- [Qwen3.7 완전 가이드: Max·Plus 성능·가격·API 활용법 철저 해설](/blog/qwen3-7-max-deep-dive)
- [Alibaba에서 Qwen3.6-27B 오픈소스 출시: 코드 에이전트 능력으로 이전 세대 플래그십 초월](/blog/qwen3-6-27b-code-agent-benchmarks)
- [중국 LLM에서 불어오는 자금 조달 러시: 다음으로 도태되는 것은 누구인가?](/blog/blog-2026-05-15-lrh6ar)
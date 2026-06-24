---
title: "Gemini 3.1 Pro 상세 분석: ARC-AGI-2 77.1% 달성, 추론 능력 전 세대 대비 2.5배 향상"
date: "2026-05-23"
tag: "Google"
excerpt: "Google이 발표한 Gemini 3.1 Pro는 ARC-AGI-2에서 77.1%를 기록하며 전 세대 대비 추론 능력이 2.5배 향상되었다. GPQA Diamond 94.3%라는 최고 점수와 함께 에이전트·코딩 분야에서도 Claude Opus 4.6과 동등한 수준의 성능을 보여준다."
---

## Gemini 3.1 Pro란?

2026년 2월 19일, Google은 Gemini 3 시리즈의 최신 모델인 'Gemini 3.1 Pro'를 발표했다. Gemini 3 Pro의 후속 모델로, 추론 능력, 멀티모달 대응, 에이전트 기능을 대폭 강화한 것이 특징이다.

**주요 사양**

| 항목 | 상세 |
|---|---|
| 컨텍스트 윈도우 | 1M 토큰 |
| 최대 출력 | 64K 토큰 |
| 지원 입력 | 텍스트, 코드, 이미지, 음성, 영상, PDF |
| 지식 컷오프 | 2025년 1월 |
| 제공 형태 | API(프리뷰), Gemini 앱, NotebookLM |

---

## 주요 벤치마크 결과

### 추론 능력

| 벤치마크 | Gemini 3.1 Pro | Gemini 3 Pro | Claude Opus 4.6 | GPT-5.2 |
|---|---|---|---|---|
| ARC-AGI-2 | **77.1%** | 31.1% | 68.8% | 52.9% |
| GPQA Diamond | **94.3%** | 91.9% | 91.3% | 92.4% |
| HLE(학술 추론) | **44.4%** | 37.5% | 40.0% | 34.5% |

ARC-AGI-2에서 전 세대의 31.1%에서 77.1%로 **2.5배의 향상**을 달성했다. 완전히 새로운 논리 패턴을 풀어내는 능력이 크게 개선된 것이다.

### 코딩·에이전트

| 벤치마크 | Gemini 3.1 Pro | Claude Opus 4.6 | GPT-5.3-Codex |
|---|---|---|---|
| SWE-Bench Verified | 80.6% | 80.8% | — |
| SWE-Bench Pro | 54.2% | — | 56.8% |
| Terminal-Bench 2.0 | 68.5% | 65.4% | 64.7% |
| SciCode | **59%** | 52% | — |
| LiveCodeBench Pro | **2887 Elo** | — | — |

SWE-Bench Verified에서는 Claude Opus 4.6(80.8%)와 거의 동일한 점수를 기록했다. Terminal-Bench 2.0에서는 65.4%의 Opus 4.6을 넘어선 68.5%를 달성했다.

### 멀티모달·다국어

| 벤치마크 | Gemini 3.1 Pro | Gemini 3 Pro |
|---|---|---|
| MMMU-Pro | 80.5% | 81.0% |
| MMMLU | 92.6% | 91.8% |
| MRCR v2(128K) | 84.9% | 77.0% |

### 에이전트·도구 활용

| 벤치마크 | Gemini 3.1 Pro | Claude Opus 4.6 | GPT-5.2 |
|---|---|---|---|
| MCP Atlas | **69.2%** | 59.5% | 60.6% |
| BrowseComp | **85.9%** | 84.0% | 65.8% |
| τ2-bench(Retail) | 90.8% | 91.9% | 82.0% |

MCP Atlas에서는 69.2%를 기록하며 Claude Opus 4.6(59.5%)를 크게 상회했다.

---

## Gemini 3.1 Pro의 강점

### 1. 추상적 추론의 비약적 향상

ARC-AGI-2에서 77.1%는 전 세대 31.1%에서 대폭 향상된 점수다. 이 벤치마크는 '완전히 새로운 논리 패턴'을 풀어내는 능력을 측정하며, 모델의 일반화 능력을 가늠하는 지표로 활용된다.

### 2. 에이전트 워크플로우 강화

MCP Atlas 69.2%, BrowseComp 85.9%라는 점수는 멀티스텝 도구 활용 태스크에서의 우위를 보여준다. Google은 '금융 및 스프레드시트 애플리케이션' 등 도메인에서의 에이전트 능력 개선을 강조하고 있다.

### 3. 사고 레벨의 확장

새롭게 `MEDIUM` 사고 레벨이 추가되어 비용·성능·속도 간 트레이드오프를 보다 세밀하게 조정할 수 있게 되었다. 기존의 `HIGH`에 더해 용도에 맞는 최적화가 쉬워졌다.

### 4. 커스텀 도구 엔드포인트

`gemini-3.1-pro-preview-customtools`라는 엔드포인트가 신설되어, `view_file`이나 `search_code` 같은 커스텀 도구를 우선적으로 사용하는 에이전트 워크플로우에 최적화되어 있다.

---

## 가격 및 이용 방법

Gemini 3.1 Pro는 다음과 같은 플랫폼에서 사용할 수 있다.

- **개발자용**: Gemini API(Google AI Studio), Gemini CLI, Google Antigravity, Android Studio
- **기업용**: Vertex AI, Gemini Enterprise
- **소비자용**: Gemini 앱, NotebookLM(Pro/Ultra 플랜)

Google AI Pro 플랜(월 $20) 및 Ultra 플랜(월 $100) 이용자는 Gemini 앱에서 3.1 Pro에 접근하며, 더 높은 사용량 제한을 누릴 수 있다.

---

## 다른 모델과의 포지셔닝

2026년 상반기 AI 모델 시장에서 Gemini 3.1 Pro의 위치는 다음과 같다.

| 모델 | 강점 | GPQA Diamond | SWE-Bench Verified |
|---|---|---|---|
| Gemini 3.1 Pro | 추상적 추론, 멀티모달 | **94.3%** | 80.6% |
| Claude Opus 4.6 | 코딩, 장문 처리 | 91.3% | 80.8% |
| Qwen3.7-Max | 에이전트, 장시간 자율 실행 | 92.4% | 80.4% |
| GPT-5.2 | 밸런스형 | 92.4% | 80.0% |

GPQA Diamond 94.3%는 현재 공개된 점수 중 최고치다.

---

## 요약

Gemini 3.1 Pro는 Gemini 3 Pro에서 추론 능력을 크게 끌어올린 모델이다. 특히 ARC-AGI-2에서 77.1%는 단연 돋보이는 점수로, 추상적 논리 문제에 대한 일반화 능력이 타 모델을 압도한다.

핵심 포인트를 정리하면:

1. **ARC-AGI-2**: 77.1%(전 세대 대비 2.5배)
2. **GPQA Diamond**: 94.3%(최고 점수)
3. **SWE-Bench Verified**: 80.6%(Claude Opus 4.6과 동급)
4. **MCP Atlas**: 69.2%(에이전트 능력에서 타 모델 압도)
5. **1M 토큰** 컨텍스트 윈도우
6. **MEDIUM 사고 레벨** 추가로 비용 최적화 용이
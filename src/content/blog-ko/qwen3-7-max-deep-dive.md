---
title: "Qwen3.7-Max 완벽 가이드: 성능, 벤치마크, API 사용법 총정리"
date: "2026-05-22"
tag: "벤치마크"
excerpt: "알리바바의 에이전트 특화 모델 Qwen3.7-Max의 성능을 상세 분석했다. 주요 벤치마크에서 Claude Opus 4.6와 DeepSeek V4 Pro를 상회하며, 35시간 자율 태스크로 10배 성능 향상을 달성했다. API 요금은 Claude 대비 약 1/10 수준이며, 다양한 개발 도구와 통합을 지원한다."
---

## Qwen3.7이란?

2026년 5월 20일, 알리바바는 알리바바 클라우드 서밋에서 'Qwen3.7-Max'를 공식 발표했다. 에이전트 시대의 기반 모델로 설계된 이 모델은 단순한 대화형 AI가 아니라, 코드 작성·디버깅, 오피스 워크플로우 자동화, 수백~수천 단계에 이르는 장시간 태스크의 자율적 실행을 목표로 한다.

Qwen3.7 시리즈에는 두 가지 모델이 있다.

| 모델 | 포지션 | 제공 형태 |
|---|---|---|
| **Qwen3.7-Max** | 플래그십. 최강의 에이전트 능력 | API 제공 (비공개) |
| **Qwen3.7-Plus** | 고성능 균형형 | API 제공 (비공개) |

Qwen3.7-Max는 오픈소스가 아니다. 알리바바는 최근 Qwen3.6-27B (Apache 2.0) 및 Qwen3.6-35B-A3B를 오픈소스로 공개했지만, 3.7 시리즈는 현재 API로만 사용할 수 있다.

---

## Arena AI 랭킹 성적

Qwen3.7-Max-Preview는 2026년 5월 19일 Arena AI (구 LMArena)에 등장하며 즉각 주목을 받았다.

**텍스트 종합 랭킹**: 13위 (GPT 5.5 및 Grok 4.2 사이), **국내 모델 1위**

**비전 랭킹**: Qwen3.7-Plus-Preview가 16위

![Qwen3.7-Max Arena AIランキング](/images/blog/qwen3-7/arena-ranking.webp)

![Qwen3.7-Max サブカテゴリランキング](/images/blog/qwen3-7/subcategory-ranking.webp)

제3자 평가 기관 Artificial Analysis의 최신 랭킹에서 Qwen3.7-Max는 종합 점수 56.6을 기록했다. GPT, Claude, Gemini의 최강 모델에 근접하는 점수로, 국내 모델 1위, 세계 5위에 올랐다.

---

## 벤치마크 상세 점수

### BenchLM 종합 평가

BenchLM.ai의 평가에 따르면, Qwen3.7-Max는 종합 점수 92/100으로 전 117개 모델 중 3위. Arena Elo는 1475.

| 카테고리 | 점수 | 랭킹 |
|---|---|---|
| 코딩 | 92.2 | #4 |
| 추론 | 96.4 | — |
| 에이전트 | 87.7 | — |
| 지식 | 86.8 | #9 |
| 다국어 | 88.2 | #10 |
| 지시 따름 | 93.6 | #7 |

### Arena Elo 세부 분석

| 카테고리 | Elo | 투표 수 |
|---|---|---|
| 텍스트 종합 | 1475 | 3,741 |
| 코딩 | 1525 | 1,135 |
| 수학 | 1499 | 218 |
| 하드 프롬프트 | 1496 | 2,546 |
| 멀티턴 | 1484 | 648 |

---

## 주요 벤치마크: 타 모델과의 비교

### 프로그래밍 에이전트

| 벤치마크 | Qwen3.7-Max | Claude Opus 4.6 | DeepSeek V4 Pro | GPT-5.5 |
|---|---|---|---|---|
| SWE-Pro | **60.6** | — | — | — |
| SWE-Multilingual | **78.3** | — | — | — |
| SWE-Verified | 80.4 | 80.8 | 80.6 | — |
| Terminal-Bench 2.0 | **69.7** | — | 67.9 | — |
| SciCode | **53.5** | — | — | — |
| NL2Repo | — | — | — | — |

SWE-Verified에서는 Claude Opus 4.6 Max (80.8) 및 DeepSeek V4 Pro Max (80.6)과 거의 동일한 점수. Terminal-Bench 2.0에서는 DeepSeek V4 Pro Max (67.9)를 넘어섰다.

### 범용 에이전트

| 벤치마크 | Qwen3.7-Max | Claude Opus 4.6 | GLM 5.1 | Kimi K2.6 |
|---|---|---|---|---|
| MCP-Mark | **60.8** | — | 57.5 | — |
| MCP-Atlas | **76.4** | 75.8 | — | — |
| SkillsBench | **59.2** | — | — | 56.2 |
| BFCL-V4 | 75.0 | — | — | — |
| SpreadSheetBench-v1 | **87.0** | — | — | — |
| Kernel Bench L3 | 1.98x / 96% | — | — | — |

MCP-Atlas에서는 Claude Opus 4.6 (75.8)을 근소하게 앞섰고, SkillsBench에서는 Kimi K2.6 (56.2)를 능가했다.

### 추론 능력

| 벤치마크 | Qwen3.7-Max | Claude Opus 4.6 | DeepSeek V4 Pro |
|---|---|---|---|
| GPQA Diamond | **92.4** | 91.3 | — |
| HLE | **41.4** | 40.0 | — |
| HMMT 2026 Feb | **97.1** | 96.2 | — |
| IMOAnswerBench | **90.0** | — | 89.8 |
| Apex | **44.5** | — | 38.3 |

추론 벤치마크에서는 Claude Opus 4.6를 일관되게 상회하는 결과를 보였다. GPQA Diamond 92.4는 공개된 점수 중 최상위권이다.

### 일반 능력·다국어

| 벤치마크 | Qwen3.7-Max | DeepSeek V4 Pro |
|---|---|---|
| IFBench | **79.1** | 77.0 |
| WMT24++ | **85.8** | — |
| MAXIFE | **89.2** | — |
| SuperGPQA | 73.6 | — |

---

## 35시간 자율 실험: 가장 주목할 성과

벤치마크 점수 이상으로 주목해야 할 것은, Qwen3.7-Max가 35시간에 걸친 완전 자율 태스크를 성공시킨 사실이다.

### 실험 내용

알리바바는 Qwen3.7-Max에게, 학습 시 한 번도 본 적 없는 칩 (핑터거우젠 우 M890) 위에서 추론 커널을 최적화하게 했다. 모델에는 하드웨어 문서나 프로파일링 데이터도 주어지지 않았다. 태스크 설명, 기존 SGLang 구현, 평가 스크립트만 전달되었다.

### 결과

- **작업 시간**: 35시간 연속 (인간 개입 없음)
- **도구 호출**: 1,158회
- **커널 평가**: 432회
- **최종 결과**: Triton 참조 구현 대비 **10.0배** 기하 평균 가속

모델은 35시간 동안 일관된 추론 전략을 유지했다. 30시간 경과 후에도 유의미한 개선을 발견하며, 장시간의 자율적 최적화가 '가능할 뿐만 아니라 생산적'임을 입증했다.

### 타 모델과의 비교

| 모델 | 기하 평균 가속 비율 | 비고 |
|---|---|---|
| **Qwen3.7-Max** | **10.0x** | 35시간 완주 |
| GLM 5.1 | 7.3x | — |
| Kimi K2.6 | 5.0x | — |
| DeepSeek V4 Pro | 3.3x | 중도 중단 |
| Qwen3.6-Plus | 1.1x | 중도 중단 |

중도 중단된 모델은 '5라운드 연속 도구 호출이 없을 경우' 자동 종료되었다. 즉, 모델 자신이 '더 이상 개선할 수 없다'고 판단해 작업을 멈춘 것이다.

### KernelBench L3 결과

마찬가지로 커널 생성 능력을 측정하는 KernelBench L3에서, Qwen3.7-Max는 96%의 시나리오에서 가속 커널을 생성했다. 비교 대상은 다음과 같다.

| 모델 | 가속 커널 생성률 |
|---|---|
| Claude Opus 4.6 | 98% |
| **Qwen3.7-Max** | **96%** |
| GLM 5.1 | 78% |
| Kimi K2.6 | 80% |
| DeepSeek V4 Pro | 54% |

---

## YC-Bench: 스타트업 경영 시뮬레이션

Qwen3.7-Max의 또 다른 주목할 성과는 YC-Bench 성적이다. 이 벤치마크는 스타트업 1년 라이프사이클 전체를 시뮬레이션하며, 인력 관리, 계약 심사, 악의적 클라이언트 식별 등 수백 번의 의사결정을 요구한다.

| 모델 | 총 수익 | 완료 태스크 수 |
|---|---|---|
| **Qwen3.7-Max** | **2.08M USD** | 237 |
| Qwen3.6-Plus | 1.05M USD | — |
| Qwen3.5-Plus | 352K USD | — |

Qwen3.7-Max는 이전 세대의 약 2배, 3.5세대의 약 6배 수익을 달성했다.

---

## API 요금

Qwen3.7-Max는 알리바바 클라우드의 Model Studio를 통해 제공된다.

| 항목 | 요금 |
|---|---|
| 입력 토큰 | $2.50 / 1M 토큰 |
| 출력 토큰 | $7.50 / 1M 토큰 |
| 컨텍스트 윈도우 | **1M 토큰** |

비교적 저렴한 요금 체계다. Claude Opus 4.6의 입력 $15/출력 $75와 비교하면, 입력은 약 1/6, 출력은 약 1/10 가격이다.

---

## API 사용 방법

### OpenAI 호환 API

Qwen3.7-Max는 OpenAI 호환 API 프로토콜을 지원한다.

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-dashscope-api-key",
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
)

completion = client.chat.completions.create(
    model="qwen3.7-max",
    messages=[{"role": "user", "content": "Python으로 정렬된 연결 리스트를 병합하는 함수를 작성해"}],
    extra_body={"enable_thinking": True},
    stream=True
)
```

### Claude Code와의 통합

Qwen API는 Anthropic API 프로토콜도 지원하여, Claude Code에 직접 연결할 수 있다.

```bash
export ANTHROPIC_MODEL="qwen3.7-max"
export ANTHROPIC_SMALL_FAST_MODEL="qwen3.7-max"
export ANTHROPIC_BASE_URL=https://dashscope-intl.aliyuncs.com/apps/anthropic
export ANTHROPIC_AUTH_TOKEN=<your_api_key>

claude
```

### OpenClaw와의 통합

```bash
curl -fsSL https://molt.bot/install.sh | bash
export DASHSCOPE_API_KEY=<your_api_key>
openclaw dashboard
```

### Qwen Code

```bash
npm install -g @qwen-code/qwen-code@latest
qwen
```

---

## preserve_thinking 기능

Qwen3.7-Max는 `preserve_thinking` 기능을 지원한다. 에이전트 태스크에 권장되는 이 기능은 메시지 내의 선행 턴 모든 사고 내용을 유지한다. 장시간의 멀티턴 대화에서 모델의 추론 일관성을 유지하는 데 도움이 된다.

---

## Qwen 시리즈의 반복 속도

Qwen3.7-Max는 3개월 연속 플래그십 모델 출이라는 이례적인 속도 속에 등장했다.

![Qwen3.7-Max リリースタイムライン](/images/blog/qwen3-7/release-timeline.webp)

| 날짜 | 모델 | 테마 |
|---|---|---|
| 2026년 2월 | Qwen3.5-Max | 네이티브 멀티모달 에이전트 |
| 2026년 3월 30일 | Qwen3.5-Omni | 전 모달 대응 |
| 2026년 4월 2일 | Qwen3.6-Plus | 에이전트 프로그래밍 강화 |
| 2026년 4월 16일 | Qwen3.6-35B-A3B | MoE 오픈소스 |
| 2026년 4월 22일 | Qwen3.6-27B | 밀집 모델 오픈소스 |
| 2026년 5월 20일 | **Qwen3.7-Max** | **에이전트 시대의 새로운 기준** |

매월 1세대 플래그십 모델을 출시하며, 그때마다 국내 모델의 성능 상한선을 갱신하고 있다. 이 반복 속도는 업계에서도 유례없는 수준이다.

---

## 기타 Qwen3.7 쿼리에 대하여

### Qwen3.7-Plus

Qwen3.7-Plus는 Max의 아랫동생 같은 존재로, 비전 능력에 강점을 가진다. Arena AI 비전 랭킹에서 16위를 기록했다. Max와 마찬가지로 사고 모드를 지원하지만, 비용 대비 성능이 뛰어난 선택지가 된다.

### Qwen3.7-Preview

Qwen3.7-Max-Preview 및 Qwen3.7-Plus-Preview는 정식 출시 전 프리뷰 버전으로 2026년 5월 19일 Arena AI에 등장했다. 현재는 사고 모드만 지원하며, 검색 기능이나 코드 인터프리터는 아직 열리지 않았다.

### Qwen3.7-Max vs Qwen3.6-Plus

Qwen3.6-Plus는 2026년 4월 2일 출시된 모델로, Qwen3.7-Max의 직접적인 전임자에 해당한다. 3.7-Max는 3.6-Plus와 비교하여, 에이전트 능력, 추론 정확도, 장시간 태스크 실행 안정성에서 대폭적인 개선을 이루었다. YC-Bench의 수익 비교 (2.08M vs 1.05M)가 그 차이를 단적으로 보여준다.

---

## 정리

Qwen3.7-Max는 에이전트 능력에 특화된 알리바바의 최신 플래그십 모델이다. 주요 벤치마크에서 Claude Opus 4.6 및 DeepSeek V4 Pro에 필적하거나 상회하는 성능을 보이며, 35시간 자율 실험에서는 10배의 성능 향상을 달성했다.

포인트를 정리하면:

1. **Arena 종합 국내 1위**, 세계 5위
2. **추론 능력**: GPQA Diamond 92.4로 Claude Opus 4.6 (91.3)을 상회
3. **코딩**: SWE-Pro 60.6, Terminal-Bench 69.7
4. **35시간 자율 실험**: 1,158회 도구 호출로 10배 가속
5. **요금**: 입력 $2.50/출력 $7.50 per 1M 토큰 (Claude 대비 약 1/10)
6. **컨텍스트**: 1M 토큰
7. **통합**: Claude Code, OpenClaw, Qwen Code 대응

에이전트 시대의 기반 모델로서, Qwen3.7-Max는 '똑똑할 뿐만 아니라 오래 일할 수 있다'는 점에서 새로운 기준을 제시하고 있다.
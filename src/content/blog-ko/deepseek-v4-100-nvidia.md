---
title: "DeepSeek V4 발표: 100만 토큰 컨텍스트와 화웨이 칩 최적화로 NVIDIA 독점 타파"
date: "2026-04-24"
tag: "오픈소스"
excerpt: "DeepSeek가 V4 시리즈를 발표하며 100만 토큰 컨텍스트와 에이전트 코딩 성능을 대폭 강화했다. V4-Pro는 주요 벤치마크에서 최상위 클로즈드 모델에 필적하는 성능을 보이며, 중국 국산 Ascend 칩 최적화를 통해 NVIDIA 독점 타파에 나섰다."
---

DeepSeek가 V4 시리즈 모델의 프리뷰 버전을 공식 발표하고 오픈소스화했다. 이번 업데이트에서 두 모델 모두 100만 토큰의 컨텍스트 윈도우를 기본 탑재한 것이 가장 큰 특징이다.

![](/images/blog/deepseek-v4-ai/img-1.png)

* **DeepSeek-V4-Pro**: 파라미터 수 1.6T (액티브 파라미터 49B)
* **DeepSeek-V4-Flash**: 파라미터 수 284B (액티브 파라미터 13B)

이 모델들은 공식 사이트(chat.deepseek.com)와 공식 앱에서 체험할 수 있으며, API 서비스도 동시에 제공이 시작되었다.

## 에이전트(Agent) 능력의 비약적 향상

이번 업그레이드에서 가장 핵심적인 방향은 에이전트 기능의 강화다. V4-Pro는 이미 DeepSeek 내부에서 에이전틱 코딩(Agentic Coding) 도구로 일상적으로 사용되고 있으며, 직원 피드백에 따르면 "Sonnet 4.5보다 사용감이 좋고, 결과물의 품질은 Opus 4.6의 비사고(non-thinking) 모드에 근접한다"는 평가를 받고 있다.

내부 R&D 프로그래밍 벤치마크(50명 이상의 엔지니어가 수행한 약 200건의 실제 태스크)에서 V4-Pro-Max의 패스율(Pass Rate)은 67%로, Sonnet 4.5의 47%를 크게 상회했다. 다만 Opus 4.6 Thinking의 80%에는 아직 차이가 있다.

![](/images/blog/deepseek-v4-ai/img-2.png)

내부 조사에 참여한 85명의 개발자 및 연구자 중 9할 이상이 V4-Pro를 "최우선 또는 그에 준하는 프로그래밍 모델"로 선택할 수 있다고 생각하고 있다. 또한 Claude Code, OpenClaw, OpenCode, CodeBuddy 등 주요 에이전트 제품에 대한 최적화도 이루어져 코드 태스크와 문서 생성 양면에서 향상이 이루어졌다.

도구 호출(Tool Call)에 관해서는 새로운 XML 형식의 스키마를 도입하고, "|DSML|"이라는 특수 토큰으로 경계를 정의하여 이스케이프 실패나 호출 오류를 대폭 감소시켜 전 세대보다 높은 신뢰성을 실현했다.

![](/images/blog/deepseek-v4-ai/img-3.png)

## 지식량과 추론 능력 벤치마크

지식과 추론 측면에서 V4-Pro는 세계 지식 평가에서 다른 오픈소스 모델을 압도하고 있다. SimpleQA-Verified 스코어는 57.9로, 근소한 차이의 오픈소스 경쟁 모델을 약 20포인트 상회하며, Gemini-3.1-Pro(75.6)에 근접한 결과를 보여준다. 수학, STEM, 경쟁 프로그래밍 3개 항목에서는 공개된 모든 오픈소스 모델을 능가하며, 최상위 클로즈드 모델에 필적하는 수준에 도달했다.

베이스 모델(Base Model)인 V4-Pro-Base는 MMLU 5-shot에서 90.1, MMLU-Pro 5-shot에서 73.5를 기록하여 파라미터 수가 유사한 V3.2-Base를 전면적으로 상회했다. 특히 주목할 점은 더 소형인 V4-Flash-Base조차도 많은 벤치마크에서 V3.2-Base를 넘어섰다는 것이며, 아키텍처 개선에 따른 효율 향상이 뚜렷하다.

![](/images/blog/deepseek-v4-ai/img-4.png)

Codeforces 인간 랭킹에서는 V4-Pro-Max가 현재 23위에 위치해 있다. 또한 IMOAnswerBench Pass@1은 89.8에 도달하여 GPT-5.4의 91.4에 이어 두 번째 성능을 보여준다. 에이전트 평가의 SWE Verified Resolved는 80.6으로, Opus-4.6 Max(80.8)와 거의 동등하다.

![](/images/blog/deepseek-v4-ai/img-5.png)

장문 컨텍스트 평가에서는 1M 토큰 시나리오에서 Gemini-3.1-Pro를 상회하는 결과가 나왔다. 128K까지는 매우 안정적이며, 이를 초과하면 저하되기 시작하지만, 1M 시점의 성능은 여전히 많은 동급 모델을 상회하고 있다.

## 'Flash'를 과소평가해선 안 된다: 사고 모드 선택이 핵심

V4-Flash는 단순한 "저사양 버전"이 아니다. API 가격에서 경쟁력이 있으면서 추론 능력은 Pro에 근접한다. 특히 "Think Max" 모드를 사용할 경우 V4-Flash의 추론 성능은 Pro에 크게 다가선다. LiveCodeBench Flash Max에서 91.6을 기록하는 등 Pro Max와의 차이는 극히 제한적이다.

![](/images/blog/deepseek-v4-ai/img-6.jpg)

중요한 것은 버전 선택보다 "사고 강도(reasoning_effort)"의 선택이다. V4-Pro를 예로 들면, HLE Pass@1은 비사고 모드의 7.7에서 Max 모드에서는 37.7로 비약적으로 향상된다. 복잡한 태스크에서는 적절한 사고 강도를 선택하는 것이 성능을 최대한 끌어내는 핵심이다.

두 모델은 다음 3가지 추론 강도를 지원한다:
1. **비사고 모드**: 응답 속도가 빠르며, 일상적인 가벼운 태스크에 적합.
2. **Think High**: 명시적 논리 추론을 활성화하며, 복잡한 문제나 플래닝에 적합.
3. **Think Max**: 추론 능력을 최대한 활용. 컨텍스트 윈도우를 384K 이상으로 설정하는 것이 권장됨.

Think Max 모드에서는 시스템 프롬프트 초입에 "최대 강도로 추론하고, 지름길을 사용하지 않으며, 모든 추론 단계와 기각된 가설을 명시적으로 기술하라"는 지시가 주입된다. 이를 통해 동일 모델이라도 모드에 따라 극적인 성능 차이가 발생한다.

![](/images/blog/deepseek-v4-ai/img-7.png)

## 100만 토큰을 뒷받침하는 아키텍처 혁신

DeepSeek V4는 1M 토큰의 컨텍스트를 효율적으로 처리하기 위해 어텐션 메커니즘에 대폭적인 변경을 가했다.

![](/images/blog/deepseek-v4-ai/img-8.png)

기존 어텐션 계산량은 시퀀스 길이의 제곱으로 증가하기 때문에, 장문 컨텍스트에서는 계산상의 병목이 된다. V4에서는 2종의 압축 어텐션을 교대로 사용하는 메커니즘을 도입했다.

1. **CSA (Compressed Sparse Attention)**: $m$개의 토큰의 KV 캐시를 하나로 압축하고, 스파스 어텐션을 사용하여 그 중 $k$개만 선별하여 계산에 활용한다.
   ![](/images/blog/deepseek-v4-ai/img-9.png)
2. **HCA (Hierarchical Compressed Attention)**: 더 높은 압축률로 더 긴 구간을 하나로 압축하고, Dense(조밀) 어텐션을 유지한다.
   ![](/images/blog/deepseek-v4-ai/img-10.png)

또한 CSA에는 "Lightning Indexer"가 탑재되어, FP4 저정밀도로 쿼리 토큰과 압축 블록 간의 상관 스코어를 고속으로 산출하여 계산량을 더욱 절감한다. 국소적인 세부 정보를 잃지 않도록 양쪽 어텐션에 슬라이딩 윈도우 분기를 도입한 점도 특징이다.

이 결과, 1M 컨텍스트에서 V4-Pro의 단일 토큰 추론 계산량은 V3.2의 27%로 억제되었고, KV 캐시 점유량은 10%까지 감소했다. V4-Flash는 더욱 적극적으로, 계산량은 V3.2의 10%, KV 캐시는 7%까지 절감되었다.

![](/images/blog/deepseek-v4-ai/img-11.png)

## 학습의 최적화와 안정화

잔차 연결(residual connection)을 강화하기 위해 "manifold Constrained Hyper-connection (mHC)"을 도입했다. 신호 전달을 안정시키고, 층을 넘나드는 정보 전파를 최적화했다. 최적화 기법으로는 Muon 옵티마이저를 도입하여, 그래디언트 행렬을 반복적으로 직교화(orthogonalization)하여 수렴 속도와 안정성을 향상시켰다. 대부분의 파라미터를 Muon으로 처리하고, Embedding 레이어나 예측 헤드 등은 AdamW를 병용하는 하이브리드 구성이다.

또한 학습 중 "Loss Spike(손실 급증)" 문제에 대해 다음 2가지 대책을 적용했다:
1. **예측적 라우팅 (Anticipatory Routing)**: 업데이트를 디커플링하여 악순환을 차단.
2. **SwiGLU의 선형 성분 클리핑**: 수치 범위를 $[-10, 10]$으로 제한하여 이상치 발생을 억제.

![](/images/blog/deepseek-v4-ai/img-12.png)

모델은 32T 토큰 이상의 고품질 데이터로 사전 학습되었으며, SFT와 GRPO(그룹 상대 정책 최적화)에 의한 강화학습을 거쳐, 온라인 증류(OPD)를 통해 각 영역의 능력을 단일 모델로 통합하고 있다.

## 오픈소스 전개와 배포

4가지 가중치 버전이 오픈소스로 공개되어 HuggingFace 및 ModelScope에서 다운로드 가능하다. 정밀도는 FP8 Mixed(Base 버전) 및 FP4/FP8 혼합 정밀도(지시 조정 버전)가 채택되었다. FP4에서 FP8로의 역양자화(dequantization)는 다이나믹 레인지 차이로 인해 로스 없이 이루어진다.

![](/images/blog/deepseek-v4-ai/img-13.png)

API 이용에 있어서는 OpenAI ChatCompletions 및 Anthropic 양쪽 인터페이스를 모두 지원한다. 모델 파라미터를 `deepseek-v4-pro` 또는 `deepseek-v4-flash`로 변경하기만 하면 바로 이용 가능하다.

## NVIDIA 독점을 타파하는 "국산 칩" 전략

기술적 측면 이상으로 주목해야 할 점은, DeepSeek V4가 NVIDIA가 아닌 중국 국산 칩(Ascend/昇腾)에서 지속적으로 최적화되었다는 것이다.

DeepSeek는 NVIDIA나 AMD에 앞서 선행 접근 권한을 국산 칩 제조사에 제공했다. 이를 통해 "알고리즘은 자사 개발, 코드는 오픈소스, 칩은 국산"이라는 에코시스템이 완성되게 된다.

NVIDIA의 젠슨 황 CEO는 최근 인터뷰에서 DeepSeek의 진전을 경시하기보다는, 오히려 "AI 모델이 중국 하드웨어에서 최적으로 작동하도록 구축되고, 이것이 세계로 확산되면서 중국 기술이 세계 표준이 될 가능성"에 대한 우려를 표명했다.

1조 파라미터급 모델을 Ascend 칩에서 구동시킨 실적은, 중국 국내 컴퓨팅 리소스 에코시스템에 강력한 추진력을 제공할 것이며, 다른 칩 제조사(Cambricon, Hygon 등)의 적응 가속을 촉진할 것으로 예상된다.
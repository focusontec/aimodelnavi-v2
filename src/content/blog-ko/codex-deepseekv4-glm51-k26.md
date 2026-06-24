---
title: "Codex에 DeepSeek V4, GLM 5.1, K2.6 연결하는 법 | 프로토콜 변환과 두 가지 해결책"
date: "2026-06-03"
tag: "오픈소스"
excerpt: "Codex에 DeepSeek, GLM 등 제3자 AI 모델을 연결하려면 단순히 API Key를 입력하는 것만으로는 부족하며, 프로토콜 변환이 필요합니다. CC-Switch는 로컬 프록시를 통해 요청을 변환하는 저침투 방식이고, Codex++는 데스크톱 앱 자체를 강화하는 방식으로, 각각 다른 해결책을 제공합니다."
---

Codex에서 DeepSeek, GLM, Kimi와 같은 제3자 대규모 모델의 API Key를 직접 입력하고 싶다면, 아마 생각대로 작동하지 않을 겁니다.

문제는 입력한 Key가 유효하지 않거나 계정을 사용할 수 없는 것이 아닙니다. 프로토콜이 완전히 일치하지 않아 정상적으로 통신할 수 없는 것이 원인입니다.

현재 새 버전의 Codex CLI / Codex App의 API Key 모드를 예로 들면, 기본 통신 경로는 **OpenAI Responses API**입니다. 반면, 많은 제3자 모델이 주로 제공하는 것은 **OpenAI 호환 Chat Completions**입니다.

양쪽 모두 메시지 구조, 스트리밍 응답, 추론(reasoning) 필드, 도구 호출(tool call) 표현 방식에 차이가 있어 "Base URL을 바꾸고 Key를 입력하면 바로 작동한다"고 단순히 생각할 수 없습니다.

![Codex에서 제3자 모델 연결 시 프로토콜 변환 관계](/images/blog/codex-deepseekv4-glm51-k26/img-1.webp)

따라서, 제3자 모델을 연결할 때 실제로 해결해야 할 것은 "API Key를 입력하는 것"이 아니라, 다음 점입니다.

**Codex가 보내는 요청을 제3자 모델이 이해할 수 있게 하고, 제3자 모델이 반환하는 내용을 Codex가 인식할 수 있는 형식으로 변환하는 것입니다.**

현재 알려진 일반적인 방법은 주로 두 가지입니다.

- **CC-Switch**: 로컬 프록시와 프로토콜 변환을 사용하는 방법.
- **Codex++**: Codex 데스크톱 앱의 강화와 설정 주입에 특화된 방법.

어느 쪽이든 Codex에 제3자 모델을 연결하는 데 도움이 되지만, 문제를 해결하는 포인트가 다릅니다. 전자는 주로 프록시 계층에서 프로토콜을 변환하고, 후자는 주로 Codex 데스크톱 앱의 설정과 UI 계층에서 강화를 수행합니다.

단순히 제3자 모델을 연결하고 싶다면, 먼저 CC-Switch를 고려해야 합니다. Codex 데스크톱 버전을 주로 사용하고, 플러그인 항목과 UI 강화도 원한다면, Codex++를 살펴보세요.

## 1. CC-Switch 루트: 저침투 설정 전환 방안

### 1.1 CC-Switch란?

CC-Switch는 여러 AI 코딩 도구의 설정 센터이자 로컬 라우팅 프록시에 가까운 존재입니다. 원래 Claude Code를 위해 개발되었지만, 이후 Codex, Gemini CLI, OpenCode, OpenClaw 같은 도구로도 확장되었습니다.

참고로, 이 오픈소스 프로젝트는 AI 시대에 만들어진 매우 우수한 제품 중 하나로, AI 바람을 타고 인기를 얻어 현재 Star 수는 9만에 가까워지고 있습니다. 비판적인 목소리도 있지만, 저자가 진지하게 유지관리하고 있으며 체험도 좋다는 점은 부인할 수 없습니다.

![CC-Switch 프로젝트의 Star 수 추이](/images/blog/codex-deepseekv4-glm51-k26/img-2.png)

Codex의 시나리오에서는 주로 다음 두 가지를 수행합니다.

- **설정 전환**: 다른 코딩 도구의 설정을 통합 관리하고, 원클릭 프리셋 전환, 템플릿 가져오기, 프로바이더 전환을 지원합니다.
- **로컬 프록시**: 로컬 머신에서 HTTP 서비스를 시작하고, Codex로부터의 요청을 프로토콜 변환·라우팅 분배하여 제3자 모델에 전달합니다.

핵심 포인트는 하나입니다. Codex 자체는 변경하지 않고, 설정만 바꾸고, 프록시를 시작한다는 점입니다.

### 1.2 설치 및 설정

설정 전에, Codex가 현재 API Key / 로컬 설정 루트를 사용하고 있는지 확인하는 것을 권장합니다. ChatGPT 로그인 루트와 혼합되면, 요청 경로가 불분명해져 오류의 원인 판별이 어려워집니다. 또한, Codex를 최소 1회 실행하여 설정 파일을 초기화해 두면, 이후 라우팅 설정이 편리해집니다.

- CC-Switch의 GitHub 저장소 [1]를 열고, 설치 프로그램을 다운로드하여 설치합니다.
- CC-Switch를 시작하고, 오른쪽 상단의 ` + `를 클릭하여 프로바이더를 추가합니다. 여기서는 DeepSeek를 예로 듭니다.

![CC-Switch의 프로바이더 추가 화면 1](/images/blog/codex-deepseekv4-glm51-k26/img-3.png)
![CC-Switch의 프로바이더 추가 화면 2](/images/blog/codex-deepseekv4-glm51-k26/img-4.png)

- 기본적으로는 API Key를 입력하기만 하면 됩니다. 로컬 라우팅 매핑이 필요한 경우, ` Needs Local Routing `가 활성화되어 있는지 확인합니다. 보통 기본적으로 활성화된 상태입니다.
![CC-Switch의 API Key 입력](/images/blog/codex-deepseekv4-glm51-k26/img-5.png)
![CC-Switch의 로컬 라우팅 설정](/images/blog/codex-deepseekv4-glm51-k26/img-6.png)

- 메인 페이지로 돌아가서, 왼쪽 상단의 톱니바퀴 아이콘을 클릭하여 설정에 들어가고, "라우팅"을 엽니다. 아래 그림과 같이, 로컬 라우팅 버튼을 활성화합니다. 이때 하단에 표시되는 총 요청 수는 ` 0 `이지만, 이 숫자로 Codex가 실제로 CC-Switch를 경유했는지 판단할 수 있습니다.
![CC-Switch의 라우팅 항목](/images/blog/codex-deepseekv4-glm51-k26/img-7.png)
![CC-Switch에서 로컬 라우팅 활성화](/images/blog/codex-deepseekv4-glm51-k26/img-8.png)

- Codex를 다시 시작하고, 메시지를 보내어 정상적으로 응답이 돌아오는지 확인합니다.
![Codex에서 제3자 모델을 사용한 응답](/images/blog/codex-deepseekv4-glm51-k26/img-9.png)

- CC-Switch의 라우팅 설정 화면으로 돌아가서, 요청 기록이 표시되면 설정이 활성화되었음을 의미합니다.
![CC-Switch의 요청 기록](/images/blog/codex-deepseekv4-glm51-k26/img-10.png)

이상으로, CC-Switch 루트가 작동하게 됩니다.

## 2. Codex++ 루트: 더 깊은 강화 방안

### 2.1 Codex++란?

Codex++는 범용적인 프로토콜 변환 프록시가 아니라, Codex 데스크톱 앱의 외부 강화 런처에 가깝습니다.

BigPizzaV3/CodexPlusPlus [2]를 예로 들면, Codex App의 원본 설치 파일은 변경하지 않고, 외부 런처를 사용하여 Codex를 시작하고, Chromium DevTools Protocol(CDP)을 통해 실행 시 Codex의 렌더링 프로세스에 강화 스크립트를 주입합니다. 프로바이더 설정은 독립된 관리 도구에서 ` ~/.codex/config.toml `에 기록됩니다.

![Codex++의 아키텍처](/images/blog/codex-deepseekv4-glm51-k26/img-11.png)

따라서 CC-Switch와는 초점이 다릅니다.

- CC-Switch는 주로 요청의 전달 방법과 프로토콜 변환을 해결합니다.
- Codex++는 주로 데스크톱 앱의 강화 방법, 설정의 주입 방법, 플러그인 항목의 사용 방법에 관심을 둡니다.

여기서 주의할 점으로, 다른 독립 프로젝트 b-nnett/codex-plusplus [3]가 존재합니다. 이것은 ` app.asar `을 수정하여 로더를 주입하는 방식으로, 본 기사에서 설명하는 BigPizzaV3 버전과는 아키텍처가 완전히 다릅니다. 아래에서 서술하는 Codex++는 특별한 언급이 없는 한 BigPizzaV3 버전을 가리킵니다.

### 2.2 설치 및 설정

- BigPizzaV3/CodexPlusPlus [4]를 열고, 해당 OS의 설치 프로그램을 다운로드합니다.
- 설치 후, 데스크톱에 두 가지 항목이 나타납니다: ` Codex++ `와 ` Codex++ 관리 도구 `. 관리 도구는 프로바이더 설정에 사용하고, ` Codex++ `는 원본 Codex 아이콘 대신 시작하기 위해 사용합니다.

` Codex++ ` 런처를 먼저 실행해야 합니다. 이렇게 해야 CDP를 통해 Codex에 강화 스크립트를 주입할 수 있습니다. 직접 원본 Codex 아이콘을 클릭하면 이 단계를 건너뛰게 되어, 강화 기능이 활성화되지 않습니다.
![Codex++ 설치 후 항목](/images/blog/codex-deepseekv4-glm51-k26/img-12.png)

- ` Codex++ 관리 도구 `를 시작하고, 프로바이더 설정을 선택하여 프로바이더를 추가합니다. DeepSeek를 예로 듭니다.
  - 연결 모드: "퓨어 API"를 선택합니다.
  - Base URL: Codex++의 내장 프리셋 또는 인터페이스의 지시에 따라 입력을 우선합니다. DeepSeek 공식 문서가 현재 제시하는 OpenAI 호환 Base URL은 ` https://api.deepseek.com `입니다. 도구가 OpenAI 스타일의 ` /v1 `을 요구하면, ` https://api.deepseek.com/v1 `과 같이 입력합니다.
  - API Key: 귀하의 Key를 입력합니다.
  - 업스트림 프로토콜: ` Chat Completions `을 선택합니다.
![Codex++의 프로바이더 추가](/images/blog/codex-deepseekv4-glm51-k26/img-13.png)
![Codex++의 DeepSeek 설정](/images/blog/codex-deepseekv4-glm51-k26/img-14.png)

- 설정 완료 후, ` Codex++ ` 아이콘에서 Codex를 시작합니다. Codex가 이미 실행 중인 경우, 한 번 종료한 후 시작하거나, 오른쪽 상단의 재시작 버튼을 클릭합니다. 직접 원본 Codex 데스크톱 아이콘을 열면, 강화 스크립트가 개입하지 않아 원본 Codex가 작동합니다.
- 최종적인 페이지 표시는 다음과 같습니다.
![Codex++의 페이지 표시 효과](/images/blog/codex-deepseekv4-glm51-k26/img-15.png)

### 2.3 Codex++가 수행하는 것

Codex++의 강화 스크립트는 주로 세 가지를 수행합니다.

첫째는 **제3자 설정의 기록**입니다. 모든 요청을 가로채어 다시 쓰는 것이 아니라, 커스텀 프로바이더를 Codex의 네이티브 설정(예: ` ~/.codex/config.toml `)에 기록하여, Codex 자체가 이 프로바이더를 통해 제3자 서비스에 접근하게 합니다. 쉽게 말해, 네트워크 계층에서 강제로 요청을 가로채는 것이 아니라, "Codex의 경로를 설정해 주는" 것과 같습니다.

둘째는 **Codex App에 대한 항목 추가**입니다. Codex++에서 Codex를 시작하면, CDP를 사용하여 강화 스크립트가 주입되어, 상단 메뉴 바에 Codex++의 상태와 설정 항목이 추가됩니다. 프로바이더의 추가나 설정 전환 같은 실제 작업은 여전히 독립적인 "Codex++ 관리 도구"에서 이루어지며, Codex의 원본 창 내에서 직접 설정되는 것은 아닙니다.

셋째는 **데스크톱 앱의 강화 기능 추가**입니다. 예를 들어 API Key 모드에서는, Codex의 원본 플러그인 항목이 ChatGPT에의 로그인이 필요하다고 표시될 때가 있습니다. Codex++로 시작하면 이 항목이 잠금 해제되고, 더 나아가 세션 삭제, Markdown 내보내기, Timeline, 프로바이더 동기화 같은 강화 기능이 추가됩니다.
![Codex++의 추가 기능 예시](/images/blog/codex-deepseekv4-glm51-k26/img-16.webp)

## 3. 연결 원리: Codex는 대체 무엇을 연결하고 있는가

위의 두 가지 루트는 겉보기에는 다르게 보이지만, 실제로 막히는 포인트는 같습니다. Codex가 발신하는 모델 요청을 제3자 서비스가 받아들일 수 있는지 여부입니다.

API Key 모드를 예로 들면, Codex는 대략 다음과 같이 동작합니다.

```
사용자 입력
-> Codex Agent가 태스크를 편성
-> ~/.codex/config.toml 읽기
-> model_provider에 기반하여 해당 프로바이더 찾기
-> base_url, API Key, wire_api 등의 설정 추출
-> 모델 서비스에 요청 전송
-> 모델이 결과 반환
-> Codex가 응답 분석
-> 도구 호출, 파일 편집, 명령 실행 등의 액션 계속
```

여기서 가장 중요한 것은 몇 가지 설정 항목입니다.

- ` model_provider `: 현재 사용하는 모델 프로바이더.
- ` base_url `: 요청의 전송 대상. OpenAI이든, 제3자 중계, 로컬 프록시, 또는 자사 내부 모델 게이트웨이든 상관없습니다.
- ` env_key `: API Key를 어떤 환경 변수에서 읽어올지. Key를 설정 파일에 직접 기록하는 것을 피합니다.
- ` wire_api `: Codex가 모델 서비스와 통신 시 어떤 프로토콜을 사용하는지. 예를 들어 ` responses `나 ` chat ` 등.

마지막 ` wire_api `가 매우 중요합니다.

일반적인 채팅 인터페이스가 한 문장을 반환할 수 있다고 해서, Codex의 Agent 흐름을 지원할 수 있는 것은 아닙니다. Codex는 단순히 질문을 모델에 보내 답을 표시하는 것이 아니라, 스트리밍 응답, 도구 호출, 추론, 상태 필드를 분석하고, 더 나아가 파일 읽기, 코드 수정, 명령 실행을 계속해야 합니다.

따라서, 제3자 모델을 연결할 수 있는지 여부는 "OpenAI 호환인지"뿐만 아니라, Chat Completions과 호환되는지, 아니면 Codex가 현재 사용하는 Responses 링크를 완전히 받아들일 수 있는지로 판단해야 합니다.

### 3.1 왜 Base URL만 바꿔서는 안 되는가

Codex는 현재 OpenAI Responses API의 사용을 선호하는 경향이 있지만, 많은 제3자 모델이 제공하는 것은 Chat Completions API입니다. 둘은 같은 것이 아닙니다.

Responses API는 에이전트 시나리오에 적합하며, 더 많은 상태와 이벤트 구조에 관여합니다. Chat Completions API는 기존 대화 인터페이스에 가깝고, 핵심은 ` messages ` 목록과 모델의 응답입니다. 일반적인 채팅 도구에서는 ` messages `를 보내기만 하면 충분하지만, Codex는 도구 호출, 스트리밍 이벤트, 컨텍스트, 추론, 태스크 상태 등의 내용을 처리할 필요가 있습니다.

그 때문에, 제3자 모델을 Codex에 연결할 때 정말로 귀찮은 점은 "요청을 보낼 수 없다"는 것이 아니라, "요청과 응답이 양쪽에서 올바르게 이해될 수 있는지"입니다.

### 3.2 CC-Switch의 원리: 프록시 계층에서의 변환

CC-Switch의 로컬 프록시가 수행하는 것은 프로토콜 변환입니다.

- Codex에서 온 Responses 요청을 Chat Completions로 변환하여 상류에 전달합니다.
- 상류에서 반환된 SSE 스트리밍 응답을 Responses로 다시 패키징하여 Codex에 푸시합니다.
- 추론 콘텐츠, 도구 호출, ` previous_response_id ` 등의 상태 필드를 처리합니다.

정확히 중간에 변환 계층이 있기 때문에, 제3자 모델이 안정적으로 작동할지는 모델 자체뿐만 아니라, 프로바이더의 호환성과 프록시의 구현에도 의존합니다.

만약 상류 자체가 Responses API를 지원한다면, 프록시는 Chat Completions로의 변환 레이어를 생략할 수 있고, 주로 인증 주입, 사용량 추적, 헬스 체크 등의 작업을 담당합니다.
![CC-Switch의 프로토콜 변환 원리](/images/blog/codex-deepseekv4-glm51-k26/img-17.webp)

### 3.3 Codex++의 원리: 데스크톱 앱에서의 강화

Codex++는 보다 **Codex App 데스크톱 앱의 강화 + 프로바이더 설정의 기록/동기화**에 중점을 둡니다. CC-Switch처럼 모든 요청을 로컬 프록시 계층에 집중시켜 프로토콜 변환을 수행하는 것이 아니라, 런처를 통해 Codex를 시작하고, CDP를 사용하여 강화 스크립트를 주입함으로써, Codex App에 추가 메뉴, 설정 항목, 플러그인 항목, 프로바이더 전환 기능을 부여합니다.

쉽게 말해, **CC-Switch는 주로 "요청의 라우팅 방법과 프로토콜 변환 방법"을 해결하고, Codex++는 주로 "Codex 데스크톱 앱의 강화 방법, 그리고 제3자 프로바이더의 더 편리한 기록과 전환 방법"을 해결합니다.**

## 4. 선택 가이드: CC-Switch인가, Codex++인가

결론부터 말하면, 대부분의 사용자는 CC-Switch를 선택하면 충분합니다. 이것도 제가 기본 루트로서 더 추천하는 방법입니다.

### 4.1 필요에 따른 선택

- 주로 Codex CLI를 사용하고, 동시에 Claude Code / Gemini CLI도 실행: CC-Switch 선택.
- Codex 데스크톱 버전만 사용하고, 플러그인 항목과 UI 강화도 희망: Codex++ 선택.
- Codex의 설치 파일을 일절 변경하고 싶지 않음: CC-Switch 우선.
- 프로토콜 변환과 로컬 라우팅이 즉시 사용 가능하길 희망: CC-Switch 우선.
- 데스크톱 앱의 강화, 플러그인 항목, 스크립트 주입을 만져보고 싶음: Codex++ 고려.
![CC-Switch와 Codex++의 선택 권장](/images/blog/codex-deepseekv4-glm51-k26/img-18.webp)

### 4.2 기능의 호환성

제3자 모델을 연결한 후, Codex의 모든 기능을 완전히 대체할 수 있는 것은 아닙니다. 현실적인 상황은 다음과 같습니다.

**완전히 사용 불가, 또는 동등한 대체가 어려움:**

- **Image Gen**: OpenAI의 해당 이미지 생성 능력에 의존하며, 제3자 텍스트 모델로는 직접 대체할 수 없습니다.
- **Computer Use**: Responses API 내장 computer action 유형, 로컬 런타임, 스크린샷의 피드백 루프에 의존합니다. Chat Completions 프로토콜 및 일반적인 제3자 모델은 동등한 능력을 보통 제공할 수 없으며, 프로토콜 변환 계층으로도 보완하기 어렵습니다.

**열화는 있으나 사용 가능:**

- **일반적인 Skills / 플러그인**: Codex++의 페이지 강화와 결합하면 일부 시나리오에서 사용 가능하지만, 안정성은 버전에 따라 다릅니다.
- **도구 호출**: 기본적인 코드 편집, 파일 읽기/쓰기, 명령 실행은 보통 실행할 수 있지만, 복잡한 도구 호출이나 장시간 태스크에서는 형식이나 호환성 문제가 발생할 수 있습니다.

**대체로 정상 작동:**

- 코드 작성
- 디버깅 및 리팩토링
- 파일 읽기/쓰기
- 프로젝트 관리
- 멀티턴 대화
- 태스크 플래닝

### 4.3 더 합리적인 사용 방법

- 가벼운 코드 Q&A, 텍스트 태스크, 간단한 스크립트: DeepSeek 같은 저렴한 모델에는 명확한 가격 우위가 있습니다.
- 복잡한 엔지니어링 프로젝트: 먼저 더 강력한 GPT로 계획을 세운 후, 제3자 모델로 간단한 서브태스크를 처리합니다.
- 만약 GPT Plus / Pro의 이용 한도가 충분하다면: 네이티브 체험이 여전히 가장 안정적이며, 반드시 불필요한 설정을 할 필요는 없습니다.

---

## 관련 기사

- [Anthropic이 Fable을 의도적으로 제한? AI 모델의 신뢰성 위기](/blog/anthropic-fable-nerfing-2026)
- [오픈소스 LLM이 AI 독점을 저지한다: 2026년의 관건 전쟁](/blog/open-source-llm-monopoly-2026)
- [MiniMax M3 리뷰: 100만 토큰 대응과 15배 고속 디코딩이 실현하는 차세대 멀티모달 AI](/blog/article-2026-05-26-minimax-m3)
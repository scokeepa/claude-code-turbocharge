# 🚀 Claude Code Turbocharge

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/claude--code-plugin-purple.svg" alt="Claude Code Plugin">
</p>

<p align="center">
  <strong>Claude Code의 성능을 극대화하는 올인원 플러그인</strong><br>
  메모리 동기화 | TDD 강제 | E2E 테스트 통합
</p>

---

## 📋 목차

- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [설치 방법](#-설치-방법)
- [사용 방법](#-사용-방법)
- [설정](#-설정)
- [스킬 목록](#-스킬-목록)
- [에이전트 목록](#-에이전트-목록)
- [훅 시스템](#-훅-시스템)
- [oh-my-claudecode 연동](#-oh-my-claudecode-연동)
- [문제 해결](#-문제-해결)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 소개

**Claude Code Turbocharge**는 Claude Code의 "기억상실증" 문제를 해결하고, 코드 품질을 자동으로 보장하는 올인원 플러그인입니다.

### 왜 Turbocharge인가?

| 문제 | Turbocharge 해결책 |
|------|-------------------|
| 세션 간 컨텍스트 소실 | 자동 메모리 동기화 |
| 테스트 없이 코드 작성 | TDD 강제 훅 |
| E2E 테스트 누락 | 자동 E2E 테스트 파이프라인 |
| 토큰 낭비 | 3계층 컨텍스트 로딩 |

---

## ✨ 주요 기능

### 1. 🧠 Memory Sync (메모리 동기화)

oh-my-claudecode의 Notepad Wisdom과 연동하여 세션 간 컨텍스트를 유지합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    Memory Sync 아키텍처                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐       ┌─────────────────┐             │
│  │ OMC Notepad     │ ←───→ │ Turbocharge     │             │
│  │ Wisdom          │       │ Memory Store    │             │
│  └─────────────────┘       └─────────────────┘             │
│           │                         │                       │
│           └───────────┬─────────────┘                       │
│                       ▼                                     │
│            ┌─────────────────────┐                          │
│            │    통합 컨텍스트     │                          │
│            │  (3계층 검색 지원)   │                          │
│            └─────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

**특징:**
- 세션 시작 시 자동 컨텍스트 주입
- 세션 종료 시 자동 요약 저장
- 중복 제거 및 압축
- 3계층 Progressive Disclosure

### 2. 🧪 TDD Guard (테스트 주도 개발 강제)

코드 작성 전 테스트 작성을 강제하는 훅 시스템입니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    TDD Guard 워크플로우                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. RED: 실패하는 테스트 작성 필수                             │
│     └─ 테스트 파일 없이 src/ 수정 시 경고                      │
│                         ↓                                   │
│  2. GREEN: 테스트 통과하는 최소 코드                          │
│     └─ 테스트 실행 후 통과 확인                               │
│                         ↓                                   │
│  3. REFACTOR: 코드 개선                                      │
│     └─ 테스트 여전히 통과 확인                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**특징:**
- PostToolUse 훅으로 Write/Edit 감시
- 테스트 커버리지 80% 미만 시 경고
- TDD 위반 시 자동 롤백 제안

### 3. 🎭 E2E Test Integration (E2E 테스트 통합)

Playwright 기반 E2E 테스트 파이프라인을 자동화합니다.

**특징:**
- 컴포넌트 수정 시 관련 E2E 테스트 자동 실행
- 스크린샷/비디오 캡처
- 실패 분석 및 수정 제안

---

## 📦 설치 방법

### 방법 1: Claude Code CLI (권장)

```bash
# 마켓플레이스 추가
claude /plugin marketplace add gongdol/claude-code-turbocharge

# 플러그인 설치
claude /plugin install claude-code-turbocharge

# Claude Code 재시작
```

### 방법 2: 수동 설치

```bash
# 저장소 클론
git clone https://github.com/gongdol/claude-code-turbocharge.git

# Claude 플러그인 디렉토리로 이동
cd ~/.claude/plugins/marketplaces/

# 심볼릭 링크 생성 (Windows)
mklink /D turbocharge "D:\path\to\claude-code-turbocharge"

# 심볼릭 링크 생성 (Mac/Linux)
ln -s /path/to/claude-code-turbocharge turbocharge
```

### 방법 3: npm 설치

```bash
npm install -g claude-code-turbocharge
claude /plugin install claude-code-turbocharge
```

---

## 🚀 사용 방법

### 기본 사용

설치 후 자동으로 활성화됩니다. 특별한 설정 없이 바로 사용 가능합니다.

### 스킬 호출

```bash
# 메모리 동기화 상태 확인
/turbocharge:memory-status

# TDD 모드 활성화
/turbocharge:tdd-mode

# E2E 테스트 실행
/turbocharge:e2e-run

# 전체 상태 체크
/turbocharge:check
```

### 에이전트 호출

```bash
# 메모리 관리 에이전트
Task(subagent_type="turbocharge:memory-keeper", prompt="...")

# TDD 강제 에이전트
Task(subagent_type="turbocharge:tdd-enforcer", prompt="...")

# E2E 테스트 에이전트
Task(subagent_type="turbocharge:e2e-runner", prompt="...")
```

---

## ⚙️ 설정

### 설정 파일 위치

```
~/.claude-turbocharge/settings.json
```

### 기본 설정

```json
{
  "memory": {
    "enabled": true,
    "autoSync": true,
    "maxTokens": 4000,
    "compressionLevel": "medium",
    "syncInterval": 300
  },
  "tdd": {
    "enabled": true,
    "strictMode": false,
    "coverageThreshold": 80,
    "allowedPatterns": ["*.test.ts", "*.spec.ts", "*.test.tsx", "*.spec.tsx"],
    "excludePatterns": ["*.config.*", "*.d.ts"]
  },
  "e2e": {
    "enabled": true,
    "framework": "playwright",
    "autoRun": true,
    "screenshotOnFailure": true,
    "videoOnFailure": false
  },
  "integration": {
    "omcSync": true,
    "claudeMemSync": false
  }
}
```

### 설정 옵션 설명

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `memory.enabled` | 메모리 동기화 활성화 | `true` |
| `memory.autoSync` | 자동 동기화 | `true` |
| `memory.maxTokens` | 최대 토큰 수 | `4000` |
| `tdd.enabled` | TDD 강제 활성화 | `true` |
| `tdd.strictMode` | 엄격 모드 (위반 시 차단) | `false` |
| `tdd.coverageThreshold` | 커버리지 임계값 (%) | `80` |
| `e2e.enabled` | E2E 테스트 활성화 | `true` |
| `e2e.framework` | E2E 프레임워크 | `playwright` |
| `integration.omcSync` | OMC 연동 | `true` |

---

## 📚 스킬 목록

### /turbocharge:memory-sync

메모리 동기화를 수동으로 실행합니다.

```bash
/turbocharge:memory-sync
```

### /turbocharge:tdd-guard

TDD 가드를 활성화/비활성화합니다.

```bash
/turbocharge:tdd-guard enable
/turbocharge:tdd-guard disable
/turbocharge:tdd-guard status
```

### /turbocharge:e2e-test

E2E 테스트를 실행합니다.

```bash
/turbocharge:e2e-test           # 전체 테스트
/turbocharge:e2e-test --file    # 특정 파일만
/turbocharge:e2e-test --watch   # 감시 모드
```

### /turbocharge:turbo-check

전체 상태를 확인합니다.

```bash
/turbocharge:turbo-check
```

---

## 🤖 에이전트 목록

### turbocharge:memory-keeper

메모리 관리 전문 에이전트입니다.

**기능:**
- 컨텍스트 요약 및 저장
- 중복 제거
- 관련 메모리 검색

### turbocharge:tdd-enforcer

TDD 강제 에이전트입니다.

**기능:**
- 테스트 작성 가이드
- 커버리지 분석
- 리팩토링 제안

### turbocharge:e2e-runner

E2E 테스트 실행 에이전트입니다.

**기능:**
- 테스트 시나리오 생성
- 테스트 실행 및 분석
- 실패 디버깅

---

## 🪝 훅 시스템

### SessionStart

세션 시작 시 메모리를 로드하고 컨텍스트를 주입합니다.

### PostToolUse

Write/Edit 도구 사용 후 TDD 검증을 수행합니다.

### PreCompact

컴팩션 전에 중요 컨텍스트를 저장합니다.

### Stop

세션 종료 시 메모리를 저장합니다.

---

## 🔗 oh-my-claudecode 연동

Turbocharge는 oh-my-claudecode와 완벽하게 연동됩니다.

### 연동 기능

| OMC 기능 | Turbocharge 보완 |
|----------|-----------------|
| `<remember>` 태그 | 자동 메모리 캡처 |
| Notepad Wisdom | 영구적 학습/결정 저장 |
| Ralph Loop | 메모리 기반 작업 연속성 |
| Ultrawork | TDD 검증 통합 |

### 활성화

```json
{
  "integration": {
    "omcSync": true
  }
}
```

---

## 🔧 문제 해결

### 메모리가 로드되지 않음

```bash
# 메모리 저장소 확인
ls ~/.claude-turbocharge/memory/

# 수동 동기화
/turbocharge:memory-sync --force
```

### TDD 가드가 너무 엄격함

```json
{
  "tdd": {
    "strictMode": false,
    "excludePatterns": ["*.config.*", "*.d.ts", "scripts/*"]
  }
}
```

### E2E 테스트 실패

```bash
# Playwright 설치 확인
npx playwright install

# 테스트 디버그 모드
/turbocharge:e2e-test --debug
```

---

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.

---

## 📮 연락처

- **GitHub Issues**: [Issues](https://github.com/gongdol/claude-code-turbocharge/issues)
- **Discussions**: [Discussions](https://github.com/gongdol/claude-code-turbocharge/discussions)

---

<p align="center">
  <strong>🚀 Claude Code를 터보차지하세요! 🚀</strong>
</p>

# Turbo Check Skill

<skill>
name: turbo-check
description: Turbocharge 전체 상태를 확인하고 진단하는 스킬
version: 1.0.0
author: gongdol
triggers:
  - turbo check
  - turbocharge status
  - 터보 체크
  - 상태 확인
</skill>

## 개요

Turbo Check 스킬은 Turbocharge 플러그인의 전체 상태를 확인하고 문제를 진단합니다.

## 기능

### 1. 상태 대시보드
- 모든 기능의 활성화 상태 확인
- 메모리 사용량 표시
- TDD 커버리지 표시

### 2. 문제 진단
- 설정 오류 감지
- 누락된 의존성 확인
- 성능 이슈 감지

### 3. 권장 사항
- 최적화 제안
- 설정 개선 안내

## 사용 방법

```bash
# 전체 상태 확인
/turbocharge:turbo-check

# 상세 모드
/turbocharge:turbo-check --verbose

# JSON 출력
/turbocharge:turbo-check --json

# 특정 기능만 확인
/turbocharge:turbo-check --feature memory
/turbocharge:turbo-check --feature tdd
/turbocharge:turbo-check --feature e2e
```

## 출력 예시

```
╔══════════════════════════════════════════════════════════════╗
║                 🚀 Turbocharge Status                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📊 Overall Health: ████████░░ 80%                           ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ 🧠 Memory Sync                                          │ ║
║  │    Status: ✅ Active                                    │ ║
║  │    Stored: 156 entries (2.3 MB)                         │ ║
║  │    Last Sync: 5 minutes ago                             │ ║
║  │    Token Usage: 2,450 / 4,000                           │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ 🧪 TDD Guard                                            │ ║
║  │    Status: ✅ Active (Strict: Off)                      │ ║
║  │    Coverage: 78% ⚠️ (Target: 80%)                       │ ║
║  │    Tests: 45 passed, 2 failed                           │ ║
║  │    Last Run: 10 minutes ago                             │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ 🎭 E2E Tests                                            │ ║
║  │    Status: ✅ Active                                    │ ║
║  │    Framework: Playwright                                │ ║
║  │    Tests: 12 passed, 0 failed                           │ ║
║  │    Last Run: 1 hour ago                                 │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ 🔗 Integrations                                         │ ║
║  │    oh-my-claudecode: ✅ Connected                       │ ║
║  │    claude-mem: ❌ Not configured                        │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  💡 Recommendations:                                         ║
║     • TDD coverage is below threshold (78% < 80%)           ║
║     • Consider enabling claude-mem integration              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## 진단 항목

| 항목 | 설명 | 상태 |
|------|------|------|
| Memory Store | 메모리 저장소 접근 가능 | ✅/❌ |
| Memory Size | 메모리 크기 적정 | ✅/⚠️/❌ |
| TDD Enabled | TDD 가드 활성화 | ✅/❌ |
| Coverage | 테스트 커버리지 | ✅/⚠️/❌ |
| E2E Setup | E2E 테스트 설정 | ✅/❌ |
| OMC Sync | OMC 연동 상태 | ✅/❌ |

## 자동 수정

```bash
# 문제 자동 수정 시도
/turbocharge:turbo-check --fix

# 수정 전 미리보기
/turbocharge:turbo-check --fix --dry-run
```

## 설정

```json
{
  "turboCheck": {
    "autoRun": false,
    "interval": 3600,
    "notifications": true,
    "healthThreshold": 70
  }
}
```

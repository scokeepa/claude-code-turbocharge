# TDD Guard Skill

<skill>
name: tdd-guard
description: Test-Driven Development를 강제하는 가드 스킬
version: 1.0.0
author: gongdol
triggers:
  - tdd guard
  - tdd mode
  - test first
  - 테스트 먼저
</skill>

## 개요

TDD Guard 스킬은 Red-Green-Refactor 사이클을 강제하여 코드 품질을 보장합니다.

## 기능

### 1. 테스트 우선 강제
- src/ 파일 수정 전 테스트 파일 존재 확인
- 테스트 없이 코드 작성 시 경고/차단

### 2. 커버리지 게이트
- 커버리지 임계값 미만 시 경고
- 커밋 전 커버리지 체크

### 3. 리팩토링 안전망
- 리팩토링 시 테스트 통과 확인
- 테스트 실패 시 롤백 제안

## 사용 방법

```bash
# TDD 모드 활성화
/turbocharge:tdd-guard enable

# TDD 모드 비활성화
/turbocharge:tdd-guard disable

# 상태 확인
/turbocharge:tdd-guard status

# 커버리지 확인
/turbocharge:tdd-guard coverage
```

## TDD 사이클

```
┌─────────────────────────────────────────────────────────────┐
│                    TDD Red-Green-Refactor                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔴 RED: 실패하는 테스트 작성                                 │
│     └─ 요구사항을 테스트로 먼저 정의                          │
│     └─ 테스트 실행 → 실패 확인                               │
│                         ↓                                   │
│  🟢 GREEN: 테스트 통과하는 최소 코드 작성                     │
│     └─ 테스트 통과만을 목표로 구현                            │
│     └─ 완벽한 코드가 아니어도 됨                              │
│                         ↓                                   │
│  🔵 REFACTOR: 코드 개선                                      │
│     └─ 테스트가 여전히 통과하는지 확인하며 리팩토링            │
│     └─ 코드 품질 향상                                        │
│                         ↓                                   │
│  → 반복                                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 검증 규칙

| 파일 패턴 | 필요한 테스트 | 예시 |
|-----------|--------------|------|
| `src/**/*.ts` | `**/*.test.ts` | `src/utils.ts` → `src/utils.test.ts` |
| `src/**/*.tsx` | `**/*.test.tsx` | `src/Button.tsx` → `src/Button.test.tsx` |
| `lib/**/*.py` | `tests/**/*.py` | `lib/utils.py` → `tests/test_utils.py` |

## 예외 패턴

기본적으로 다음 패턴은 TDD 검증에서 제외됩니다:

- `*.config.*` - 설정 파일
- `*.d.ts` - TypeScript 선언 파일
- `scripts/*` - 스크립트 파일
- `migrations/*` - DB 마이그레이션
- `*.md` - 문서 파일

## 훅 동작

### PostToolUse 훅

```javascript
// Write/Edit 도구 사용 후 실행
if (isSourceFile(filePath) && !hasTestFile(filePath)) {
  if (strictMode) {
    return { blocked: true, message: "테스트 파일을 먼저 작성하세요" };
  } else {
    return { warning: "TDD: 테스트 파일이 없습니다" };
  }
}
```

## 설정

```json
{
  "tdd": {
    "enabled": true,
    "strictMode": false,
    "coverageThreshold": 80,
    "allowedPatterns": ["*.test.ts", "*.spec.ts", "*.test.tsx", "*.spec.tsx"],
    "excludePatterns": ["*.config.*", "*.d.ts", "scripts/*"],
    "testCommand": "npm test",
    "coverageCommand": "npm run coverage"
  }
}
```

## oh-my-claudecode 연동

OMC의 TDD 스킬과 함께 사용:

```bash
# OMC TDD 스킬 호출
/oh-my-claudecode:tdd {feature}

# Turbocharge TDD Guard 활성화
/turbocharge:tdd-guard enable
```

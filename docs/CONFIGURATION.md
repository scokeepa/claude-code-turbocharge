# 설정 가이드

## 설정 파일 위치

```
~/.claude-turbocharge/settings.json
```

## 전체 설정 구조

```json
{
  "memory": { ... },
  "tdd": { ... },
  "e2e": { ... },
  "integration": { ... },
  "turboCheck": { ... }
}
```

## Memory 설정

메모리 동기화 관련 설정입니다.

```json
{
  "memory": {
    "enabled": true,
    "autoSync": true,
    "maxTokens": 4000,
    "compressionLevel": "medium",
    "syncInterval": 300,
    "retentionDays": 30
  }
}
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `enabled` | boolean | `true` | 메모리 기능 활성화 |
| `autoSync` | boolean | `true` | 자동 동기화 활성화 |
| `maxTokens` | number | `4000` | 컨텍스트 주입 시 최대 토큰 수 |
| `compressionLevel` | string | `"medium"` | 압축 레벨 (`low`, `medium`, `high`) |
| `syncInterval` | number | `300` | 동기화 간격 (초) |
| `retentionDays` | number | `30` | 메모리 보관 기간 (일) |

## TDD 설정

TDD 가드 관련 설정입니다.

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

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `enabled` | boolean | `true` | TDD 가드 활성화 |
| `strictMode` | boolean | `false` | 엄격 모드 (위반 시 차단) |
| `coverageThreshold` | number | `80` | 목표 커버리지 (%) |
| `allowedPatterns` | string[] | `["*.test.ts", ...]` | 테스트 파일 패턴 |
| `excludePatterns` | string[] | `["*.config.*", ...]` | 제외 파일 패턴 |
| `testCommand` | string | `"npm test"` | 테스트 실행 명령어 |
| `coverageCommand` | string | `"npm run coverage"` | 커버리지 확인 명령어 |

### 엄격 모드 (strictMode)

- `false`: 테스트 없이 코드 작성 시 경고만 표시
- `true`: 테스트 없이 코드 작성 시 차단

## E2E 설정

E2E 테스트 관련 설정입니다.

```json
{
  "e2e": {
    "enabled": true,
    "framework": "playwright",
    "autoRun": true,
    "screenshotOnFailure": true,
    "videoOnFailure": false,
    "retries": 2,
    "timeout": 30000,
    "testDir": "e2e/tests",
    "baseURL": "http://localhost:3000"
  }
}
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `enabled` | boolean | `true` | E2E 테스트 활성화 |
| `framework` | string | `"playwright"` | 테스트 프레임워크 |
| `autoRun` | boolean | `true` | 파일 변경 시 자동 실행 |
| `screenshotOnFailure` | boolean | `true` | 실패 시 스크린샷 캡처 |
| `videoOnFailure` | boolean | `false` | 실패 시 비디오 녹화 |
| `retries` | number | `2` | 재시도 횟수 |
| `timeout` | number | `30000` | 타임아웃 (ms) |
| `testDir` | string | `"e2e/tests"` | 테스트 디렉토리 |
| `baseURL` | string | `"http://localhost:3000"` | 테스트 기본 URL |

## Integration 설정

외부 플러그인 연동 설정입니다.

```json
{
  "integration": {
    "omcSync": true,
    "claudeMemSync": false
  }
}
```

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `omcSync` | boolean | `true` | oh-my-claudecode 연동 |
| `claudeMemSync` | boolean | `false` | claude-mem 연동 |

## Turbo Check 설정

상태 확인 관련 설정입니다.

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

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `autoRun` | boolean | `false` | 자동 상태 확인 |
| `interval` | number | `3600` | 확인 간격 (초) |
| `notifications` | boolean | `true` | 알림 활성화 |
| `healthThreshold` | number | `70` | 건강도 임계값 (%) |

## 프로젝트별 설정

프로젝트 루트에 `.turbocharge.json` 파일을 생성하여 프로젝트별 설정을 오버라이드할 수 있습니다.

```json
{
  "tdd": {
    "strictMode": true,
    "coverageThreshold": 90
  },
  "e2e": {
    "baseURL": "http://localhost:8080"
  }
}
```

## 환경 변수

일부 설정은 환경 변수로 오버라이드할 수 있습니다:

| 환경 변수 | 설명 |
|-----------|------|
| `TURBOCHARGE_MEMORY_ENABLED` | 메모리 활성화 |
| `TURBOCHARGE_TDD_STRICT` | TDD 엄격 모드 |
| `TURBOCHARGE_E2E_BASE_URL` | E2E 기본 URL |

# Memory Sync Skill

<skill>
name: memory-sync
description: 세션 간 메모리를 동기화하고 컨텍스트를 관리합니다
version: 1.0.0
author: gongdol
triggers:
  - memory sync
  - 메모리 동기화
  - sync memory
  - context sync
</skill>

## 개요

Memory Sync 스킬은 Claude Code 세션 간 컨텍스트를 유지하고 동기화합니다.

## 기능

### 1. 자동 컨텍스트 주입
- 세션 시작 시 이전 세션의 관련 컨텍스트 자동 로드
- 3계층 Progressive Disclosure로 토큰 효율적 로딩

### 2. 메모리 저장
- 세션 중 중요한 학습/결정/이슈 자동 캡처
- 세션 종료 시 요약 저장

### 3. 중복 제거
- 동일/유사 컨텍스트 자동 병합
- 오래된 정보 자동 정리

## 사용 방법

```bash
# 메모리 상태 확인
/turbocharge:memory-sync status

# 수동 동기화
/turbocharge:memory-sync

# 강제 동기화 (캐시 무시)
/turbocharge:memory-sync --force

# 특정 키워드 검색
/turbocharge:memory-sync search "키워드"
```

## 워크플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    Memory Sync 워크플로우                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 세션 시작                                                │
│     └─ 관련 메모리 검색 및 주입                               │
│                         ↓                                   │
│  2. 작업 수행                                                │
│     └─ 중요 정보 자동 캡처                                    │
│                         ↓                                   │
│  3. 세션 종료                                                │
│     └─ 요약 생성 및 저장                                      │
│                         ↓                                   │
│  4. 다음 세션                                                │
│     └─ 1번으로 돌아감                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 3계층 검색

| 계층 | 토큰 | 내용 |
|------|------|------|
| 1단계 | 50-100 | 컴팩트 인덱스 (키워드, 날짜) |
| 2단계 | 200-500 | 시간순 컨텍스트 (요약) |
| 3단계 | 500-1000 | 전체 상세정보 |

## oh-my-claudecode 연동

OMC의 Notepad Wisdom과 자동 동기화:

```javascript
// OMC Notepad → Turbocharge Memory
addLearning() → memory.learnings[]
addDecision() → memory.decisions[]
addIssue() → memory.issues[]
addProblem() → memory.problems[]
```

## 설정

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

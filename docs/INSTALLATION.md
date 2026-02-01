# 설치 가이드

## 요구 사항

- **Node.js**: 18.0.0 이상
- **Claude Code**: 최신 버전
- **oh-my-claudecode**: 3.0.0 이상 (선택사항, 연동 시 필요)

## 설치 방법

### 방법 1: Claude Code CLI (권장)

가장 간단한 설치 방법입니다.

```bash
# 1. 마켓플레이스 추가
claude /plugin marketplace add gongdol/claude-code-turbocharge

# 2. 플러그인 설치
claude /plugin install claude-code-turbocharge

# 3. Claude Code 재시작
```

### 방법 2: 수동 설치

```bash
# 1. 저장소 클론
git clone https://github.com/gongdol/claude-code-turbocharge.git

# 2. 디렉토리 이동
cd claude-code-turbocharge

# 3. 의존성 설치
npm install

# 4. 설정 스크립트 실행
npm run postinstall

# 5. Claude 플러그인 디렉토리에 링크
# Windows (관리자 권한 필요)
mklink /D "%USERPROFILE%\.claude\plugins\marketplaces\turbocharge" "D:\path\to\claude-code-turbocharge"

# Mac/Linux
ln -s /path/to/claude-code-turbocharge ~/.claude/plugins/marketplaces/turbocharge
```

### 방법 3: npm 전역 설치

```bash
# 1. 전역 설치
npm install -g claude-code-turbocharge

# 2. Claude Code에 등록
claude /plugin install claude-code-turbocharge
```

## 설치 확인

설치가 완료되면 다음 명령어로 확인할 수 있습니다:

```bash
/turbocharge:turbo-check
```

## 설정

설치 후 자동으로 기본 설정 파일이 생성됩니다:

```
~/.claude-turbocharge/settings.json
```

자세한 설정 옵션은 [CONFIGURATION.md](./CONFIGURATION.md)를 참조하세요.

## 문제 해결

### 플러그인이 인식되지 않음

1. Claude Code를 완전히 종료 후 재시작
2. 플러그인 디렉토리 권한 확인
3. manifest.json 파일 존재 여부 확인

### 훅이 실행되지 않음

1. Node.js 버전 확인 (18.0.0 이상)
2. 훅 스크립트 실행 권한 확인
3. Claude Code 설정에서 훅 활성화 확인

### 메모리가 저장되지 않음

1. 디렉토리 권한 확인:
   ```bash
   ls -la ~/.claude-turbocharge/
   ```
2. 설정에서 memory.enabled가 true인지 확인

## 업데이트

```bash
# CLI로 업데이트
claude /plugin update claude-code-turbocharge

# 또는 수동 업데이트
cd /path/to/claude-code-turbocharge
git pull
npm install
```

## 제거

```bash
# CLI로 제거
claude /plugin uninstall claude-code-turbocharge

# 데이터도 함께 삭제하려면
rm -rf ~/.claude-turbocharge
```

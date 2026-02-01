#!/usr/bin/env node
/**
 * TDD Guard Hook
 * Write/Edit 도구 사용 후 TDD 검증을 수행합니다.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const TURBOCHARGE_DIR = path.join(os.homedir(), '.claude-turbocharge');
const SETTINGS_FILE = path.join(TURBOCHARGE_DIR, 'settings.json');

// 기본 설정
const DEFAULT_TDD_SETTINGS = {
  enabled: true,
  strictMode: false,
  coverageThreshold: 80,
  allowedPatterns: ['*.test.ts', '*.spec.ts', '*.test.tsx', '*.spec.tsx', '*.test.js', '*.spec.js'],
  excludePatterns: ['*.config.*', '*.d.ts', 'scripts/*', 'migrations/*', '*.md', 'node_modules/*', '.git/*']
};

/**
 * 설정 로드
 */
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const settings = JSON.parse(content);
      return { ...DEFAULT_TDD_SETTINGS, ...settings.tdd };
    }
  } catch (error) {
    // 설정 로드 실패 시 기본값 사용
  }
  return DEFAULT_TDD_SETTINGS;
}

/**
 * 패턴 매칭 확인
 */
function matchesPattern(filePath, patterns) {
  const fileName = path.basename(filePath);
  const normalizedPath = filePath.replace(/\\/g, '/');

  return patterns.some(pattern => {
    // 간단한 글로브 패턴 매칭
    const regex = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp(regex).test(fileName) || new RegExp(regex).test(normalizedPath);
  });
}

/**
 * 소스 파일인지 확인
 */
function isSourceFile(filePath) {
  const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java'];
  const ext = path.extname(filePath);
  return sourceExtensions.includes(ext);
}

/**
 * 테스트 파일인지 확인
 */
function isTestFile(filePath, settings) {
  return matchesPattern(filePath, settings.allowedPatterns);
}

/**
 * 제외 파일인지 확인
 */
function isExcludedFile(filePath, settings) {
  return matchesPattern(filePath, settings.excludePatterns);
}

/**
 * 테스트 파일 경로 찾기
 */
function findTestFile(sourceFile) {
  const dir = path.dirname(sourceFile);
  const ext = path.extname(sourceFile);
  const baseName = path.basename(sourceFile, ext);

  // 가능한 테스트 파일 경로들
  const possibleTestFiles = [
    path.join(dir, `${baseName}.test${ext}`),
    path.join(dir, `${baseName}.spec${ext}`),
    path.join(dir, '__tests__', `${baseName}.test${ext}`),
    path.join(dir, '__tests__', `${baseName}.spec${ext}`),
    path.join(process.cwd(), 'tests', `${baseName}.test${ext}`),
    path.join(process.cwd(), 'tests', `test_${baseName}${ext}`),
    path.join(process.cwd(), 'test', `${baseName}.test${ext}`)
  ];

  for (const testFile of possibleTestFiles) {
    if (fs.existsSync(testFile)) {
      return testFile;
    }
  }

  return null;
}

/**
 * 메인 함수
 */
async function main() {
  try {
    // 훅 입력 파싱
    let hookInput;
    try {
      const input = await new Promise((resolve) => {
        let data = '';
        process.stdin.on('data', chunk => data += chunk);
        process.stdin.on('end', () => resolve(data));
        // 타임아웃 설정
        setTimeout(() => resolve('{}'), 1000);
      });
      hookInput = JSON.parse(input || '{}');
    } catch {
      hookInput = {};
    }

    // 설정 로드
    const settings = loadSettings();

    // TDD 비활성화 시 통과
    if (!settings.enabled) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 도구 정보 확인
    const toolName = hookInput.tool_name || '';
    const toolInput = hookInput.tool_input || {};

    // Write/Edit 도구가 아니면 통과
    if (!['Write', 'Edit'].includes(toolName)) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 파일 경로 확인
    const filePath = toolInput.file_path || toolInput.path || '';
    if (!filePath) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 제외 파일이면 통과
    if (isExcludedFile(filePath, settings)) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 테스트 파일이면 통과 (테스트 작성 중)
    if (isTestFile(filePath, settings)) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 소스 파일이 아니면 통과
    if (!isSourceFile(filePath)) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 테스트 파일 존재 확인
    const testFile = findTestFile(filePath);

    if (!testFile) {
      const message = `⚠️ [TDD Guard] 테스트 파일이 없습니다: ${path.basename(filePath)}\n` +
                      `   TDD 원칙: 테스트를 먼저 작성한 후 구현 코드를 작성하세요.\n` +
                      `   예상 테스트 파일: ${path.basename(filePath, path.extname(filePath))}.test${path.extname(filePath)}`;

      if (settings.strictMode) {
        // 엄격 모드: 차단
        console.log(JSON.stringify({
          continue: false,
          blocked: true,
          message: message + '\n\n   [Strict Mode] 테스트 파일을 먼저 작성해야 합니다.'
        }));
      } else {
        // 경고 모드: 경고 후 통과
        console.log(JSON.stringify({
          continue: true,
          additionalContext: message
        }));
      }
      return;
    }

    // 테스트 파일 존재 - 통과
    console.log(JSON.stringify({ continue: true }));

  } catch (error) {
    // 오류 발생 시에도 통과 (훅이 작업을 차단하지 않도록)
    console.error('[TDD Guard] Error:', error.message);
    console.log(JSON.stringify({ continue: true }));
  }
}

main();

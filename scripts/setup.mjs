#!/usr/bin/env node
/**
 * Turbocharge Setup Script
 * 플러그인 설치 후 초기 설정을 수행합니다.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const TURBOCHARGE_DIR = path.join(os.homedir(), '.claude-turbocharge');
const MEMORY_DIR = path.join(TURBOCHARGE_DIR, 'memory');
const SESSIONS_DIR = path.join(TURBOCHARGE_DIR, 'sessions');
const SETTINGS_FILE = path.join(TURBOCHARGE_DIR, 'settings.json');

const DEFAULT_SETTINGS = {
  memory: {
    enabled: true,
    autoSync: true,
    maxTokens: 4000,
    compressionLevel: 'medium',
    syncInterval: 300,
    retentionDays: 30
  },
  tdd: {
    enabled: true,
    strictMode: false,
    coverageThreshold: 80,
    allowedPatterns: ['*.test.ts', '*.spec.ts', '*.test.tsx', '*.spec.tsx', '*.test.js', '*.spec.js'],
    excludePatterns: ['*.config.*', '*.d.ts', 'scripts/*', 'migrations/*', '*.md', 'node_modules/*', '.git/*'],
    testCommand: 'npm test',
    coverageCommand: 'npm run coverage'
  },
  e2e: {
    enabled: true,
    framework: 'playwright',
    autoRun: true,
    screenshotOnFailure: true,
    videoOnFailure: false,
    retries: 2,
    timeout: 30000,
    testDir: 'e2e/tests',
    baseURL: 'http://localhost:3000'
  },
  integration: {
    omcSync: true,
    claudeMemSync: false
  },
  turboCheck: {
    autoRun: false,
    interval: 3600,
    notifications: true,
    healthThreshold: 70
  }
};

function setup() {
  console.log('🚀 Claude Code Turbocharge 설정 시작...\n');

  // 디렉토리 생성
  const dirs = [
    TURBOCHARGE_DIR,
    MEMORY_DIR,
    SESSIONS_DIR,
    path.join(MEMORY_DIR, 'learnings'),
    path.join(MEMORY_DIR, 'decisions'),
    path.join(MEMORY_DIR, 'issues'),
    path.join(MEMORY_DIR, 'problems'),
    path.join(MEMORY_DIR, 'preferences')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✅ 디렉토리 생성: ${dir}`);
    }
  }

  // 설정 파일 생성
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    console.log(`  ✅ 설정 파일 생성: ${SETTINGS_FILE}`);
  } else {
    console.log(`  ℹ️  설정 파일 존재: ${SETTINGS_FILE}`);
  }

  // 메모리 인덱스 초기화
  const indexFile = path.join(MEMORY_DIR, 'index.json');
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, JSON.stringify({ entries: [], lastUpdated: null }, null, 2));
    console.log(`  ✅ 메모리 인덱스 생성: ${indexFile}`);
  }

  // 통계 파일 초기화
  const statsFile = path.join(TURBOCHARGE_DIR, 'stats.json');
  if (!fs.existsSync(statsFile)) {
    fs.writeFileSync(statsFile, JSON.stringify({
      totalSessions: 0,
      totalMemories: 0,
      lastSession: null,
      installedAt: new Date().toISOString()
    }, null, 2));
    console.log(`  ✅ 통계 파일 생성: ${statsFile}`);
  }

  console.log('\n✨ Claude Code Turbocharge 설정 완료!\n');
  console.log('사용 가능한 스킬:');
  console.log('  /turbocharge:memory-sync  - 메모리 동기화');
  console.log('  /turbocharge:tdd-guard    - TDD 가드 설정');
  console.log('  /turbocharge:e2e-test     - E2E 테스트 실행');
  console.log('  /turbocharge:turbo-check  - 전체 상태 확인');
  console.log('\n설정 파일 위치:', SETTINGS_FILE);
  console.log('');
}

setup();

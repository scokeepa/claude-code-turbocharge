#!/usr/bin/env node
/**
 * Session Start Hook
 * 세션 시작 시 메모리를 로드하고 컨텍스트를 주입합니다.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const TURBOCHARGE_DIR = path.join(os.homedir(), '.claude-turbocharge');
const MEMORY_DIR = path.join(TURBOCHARGE_DIR, 'memory');
const SETTINGS_FILE = path.join(TURBOCHARGE_DIR, 'settings.json');

// 기본 설정
const DEFAULT_SETTINGS = {
  memory: {
    enabled: true,
    autoSync: true,
    maxTokens: 4000,
    compressionLevel: 'medium'
  },
  tdd: {
    enabled: true,
    strictMode: false,
    coverageThreshold: 80
  },
  e2e: {
    enabled: true,
    framework: 'playwright',
    autoRun: true
  },
  integration: {
    omcSync: true,
    claudeMemSync: false
  }
};

/**
 * 설정 로드
 */
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
    }
  } catch (error) {
    console.error('[Turbocharge] Failed to load settings:', error.message);
  }
  return DEFAULT_SETTINGS;
}

/**
 * 디렉토리 초기화
 */
function initializeDirectories() {
  const dirs = [
    TURBOCHARGE_DIR,
    MEMORY_DIR,
    path.join(MEMORY_DIR, 'learnings'),
    path.join(MEMORY_DIR, 'decisions'),
    path.join(MEMORY_DIR, 'issues'),
    path.join(MEMORY_DIR, 'problems'),
    path.join(MEMORY_DIR, 'preferences')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // 기본 설정 파일 생성
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  }
}

/**
 * 메모리 인덱스 로드
 */
function loadMemoryIndex() {
  const indexFile = path.join(MEMORY_DIR, 'index.json');
  try {
    if (fs.existsSync(indexFile)) {
      return JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
    }
  } catch (error) {
    console.error('[Turbocharge] Failed to load memory index:', error.message);
  }
  return { entries: [], lastUpdated: null };
}

/**
 * 관련 메모리 검색 (1단계: 인덱스만)
 */
function searchRelevantMemory(index, projectPath) {
  const projectName = path.basename(projectPath);
  const relevantEntries = index.entries
    .filter(entry => {
      // 프로젝트 관련 또는 최근 항목
      return entry.project === projectName ||
             entry.importance === 'critical' ||
             entry.importance === 'high';
    })
    .slice(0, 10); // 최대 10개

  return relevantEntries;
}

/**
 * 컨텍스트 생성
 */
function generateContext(entries, settings) {
  if (!entries || entries.length === 0) {
    return null;
  }

  let context = '## 🧠 이전 세션 컨텍스트 (Turbocharge Memory)\n\n';

  // 중요도 순으로 정렬
  const sorted = entries.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.importance] - order[b.importance];
  });

  // 타입별 그룹화
  const grouped = {
    decision: sorted.filter(e => e.type === 'decision'),
    learning: sorted.filter(e => e.type === 'learning'),
    issue: sorted.filter(e => e.type === 'issue'),
    problem: sorted.filter(e => e.type === 'problem')
  };

  if (grouped.decision.length > 0) {
    context += '### 📋 결정 사항\n';
    grouped.decision.forEach(e => {
      context += `- **${e.title}**: ${e.summary || e.content.substring(0, 100)}\n`;
    });
    context += '\n';
  }

  if (grouped.learning.length > 0) {
    context += '### 💡 학습 내용\n';
    grouped.learning.forEach(e => {
      context += `- **${e.title}**: ${e.summary || e.content.substring(0, 100)}\n`;
    });
    context += '\n';
  }

  if (grouped.issue.length > 0) {
    context += '### ⚠️ 알려진 이슈\n';
    grouped.issue.forEach(e => {
      context += `- **${e.title}**: ${e.summary || e.content.substring(0, 100)}\n`;
    });
    context += '\n';
  }

  if (grouped.problem.length > 0) {
    context += '### 🔴 해결할 문제\n';
    grouped.problem.forEach(e => {
      context += `- **${e.title}**: ${e.summary || e.content.substring(0, 100)}\n`;
    });
    context += '\n';
  }

  context += '\n---\n*Turbocharge Memory에서 자동 주입됨*\n';

  return context;
}

/**
 * 메인 함수
 */
async function main() {
  try {
    // 디렉토리 초기화
    initializeDirectories();

    // 설정 로드
    const settings = loadSettings();

    // 메모리 비활성화 시 종료
    if (!settings.memory.enabled) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 메모리 인덱스 로드
    const index = loadMemoryIndex();

    // 현재 프로젝트 경로
    const projectPath = process.cwd();

    // 관련 메모리 검색
    const relevantEntries = searchRelevantMemory(index, projectPath);

    // 컨텍스트 생성
    const context = generateContext(relevantEntries, settings);

    // 결과 출력
    if (context) {
      console.log(JSON.stringify({
        continue: true,
        additionalContext: context
      }));
    } else {
      console.log(JSON.stringify({ continue: true }));
    }

  } catch (error) {
    console.error('[Turbocharge] Session start error:', error.message);
    console.log(JSON.stringify({ continue: true }));
  }
}

main();

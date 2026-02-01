#!/usr/bin/env node
/**
 * Session End Hook
 * 세션 종료 시 메모리를 저장하고 요약을 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const TURBOCHARGE_DIR = path.join(os.homedir(), '.claude-turbocharge');
const MEMORY_DIR = path.join(TURBOCHARGE_DIR, 'memory');
const SESSIONS_DIR = path.join(TURBOCHARGE_DIR, 'sessions');
const INDEX_FILE = path.join(MEMORY_DIR, 'index.json');
const SETTINGS_FILE = path.join(TURBOCHARGE_DIR, 'settings.json');

/**
 * 설정 로드
 */
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch (error) {
    // 설정 로드 실패
  }
  return { memory: { enabled: true } };
}

/**
 * 세션 요약 저장
 */
function saveSessionSummary(sessionData) {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    }

    const date = new Date();
    const fileName = `${date.toISOString().split('T')[0]}_${date.getTime()}.json`;
    const filePath = path.join(SESSIONS_DIR, fileName);

    fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
    return filePath;
  } catch (error) {
    console.error('[Turbocharge] Failed to save session summary:', error.message);
    return null;
  }
}

/**
 * 세션 통계 업데이트
 */
function updateSessionStats() {
  const statsFile = path.join(TURBOCHARGE_DIR, 'stats.json');
  let stats = {
    totalSessions: 0,
    totalMemories: 0,
    lastSession: null
  };

  try {
    if (fs.existsSync(statsFile)) {
      stats = JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
    }
  } catch {
    // 통계 로드 실패
  }

  stats.totalSessions++;
  stats.lastSession = new Date().toISOString();

  try {
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  } catch {
    // 통계 저장 실패
  }

  return stats;
}

/**
 * OMC Notepad와 동기화
 */
function syncWithOMC() {
  const omcWisdomDir = path.join(os.homedir(), '.claude', '.omc', 'notepads');

  if (!fs.existsSync(omcWisdomDir)) {
    return;
  }

  try {
    // OMC Notepad 디렉토리 탐색
    const plans = fs.readdirSync(omcWisdomDir).filter(f =>
      fs.statSync(path.join(omcWisdomDir, f)).isDirectory()
    );

    for (const plan of plans) {
      const planDir = path.join(omcWisdomDir, plan);

      // learnings.md 동기화
      const learningsFile = path.join(planDir, 'learnings.md');
      if (fs.existsSync(learningsFile)) {
        syncLearningsFromOMC(learningsFile);
      }

      // decisions.md 동기화
      const decisionsFile = path.join(planDir, 'decisions.md');
      if (fs.existsSync(decisionsFile)) {
        syncDecisionsFromOMC(decisionsFile);
      }
    }
  } catch (error) {
    console.error('[Turbocharge] OMC sync error:', error.message);
  }
}

/**
 * OMC learnings 동기화
 */
function syncLearningsFromOMC(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // TODO: learnings 파싱 및 메모리 저장
  } catch (error) {
    // 동기화 실패
  }
}

/**
 * OMC decisions 동기화
 */
function syncDecisionsFromOMC(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // TODO: decisions 파싱 및 메모리 저장
  } catch (error) {
    // 동기화 실패
  }
}

/**
 * 오래된 세션 정리
 */
function cleanupOldSessions(retentionDays = 30) {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) {
      return;
    }

    const files = fs.readdirSync(SESSIONS_DIR);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    for (const file of files) {
      const filePath = path.join(SESSIONS_DIR, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    // 정리 실패
  }
}

/**
 * 메인 함수
 */
async function main() {
  try {
    // 설정 로드
    const settings = loadSettings();

    // 메모리 비활성화 시 종료
    if (!settings.memory || !settings.memory.enabled) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 훅 입력 파싱
    let hookInput;
    try {
      const input = await new Promise((resolve) => {
        let data = '';
        process.stdin.on('data', chunk => data += chunk);
        process.stdin.on('end', () => resolve(data));
        setTimeout(() => resolve('{}'), 1000);
      });
      hookInput = JSON.parse(input || '{}');
    } catch {
      hookInput = {};
    }

    // 세션 데이터 수집
    const sessionData = {
      id: crypto.randomUUID(),
      project: path.basename(process.cwd()),
      startedAt: hookInput.sessionStartedAt || null,
      endedAt: new Date().toISOString(),
      summary: hookInput.summary || null,
      toolsUsed: hookInput.toolsUsed || [],
      filesModified: hookInput.filesModified || []
    };

    // 세션 요약 저장
    saveSessionSummary(sessionData);

    // 세션 통계 업데이트
    updateSessionStats();

    // OMC와 동기화 (설정에 따라)
    if (settings.integration && settings.integration.omcSync) {
      syncWithOMC();
    }

    // 오래된 세션 정리
    cleanupOldSessions(settings.memory.retentionDays || 30);

    console.log(JSON.stringify({
      continue: true,
      additionalContext: '[Turbocharge] 세션 메모리가 저장되었습니다.'
    }));

  } catch (error) {
    console.error('[Turbocharge] Session end error:', error.message);
    console.log(JSON.stringify({ continue: true }));
  }
}

main();

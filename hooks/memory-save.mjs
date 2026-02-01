#!/usr/bin/env node
/**
 * Memory Save Hook (PreCompact)
 * 컴팩션 전에 중요 컨텍스트를 저장합니다.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const TURBOCHARGE_DIR = path.join(os.homedir(), '.claude-turbocharge');
const MEMORY_DIR = path.join(TURBOCHARGE_DIR, 'memory');
const INDEX_FILE = path.join(MEMORY_DIR, 'index.json');

/**
 * 메모리 인덱스 로드
 */
function loadMemoryIndex() {
  try {
    if (fs.existsSync(INDEX_FILE)) {
      return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    }
  } catch (error) {
    // 인덱스 로드 실패
  }
  return { entries: [], lastUpdated: null };
}

/**
 * 메모리 인덱스 저장
 */
function saveMemoryIndex(index) {
  try {
    // 디렉토리 확인
    if (!fs.existsSync(MEMORY_DIR)) {
      fs.mkdirSync(MEMORY_DIR, { recursive: true });
    }

    index.lastUpdated = new Date().toISOString();
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  } catch (error) {
    console.error('[Turbocharge] Failed to save memory index:', error.message);
  }
}

/**
 * 메모리 엔트리 저장
 */
function saveMemoryEntry(entry) {
  const typeDir = path.join(MEMORY_DIR, entry.type + 's');
  if (!fs.existsSync(typeDir)) {
    fs.mkdirSync(typeDir, { recursive: true });
  }

  const date = new Date();
  const fileName = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}.json`;
  const filePath = path.join(typeDir, fileName);

  let entries = [];
  try {
    if (fs.existsSync(filePath)) {
      entries = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch {
    entries = [];
  }

  entries.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
}

/**
 * 컨텍스트에서 중요 정보 추출
 */
function extractImportantInfo(context) {
  const entries = [];
  const lines = context.split('\n');

  let currentType = null;
  let currentTitle = null;
  let currentContent = [];

  for (const line of lines) {
    // <remember> 태그 감지
    if (line.includes('<remember>') || line.includes('<remember priority>')) {
      const isPriority = line.includes('priority');
      const content = line.replace(/<\/?remember[^>]*>/g, '').trim();
      if (content) {
        entries.push({
          type: 'learning',
          title: content.substring(0, 50),
          content: content,
          importance: isPriority ? 'high' : 'medium'
        });
      }
    }

    // 결정 사항 감지
    if (line.includes('결정:') || line.includes('Decision:')) {
      const content = line.replace(/결정:|Decision:/i, '').trim();
      if (content) {
        entries.push({
          type: 'decision',
          title: content.substring(0, 50),
          content: content,
          importance: 'high'
        });
      }
    }

    // 학습 내용 감지
    if (line.includes('학습:') || line.includes('Learning:') || line.includes('발견:')) {
      const content = line.replace(/학습:|Learning:|발견:/i, '').trim();
      if (content) {
        entries.push({
          type: 'learning',
          title: content.substring(0, 50),
          content: content,
          importance: 'medium'
        });
      }
    }

    // 이슈 감지
    if (line.includes('이슈:') || line.includes('Issue:') || line.includes('문제:')) {
      const content = line.replace(/이슈:|Issue:|문제:/i, '').trim();
      if (content) {
        entries.push({
          type: 'issue',
          title: content.substring(0, 50),
          content: content,
          importance: 'medium'
        });
      }
    }
  }

  return entries;
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
        setTimeout(() => resolve('{}'), 1000);
      });
      hookInput = JSON.parse(input || '{}');
    } catch {
      hookInput = {};
    }

    // 컨텍스트 추출
    const context = hookInput.context || hookInput.conversation || '';

    if (!context) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 중요 정보 추출
    const extractedEntries = extractImportantInfo(context);

    if (extractedEntries.length === 0) {
      console.log(JSON.stringify({ continue: true }));
      return;
    }

    // 메모리 인덱스 로드
    const index = loadMemoryIndex();
    const projectPath = process.cwd();
    const projectName = path.basename(projectPath);

    // 엔트리 저장
    for (const extracted of extractedEntries) {
      const entry = {
        id: crypto.randomUUID(),
        ...extracted,
        project: projectName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: []
      };

      // 인덱스에 추가 (요약 정보만)
      index.entries.push({
        id: entry.id,
        type: entry.type,
        title: entry.title,
        summary: entry.content.substring(0, 100),
        project: entry.project,
        importance: entry.importance,
        createdAt: entry.createdAt
      });

      // 상세 내용 저장
      saveMemoryEntry(entry);
    }

    // 인덱스 저장
    saveMemoryIndex(index);

    console.log(JSON.stringify({
      continue: true,
      additionalContext: `[Turbocharge] ${extractedEntries.length}개의 메모리가 저장되었습니다.`
    }));

  } catch (error) {
    console.error('[Turbocharge] Memory save error:', error.message);
    console.log(JSON.stringify({ continue: true }));
  }
}

main();

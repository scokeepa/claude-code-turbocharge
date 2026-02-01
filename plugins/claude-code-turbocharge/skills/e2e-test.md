# E2E Test Skill

<skill>
name: e2e-test
description: End-to-End 테스트 자동화 및 통합 스킬
version: 1.0.0
author: gongdol
triggers:
  - e2e test
  - e2e run
  - end to end
  - playwright test
  - 통합 테스트
</skill>

## 개요

E2E Test 스킬은 Playwright 기반 End-to-End 테스트를 자동화합니다.

## 기능

### 1. 자동 테스트 실행
- 컴포넌트 수정 시 관련 E2E 테스트 자동 실행
- 변경된 파일 기반 테스트 범위 결정

### 2. 스크린샷/비디오 캡처
- 테스트 실패 시 자동 스크린샷
- 옵션으로 비디오 녹화

### 3. 실패 분석
- 실패 원인 자동 분석
- 수정 제안 제공

## 사용 방법

```bash
# 전체 E2E 테스트 실행
/turbocharge:e2e-test

# 특정 파일 테스트
/turbocharge:e2e-test --file auth.spec.ts

# 특정 태그 테스트
/turbocharge:e2e-test --tag @smoke

# 감시 모드
/turbocharge:e2e-test --watch

# 디버그 모드 (헤드리스 비활성화)
/turbocharge:e2e-test --debug

# UI 모드
/turbocharge:e2e-test --ui
```

## 워크플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    E2E 테스트 파이프라인                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 테스트 시나리오 정의                                      │
│     └─ 사용자 스토리 기반 시나리오 작성                        │
│     └─ 크리티컬 패스 우선 테스트                              │
│                         ↓                                   │
│  2. Playwright 테스트 작성                                   │
│     └─ 페이지 객체 모델 (POM) 패턴 적용                       │
│     └─ 재사용 가능한 테스트 유틸리티                          │
│                         ↓                                   │
│  3. 테스트 실행 및 검증                                       │
│     └─ 로컬 실행: npx playwright test                        │
│     └─ CI 통합: GitHub Actions                              │
│                         ↓                                   │
│  4. 결과 분석 및 리포트                                       │
│     └─ 스크린샷/비디오 캡처                                   │
│     └─ 실패 분석 및 수정                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 파일 구조

```
e2e/
├── fixtures/
│   └── test-data.json
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── tests/
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   └── settings.spec.ts
├── utils/
│   └── helpers.ts
└── playwright.config.ts
```

## 페이지 객체 모델 (POM)

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## 테스트 예시

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/login');
    await loginPage.login('user@example.com', 'password');

    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/login');
    await loginPage.login('invalid@example.com', 'wrong');

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
```

## 훅 동작

### PostToolUse 훅

```javascript
// 컴포넌트 파일 수정 시 관련 E2E 테스트 실행
if (isComponentFile(filePath) && e2eEnabled && autoRun) {
  const relatedTests = findRelatedE2ETests(filePath);
  if (relatedTests.length > 0) {
    runE2ETests(relatedTests);
  }
}
```

## 설정

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

## Playwright 설정

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

## CI 통합

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

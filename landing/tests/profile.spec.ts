import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BOOKING_URL } from '../src/booking';

test('every sitemap document has real HTML, one title and a matching canonical', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const paths = [...(await sitemap.text()).matchAll(/<loc>https:\/\/elfadil.com([^<]*)<\/loc>/g)].map(m => m[1]);
  expect(paths.length).toBeGreaterThan(20);
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain('<h1');
    if (path !== '/the_leverage_point') {
      expect((html.match(/<title>/g) || []).length, path).toBe(1);
      expect(html, path).toContain(`rel="canonical" href="https://elfadil.com${path}"`);
      expect(html, path).not.toContain('<!--app-html-->');
    }
  }
});

test('routing returns real 404s, canonical redirects, bounded probes and HEAD', async ({ request }) => {
  for (const path of ['/missing', '/en/missing', '/assets/missing.js']) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(response.headers()['x-robots-tag']).toContain('noindex');
  }
  for (const [path, target] of [['/en/index.html?ref=test', '/en?ref=test'], ['/ar/', '/ar'], ['/the_leverage_point.html', '/the_leverage_point']]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location).pathname + new URL(response.headers().location).search).toBe(target);
  }
  expect((await request.post('/')).status()).toBe(405);
  expect((await request.get('/__pulse?u=https://example.com')).status()).toBe(400);
  expect((await request.get('/__pulse?u=invalid')).status()).toBe(400);
  expect((await request.head('/en')).status()).toBe(200);
});

test('English and Arabic remain readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const lang of ['ar', 'en']) {
    await page.goto(`${test.info().project.use.baseURL}/${lang}`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
  }
  await context.close();
});

test('language routes, theme persistence, contact dialog and focus restoration', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'theme', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const trigger = page.locator('.hero-ctas button').first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('iframe')).toHaveAttribute('src', BOOKING_URL);
  await expect(dialog.getByRole('link', { name: 'Open in Google Calendar' })).toHaveAttribute('href', BOOKING_URL);
  await expect(dialog.getByRole('link', { name: 'Open email draft' })).toHaveAttribute('href', /^mailto:/);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'language', exact: true }).click();
  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  expect(errors).toEqual([]);
});

test('mobile layout, navigation and main-page accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const menu = page.getByRole('button', { name: 'menu', exact: true });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});

test('workspace launches, opens projects, maximizes and exits', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/en');
  await page.getByRole('button', { name: 'Enter my workspace', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Workspace' })).toBeVisible();
  await page.getByRole('dialog', { name: 'Workspace' }).getByRole('button', { name: /My projects|^Projects$/ }).click();
  await expect(page.locator('.desktop-window')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle fullscreen' }).click();
  await expect(page.locator('.desktop-window.is-fullscreen')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle fullscreen' }).click();
  await expect(page.locator('.desktop-window')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('storage restrictions and WebGL failure leave the workspace usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return original.apply(this, [type, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto('/en');
  await page.getByRole('button', { name: 'Enter my workspace', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Projects', exact: true }).click();
  await expect(page.locator('.desktop-window')).toBeVisible();
  await expect(page.locator('.app-root')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('article pages and contact drafts expose accessible content', async ({ page }) => {
  await page.goto('/en/writing');
  await page.locator('.content-grid h2 a').first().click();
  await expect(page.locator('main article p').first()).toBeVisible();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => v.id)).toEqual([]);
  await page.goto('/en');
  await page.getByRole('button', { name: 'Enter my workspace', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: "Let's collaborate", exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open email draft', exact: true })).toBeVisible();
  await expect(page.locator('.collaborate-form input[type=email]')).toHaveAttribute('required', '');
  await expect(page.locator('.collaborate-form')).toContainText('Review and send it there');
});

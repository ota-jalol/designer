import { test, expect } from '@playwright/test';

test.describe('Designer Page', () => {
  test('should load the designer page', async ({ page }) => {
    await page.goto('/');
    
    // Should show the UI builder interface
    await expect(page.locator('text=Vue UI Builder')).toBeVisible();
  });

  test('should show component palette', async ({ page }) => {
    await page.goto('/');
    
    // Should show components panel
    await expect(page.locator('text=Components')).toBeVisible();
  });

  test('should show properties panel', async ({ page }) => {
    await page.goto('/');
    
    // Should show properties panel
    await expect(page.locator('text=Properties')).toBeVisible();
  });

  test('should show generated code panel', async ({ page }) => {
    await page.goto('/');
    
    // Should show generated code panel
    await expect(page.locator('text=Generated Code')).toBeVisible();
  });

  test('should be able to navigate to projects page', async ({ page }) => {
    await page.goto('/');
    
    // Click on projects link
    await page.click('text=Projects');
    
    // Should navigate to projects page
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
  });
});

test.describe('Projects Page', () => {
  test('should load the projects page', async ({ page }) => {
    await page.goto('/projects');
    
    // Should show the projects page
    await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
  });

  test('should show new project button', async ({ page }) => {
    await page.goto('/projects');
    
    // Should show new project button
    await expect(page.locator('text=+ New Project')).toBeVisible();
  });

  test('should open create project modal', async ({ page }) => {
    await page.goto('/projects');
    
    // Click new project button
    await page.click('text=+ New Project');
    
    // Should show modal
    await expect(page.locator('text=Create New Project')).toBeVisible();
  });
});

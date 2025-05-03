import {test} from '@playwright/test';

/**
 * Basic browser test to open a page and pause for debugging
 * @description Opens a local development server and pauses browser execution for manual inspection
 * @group debug
 * @test
 */
test('test browser', async ({page}) => {
  // point this to wherever you want
  await page.goto('http://localhost:3030/');

  // keep browser open
  await page.pause();
});

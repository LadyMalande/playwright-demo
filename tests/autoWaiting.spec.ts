import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto(process.env.URL)
    console.log('Test env from .env file:' + process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)

})

test('auto waiting',async({page}) => {
    const successButton = page.locator('.bg-success')
    await successButton.click()

    /*
    // Will wait (up to set timeout) for the button to appear to grab the text
    const text = await successButton.textContent()
    await expect.soft(successButton).toHaveText('Data loaded with AJAX get request.')
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})

    // Will NOT wait 
    const allText = await successButton.allTextContents()
    expect.soft(allText).toContain('Data loaded with AJAX get request.')

    // Explicit waiting
    await successButton.waitFor({state: 'attached'})
    const allTextAfterWait = await successButton.allTextContents()

    expect(text).toEqual('Data loaded with AJAX get request.')
    expect(allText).toContain('Data loaded with AJAX get request.')


    // wait for element
    await page.waitForSelector('.bg-success')
*/
    // wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // wait for network calls to be completed NOT RECOMMENDED
    await page.waitForLoadState('networkidle') // all the calls are done



})

test('timeouts',async({page}) => {
    // test.setTimeout(10000) // has bigger prioritz than timeouts at particular events
    // Default test timeout is 30 seconds
    // To change the settings for timeout do that in playwright.config.ts
    const successButton = page.locator('.bg-success')
    //await successButton.click()
    await successButton.click({timeout: 16000})




})
import {test} from '@playwright/test'


test.beforeEach(async({page}) => {
    // Navigate to the base URL before each test    
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
})

test('first test', async ({page}) => {
    await page.getByText('Form Layouts').click()
})

test('Navigate to Datepicker page', async ({page}) => {
    await page.getByText('Datepicker').click()
})

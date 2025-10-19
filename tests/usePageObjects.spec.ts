import {test, expect} from '@playwright/test'
import {PageManager} from '../page-objects/pageManager'

test.beforeEach(async({page}) => {
    // Navigate to the base URL before each test    
    await page.goto('/')

})

 // Ruuning project using custom configuration file: npx playwright test --config=playwright-prod.config.ts

// To start the application to be tested, run in a separate terminal the command: "npm run start" or "npm start" 
// To run test manually from the cmd line in chromium: npx playwright test usePageObjects.spec.ts --project=chromium

test('Navigate to form page', async({page}) => {

    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
    
})

test('Parametrized methods', async({page}) => {

    const pm = new PageManager(page)

   

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')

    await page.screenshot({path: 'screenshots/formsLayoutsParametrizedMethods.png'})
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    
})

test('Parametrized methods Inline form', async({page}) => {

    const { faker } = await import('@faker-js/faker');

    const pm = new PageManager(page)

    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.toLowerCase().replace(' ', '.')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)

    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'  })

    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(1)
    await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(1, 2)
})
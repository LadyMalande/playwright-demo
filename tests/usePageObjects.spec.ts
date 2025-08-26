import {test, expect} from '@playwright/test'
import {PageManager} from '../page-objects/pageManager'

test.beforeEach(async({page}) => {
    // Navigate to the base URL before each test    
    await page.goto('http://localhost:4200/')

})

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
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 1')
    
})

test('Parametrized methods Inline form', async({page}) => {

    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('Janine Dove', 'test@test.com', true)
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(1)
    await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(1, 2)
})
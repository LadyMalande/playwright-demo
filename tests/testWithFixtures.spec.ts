import {test} from '../test-options'
import {PageManager} from '../page-objects/pageManager'

test('Parametrized methods Inline form', async({page, pageManager}) => {

    const { faker } = await import('@faker-js/faker');

    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.toLowerCase().replace(' ', '.')}${faker.number.int(1000)}@test.com`

    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)

    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'  })

    await pageManager.navigateTo().datepickerPage()
    await pageManager.onDatepickerPage().selectCommonDatePickerDateFromToday(1)
    await pageManager.onDatepickerPage().selectDatePickerWithRangeFromToday(1, 2)
})

import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    // Navigate to the base URL before each test    
    await page.goto('http://localhost:4200/')

})

test.describe('Form Layouts page', () => {

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        // Cannot be chained
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        // Press the input keys one by one with given delay to simulate real user interaction (delay between key strokes)
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 200})

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    /*
    Comment regarding the force: true option:
    What Actionability in Playwright Checks Normally Do:
        Before interacting with an element, Playwright verifies that:
            The element is visible in the viewport
            The element is not covered by other elements
            The element is not disabled
            The element is attached to the DOM
            The element is stable (not animating)

    When to Use force: true:
        You might need force: true when:
            The element is hidden (e.g., behind a dropdown or modal)
            The element is covered by another transparent element (like a overlay)
            You want to test disabled elements (though this is not recommended for realistic user flows)
            The element is not visible in the viewport (but exists in the DOM)
    */
        test('Radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        const radioButton1 = usingTheGridForm.getByLabel('Option 1')
        // Force true is used to bypass Playwright's built-in actionability checks when performing actions like .check(), .click(), or .fill()
        await radioButton1.check({force: true})
        const radioButton2 = usingTheGridForm.getByText('Option 2')
        await radioButton2.check({force: true})

        const isCheckedOption1 = await radioButton1.isChecked()
        const isCheckedOption2 = await radioButton2.isChecked()
        expect(isCheckedOption1).toBeFalsy()
        expect(isCheckedOption2).toBeTruthy()
        await expect(usingTheGridForm.getByLabel('Option 2')).toBeChecked()
    })
})

test('Checkboxes', async({page}) => {
        await page.getByText('Modal & Overlay').click()
        await page.getByText('Toastr').click()

        // Click just click
        await page.getByRole('checkbox', {name: "Hide on Click"}).click({force: true})
        // check does check, if it was already checked, it will not do anything
        await page.getByRole('checkbox', {name: "Hide on Click"}).check({force: true})
        await page.getByRole('checkbox', {name: "Hide on Click"}).uncheck({force: true})
        await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).click({force: true})

        const allBoxes = page.getByRole('checkbox')
        for(const box of await allBoxes.all()){
            await box.check({force: true})
            expect(await box.isChecked()).toBeTruthy()
        }
})

test('Lists and dropdowns', async({page}) => {

    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list item has LI tag

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
        
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')

    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()

    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropDownMenu.click()

    }
})

test('Tooltips', async({page}) => {
        await page.getByText('Modal & Overlay').click()
        await page.getByText('Tooltip').click()

        const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
        await tooltipCard.getByRole('button', {name: "TOP"}).hover()

        page.getByRole('tooltip') // if you have a role tooltip created ((not this case))
        const tooltip = await page.locator('nb-tooltip').textContent()

        expect(tooltip).toEqual('This is a tooltip')

})

test('Dialogue box', async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        // Create a listener that overrides playwright default behavior regarding the dialog we want to interact with
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
        // Playwright by default canceles browser-managed dialogue boxes

        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('Web tables', async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        // 1. How to get the row by any text in this row
        const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
        await targetRow.locator('.nb-edit').click()

        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()

        // 2. Get the row based on the value in the specific column
        // Navigate to the second page of the table
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
        await targetRowById.locator('.nb-edit').click()

        await page.locator('input-editor').getByPlaceholder('E-mail').clear()
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click()
        await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

        // 3. Check that when using text filter on columns, only rows with that value in given column are present in the table
        const ages = ["20", "30", "40", "200"]

        for(let age of ages){
            await page.locator('input-filter').getByPlaceholder('Age').clear()
            await page.locator('input-filter').getByPlaceholder('Age').fill(age)
            // we need to wait for the table to filter the results because playwright is faster than the rendering
            await page.waitForTimeout(500)
            const ageRows = page.locator('tbody tr')

            for(let row of await ageRows.all()){
                const cellValue = await row.locator('td').last().textContent()

                if(age == "200"){
                    expect(await page.getByRole('table').textContent()).toContain('No data found')

                } else{
                    expect(cellValue).toEqual(age)

                }

            }
        }
})

test('Date picker', async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()

        const datepickerInput = page.getByPlaceholder('Form Picker')
        await datepickerInput.click()

        const lastPickedDate = "1";
        const lastPickedDateFormatted = "Aug 1, 2025"

        // Match either of those classes - will allow to date pick even today which is preselected
        await page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"]').getByText('14').click()
        await datepickerInput.click()

        // For exact matching when the number is present multiple times in the calendar
        await page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"]').getByText('1', {exact: true}).click()

        await expect(datepickerInput).toHaveValue(lastPickedDateFormatted)
})

test('Dynamic Date picker', async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()

        const datepickerInput = page.getByPlaceholder('Form Picker')
        await datepickerInput.click()

        const lastPickedDate = "1";
        const lastPickedDateFormatted = "Aug 1, 2025"

        let date = new Date()
        date.setDate(date.getDay() + 7)
        const expectedDate = date.getDate().toString()
        // Match either of those classes - will allow to date pick even today which is preselected
        await page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"]').getByText('14').click()
        await datepickerInput.click()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})

        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthToPick = ` ${expectedMonthLong} ${expectedYear}`

        while(!calendarMonthAndYear.includes(expectedMonthToPick)){
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        }

        // For exact matching when the number is present multiple times in the calendar
        await page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"]').getByText('1', {exact: true}).click()

        await datepickerInput.click()
        await page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()


        await expect(datepickerInput).toHaveValue(dateToAssert)
})

test('Sliders', async({page}) => {
    // Update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

    // Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    await page.mouse.move(x,y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x+100,y+100)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')
})


import {test, expect} from '@playwright/test'


test.beforeEach(async({page}) => {
    // Navigate to the base URL before each test    
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    
})

test('Locator syntax rules', async({page}) =>{
    // by Tag name
    await page.locator('input').first().click()

    // by ID
    page.locator('#inputEmail')

    // by class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    // by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // COMBINE DIFFERENT SELECTORS (without space!!!))
    page.locator('input[placeholder="Email"][nbinput]')

    // by xpath, not recommended!!!, recommended are user-visible locators
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')

})

// Best Practice - target elements by user facing locators = by what a user can see
test('User facing locators', async({page}) =>{

    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').first().click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Dashboard').click()
})

test('Finding child elements', async({page}) =>{
    // The cleanest solution, locators divided by space to search for child elements
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()

    // chaining the methods can also be used for finding the child elements
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click()

    // combination of regular method and user facing method
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    // The fourth nb-card from the top of the DOM
    // Try to avoid this method
    // Also try to avoid the ordering of the elements (like first() or last())
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Finding parent elements', async({page}) =>{

    // has text will find text in any child or self element
    // Only one element will be returned
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()

    // Provide second attribute as a locator
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing the locators', async({page}) =>{

    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const emailInputField = basicForm.getByRole('textbox', {name: "Email"})
    // Filling out a basic form
        await emailInputField.fill('test@test.com')
        await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
        await basicForm.locator('nb-checkbox').click()
        await basicForm.getByRole('button').click()

        await expect(emailInputField).toHaveValue("test@test.com")
})

test('Extracting values from DOM', async({page}) =>{

    // Single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const buttonText = await basicForm.locator('button').textContent()

    await expect(buttonText).toEqual('Submit')

    // Get all text values
    const allRadioButtonTexts = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonTexts).toContain('Option 2')
    //expect(allRadioButtonTexts).toContain('Option 3')

    const emailField = basicForm.getByRole('textbox', {name:"Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual("Email")
})

test('Assertions', async({page}) =>{

    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})


    // General assertions - wont wait
    const value = 5
    expect(value).toEqual(5)

    const basicFormButton = basicForm.locator('button')
    const textOntheButton = await basicFormButton.textContent()
    expect(textOntheButton).toEqual("Submit")

    // Locator assertion - will wait 5 seconds for the element to appear
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertions - non blocking for the test to continue
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})

test('Auto waiting', async({page}) =>{
    // Default timeout for the default waiting is 30 seconds, can be configured

    
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})


    // General assertions - wont wait
    const value = 5
    expect(value).toEqual(5)

    const basicFormButton = basicForm.locator('button')
    const textOntheButton = await basicFormButton.textContent()
    expect(textOntheButton).toEqual("Submit")

    // Locator assertion - will wait 5 seconds for the element to appear
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertions - non blocking for the test to continue
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})

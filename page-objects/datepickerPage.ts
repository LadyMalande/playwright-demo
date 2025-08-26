import { Page, expect } from '@playwright/test'
import {HelperBase} from "./helperBase"

export class DatepickerPage extends HelperBase {

    constructor(page: Page){
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const datepickerInput = this.page.getByPlaceholder('Form Picker')
        await datepickerInput.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)

        
        
        await expect(datepickerInput).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)

        const dayToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dayToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){
        
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        // Match either of those classes - will allow to date pick even today which is preselected
        /*
        await this.page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"]').getByText('14').click()
        await datepickerInput.click()
        */
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
        
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthToPick = ` ${expectedMonthLong} ${expectedYear}`
        
        while(!calendarMonthAndYear.includes(expectedMonthToPick)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        }
        
        // For exact matching when the number is present multiple times in the calendar
        if(expectedDate in ["1","2","3","4","5","6","7"]){
            await this.page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"], [class="range-cell day-cell today ng-star-inserted"], [class="range-cell day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).first().click()
        } else{
            await this.page.locator('[class="day-cell ng-star-inserted"], [class="today day-cell ng-star-inserted"], [class="range-cell day-cell today ng-star-inserted"], [class="range-cell day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).first().click()
        }
        
        return dateToAssert
    }
}
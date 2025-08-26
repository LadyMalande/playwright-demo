import { Locator, LocatorScreenshotOptions, Page } from "@playwright/test"
import {HelperBase} from "./helperBase"

export class NavigationPage extends HelperBase {

    // Create fields to separate locators from methods - we can reuse the locators DRY principle = DO NOT REPEAT YOURSELF
    // Other possible way is to keep it stupid simple - have the locators in the functional methods because then during debugging the framework shows where its failing
    readonly fromLayoutsMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page){
        super(page)
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.fromLayoutsMenuItem = page.getByText('Form Layouts')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.tooltipMenuItem = page.getByText('Tooltip')
        this.toastrMenuItem = page.getByText('Toastr')
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.fromLayoutsMenuItem.click()
        await this.waitForNumberOfSeconds(2)
    }

    async datepickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenuItem.click()
    }
    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }
    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }
    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false"){
            await groupMenuItem.click()
        }
    } 
}
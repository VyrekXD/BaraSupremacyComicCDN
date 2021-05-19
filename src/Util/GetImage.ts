import path from 'path'
import { Browser } from 'puppeteer'

interface Sizes {
    width: number
    height: number
    x: number
    y: number
}

export async function GetImage(puppeter: Browser, url: string, ID: string): Promise<boolean> {
    try {
        const page = await puppeter.newPage()

        await page.setViewport({ width: 1920, height: 1540 })
        await page.goto(url, { waitUntil: 'networkidle0' })
        await page.waitForSelector('img.attachment-magaziner-large')
        await page.waitForTimeout(2000)
        //await page.screenshot({ path: path.join(__dirname, `../../Images/${ID}_test.png`) })

        const sizes = await page.evaluate(() => {
            const _img = document.querySelector('img.attachment-magaziner-large') as HTMLImageElement

            return {
                width: _img.width,
                height: _img.height,
                x: _img.x,
                y: _img.y
            }
        }) as Sizes

        await page.screenshot({ path: path.join(__dirname, `../../Images/${ID}.png`), clip: { x: sizes.x, y: sizes.y, width: sizes.width, height: sizes.height } })

        return true
    } catch (e) {
        throw e
    }
}
import path from 'path'
import { Browser } from 'puppeteer'

interface EvalData {
    width: number
    height: number
    x: number
    y: number
    title: string
}

export async function GetComic(puppeter: Browser, url: string, ID: string, isBaraOnline: boolean): Promise<string> {
    try {
        const page = await puppeter.newPage()
        const imgSelector = isBaraOnline ? 'img.attachment-magaziner-large' : 'img.img-myreadingmanga'
        const titleSelector = isBaraOnline ? 'h1.post-title' : 'h1.entry-title'

        await page.setViewport({ width: 1920, height: 1540 })
        await page.goto(url, { waitUntil: 'networkidle0' })
        await page.waitForSelector(imgSelector)
        await page.waitForSelector(titleSelector)
        await page.waitForTimeout(2000)

        let Data: EvalData

        if (isBaraOnline) {
            Data = await page.evaluate(() => {
                const _img = document.querySelector('img.attachment-magaziner-large') as HTMLImageElement
                const _title = document.querySelector('h1.post-title') as Element

                return {
                    width: _img.width,
                    height: _img.height,
                    x: _img.x,
                    y: _img.y,
                    title: _title.textContent
                }
            }) as EvalData
        } else {
            Data = await page.evaluate(() => {
                const _img = document.querySelector('img.img-myreadingmanga') as HTMLImageElement
                const _title = document.querySelector('h1.entry-title') as Element

                return {
                    width: _img.width,
                    height: _img.height,
                    x: _img.x,
                    y: _img.y,
                    title: _title.textContent
                }
            }) as EvalData
        }

        await page.screenshot({ path: path.join(__dirname, `../../Images/${ID}.png`), clip: { x: Data.x, y: Data.y, width: Data.width, height: Data.height } })

        return Data.title
    } catch (e) {
        throw e
    }
}
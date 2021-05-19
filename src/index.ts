import express from 'express'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import AdblockPlugin from 'puppeteer-extra-plugin-adblocker'
import { json } from 'body-parser'
import { config } from 'dotenv'
import { join } from 'path'
import { GetImage } from './Util/GetImage'

const app = express()
app.use(json())
app.use(express.static(join(__dirname, '../Images')))

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockPlugin())
puppeteer.defaultArgs({
	args: ['--no-sandbox', '--disable-setuid-sandbox']
})

config();

(async () => {
	const browser = await puppeteer.launch()

	app.post('/post', async (req, res) => {
		const TOKEN = req.headers.authorization
		if (TOKEN !== process.env.TOKEN) return res.status(401).json({ message: `Tu token no es el correcto` })

		const ImageURL = req.body.url
		const _ID = req.body._id
		const Image = await GetImage(browser, ImageURL, _ID).catch(e => { console.log(e); return e.message })
		if (typeof Image !== 'boolean') return res.status(500).json({ message: `Se produjo un error obteniendo la imagen`, error: Image })

		return res.status(200).json({ message: `Se ha publicado correctamente la imagen con id: ${_ID}`, url: `cdn.muscleboat.ga/${_ID}.png` })
	})

	app.listen(process.env.PORT, () => {
		console.log(`MuscleBoatCDN on: http://cdn.muscleboat.ga/`)
	})
})();
import puppeteer, { Page } from 'puppeteer' // or import puppeteer from 'puppeteer-core';
import { createClientCollection } from '../lib/client/collection'
import { Product } from '../types/products'
import chunk from 'lodash.chunk'

async function parseProductPage(page: Page): Promise<Product> {
  const description = await page.evaluate(() => {
    const description = document.querySelector('.ui-pdp-description__content')
    return description?.textContent
  })

  const title = await page.evaluate(() => {
    const title = document.querySelector('.ui-pdp-title')
    return title?.textContent
  })

  const price = await page.evaluate(() => {
    const price = document.querySelector('meta[itemprop]')

    return price?.getAttribute('content')
  })
  const image = await page.evaluate(() => {
    const image = document.querySelectorAll(
      '.ui-pdp-image.ui-pdp-gallery__figure__image'
    )[0]
    return image?.getAttribute('src')
  })

  return {
    description,
    title,
    price,
    url: page.url(),
    image,
  } as unknown as Product
}

const MAX_ALLOWED_PAGES = 42

async function main() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1080, height: 1024 })

  const productLinks: Array<string | null> = []
  const offerCardLinkSelector = 'a.promotion-item__link-container'

  for (let i = 1; i <= MAX_ALLOWED_PAGES; i++) {
    try {
      await page.goto(`https://www.mercadolibre.com.ar/ofertas?page=${i}`)

      await page.waitForSelector(offerCardLinkSelector)

      const pageProductsLinks = await page.evaluate((selector) => {
        const links = Array.from(document.querySelectorAll(selector))
        return links.map((link) => link.getAttribute('href'))
      }, offerCardLinkSelector)

      productLinks.push(...pageProductsLinks)
    } catch (error) {
      console.error('Error scraping main page', error)
    }
  }

  console.log('productLinks', productLinks)

  const allProductsParsed: Product[] = []
  const chunkedProductLinks = chunk(productLinks, 15)
  for (const chunkedLink of chunkedProductLinks) {
    await Promise.all(
      chunkedLink.map(async (link) => {
        try {
          if (!link) return
          const newPage = await browser.newPage()
          await newPage.goto(link)
          const parsedProduct = await parseProductPage(newPage)

          allProductsParsed.push({
            ...parsedProduct,
          })
          await newPage.close()
        } catch (error) {
          console.error(`Error scraping product ${link}`, error)
        }
      })
    )
  }

  const collection = await createClientCollection()

  const completedProducts = allProductsParsed.filter(
    (product) =>
      product.title && product.price && product.description && product.image
  )

  const chunkedProducts = chunk(completedProducts, 20)

  // await collection.insertMany(chunk as unknown as Product[])
  for (const chunk of chunkedProducts) {
    await collection.insertMany(chunk as unknown as Product[])
  }

  await browser.close()
}

main()
  .then(() => console.log('Done!'))
  .catch(console.error)

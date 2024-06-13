import puppeteer from 'puppeteer' // or import puppeteer from 'puppeteer-core';

async function main() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1080, height: 1024 })

  // Navigate the page to a URL.
  await page.goto('https://www.mercadolibre.com.ar/categorias#nav-header/')

  await page.waitForSelector('.categories-container__title')

  // get all category links from categories__item > a
  const categories = await page.evaluate(() => {
    const categories = Array.from(
      document.querySelectorAll('.categories__item > a')
    )
    return categories.map((category) => {
      return {
        name: category.textContent,
        url: category.getAttribute('href'),
      }
    })
  })

  console.log(categories)

  await browser.close()
}

main()
  .then(() => console.log('Done!'))
  .catch(console.error)

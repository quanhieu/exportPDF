const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const moment = require('moment');
const data = require('./Templates/data.json');

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'Templates', `${templateName}.hbs`)
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

hbs.registerHelper('dateFormat', function(value, format) {
    return moment(value).format(format);
});

(async function() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('shotList', data);

        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
            path: 'test.pdf',
            format: 'A4',
            printBackground: true
        });

        console.log('done');
        await browser.close();
        process.exit();
    } catch (err) {
        console.log(`Some error ${err}`)
    }
})();

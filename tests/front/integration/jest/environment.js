const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
const baseFile = fs.readFileSync(`${process.cwd()}/web/test_dist/index.html`, 'utf-8');
const translations = fs.readFileSync(path.join(process.cwd(), './web/js/translation/en_US.js'), 'utf-8');
const pimCSS = fs.readFileSync(path.join(process.cwd(), './web/css/pim.css'), 'utf-8');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // connect to puppeteer
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });

    const page = await this.global.__BROWSER__.newPage();
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      if (interceptedRequest.url() === 'http://pim.com/') {
        interceptedRequest.respond({
          contentType: 'text/html;charset=UTF-8',
          body: baseFile,
        });
      }

      if (interceptedRequest.url().includes('/js/translation')) {
        interceptedRequest.respond({
          contentType: 'application/json',
          body: `${JSON.stringify(translations)}`,
        });
      }
    });

    await page.goto('http://pim.com');
    await page.addStyleTag({ content: pimCSS })
    await page.evaluate(async () => await require('pim/fetcher-registry').initialize());
    await page.evaluate(async () => await require('pim/init-translator').fetch());

    this.global.__PAGE__ = page;
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;

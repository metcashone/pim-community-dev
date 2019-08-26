const CONTRACT_PATH = `${process.cwd()}/tests/front/integration/common/contracts/`
const { readFileSync } = require('fs')

function mockRequests(page, answers) {
  page.on('request', req => {
    const requestUrl = req.url();
    const contract = answers[requestUrl]
    if (!contract) return req.continue();

    try {
      const body = readFileSync(`${CONTRACT_PATH}${contract}`)
      req.respond({ contentType: 'application/json', body });
    } catch (e) {
      throw Error(`Can't find contract at ${CONTRACT_PATH}${contract}`)
    }
  });
}


module.exports = { mockRequests };

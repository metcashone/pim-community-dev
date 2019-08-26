describe('Pimenrich > filter > number filter', () => {
  let page = global.__PAGE__;

  it('renders a number filter with choices', async () => {
    const go = await page.evaluate(async () => {
      const NumberFilter = new require('oro/datafilter/number-filter');
      const filter = new NumberFilter({
        choices: [{label: "=", value: "3", data: 3, attr: []}],
        emptyValue: {unit: "MILLIGRAM", type: 3, value: ""},
        enabled: true,
        family: 'weight',
        type: 'metric'
      })

      filter.operatorChoices = [{label: "=", value: "3", data: 3, attr: []}],
      filter.enabled = true
      filter.options.units = {}


      $('body').html(filter.render().el)
      return filter;
    });

    console.log(go)
  });

});

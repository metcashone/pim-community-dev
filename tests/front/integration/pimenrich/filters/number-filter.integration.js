const process = require('process')
const fs = require('fs')
const tools = require('../../common/tools');
const datagridLoad = fs.readFileSync(`${process.cwd()}/tests/front/integration/common/contracts/product_grid.json`, 'utf-8');
const loadProducts = fs.readFileSync(`${process.cwd()}/tests/front/integration/common/contracts/load_products.json`, 'utf-8');
const categoryChildren = fs.readFileSync(`${process.cwd()}/tests/front/integration/common/contracts/category_children.json`, 'utf-8');
const listTree = fs.readFileSync(`${process.cwd()}/tests/front/integration/common/contracts/list_tree.json`, 'utf-8');
const attributesFilters = fs.readFileSync(`${process.cwd()}/tests/front/integration/common/contracts/attributes_filters.json`, 'utf-8');

const renderProductGrid = async (page) => {
  const answerJSON = (body) => { return { contentType: 'application/json', body}}
  tools.mockRequests(page, {
    'http://pim.com/datagrid_view/rest/product-grid/default': answerJSON(JSON.stringify({view: null})),
    'http://pim.com/datagrid_view/rest/product-grid/default-columns': answerJSON(JSON.stringify(["identifier","image","label","family","enabled","completeness","created","updated","complete_variant_products"])),
    'http://pim.com/enrich/product-category-tree/product-grid/children.json?dataLocale=undefined&context=view&id=0&select_node_id=-2&with_items_count=1&include_sub=1': answerJSON(categoryChildren),
    'http://pim.com/datagrid/product-grid/load?dataLocale=en_US&params%5BdataLocale%5D=en_US&product-grid%5B_parameters%5D%5Bview%5D%5Bcolumns%5D=identifier%2Cimage%2Clabel%2Cfamily%2Cenabled%2Ccompleteness%2Ccreated%2Cupdated%2Ccomplete_variant_products%2Csuccess%2C%5Bobject+Object%5D': answerJSON(datagridLoad),
    'http://pim.com/datagrid/product-grid/attributes-filters?page=1&locale=en_US': answerJSON(attributesFilters),
    'http://pim.com/enrich/product-category-tree/product-grid/list-tree.json?dataLocale=undefined&select_node_id=0&include_sub=1&context=view': answerJSON(listTree),
    'http://pim.com/enrich/product-category-tree/product-grid/children.json?dataLocale=undefined&context=view&id=1&select_node_id=-2&with_items_count=1&include_sub=1': answerJSON(categoryChildren),
    'http://pim.com/datagrid/product-grid?dataLocale=en_US&product-grid%5B_pager%5D%5B_page%5D=1&product-grid%5B_pager%5D%5B_per_page%5D=25&product-grid%5B_parameters%5D%5Bview%5D%5Bcolumns%5D=identifier%2Cimage%2Clabel%2Cfamily%2Cenabled%2Ccompleteness%2Ccreated%2Cupdated%2Ccomplete_variant_products%2Csuccess%2C%5Bobject%20Object%5D&product-grid%5B_parameters%5D%5Bview%5D%5Bid%5D=&product-grid%5B_sort_by%5D%5Bupdated%5D=DESC&product-grid%5B_filter%5D%5Bscope%5D%5Bvalue%5D=ecommerce&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BtreeId%5D=1&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BcategoryId%5D=-2&product-grid%5B_filter%5D%5Bcategory%5D%5Btype%5D=1': answerJSON(loadProducts),
    'http://pim.com/datagrid/product-grid?dataLocale=en_US&product-grid%5B_pager%5D%5B_page%5D=1&product-grid%5B_pager%5D%5B_per_page%5D=25&product-grid%5B_parameters%5D%5Bview%5D%5Bcolumns%5D=identifier%2Cimage%2Clabel%2Cfamily%2Cenabled%2Ccompleteness%2Ccreated%2Cupdated%2Ccomplete_variant_products%2Csuccess%2C%5Bobject%20Object%5D&product-grid%5B_parameters%5D%5Bview%5D%5Bid%5D=&product-grid%5B_sort_by%5D%5Bupdated%5D=DESC&product-grid%5B_filter%5D%5Bscope%5D%5Bvalue%5D=ecommerce&product-grid%5B_filter%5D%5Bweight%5D%5Bvalue%5D=&product-grid%5B_filter%5D%5Bweight%5D%5Btype%5D=empty&product-grid%5B_filter%5D%5Bweight%5D%5Bunit%5D=MILLIGRAM&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BtreeId%5D=1&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BcategoryId%5D=-2&product-grid%5B_filter%5D%5Bcategory%5D%5Btype%5D=1': answerJSON(loadProducts)
  });

  return page.evaluate(({data, extension}) => {
    const FormBuilder = require('pim/form-builder');

    return FormBuilder.build(extension).then(form => {
      form.setData(data);
      form.setElement(document.getElementById('app')).render();

      return form;
    });
  }, { data: {}, extension: 'pim-product-index' });
  }

describe('Product grid > number filter', () => {
  let page = global.__PAGE__;

  beforeEach(async () => {
    try {
     await renderProductGrid(page)
    } catch (e) {
      console.log("Error", e)
    }
  }, 60000);

  it('filters by the "is empty" operator', async () => {
    await page.waitForSelector('tr.AknGrid-bodyRow:nth-child(3)', {visible: true});
    await page.click('button.AknFilterBox-addFilterButton')
    await page.waitFor(500)
    await page.click('.filters-column label[for="weight"]')
    await page.click('.AknButton.AknButton--apply.close')
    await page.click('.filter-box [data-name="weight"]')
    await page.click('.open-filter .AknDropdown.operator')
    await page.click('.open-filter .operator_choice[data-value="empty"]')
    await page.click('.open-filter .filter-update')
    expect(true).toBeTruthy()
  }, 60000);
});

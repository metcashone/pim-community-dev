const process = require('process')
const fs = require('fs')
const tools = require('../../common/tools');

const renderProductGrid = async (page) => {
  tools.mockRequests(page, {
    'http://pim.com/datagrid_view/rest/product-grid/default': 'product-grid/default_views.json',
    'http://pim.com/datagrid_view/rest/product-grid/default-columns': 'product-grid/default_columns.json',
    'http://pim.com/enrich/product-category-tree/product-grid/children.json?dataLocale=undefined&context=view&id=0&select_node_id=-2&with_items_count=1&include_sub=1': 'product-grid/category_children.json',
    'http://pim.com/datagrid/product-grid/load?dataLocale=en_US&params%5BdataLocale%5D=en_US&product-grid%5B_parameters%5D%5Bview%5D%5Bcolumns%5D=identifier%2Cimage%2Clabel%2Cfamily%2Cenabled%2Ccompleteness%2Ccreated%2Cupdated%2Ccomplete_variant_products%2Csuccess%2C%5Bobject+Object%5D': 'product-grid/product_grid.json',
    'http://pim.com/datagrid/product-grid/attributes-filters?page=1&locale=en_US': 'product-grid/attributes_filters.json',
    'http://pim.com/enrich/product-category-tree/product-grid/list-tree.json?dataLocale=undefined&select_node_id=0&include_sub=1&context=view': 'product-grid/list_tree.json',
    'http://pim.com/enrich/product-category-tree/product-grid/children.json?dataLocale=undefined&context=view&id=1&select_node_id=-2&with_items_count=1&include_sub=1': 'product-grid/category_children.json',
    'http://pim.com/datagrid/product-grid?dataLocale=en_US&product-grid%5B_pager%5D%5B_page%5D=1&product-grid%5B_pager%5D%5B_per_page%5D=25&product-grid%5B_parameters%5D%5Bview%5D%5Bcolumns%5D=identifier%2Cimage%2Clabel%2Cfamily%2Cenabled%2Ccompleteness%2Ccreated%2Cupdated%2Ccomplete_variant_products%2Csuccess%2C%5Bobject%20Object%5D&product-grid%5B_parameters%5D%5Bview%5D%5Bid%5D=&product-grid%5B_sort_by%5D%5Bupdated%5D=DESC&product-grid%5B_filter%5D%5Bscope%5D%5Bvalue%5D=ecommerce&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BtreeId%5D=1&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BcategoryId%5D=-2&product-grid%5B_filter%5D%5Bcategory%5D%5Btype%5D=1': 'product-grid/load_products.json',
    'http://pim.com/datagrid/product-grid?dataLocale=en_US&product-grid%5B_pager%5D%5B_page%5D=1&product-grid%5B_pager%5D%5B_per_page%5D=25&product-grid%5B_parameters%5D%5Bview%5D%5Bcolumns%5D=identifier%2Cimage%2Clabel%2Cfamily%2Cenabled%2Ccompleteness%2Ccreated%2Cupdated%2Ccomplete_variant_products%2Csuccess%2C%5Bobject%20Object%5D&product-grid%5B_parameters%5D%5Bview%5D%5Bid%5D=&product-grid%5B_sort_by%5D%5Bupdated%5D=DESC&product-grid%5B_filter%5D%5Bscope%5D%5Bvalue%5D=ecommerce&product-grid%5B_filter%5D%5Bweight%5D%5Bvalue%5D=&product-grid%5B_filter%5D%5Bweight%5D%5Btype%5D=empty&product-grid%5B_filter%5D%5Bweight%5D%5Bunit%5D=MILLIGRAM&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BtreeId%5D=1&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BcategoryId%5D=-2&product-grid%5B_filter%5D%5Bcategory%5D%5Btype%5D=1': 'product-grid/load_products.json',
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
      throw Error(e.message)
    }
  }, 60000);

  it('filters by the "is empty" operator', async () => {
    const requests = [];
    page.on('request', (req) => requests.push(req.url()));
    await page.waitForSelector('tr.AknGrid-bodyRow:nth-child(3)', {visible: true});
    await page.click('button.AknFilterBox-addFilterButton')
    await page.waitFor(500)
    await page.click('.filters-column label[for="weight"]')
    await page.click('.AknButton.AknButton--apply.close')
    await page.click('.filter-box [data-name="weight"]')
    await page.click('.open-filter .AknDropdown.operator')
    await page.click('.open-filter .operator_choice[data-value="empty"]')
    await page.click('.open-filter .filter-update')
    expect(requests).toContain('http://pim.com/datagrid/product-grid?dataLocale=en_US&product-grid%5B_pager%5D%5B_page%5D=1&product-grid%5B_pager%5D%5B_per_page%5D=25&product-grid%5B_parameters%5D%5Bview%5D%5Bcolumns%5D=identifier%2Cimage%2Clabel%2Cfamily%2Cenabled%2Ccompleteness%2Ccreated%2Cupdated%2Ccomplete_variant_products%2Csuccess%2C%5Bobject%20Object%5D&product-grid%5B_parameters%5D%5Bview%5D%5Bid%5D=&product-grid%5B_sort_by%5D%5Bupdated%5D=DESC&product-grid%5B_filter%5D%5Bscope%5D%5Bvalue%5D=ecommerce&product-grid%5B_filter%5D%5Bweight%5D%5Bvalue%5D=&product-grid%5B_filter%5D%5Bweight%5D%5Btype%5D=empty&product-grid%5B_filter%5D%5Bweight%5D%5Bunit%5D=MILLIGRAM&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BtreeId%5D=1&product-grid%5B_filter%5D%5Bcategory%5D%5Bvalue%5D%5BcategoryId%5D=-2&product-grid%5B_filter%5D%5Bcategory%5D%5Btype%5D=1')
  });
});

import SortableTable from '../../../components/sortable-table/index.js';
import header from './bestsellers-header.js';

import fetchJson from '../../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async updateComponents () {
    const data = await fetchJson(`${process.env.BACKEND_URL}api/rest/products?_embed=subcategory.category&_start=1&_end=20`);

    this.components.sortableTable.addRows(data);

    //this.components.ordersChart.update(from, to);
    //this.components.salesChart.update(from, to);
    //this.components.customersChart.update(from, to);
  }

  async initComponents () {
    const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));
/*url = '',
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false,
    step = 20,
    start = 1,
    end = start + step*/

    const sortableTable = new SortableTable(header, {
      url: `api/rest/products?_embed=subcategory.category`,
      isSortLocally: false,
    });
    this.components.sortableTable = sortableTable;
  }

  get template () {
    return `<div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Товары</h2>
        <a href="/products/add" class="button-primary">Добавить товар</a>
      </div>
      <div data-element="productsContainer" class="products-list__container">
          <div data-element="sortableTable">
          <!-- sortable-table component -->
        </div>
      </div>
    </div>`;
  }

  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();
    //this.initEventListeners();

    return this.element;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  /*initEventListeners () {
    this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;

      this.updateComponents(from, to);
    });
  }*/

  remove () {
    this.element.remove();
  }

  destroy () {
    this.remove();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}

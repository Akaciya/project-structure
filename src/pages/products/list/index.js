import SortableTable from '../../../components/sortable-table/index.js';
import header from './bestsellers-header.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async initComponents () {

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

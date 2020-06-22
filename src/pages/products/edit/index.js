import ProductForm from '../../../components/product-form/index.js';
import SortableList from "../../../components/sortable-list/index.js";

export default class Page {

  productId;
  element;
  subElements = {};
  components = {};

  constructor(matches) {
    console.log(matches);
    this.productId = matches[1];
    console.log('this.productId='+this.productId);
  }

 /* async updateTableComponent (from, to) {
    const data = await fetchJson(`${process.env.BACKEND_URL}api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`);
    this.components.sortableTable.addRows(data);
  }*/

  async initComponents () {
    const productForm = new ProductForm(this.productId);
    //console.log();
    /*productForm.addEventListener('product-saved', event => {
      console.error('product-saved', event.detail);
    });

    productForm.addEventListener('product-updated', event => {
      console.error('product-updated', event.detail);
    });*/

    //root.append(productForm.element);
    return productForm.render();
    //this.components.productForm = productForm;
    //console.log(this.components.productForm, 'f');
    //return Object.values(productForm);

  }

  get template() {
  return `
    <div class="products-edit">
      <div class="content__top-panel">
        <h1 class="page-title">
          <a href="/products" class="link">Товары</a> / Добавить
        </h1>
      </div>
      <div class="content-box">
      <!--this form component-->
        </div>

    </div>`;
  }

  async render () {

    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    console.log(this.element);//product-edit
    //this.subElements = this.getSubElements(this.element);
    this.subElements = this.element.querySelector('.content-box');
    this.subElements.append(await this.initComponents());
    //this.imageListContainer = this.subElements.querySelector('[data-element="imageListContainer"]').firstElementChild;
    console.log(this.subElements.querySelector('[data-element="imageListContainer"]').firstElementChild);
    /*const items = this.imageListContainer.map(({ url, source }) => this.itemImageTemplate({url, source}));
    const sortableList = new SortableList({
      items
    });*/
    await this.initComponents();

    this.renderComponents();

    //this.initEventListeners();

    return this.element;
  }


  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];
      console.log(component, 'component');
      root.append(element);
    });
  }

  /*getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      console.log(accum, 'accum');//product-edit
      return accum;
    }, {});
  }*/

  /*initEventListeners () {
   /!* this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;
      this.updateChartsComponents(from, to);
      this.updateTableComponent(from, to);
    });*!/
  }*/

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}




import ProductForm from '../../../components/product-form/index.js';

export default class Page {

  productId;
  element;
  subElements = {};
  components = {};

  constructor(matches) {
    this.productId = matches[1];
  }

  async initComponents () {
    const productForm = new ProductForm(this.productId);
    return productForm.render();
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
    this.subElements = this.element.querySelector('.content-box');
    this.subElements.append(await this.initComponents());

    await this.initComponents();

    this.renderComponents();

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


  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}




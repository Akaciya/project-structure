import SortableList from '../../components/sortable-list/index.js';
import fetchJson from '../../utils/fetch-json.js';
import escapeHtml from '../../utils/escape-html.js';

export default class Page {
  element;
  subElements = {};
  components = {};
  category;

  onShow =(event)=> {
    //const header = this.subElements.querySelectorAll('.category__header');
    const header = this.subElements.querySelectorAll('[data-toggle-handle]');
    const target = event.target;
    header.forEach((item) => {
      if (target === item) {
        target.closest('.category').classList.toggle('category_open');
      }
    });
  };

   constructor() {
    this.render();
  }


  async getCategoryList() {
    const categoryData = await fetchJson(`https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory`);
    const arrCategory = [];

    categoryData.forEach( ({title, id, subcategories}) => {
      const arrLi = subcategories.map((item) => this.liTemplate(item.id, item.title, item.count));
      const sortList = new SortableList({items: arrLi});
      const itemCategory = this.categoryTemplate(id, title, sortList.element);

      arrCategory.push(itemCategory);
    });
    this.subElements.append(...arrCategory);
  }


  liTemplate(id, title, count) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${id}">
          <strong>${title}</strong>
          <span><b>${count}</b> products</span>
      </li>`;

    return wrapper.firstElementChild;
  }

  categoryTemplate(id, header, ul) {
    const  wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div data-id="${id}" class="category category_open">
        <header class="category__header" data-toggle-handle="">${header}</header>
        <div class="category__body">
          <div class="subcategory-list">
          </div>
        </div>
      </div>
    `;
    const category = wrapper.firstElementChild;
    category.querySelector('.subcategory-list').append(ul);
    return category;
  }
  getCategoriesContainer() {
      return `
        <div data-element="categoriesContainer">
        </div>
           `
  }

  get template () {
    return `
    <div class="categories">
      <div class="content__top-panel">
        <h2 class="page-title">Категории товаров</h2>
      </div>
      ${this.getCategoriesContainer()}
    </div>`;
  }


  render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.getCategoryList();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element)[0];
    this.initEventListeners ();
      return this.element;
  }
  initEventListeners () {
    this.subElements.addEventListener('click', event => this.onShow(event));
  }
  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return Object.values(accum);
    }, {});
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];
      root.append(element);
    });
  }
  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}

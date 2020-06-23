export default class ToggleShow {

  element;
  parent;
  toggleClass;

  onToggleShow =(event)=> {
    const handle = this.element.querySelectorAll('[data-toggle-handle]');
    const target = event.target;
    handle.forEach((item) => {
      if (target === item) {
        target.closest(this.parent).classList.toggle(this.toggleClass);
      }
    });
  };


  constructor(eventElement, closest, toggleClass) {
    this.element = eventElement.querySelectorAll('[data-toggle-handle]');
    this.parent = closest;
    this.toggleClass = toggleClass;
  }

  initEventListeners() {
    this.element.addEventListener('click', event => this.onToggleShow(event));
  }



  render() {
    //const header = this.element.dataset.toggleHandle;
    //this.element = this.subElements.querySelectorAll('.category__header');
    /*this.element = document.createElement('div');
    this.element.className = 'tooltip';*/
    this.element.innerHTML = html;

    document.body.append(this.element);
  }



  destroy() {
    document.removeEventListener('click', this.onToggleShow);
    this.element.remove();
  }
}


/*export default class SortableList {
  element;
  subElements = {};
  dragElement;
  placeElement;
  shiftX;
  shiftY;

  onDrap = (event) => {
    event.preventDefault();
    console.log(event.target);
    const target = event.target;
    const elem = event.target.closest('.sortable-list__item');
    const handle = elem.querySelector('[data-grab-handle]');

    //если вдруг нет картинки-хваталки
      this.dragElement = handle || elem;

      const { left, top } =  elem.getBoundingClientRect();
      this.shiftX = event.clientX - left;
      this.shiftY = event.clientY - top;

      this.placeElement = document.createElement('div');
      this.placeElement.className = 'sortable-list__placeholder';
      this.placeElement.style.width = `${elem.offsetWidth}px`;
      this.placeElement.style.height = `${elem.offsetHeight}px`;

      elem.classList.add('sortable-list__item_dragging');
      elem.after(this.placeElement);
      this.element.append(elem);

      this.getDragStyle(event);

      document.addEventListener("pointermove", this.onMove);
      document.addEventListener("pointerup", this.onUp);

  };

  onMove =(event) => {
    this.getDragStyle(event);

    const childElem = this.element.children;
    const elemLength = childElem.length;

    for (let i = 0; i < elemLength; i++) {
      const itemElem = childElem[i],
        {top, bottom} = itemElem.getBoundingClientRect(),

        before = event.clientY < top + itemElem.offsetHeight / 2,
        there = event.clientY > top && event.clientY < bottom;

      if (itemElem !== this.dragElement && there) {
        if (before) {
          this.element.insertBefore(this.placeElement, childElem[i]);
          break;
        }
        this.element.insertBefore(this.placeElement, childElem[i+1]);
      }
    }
  };

  onUp = (event)=> {
    this.placeElement.replaceWith(this.dragElement);
    this.dragElement.classList.remove("sortable-list__item_dragging");
    this.dragElement.style.cssText = '';

    this.removeEventListeners();
  };

  constructor({items: arr} = {}) {
    this.items = arr;

    this.render();

  }

  getDragStyle(event) {
    this.dragElement.style.left = `${event.clientX - this.shiftX}px`;
    this.dragElement.style.top = `${event.clientY - this.shiftY}px`;
    this.dragElement.style.width = `${this.placeElement.offsetWidth}px`;
    this.dragElement.style.height = `${this.placeElement.offsetHeight}px`;
  }

  deleteImage(event)  {
    const parent = event.target.closest('.sortable-list__item'),
      deleteElem = parent.querySelector('[data-delete-handle]');

    if ( parent && (event.target === deleteElem)) {
      parent.remove();
    }
  };

  get template() {
    const list = document.createElement('ul');
    list.className = 'sortable-list';
    this.items.forEach((item) => {
      item.classList.add('sortable-list__item');
      list.append(item);
    });
    return list;
  }

  render() {
    const element = document.createElement('div');

    element.append(this.template);

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
  }

  getSubElements(element) {
    return  element.children;
  }

  initEventListeners() {
    this.element.addEventListener('pointerdown', (event) => this.onDrap(event));
    this.element.addEventListener('click', (event) => this.deleteImage(event));
  }
  removeEventListeners() {
    document.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerup", this.onUp);
    this.dragElement = null;
  }

  remove() {
    this.element.remove();
    document.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerup", this.onUp);
    this.dragElement = null;
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}*/
export default class SortableList {
  element;

  onDocumentPointerMove = ({ clientX, clientY }) => {
    this.moveDraggingAt(clientX, clientY);

    const { firstElementChild, children } = this.element;
    const { top: firstElementTop } = firstElementChild.getBoundingClientRect();
    const { bottom } = this.element.getBoundingClientRect();

    if (clientY < firstElementTop) {
      this.movePlaceholderAt(0);
    } else if (clientY > bottom) {
      this.movePlaceholderAt(children.length);
    } else {
      for (let i = 0; i < children.length; i++) {
        const li = children[i];

        // ignore to prevent bugs when dragging between elements
        if (li !== this.draggingElem) {
          const { top, bottom } = li.getBoundingClientRect();
          const { offsetHeight: height } = li;

          if (clientY > top && clientY < bottom) {
            // inside the element (y-axis)
            if (clientY < top + height / 2) {
              // upper half of the element
              this.movePlaceholderAt(i);
              break;
            } else {
              // lower half of the element
              this.movePlaceholderAt(i + 1);
              break;
            }
          }
        }
      }
    }

    this.scrollIfCloseToWindowEdge(clientY);
  };

  onDocumentPointerUp = () => {
    this.dragStop();
  };

  constructor({ items = [] } = {}) {
    this.items = items;
    this.render();
  }

  render() {
    this.element = document.createElement('ul');
    this.element.className = 'sortable-list';

    this.addItems();
    this.initEventListeners();
  }

  initEventListeners () {
    console.log('init', this.element);
    this.element.addEventListener('pointerdown', event => this.onPointerDown(event));
  }

  addItems() {
    // item is a DOM element
    for (let item of this.items) {
      item.classList.add('sortable-list__item');
    }
    this.element.append(...this.items);

  }

  onPointerDown (event) {
    if (event.which !== 1) { // must be left-button
      return false;
    }

    const itemElem = event.target.closest('.sortable-list__item');
    const handle = event.target.closest('[data-grab-handle]');
    //this.dragElement = handle || itemElem;
    console.log(event.target, 'target');
    if (itemElem) {
      if (handle) {
        event.preventDefault();

        this.dragStart(itemElem, event);
      }

      if (event.target.closest('[data-delete-handle]')) {
        event.preventDefault();

        itemElem.remove();
      }
    }
  }

  dragStart(itemElem, {clientX, clientY}) {
    this.elementInitialIndex = [...this.element.children].indexOf(itemElem);

    this.pointerInitialShift = {
      x: clientX - itemElem.getBoundingClientRect().x,
      y: clientY - itemElem.getBoundingClientRect().y
    };

    this.draggingElem = itemElem;

    this.placeholderElem = document.createElement('li');
    this.placeholderElem.className = 'sortable-list__placeholder';

    // itemElem will get position:fixed
    // so its width will be auto-set to fit the parent container
    itemElem.style.width = `${itemElem.offsetWidth}px`;
    itemElem.style.height = `${itemElem.offsetHeight}px`;

    this.placeholderElem.style.width = itemElem.style.width;
    this.placeholderElem.style.height = itemElem.style.height;

    itemElem.classList.add('sortable-list__item_dragging');

    itemElem.after(this.placeholderElem);

    // move to the end, to be over other list elements
    this.element.append(itemElem);

    this.moveDraggingAt(clientX, clientY);

    document.addEventListener('pointermove', this.onDocumentPointerMove);
    document.addEventListener('pointerup',  this.onDocumentPointerUp);
  }

  moveDraggingAt(clientX, clientY) {
    this.draggingElem.style.left = clientX - this.pointerInitialShift.x + 'px';
    this.draggingElem.style.top = clientY - this.pointerInitialShift.y + 'px';
  }

  scrollIfCloseToWindowEdge(clientY) {
    const scrollingValue = 10;
    const threshold = 20;

    if (clientY < threshold) {
      window.scrollBy(0, -scrollingValue);
    } else if (clientY > document.documentElement.clientHeight - threshold) {
      window.scrollBy(0, scrollingValue);
    }
  }

  movePlaceholderAt(index) {
    const currentElement = this.element.children[index];

    if (currentElement !== this.placeholderElem) {
      this.element.insertBefore(this.placeholderElem, currentElement);
    }
  }

  dragStop() {
    const placeholderIndex = [...this.element.children].indexOf(this.placeholderElem);

    // drop element back
    this.placeholderElem.replaceWith(this.draggingElem);
    this.draggingElem.classList.remove('sortable-list__item_dragging');

    this.draggingElem.style.left = '';
    this.draggingElem.style.top = '';
    this.draggingElem.style.width = '';
    this.draggingElem.style.height = '';

    document.removeEventListener('pointermove', this.onDocumentPointerMove);
    document.removeEventListener('pointerup', this.onDocumentPointerUp);

    this.draggingElem = null;

    if (placeholderIndex !== this.elementInitialIndex) {
      this.element.dispatchEvent(new CustomEvent('sortable-list-reorder', {
        bubbles: true,
        details: {
          from: this.elementInitialIndex,
          to: placeholderIndex
        }
      }));
    }
  }

  remove () {
    this.element.remove();
    document.removeEventListener('pointermove', this.onDocumentPointerMove);
    document.removeEventListener('pointerup', this.onDocumentPointerUp);
  }

  destroy () {
    this.remove();
  }
}

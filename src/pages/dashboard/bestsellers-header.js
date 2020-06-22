const header = [
  {
    id: 'images',
    title: 'Image',
    sortable: false,
    template: data => {
      return `
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${data.length ? data[0].url : ''}">
          </div>
        `;
    }
  },
  {
    id: 'title',
    title: 'Name',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'subcategory',
    title: 'Subcategory',
    sortable: false,
    sortType: 'string',
    template: data => {
      if (!data) {
        return `<div class="sortable-table__cell"></div>`;
      }
      return `<div class="sortable-table__cell">
        <span data-tooltip="
        <div class=&quot;sortable-table-tooltip&quot;>
          <span class=&quot;sortable-table-tooltip__category&quot;>${data.title}</span> /
          <b class=&quot;sortable-table-tooltip__subcategory&quot;>${data.category.title}</b>
        </div>">${data.category.title}</span>
        </div>
      `;
    }
  },
  {
    id: 'quantity',
    title: 'Quantity',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'status',
    title: 'Status',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">
          ${data > 0 ? 'Active' : 'Inactive'}
        </div>`;
    }
  },
];

export default header;

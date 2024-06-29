class DownloadCounter extends HTMLSpanElement {
  static observedAttributes = [
    'date',
    'inc-per-day'
  ];

  constructor() {
    super();
  }
  connectedCallback() {
    this.count = +this.textContent;
    this.date = new Date(this.getAttribute('date'));
    this.inc = (+this.getAttribute('inc-per-day')) / (3600 * 24 * 1000) 
    this.calculateCurrentDownloads();

  }

  calculateCurrentDownloads() {

    const currentDownloads =
      Math.floor(
      this.count +
      (Date.now()-this.date) * this.inc
      );

    this.textContent = Intl.NumberFormat().format(currentDownloads);

    setTimeout(
      () => this.calculateCurrentDownloads(),
      // Add some randomnes
      Math.floor(Math.random() * 150)+50,
    );

  }

}

customElements.define('download-counter', DownloadCounter, { extends: 'span' });

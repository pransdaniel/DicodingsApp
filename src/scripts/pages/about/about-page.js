export default class AboutPage {
  async render() {
    return `
      <section class="container" role="main" aria-labelledby="about-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="about-title">Tentang Dicoding Story</h1>
        <p>Aplikasi untuk berbagi cerita seputar Dicoding. Dibangun dengan Vanilla JS dan Webpack.</p>
      </section>
    `;
  }

  async afterRender() {
    // No additional logic needed
  }
}
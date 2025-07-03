class BasePage {
    constructor(page) {
      this.page = page;
      this.timeout = 30000;
    }
  
    async navigate(url) {
      // Handle both absolute and relative URLs
      let targetUrl = url;
      
      // If URL doesn't start with http/https, check if we have a baseURL configured
      if (!url.startsWith('http')) {
        const baseURL = this.page.context()._options.baseURL;
        if (baseURL) {
          // Use the configured baseURL
          targetUrl = `${baseURL.replace(/\/$/, '')}${url}`;
        } else {
          // Fallback to production URL
          targetUrl = `https://wordmate.es${url}`;
        }
      }
      
      console.log(`Navigating to: ${targetUrl}`);
      await this.page.goto(targetUrl);
      await this.page.waitForLoadState('networkidle');
    }
  
    async waitForElement(selector, options = {}) {
      return await this.page.waitForSelector(selector, {
        timeout: this.timeout,
        ...options
      });
    }
  
    async clickElement(selector) {
      await this.waitForElement(selector);
      await this.page.click(selector);
    }
  
    async fillInput(selector, value) {
      await this.waitForElement(selector);
      await this.page.fill(selector, value);
    }
  
    async getText(selector) {
      await this.waitForElement(selector);
      return await this.page.textContent(selector);
    }
  
    async isElementVisible(selector) {
      try {
        await this.waitForElement(selector, { timeout: 5000 });
        return true;
      } catch {
        return false;
      }
    }
  
    async takeScreenshot(name) {
      await this.page.screenshot({ 
        path: `reports/screenshots/${name}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  }
  
  module.exports = BasePage;
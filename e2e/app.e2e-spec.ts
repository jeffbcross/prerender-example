import { PrerenderPage } from './app.po';

describe('prerender App', () => {
  let page: PrerenderPage;

  beforeEach(() => {
    page = new PrerenderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

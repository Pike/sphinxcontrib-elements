import { Sphinx } from "../sphinx";

export function create_sidebar_searchbox() {
    class Searchbox extends HTMLElement {
        connectedCallback() {
            if (this.children.length > 0) {
                return;
            }
            const context = Sphinx.context();
            if (context.pagename != "search") {
                this.create_box(context)
            }
        }

        create_box(context: any) {
            let url = new URL(context.depth, document.location.href);
            url = new URL('search.html', url.href);
            this.innerHTML = `<div id="searchbox" role="search">
            <h3 id="searchlabel">Quick search</h3>
              <div class="searchformwrapper">
              <form class="search" action="${url.href}" method="get">
                <input type="text" name="q" aria-labelledby="searchlabel" />
                <input type="submit" value="Go" />
              </form>
              </div>
          </div>

        `
        }
    }
    return Searchbox;
}

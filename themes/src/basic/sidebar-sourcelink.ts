import { Sphinx } from "../sphinx";

export function create_sidebar_sourcelink() {
    class Sourcelink extends HTMLElement {
        connectedCallback() {
            if (this.children.length > 0) {
                return;
            }
            const context = Sphinx.context();
            if (context.has_source && context.sourcename) {
                this.create_link(context)
            }
        }

        create_link(context: any) {
            let url = new URL(context.depth, document.location.href);
            url = new URL('_sources/' + context.sourcename, url.href);
            this.innerHTML = `<div role="note" aria-label="source link">
            <h3>This Page</h3>
            <ul class="this-page-menu">
              <li><a href="${url.href}"
                    rel="nofollow">Show Source</a></li>
            </ul>
           </div>
        `
        }
    }
    return Sourcelink;
}

import { Sphinx } from "../sphinx";

export function create_sidebar_localtoc() {
    let tocdoc: Document|undefined;
    class Localtoc extends HTMLElement {
        async connectedCallback() {
            if (this.children.length > 0) {
                return;
            }
            if (!tocdoc) {
                tocdoc = await this.loadtoc();
            }
            this.render();
        }
        render()  {
            let toc_template: HTMLTemplateElement = /** @type {HTMLTemplateElement} */ (tocdoc.querySelector(
                `template[pagename="${Sphinx.context().pagename}"]`
            ));
            let pagetoc: DocumentFragment = /** @type {DocumentFragment} */ (toc_template.content.cloneNode(true));
            for (const pagerefs of pagetoc.querySelectorAll('div.pagerefs')) {
                pagerefs.remove();
            }
            if (pagetoc.querySelectorAll('li').length < 2) {
                return;
            }
            const h = document.createElement('h3');
            const a = document.createElement('a');
            h.appendChild(a);
            a.href = "#";
            a.textContent = "Table of Contents";
            this.appendChild(h);
            this.appendChild(pagetoc);
        }
        async loadtoc(): Promise<Document> {
            let url = new URL(Sphinx.context().depth, document.location.href);
            url = new URL('_tocs.html', url);
            let content = await (await fetch(url.href)).text();
            return new DOMParser().parseFromString(content, "text/html");
        }
    }

    return Localtoc;
}

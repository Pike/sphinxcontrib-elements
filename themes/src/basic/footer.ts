import { Sphinx } from "../sphinx";

export function create_footer() {

    class Footer extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            if (this.childElementCount) return;
            const context = Sphinx.context();
            this.setAttribute("role", "contentinfo");
            this.textContent = `© Copyright ${context.copyright}.`;
            this.textContent +=  ' Created using ';
            const  a = document.createElement("a");
            a.href = "https://www.sphinx-doc.org/";
            a.textContent = "Sphinx";
            this.appendChild(a);
            this.appendChild(document.createTextNode(" " + context.sphinx_version + "."));
        }
    }

    return Footer;
}

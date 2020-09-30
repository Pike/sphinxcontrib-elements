import * as elements from "./elements.js";

for (const cls in elements) {
    const impl = elements[cls];
    if (HTMLElement.isPrototypeOf(impl)) {
        customElements.define('sphinx-' + cls.toLowerCase(), impl);
    }
}

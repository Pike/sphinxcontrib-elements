export function create_document(): CustomElementConstructor {
    class Document extends HTMLElement {
        private ctx: any
        constructor() {
            super();
        }

        connectedCallback() {
        }

    }
    return Document;
}

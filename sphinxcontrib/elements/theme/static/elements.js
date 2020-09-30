export function content(html_content) {
    const template = document.createElement('template');
    template.innerHTML = html_content;
    return template.content;
}

export class Document extends HTMLElement {
    constructor() {
        super();
        this._ctx = null;
    }

    connectedCallback() {

    }

    get context() {
        if (this._ctx === null) {
            const global_ctx = JSON.parse(
                document.getElementById("global-ctx").textContent
            );
            const local_ctx = JSON.parse(
                document.getElementById("local-ctx").textContent
            );
            Object.setPrototypeOf(local_ctx, global_ctx);
            this._ctx = local_ctx;
        }
        return this._ctx
    }

    get depth() {
        return this.context.depth;
    }
}

export class Sidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"}).innerHTML = "<div class='sidebar'><slot></slot><sphinx-searchbox></sphinx-searchbox></div>";
    }
    connectedCallback() {
        this.appendChild(document.getElementById("elements-docs-toc").content.cloneNode(true));
    }
}

const SEARCHBOX_CONTENT = content`
<form>
  <input placeholder="search"><button type="submit">Go</button>
</form>
`;

export class SearchBox extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(SEARCHBOX_CONTENT.cloneNode(true));
    }
    connectedCallback() {

    }
}

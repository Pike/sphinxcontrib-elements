export function content(html_content) {
    const template = document.createElement('template');
    template.innerHTML = html_content;
    return template.content;
}

const relsep = " »";

export let rootrellink = (function() {
    let _rrl;
    return function(ctx) {
        if (!_rrl) {
            _rrl = _create_rootrelllink(ctx);
        }
        return _rrl;
    };
    function _create_rootrelllink(ctx) {
        const a = document.createElement("a");
        a.textContent = ctx.shorttitle;
        a.href = ctx.master_href;
        const li = document.createElement("li");
        li.className = "nav-item nav-item-0";
        li.appendChild(a);
        li.appendChild(document.createTextNode(relsep));
        return li;
    }
})();

export let relbar = (function() {
    let _relbar;
    return function() {
        if (!_relbar) {
            _relbar = _create_relbar();
        }
        return _relbar.cloneNode(true);
    }
    function _create_relbar() {
        const context = document
            .getElementsByTagName("sphinx-document")[0]
            .context;
        const container = document.createElement("div");
        container.classList.add("related");
        container.setAttribute("role", "navigation");
        container.setAttribute("aria-label", "related navigation");
        container.appendChild(document.createElement('h3'));
        container.lastElementChild.textContent = "Navigation";
        container.appendChild(document.createElement("ul"));
        const rellinks = container.lastElementChild;
        if (context.rellinks) {
            context.rellinks.forEach(function(l, i) {
                if (i) {
                    rellinks.appendChild(document.createTextNode(" |"))
                }
                let a = document.createElement("a");
                a.accessKey = l.accessKey;
                a.href = l.href;
                a.title = l.title;
                a.textContent = l.textContent;
                let li = document.createElement("li");
                li.classList.add("right");
                li.appendChild(a);
                rellinks.appendChild(li);
            });
        }
        rellinks.appendChild(rootrellink(context));
        const li = content` <li class="nav-item nav-item-this"><a></a></li>`
        const a = li.querySelector("a")
        a.href = '#';
        a.textContent = context.title;
        rellinks.appendChild(li);
        return container;
    }
})();

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

export class Relbar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        if (this.childElementCount) return;
        this.appendChild(relbar());
    }
}

export class Sidebar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
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

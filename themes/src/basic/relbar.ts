import { Sphinx } from "../sphinx";
import { content } from "../util"

let relbar: HTMLElement | undefined;
let rootlink: HTMLElement | undefined;

export function create_relbar(): CustomElementConstructor {
    class Relbar extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            if (this.childElementCount) return;
            this.appendChild(this.relbar);
        }

        get relbar() {
            if (!relbar) {
                relbar = this.create_relbar()
            }
            return relbar.cloneNode(true);
        }
        create_relbar() {
            const context = Sphinx.context();
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
            rellinks.appendChild(this.rootrellink(context));
            const li = content` <li class="nav-item nav-item-this"><a></a></li>`
            const a = li.querySelector("a")
            a.href = "";
            a.textContent = context.title;
            rellinks.appendChild(li);
            return container;
        }
        rootrellink(ctx: any) {
            if (!rootlink) {
                rootlink = this.create_rootrelllink(ctx);
            }
            return rootlink;
        }
        create_rootrelllink(ctx: any) {
            const a = document.createElement("a");
            a.textContent = ctx.shorttitle;
            a.href = ctx.master_href;
            const li = document.createElement("li");
            li.className = "nav-item nav-item-0";
            li.appendChild(a);
            return li;
        }
    }
    return Relbar;
}

import { Sphinx } from "../sphinx";

export function create_sidebar_relations() {
    class Relations extends HTMLElement {
        connectedCallback() {
            if (this.children.length > 0) {
                return;
            }
            const context = Sphinx.context();
            this.create_link('Previous topic', 'previous chapter', context.prev);
            this.create_link('Next topic', 'next chapter', context.next);
        }

        create_link(heading: string, title: string, link_data: any) {
            if (!link_data) {
                return;
            }
            const h = document.createElement('h4');
            h.textContent = heading;
            this.appendChild(h);
            const p = document.createElement('p');
            p.classList.add('topless');
            const a = document.createElement('a');
            p.appendChild(a);
            a.title = title;
            a.innerHTML = link_data.title;
            a.href = link_data.link;
            this.appendChild(p);
        }
    }
    return Relations;
}

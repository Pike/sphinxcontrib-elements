import {SidebarOptions} from "./types"

export function create_sidebar(opts: SidebarOptions): CustomElementConstructor {
    class Sidebar extends HTMLElement {
        constructor() {
            super()
        }
        connectedCallback() {
            for (const sidebar of opts.sidebars) {
                this.appendChild(document.createElement(`sphinx-sidebar-${sidebar}`));
            }
        }

    }
    return Sidebar;
}

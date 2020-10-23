import {SidebarOptions} from "./types"

export function create_sidebar(opts: Partial<SidebarOptions>): CustomElementConstructor {
    class Sidebar extends HTMLElement {
        constructor() {
            super()
        }
    }
    return Sidebar;
}

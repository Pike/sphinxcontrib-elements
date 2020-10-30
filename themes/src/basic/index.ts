import * as types from "./types"
import { create_footer } from "./footer"
import { create_document } from "./document"
import { create_relbar } from "./relbar"
import { create_sidebar } from "./sidebar"
import { create_sidebar_localtoc } from "./sidebar-localtoc"


export class Elements {
    elements: Map<string, CustomElementConstructor> = new Map()
    setup(opts: types.Options) {
        this.create_elements(opts)
        this.register()
    }
    register() {
        this.elements.forEach(function(impl, name) {
            customElements.define(`sphinx-${name}`, impl)
        });
    }
    create_footer() {
        this.elements.set("footer", create_footer())
    }
    create_document() {
        this.elements.set("document", create_document())
    }
    create_relbar() {
        this.elements.set("relbar", create_relbar())
    }
    create_sidebar(opts:  types.SidebarOptions) {
        this.elements.set("sidebar", create_sidebar(opts))
    }
    create_sidebar_localtoc() {
        this.elements.set("sidebar-localtoc", create_sidebar_localtoc())
    }
    create_elements(opts: types.Options) {
        this.create_footer()
        this.create_document()
        this.create_relbar()
        if (!opts.nosidebar && opts.sidebars.length >= 0) {
            this.create_sidebar(opts)
            this.create_sidebar_localtoc()
        }
    }
}

export function setup(opts: Partial<types.Options> = {}):  Elements {
    let real_opts: types.Options = Object.create(types.OPTIONS_DEFAULTS)
    Object.assign(real_opts, opts)
    const elements = new Elements()
    elements.setup(real_opts)
    return elements
}

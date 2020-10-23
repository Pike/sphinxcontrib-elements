import * as types from "./types"
import {Elements as BasicElements} from "../basic"
import { create_footer } from "./footer"


export class Elements extends BasicElements {
    create_footer() {
        this.elements.set("footer", create_footer());
    }
}


export function setup(opts: Partial<types.Options> = {}):  Elements {
    let real_opts: types.Options = Object.create(types.OPTIONS_DEFAULTS)
    Object.assign(real_opts, opts)
    const elements = new Elements()
    elements.setup(real_opts)
    return elements
}

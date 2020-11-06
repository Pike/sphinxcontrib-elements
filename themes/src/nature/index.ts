import * as types from "./types"
import {Elements as BasicElements} from "../basic"


export class Elements extends BasicElements {
}


export function setup(opts: Partial<types.Options> = {}):  Elements {
    let real_opts: types.Options = Object.create(types.OPTIONS_DEFAULTS)
    Object.assign(real_opts, opts)
    const elements = new Elements()
    elements.setup(real_opts)
    return elements
}

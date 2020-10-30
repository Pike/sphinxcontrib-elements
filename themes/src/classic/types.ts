import {Options as BasicOptions, OPTIONS_DEFAULTS as BASIC_DEFAULTS} from "../basic/types"

export interface Options extends BasicOptions {}

export let OPTIONS_DEFAULTS = Object.create(BASIC_DEFAULTS)

OPTIONS_DEFAULTS.sidebars = ["localtoc"]

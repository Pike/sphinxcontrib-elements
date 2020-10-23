export interface SidebarOptions {
    sidebars: string[]
    nosidebar: boolean
}

export interface DocumentOptions {
    navigation_with_keys: boolean
    globaltoc_collapse: boolean
    globaltoc_includehidden: boolean
    globaltoc_maxdepth: number | undefined
}


export const OPTIONS_DEFAULTS: Options = {
    sidebars: [],
    nosidebar: false,
    navigation_with_keys: false,
    globaltoc_collapse: true,
    globaltoc_includehidden: false,
    globaltoc_maxdepth: undefined,
}

export type Options = SidebarOptions & DocumentOptions

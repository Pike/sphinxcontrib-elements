import { SphinxData } from "./types";

let ctx: any;

export const Sphinx: SphinxData = {
    context: function() {
        if (!ctx) {
            const global_ctx = JSON.parse(
                document.getElementById("global-ctx").textContent
            );
            const local_ctx = JSON.parse(
                document.getElementById("local-ctx").textContent
            );
            Object.setPrototypeOf(local_ctx, global_ctx);
            ctx = local_ctx;
        }
        return ctx;
    }
}

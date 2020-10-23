import { create_footer as create_basic_footer } from "../basic/footer";

export function create_footer() {
    const BaseFooter = create_basic_footer();
    class Footer extends BaseFooter {
        connectedCallback() {
            if (this.childElementCount) return;
            super.connectedCallback();
            this.classList.add("classic");
        }
    }
    return  Footer;
}

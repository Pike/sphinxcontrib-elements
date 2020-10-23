export function content(html_content: TemplateStringsArray) {
    const template = document.createElement('template');
    template.innerHTML = html_content[0];
    return template.content;
}

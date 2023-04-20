export function copyText(id: string | undefined, text: string, cb?: Function): void {
    const textString = text.toString();
    let input: undefined | HTMLTextAreaElement;
    if (id) {
        input = document.querySelector(id) as HTMLTextAreaElement;
    }
    if (!input) {
        (document.activeElement as any).blur();
        input = document.createElement('textarea');
        input.id = "copy-input";
        input.readOnly = true;
        input.style.position = "absolute";
        input.style.left = "-1000px";
        input.style.zIndex = "-1000";
    }
    document.body.appendChild(input);
    input.value = textString;
    input.select();
    setTimeout(() => {
        input && document.body.removeChild(input);
    }, 200)

    if (document.execCommand('copy')) {
        document.execCommand('copy');
        cb && cb();
    }
}

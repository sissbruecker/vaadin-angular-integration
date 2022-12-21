export async function aFrame() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

export function enter(element: HTMLElement) {
  const keyDown: any = new CustomEvent('keydown', {
    detail: 0,
    bubbles: true,
    cancelable: true,
    composed: true,
  });
  keyDown.keyCode = 13;
  keyDown.code = 13;
  keyDown.key = 'Enter';
  element.dispatchEvent(keyDown);

  const keyUp: any = new CustomEvent('keyup', {
    detail: 0,
    bubbles: true,
    cancelable: true,
    composed: true,
  });
  keyUp.keyCode = 13;
  keyUp.code = 13;
  keyUp.key = 'Enter';
  element.dispatchEvent(keyUp);
}

export function write(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new CustomEvent('input'));
}

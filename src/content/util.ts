import papa from 'papaparse';

export async function wait(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export async function waitElementToLoad(
  selector: string,
  delay = 100,
  context: Element | Document = document,
  checkLimit = 50
): Promise<Element | boolean> {
  const el = context.querySelector(selector);
  if (el) return new Promise((res) => res(el));
  return new Promise((resolve) => {
    let interval: any;
    // eslint-disable-next-line prefer-const
    interval = setInterval(() => {
      console.log('waiting for element');
      const el = context.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }
      if (checkLimit === 0) {
        clearInterval(interval);
        resolve(false);
      }
      checkLimit--;
    }, delay);
  });
}

export function click(el: string | Element): boolean {
  if (el instanceof Element) {
    (el as HTMLElement).click();
    return true;
  } else {
    if (document.querySelector(el)) {
      (document.querySelector(el) as HTMLElement).click();
      return true;
    } else return false;
  }
}

export async function readTextFromHTMLFile(
  file: File,
  encoding: string | undefined = undefined
): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsText(file, encoding);
    console.log(reader);
    // @ts-ignore
    reader.onload = () => {
      res(reader.result as string);
    };
    // @ts-ignore
    reader.onerror = () => {
      rej('Error while Reading File');
    };
  });
}

export async function parseCSV(
  file: File,
  encoding: string | undefined = undefined
): Promise<{ [p: string]: string }[]> {
  const csvText = await readTextFromHTMLFile(file, encoding);
  return new Promise((res, rej) => {
    // @ts-ignore
    papa.parse(csvText, {
      complete: (result: string[]) => {
        // @ts-ignore
        const data: string[][] = result.data;
        const head: string[] = data.shift() as string[];
        const out = [];
        for (const datum of data) {
          const o: { [p: string]: string } = {};
          for (let i = 0; i < head.length; i++) {
            o[head[i]] = datum[i];
          }
          out.push(o);
        }
        res(out);
      },
      // @ts-ignore
      error: () => {
        rej('error');
      },
    });
  });
}

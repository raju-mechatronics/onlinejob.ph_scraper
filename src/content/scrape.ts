import { getState } from './exporter';
import $ from 'jquery';
import { JobType } from '../dataTypes';
import { wait } from './util';
import { Storage } from '../redefination';

function stringBeautify(str: string) {
  str = str.replace(/\n|\t|[ ]{2,}/gi, '');
  str = str.trim();
  return str;
}

async function scrapeData(element: HTMLElement): Promise<JobType> {
  element.scrollIntoView();
  element.style.border = '3px solid blue';
  const title = $(element).find('[title]').html().split('<span')[0].trim();
  const [writer, date] = $(element).find('a > p.fs-13.mb-0[data-temp]').text().split('•');
  const rate = $(element).find('dd.col').text();
  const jobURL = $(element).find('a').attr('href');
  let description: string;
  try {
    const res = await fetch(jobURL as string);
    const resText = await res.text();
    description = $(resText).find('#job-description').text();
    element.style.border = '3px solid green';
  } catch (e) {
    element.style.border = '3px solid red';
    description = '';
  }
  return {
    date: stringBeautify(date),
    description: stringBeautify(description),
    rate: stringBeautify(rate),
    title: stringBeautify(title),
    writer: stringBeautify(writer),
    url: stringBeautify(jobURL ? jobURL : ''),
  };
}

export async function scrape() {
  const state = await getState();
  if (state.running) {
    const nextBtn = document.querySelector('[rel="next"]');
    const jobPosts = $('.jobpost-cat-box');
    const jobArr: JobType[] = [];
    const promises: Promise<JobType>[] = [];
    for (let i = 0; i < jobPosts.length; i++) {
      const element = jobPosts[i];
      promises.push(scrapeData(element));
      await wait(3000);
    }
    console.log(promises);
    const results = await Promise.all(promises);
    console.log(results);
    state['currentStack'] = [...state['currentStack'], ...results];
    const newState = { ...state };
    console.log(newState);
    await Storage.set({ state: newState });
    if (nextBtn) {
      // @ts-ignore
      nextBtn?.click();
    } else {
      const id = Date.now();
      await Storage.set({ [id]: state.currentStack });
      state.running = false;
      state.tabId = undefined;
      state.currentStack = [];
      await Storage.set({ state });
    }
  }
}

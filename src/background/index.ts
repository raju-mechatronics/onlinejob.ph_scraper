import { Storage } from '../redefination';

console.log('background');

// @ts-ignore
chrome.runtime.onMessage.addListener((mes, sender, res) => {
  if (mes === 'getId') {
    const tabId = sender.tab?.id;
    // @ts-ignore
    res(tabId);
  }
});

chrome.tabs.onRemoved.addListener(async (tabid) => {
  const { state } = await Storage.get('state');
  if (state && state.tabId === tabid && state.running) {
    Storage.remove('state');
  }
});

chrome.runtime.onStartup.addListener(() => {
  Storage.remove('state');
});

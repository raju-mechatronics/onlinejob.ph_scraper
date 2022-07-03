export const Storage = chrome.storage.local;
export const Cookies = chrome.cookies;

export const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
};

export async function sendMessageToTab(data: any, tabId: number | undefined = undefined) {
  if (tabId == undefined) {
    const tab = await getActiveTab();
    tabId = tab.id;
  }
  if (tabId) return await chrome.tabs.sendMessage(tabId, data);
}

export async function sendMessage(data: any) {
  return await chrome.runtime.sendMessage(data);
}

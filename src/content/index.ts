import { click, wait, waitElementToLoad } from './util';
import { Storage } from '../redefination';
import { done, getState } from '../services/StateManager';
import { StateType } from '../data/DataType';
import { messageParser } from '../services/MessageManager';

// @ts-ignore
chrome.runtime.onMessage.addListener((message) => {
  if (message === 'run') {
    run();
  }
});

function findMessageButton() {
  const btn = document.querySelectorAll(
    '.pvs-profile-actions .pvs-profile-actions__action, .pvs-compose-option-action__dropdown-item'
  );
  for (let i = 0; i < btn.length; i++) {
    const btnElement = btn[i];
    if (btnElement?.textContent?.match(/message/gi)) {
      return btnElement;
    }
  }
  return null;
}

function sendBtnClick() {
  click("[type='submit']");
}

async function setTitle(title: any) {
  const el = (await waitElementToLoad("[name='subject']")) as HTMLInputElement;
  el.value = title;
}

async function setBody(body: any) {
  const el = (await waitElementToLoad('.msg-form__contenteditable')) as HTMLInputElement;
  el.innerHTML = `<p>${body}<p>`;
}

async function openMessageDialog() {
  const btn = (await waitElementToLoad('div.entry-point > a')) as HTMLElement;
  console.log(btn);
  await wait(1000);
  console.log(btn);
  btn.click();
}

const color = {
  start: 'cornflowerblue',
  stop: 'crimson',
};

const statusBar = document.createElement('div');
const el = `
  <div style="
    position: fixed;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    z-index: 99999;
    bottom: 30px;
    left: 30px;
    width: 600px;
    background-color: rgba(0,0,0,.7);
    padding: 10px 20px 10px 20px;
    color: honeydew;
    border-radius: 10px;
">
    <div class="dragger">...</div>
    <button class="running artdeco-button--light" id="#runBtn"  style="
    background: cornflowerblue;
    border: blueviolet;
    padding: 8px;
    cursor: pointer;">Start</button>
    <div class="campaign-name">Campaign name</div>
    <div class="profile-name">Profile Name</div>
    <div class="connected">100</div>
    <div class="imported">50</div>
    <div class="total">150</div>
</div>
`;

statusBar.innerHTML = el;

// @ts-ignore
async function run() {
  const { state } = (await Storage.get('state')) as { state: StateType };
  console.log(state);
  if (state.running) {
    document.body.append(statusBar);
    const stateData = await getState();
    console.log(stateData);
    if (stateData) {
      const profile = stateData.profile;
      const message = stateData.message;
      debugger;
      if (!state.profileLoaded) {
        location.href = profile.profile_link;
        await Storage.set({ state: { ...state, profileLoaded: true } });
        return;
      } else {
        const msgOpener = await findMessageButton();
        if (!msgOpener) {
          await wait(1000);
          alert('failed');
          await done({ imported: true, connected: false });
          return run();
        }
        // @ts-ignore
        msgOpener.click();
        if (message.subject) await setTitle(messageParser(message.subject, profile));
        await setBody(messageParser(message.body, profile));
        await wait(500);
        // sendBtnClick();
        alert('sent');
        await wait(500);
        await done({ connected: true, imported: false });
        return run();
      }
    }
  }
}

wait(1000).then((e) => run());

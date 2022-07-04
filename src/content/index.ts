import { scrape } from './scrape';
import { getId, getState } from './exporter';

async function initiator() {
  const id = await getId();
  const state = await getState();
  if (state.running && state.tabId == id) scrape();
}

initiator();

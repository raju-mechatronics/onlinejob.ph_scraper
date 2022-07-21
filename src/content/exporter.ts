import { ITotalJob, JobType, StateType } from '../dataTypes';
import { sendMessage, Storage } from '../redefination';
import { JsonType } from '../types/utilType';
import papa from 'papaparse';
import { scrape } from './scrape';

export async function getId(): Promise<number> {
  const id = await sendMessage('getId');
  return id as number;
}

export async function getState(): Promise<StateType> {
  const id = await getId();
  const { state } = (await Storage.get('state')) as { state?: StateType };
  if (state) {
    return state;
  } else {
    const newState: StateType = {
      tabId: id,
      currentStack: [],
      running: false,
    };
    await Storage.set({ state: newState });
    return newState;
  }
}

export async function getAllJobGroup() {
  const jobGroups: ITotalJob[] = [];
  //@ts-ignore
  const jobsObj: JsonType = await Storage.get(null);
  for (const jobGroup in jobsObj) {
    if (jobGroup === 'state') {
      continue;
    }
    const jobs = jobsObj[jobGroup] as JobType[];
    jobGroups.push({ id: jobGroup, jobs: jobs });
  }
  return jobGroups;
}

export async function getGroup(id: string): Promise<ITotalJob> {
  const groupObj = await Storage.get(id);
  const jobGroup = groupObj[id] as JobType[];
  const group: ITotalJob = { id: id, jobs: jobGroup };
  return group;
}

const mapJob = (job: JobType): string =>
  `${job.title}\t${job.writer}\t${job.rate}\t${job.date}\t${job.description}\t${job.url}`;

export async function copyGroup(id: string) {
  const groupObj = await Storage.get(id);
  const jobGroup = groupObj[id] as JobType[];
  const copyText = jobGroup.map((job) => mapJob(job)).join('\n');
  await navigator.clipboard.writeText(copyText);
}

export async function exportCSV(id: string) {
  const jobs = await Storage.get(id);
  const csv = papa.unparse(jobs[id], {
    columns: ['title', 'writer', 'rate', 'date', 'description', 'url'],
  });
  const blob = new Blob([csv]);
  const a = document.createElement('a');
  // @ts-ignore
  a.href = URL.createObjectURL(blob, { type: 'text/plain' });
  a.download = 'export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function deleteGroup(id: string) {
  Storage.remove(id);
}

export async function stopRunner() {
  const state = await getState();
  const id = Date.now();
  Storage.set({ [id]: state.currentStack });
  state.running = false;
  state.tabId = undefined;
  state.currentStack = [];
  Storage.set({ state });
}

export async function startRunner() {
  const state = await getState();
  state.running = true;
  const id = await getId();
  state.tabId = id;
  await Storage.set({ state: { ...state } });
  scrape();
}

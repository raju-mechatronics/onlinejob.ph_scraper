export interface ITotalJob{
    id: string;
    jobs: JobType[];
}

export type JobType = {
    title: string;
    date: string;
    writer: string;
    rate: string;
    description: string;
    url: string;
}

export type StateType = {
    currentStack: JobType[];
    running: boolean;
    tabId?: number;
}
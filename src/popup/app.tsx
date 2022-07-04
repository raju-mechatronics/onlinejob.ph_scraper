import React, { FunctionComponent, useEffect, useState } from 'react';
import './index.css';
import { ITotalJob, StateType } from '../dataTypes';
import {
  copyGroup,
  deleteGroup,
  exportCSV,
  getAllJobGroup,
  getId,
  getState,
  startRunner,
  stopRunner,
} from '../content/exporter';
import { Storage } from '../redefination';

const App: FunctionComponent = () => {
  const [hidden, setHidden] = useState(true);
  const [groups, setGroups] = useState<ITotalJob[]>([]);
  const [state, setState] = useState<StateType | null>(null);
  const [id, setId] = useState<number | null>(null);

  console.log(groups, state, id);

  useEffect(() => {
    const getig = () => {
      getAllJobGroup().then((g) => setGroups(g));
      getState().then((s) => setState(s));
      getId().then((e) => {
        setId(e);
      });
    };
    getig();
    Storage.onChanged.addListener(getig);
    return () => Storage.onChanged.removeListener(getig);
  }, []);

  console.log(id, state);

  return (
    <div className="absolute">
      <div id="dataViewer" className="overflow-hidden" hidden={hidden}>
        <div className="overflow-x-auto w-full h-full flex-col justify-between">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>index</th>
                <th>Created At</th>
                <th>Total Jobs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={group.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(Number(group.id)).toLocaleString()}</td>
                  <td>{group.jobs.length}</td>
                  <td>
                    <button
                      className="btn btn-xs px-3 btn-info"
                      onClick={() => copyGroup(group.id)}
                    >
                      Copy
                    </button>
                    <button
                      className="btn btn-xs px-3 btn-warn"
                      onClick={() => exportCSV(group.id)}
                    >
                      export
                    </button>
                    <button
                      className="btn btn-xs px-3 btn-error"
                      onClick={() => deleteGroup(group.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-sm btn-error self-end" onClick={(e) => setHidden(true)}>
          Close
        </button>
      </div>

      {(state?.running && id == state?.tabId) || !state?.running ? (
        <div id="buttonViewer">
          <button
            className={'btn btn-sm' + (state?.running ? ' btn-error' : ' btn-success')}
            onClick={() => {
              if (state && state.running) {
                stopRunner();
              } else {
                startRunner();
              }
            }}
          >
            {state?.running ? 'stop' : 'start'}
          </button>
          <button className="btn btn-sm btn-info" onClick={(e) => setHidden(!hidden)}>
            export
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default App;

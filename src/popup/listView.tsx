import React from 'react';

function ListView() {
  return (
    <div>
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Congratulations random Internet user!</h3>
          <p className="py-4"></p>
          <div className="modal-action">
            <label htmlFor="my-modal-5" className="btn">
              close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListView;

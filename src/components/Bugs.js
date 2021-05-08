import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBugs, resolveBug, selectUnresolvedBugs } from '../store/bugs';

const Bugs = () => {
  const dispatch = useDispatch();
  // const bugs = useSelector((state) => state.entities.bugs.list);
  const bugs = useSelector(selectUnresolvedBugs);

  useEffect(() => {
    dispatch(loadBugs());
  }, []);

  return (
    <>
      <h1>Bugs Apps</h1>
      <p>Track all your Bugs in real time.</p>
      <ul>
        {bugs.map((bug) => (
          <li key={bug.id}>
            {bug.description}
            <button onClick={() => dispatch(resolveBug(bug.id))}>remove</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Bugs;

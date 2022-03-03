import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { wrapper } from '../redux/store';
import axios from 'axios';

import { getPosts } from '../redux/reducers/fetchReducer';

export default function Home() {
  const globalState = useSelector((state) => state.posts.list);

  return (
    <section>
      {globalState.map((item) => (
        <>
          <p>{item.title}</p>
        </>
      ))}
    </section>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res }) => {
      await store.dispatch(getPosts());
    }
);

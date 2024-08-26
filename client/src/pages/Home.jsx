import React, { useEffect } from 'react';

import Loader from '../components/common/Loader';
import CenterSide from '../components/CenterSide';
import { useForum } from '../utils/PostContext';

import HomeWrapper from '../components/common/HomeWrapper';

const Home = () => {
  const { loading, handleFetchPosts } = useForum();

  useEffect(() => {
    handleFetchPosts();
  }, []);

  return <HomeWrapper children={<CenterSide />} />;
};

export default Home;

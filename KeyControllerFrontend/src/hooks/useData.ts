import { DataContext } from '@/context/DataContext';
import { useContext } from 'react';

export const useData = () => {
  const context = useContext(DataContext);
  return context;
};

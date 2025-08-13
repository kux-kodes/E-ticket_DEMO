import { createContext, useContext, useState, useEffect } from 'react';
import { getFines, getFineById, payFine, submitDispute } from '../services/fines';

export const FineContext = createContext();

export const FineProvider = ({ children }) => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFines = async () => {
    setLoading(true);
    setError(null);
    try {
      const finesData = await getFines();
      setFines(finesData);
    } catch (err) {
      setError(err.message || 'Failed to load fines');
    } finally {
      setLoading(false);
    }
  };

  const getFine = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const fine = await getFineById(id);
      return fine;
    } catch (err) {
      setError(err.message || 'Failed to load fine details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const pay = async (id, paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFine = await payFine(id, paymentData);
      setFines(fines.map(f => f.id === id ? updatedFine : f));
      return updatedFine;
    } catch (err) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const dispute = async (id, disputeData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFine = await submitDispute(id, disputeData);
      setFines(fines.map(f => f.id === id ? updatedFine : f));
      return updatedFine;
    } catch (err) {
      setError(err.message || 'Failed to submit dispute');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  return (
    <FineContext.Provider value={{ 
      fines, 
      loading, 
      error, 
      getFineById: getFine,
      payFine: pay,
      submitDispute: dispute,
      refreshFines: fetchFines
    }}>
      {children}
    </FineContext.Provider>
  );
};

export const useFines = () => useContext(FineContext);
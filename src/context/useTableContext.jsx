import { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  return (
    <TableContext.Provider value={{ data, setData }}>
      {children}
    </TableContext.Provider>
  );
};

// Export the custom hook
export const useDataContext = () => useContext(TableContext);

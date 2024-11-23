
export const getFormattedDate = () => {
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString('pt-BR', options);
};

export const getColumnsProdutoTotal = () => {
    const currentYear = new Date().getFullYear();
    
    // Base columns that are always present
    const baseColumns = [
      {
        key: 'product_name',
        title: 'Produto',
        dataIndex: 'product_name',
        fixed: 'left',
        className: 'fixed-column',
        sorter: (a, b) => a.product_name.localeCompare(b.product_name),
      },
    ];
  
    // Generate columns for each year from 2018 up to the current year
    const yearColumns = Array.from(
      { length: currentYear - 2018 + 1 }, // Determine the number of years
      (_, i) => {
        const year = 2018 + i; // Calculate the actual year
        return {
          key: `${year}`,
          title: `${year}`,
          dataIndex: `${year}`,
          sorter: (a, b) => a[year] - b[year],
        };
      }
    );
  
    // Combine the base columns with the dynamically generated year columns
    return [...baseColumns, ...yearColumns];
  };
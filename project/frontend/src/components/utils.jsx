
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

//Compare dates on the visitas table
export function compareDates(date1, date2) {
    // Parse the dates
    const [day1, month1, year1] = date1.split('-').map(Number);
    const [day2, month2, year2] = date2.split('-').map(Number);
    
    const d1 = new Date(year1, month1 - 1, day1); // JavaScript months are 0-indexed
    const d2 = new Date(year2, month2 - 1, day2);
    
    // Compare the dates
    if (d1 < d2) {
        return -1;
    } else if (d1 > d2) {
        return 1;
    } else {
        return 0;
    }
}
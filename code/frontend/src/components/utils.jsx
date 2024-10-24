
export const getFormattedDate = () => {
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString('pt-BR', options);
};
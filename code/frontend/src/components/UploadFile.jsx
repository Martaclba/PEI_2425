import { message } from 'antd';
import useSalesDataStore from '../context/SalesData';

// Upload a Excel file
const UploadFileProps = (path, setFetchTrigger) => ({    
    listType: 'picture',
    showUploadList: false, 

    // Only accepts Excel files
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // Post to the backend URL
    action: process.env.REACT_APP_API_PATH + '/import' + path,
    
    // Handling the change event to monitor upload progress and success/failure
    // States: 'done', 'error', 'uploading' and 'removed'
    onChange: (info) => {
        const { status } = info.file;

        if (status === 'done') {
            message.success("Ficheiro importado com sucesso");
            console.log(`"${info.file.name}" uploaded successfully.`);

            // Check if setFetchTrigger is a single trigger or an object trigger
            if (setFetchTrigger) {
                setFetchTrigger(Date.now());
            } else if (setFetchTrigger === null) {
                // Update all triggers in the Zustand store
                const { updateFetchTriggers } = useSalesDataStore.getState();
                updateFetchTriggers();
            }
        } else if (status === 'error') {
            message.error("Oops! Ocorreu algum erro durante o upload...");
            console.log(`"${info.file.name}" upload failed.`);
        }else if (status === 'removed') {
            message.info("Ficheiro removido");
            console.log(`"${info.file.name}" file was removed.`);
        }
    },
})

export default UploadFileProps;
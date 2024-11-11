import { message } from 'antd';

// Upload a Excel file
const UploadFileProps = (path, setFetchTrigger) => ({    
    listType: 'picture',

    // Only accepts Excel files
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // Set the backend URL
    action: process.env.REACT_APP_API_PATH  + path,

    // Handling the change event to monitor upload progress and success/failure
    // States: 'done', 'error', 'uploading' and 'removed'
    onChange: (info) => {
        const { status } = info.file;

        if (status === 'done') {
            message.success("Ficheiro importado com sucesso");
            console.log(`"${info.file.name}" uploaded successfully.`);
            setFetchTrigger(Date.now())            
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
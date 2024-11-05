import { message } from 'antd';

// Upload a Excel file
const UploadFileProps = {
    listType: 'picture',

    // Only accepts Excel files
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // Set the backend URL
    action: 'http://localhost:5000/',

    // Handling the change event to monitor upload progress and success/failure
    // States: 'done', 'error', 'uploading' and 'removed'
    onChange: async (info) => {
        const { status } = info.file;

        if (status === 'done') {
            message.success(`"${info.file.name}" importado com sucesso`);
            console.log(`"${info.file.name}" uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`"${info.file.name}" Oops! Ocorreu algum erro durante o upload...`);
            console.log(`"${info.file.name}" upload failed.`);
        }else if (status === 'removed') {
            message.info(`"${info.file.name}" foi removido`);
            console.log(`"${info.file.name}" file was removed.`);
        }
    },
}

export default UploadFileProps;
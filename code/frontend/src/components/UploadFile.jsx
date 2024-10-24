import { message, Upload } from 'antd';

// Upload a Excel file
export const UploadFileProps = (onSuccess = null, onError = null) => ({
    listType: 'picture',
    
    beforeUpload: (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // Check if the file is an Excel file
    if (!isExcel) {
        message.error(`"${file.name}" não é um ficheiro Excel`);
        return Upload.LIST_IGNORE;
    }
    else {
        message.success(`"${file.name}" importado com sucesso`);
    }
    },

    // Handling the change event to monitor upload progress and success/failure
    onChange: (info) => {
    const { status } = info.file;
    if (status === 'done') {
        console.log(`${info.file.name} file uploaded successfully.`);
        if (onSuccess) onSuccess(info);
    } else if (status === 'error') {
        console.log(`${info.file.name} file upload failed.`);
        if (onError) onError(info);
    }
    },
})

export default UploadFileProps;
import { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import './styles/ConfigWizard.css';


export default function ConfigWizard(props) {
    const {dataSchema, UISchema, setFunction, exitFunction, id, defaultData} = props;
    // console.log(dataSchema);
    return (
        <Dialog open onClose={()=>{exitFunction()}}>
            <Form schema={dataSchema} uiSchema={UISchema} validator={validator} onSubmit={(e) => {setFunction(id, e.formData);}} className='cwl-config-wizard-padding' formData={defaultData}/>
        </Dialog>
    );
}
import React from 'react'
import { Checkbox } from 'semantic-ui-react'

// interface IProps {
//     label: string
//     checked: boolean
//     action: () => void;
// }




const CheckBox = ({ label, checked, action }: any) => (
    <Checkbox label={label} checked={checked} onClick={action} />
)

export default CheckBox
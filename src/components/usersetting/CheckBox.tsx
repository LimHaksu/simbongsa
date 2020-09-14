import React from 'react'
import { Checkbox } from 'semantic-ui-react'

const CheckBox = ({ label, checked, action }: any) => (
    <Checkbox label={label} checked={checked} onClick={action} />
)

export default CheckBox
import React from 'react';
import { Header } from '@fluentui/react-northstar'

const HeaderComponent = (props) => {
    
    return (
        <Header content='Business Process Automation Accelerator' className="header" style={{fontSize:"20px"}}/>
        // <div className="header" style={{fontFamily: props.theme.siteVariables.bodyFontFamily,  backgroundColor: props.theme.siteVariables.colorScheme.brand.background, color : props.theme.siteVariables.colorScheme.brand.foreground, fontSize: props.theme.siteVariables.fontSizes.larger}}>
        //     Business Process Automation Accelerator
        // </div>
    )
}

export default HeaderComponent
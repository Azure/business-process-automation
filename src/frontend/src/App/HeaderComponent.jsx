import React from 'react';
import { Text } from '@fluentui/react-northstar'

const HeaderComponent = (props) => {
    
    return (
        <div style={{backgroundColor: "rgb(0, 120, 212)", color: "white", padding: "10px" }}>
            <Text size="large" content="Business Process Automation Accelerator" />
            {/* <Header content='Business Process Automation Accelerator' className="header" style={{ fontSize: "20px", color: "white", backgroundColor: "rgb(0, 120, 212)" }} /> */}
            </div>
        // <div className="header" style={{fontFamily: props.theme.siteVariables.bodyFontFamily,  backgroundColor: props.theme.siteVariables.colorScheme.brand.background, color : props.theme.siteVariables.colorScheme.brand.foreground, fontSize: props.theme.siteVariables.fontSizes.larger}}>
        //     Business Process Automation Accelerator
        // </div>
    )
}

export default HeaderComponent
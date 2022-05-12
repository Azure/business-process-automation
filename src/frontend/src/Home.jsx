import { Text, Button } from '@fluentui/react-northstar';

export default function Home(props){

    return(
        <div style={{ paddingLeft: "0px", paddingTop: "50px" }}>
            <Text weight="semibold" style={{ fontSize: "25px", display: "block", marginBottom: "20px" }}>Welcome to the Business Process Automation Accelerator</Text>
            <Text style={{ display: "block", marginBottom: "40px" }}>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

            </Text>
            <Text weight="semibold" style={{ fontSize: "18px", display: "block", marginBottom: "20px" }}>What would you like to do?</Text>
            {/* <div style={{display:"flex", paddingTop : "50px"}}> */}
                <Button id="CONFIGURE_PIPELINE" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)", paddingLeft: "0px"}} content="Configure A New Pipeline"/>
                |
                <Button id="CURRENT_PIPELINE" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)"}} content="View The Existing Pipeline "/>
                |
                <Button id="UPLOAD_DOCUMENTS" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)"}} content="Ingest Documents"/>
                |
                <Button id="VIEW_INSIGHTS" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)"}} content="View Insights"/>
            {/* </div> */}
        </div>
        
    )
}
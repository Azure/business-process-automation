import { Text, Button } from '@fluentui/react-northstar';

export default function Home(props){

    return(
        <div style={{ paddingLeft: "0px", paddingTop: "50px" }}>
            <Text weight="semibold" style={{ fontSize: "25px", display: "block", marginBottom: "40px" }}>Welcome to the Business Process Automation Accelerator</Text>
            <Text weight="semibold" style={{ fontSize: "18px", display: "block", marginBottom: "20px" }}>What would you like to do?</Text>
            {/* <div style={{display:"flex", paddingTop : "50px"}}> */}
                <Button id="CONFIGURE_PIPELINE" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)"}} content="Configure A New Pipeline"/>
                |
                <Button id="CURRENT_PIPELINE" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)"}} content="View The Existing Pipeline "/>
                |
                <Button id="UPLOAD_DOCUMENTS" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)"}} content="Ingest Documents"/>
                |
                <Button id="insights" onClick={(e)=>props.onClick(e)} text style={{color: "rgb(0, 120, 212)"}} content="View Insights"/>
            {/* </div> */}
        </div>
        
    )
}
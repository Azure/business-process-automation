import { Label } from '@fluentui/react-northstar';

export default function Home(props){

    // const labelStyle = {fontFamily:props.theme.siteVariables.bodyFontFamily, fontSize:props.theme.siteVariables.fontSizes.larger, color:props.theme.siteVariables.colorScheme.brand.foreground, paddingRight: "20px"}
    // const labelStyleSeparator = {fontFamily:props.theme.siteVariables.bodyFontFamily, fontSize:props.theme.siteVariables.fontSizes.larger, color:props.theme.siteVariables.colorScheme.brand.foreground, paddingRight: "20px"}

    return(
        <div style={{paddingLeft : "0px", paddingTop : "100px"}}>
            <Label style={{fontSize:"25px", color : "black", fontWeight:"bold"}}>What would you like to do?</Label>
            <div style={{display:"flex", paddingTop : "50px"}}>
                <Label id="CONFIGURE_PIPELINE" onClick={(e)=>props.onClick(e)} >Configure A New Pipeline</Label>
                <Label >|</Label>
                <Label id="CURRENT_PIPELINE" onClick={(e)=>props.onClick(e)} >View The Existing Pipeline</Label>
                <Label >|</Label>
                <Label id="UPLOAD_DOCUMENTS" onClick={(e)=>props.onClick(e)} >Ingest Documents</Label>
                <Label >|</Label>
                <Label id="insights" onClick={(e)=>props.onClick(e)} >View Insights</Label>
            </div>
        </div>
        
    )
}
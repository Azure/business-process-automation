import { Text, Button } from '@fluentui/react-northstar';

export default function Home(props) {

    return (
        <div style={{ paddingLeft: "0px", paddingTop: "50px" }}>
            <Text weight="semibold" style={{ fontSize: "25px", display: "block", marginBottom: "20px" }}>Welcome to the Business Process Automation Accelerator</Text>
            <Text style={{ display: "block", marginBottom: "10px" }}>
                Build multi-stage AI/ML pipelines across Azure AI and ML Services using pretrained, or your own custom/open source models in our Cognitive Services Studio (<span><a href="https://github.com/Azure/business-process-automation">Learn More</a></span>). Create a new pipeline by selecting “Configure a New Pipeline” below. After the input file type is selected, new Services will appear within your pipeline builder from (Azure Language, Form Recognizer, Speech, etc..), based on the file type (e.g. audio files). As files are transformed or converted, from images or audio to text, new Services will become available to be added to the pipeline builder. For example, Language Services options for data that has been transformed to text.
            </Text>
            <Text style={{ display: "block", marginBottom: "10px" }}>
                As you start to build longer pipelines, with multiple transformations, you can optionally continue building the pipeline against data in an earlier stage within the pipeline, with the “Change Output” card.
            </Text>
            <Text style={{ display: "block", marginBottom: "40px" }}>
                Once the pipeline is built, a cost estimate can be generated. And the pipeline can will be triggered once documents are uploaded.
            </Text>


            <Text weight="semibold" style={{ fontSize: "18px", display: "block", marginBottom: "20px" }}>What would you like to do?</Text>
            {/* <div style={{display:"flex", paddingTop : "50px"}}> */}
            <Button id="CONFIGURE_PIPELINE" onClick={(e) => props.onClick(e)} text style={{ color: "rgb(0, 120, 212)", paddingLeft: "0px" }} content="Configure A New Pipeline" />
            |
            <Button id="CURRENT_PIPELINE" onClick={(e) => props.onClick(e)} text style={{ color: "rgb(0, 120, 212)" }} content="View The Existing Pipeline " />
            |
            <Button id="UPLOAD_DOCUMENTS" onClick={(e) => props.onClick(e)} text style={{ color: "rgb(0, 120, 212)" }} content="Ingest Documents" />
            |
            <Button id="VIEW_INSIGHTS" onClick={(e) => props.onClick(e)} text style={{ color: "rgb(0, 120, 212)" }} content="Sample Search Application" />
            |
            <Button id="OPENAI_VIEWER" onClick={(e) => props.onClick(e)} text style={{ color: "rgb(0, 120, 212)" }} content="OpenAI Viewer" />
            |
            <Button id="VECTOR_SEARCH" onClick={(e) => props.onClick(e)} text style={{ color: "rgb(0, 120, 212)" }} content="OpenAI Vector Search Application" />
            {/* </div> */}
        </div>

    )
}
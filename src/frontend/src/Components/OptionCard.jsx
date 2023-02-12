
import { Card, Text, Image } from '@fluentui/react-northstar'

export default function OptionCard(props) {

    return (
        <Card elevated style={{ margin: "20px", minWidth:"100px", maxWidth:"150px", height: "220px", padding: "0px", backgroundColor: "white" }} onClick={() => props.onClickHandler(props.option)}>
            
            <Card.Preview fitted>
                <Image 
                    fluid
                    src={props.option.image }
                />
            </Card.Preview>
            <Card.Header style={{paddingLeft: "10px", paddingRight: "10px", paddingTop: "10px"}}><Text content={props.option.label} weight="semibold" /></Card.Header>
            <Card.Body style={{paddingLeft: "10px", paddingRight: "10px"}}>
                
                {/* <Text content="These are some details that will be given about the service." size="small" /> */}
            </Card.Body>
        </Card>
    )
}
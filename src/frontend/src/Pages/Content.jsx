
import React, { useState } from 'react'
import CurrentPipeline from '../Pages/CurrentPipeline'
import Home from '../App/Home'
import Upload from './Upload';
import { Breadcrumb } from '@fluentui/react-northstar';
import { ChevronEndMediumIcon } from '@fluentui/react-icons-northstar'
import SelectPipeline from '../Components/SelectPipeline';
import ViewInsights from './ViewInsights';
import OpenAiViewer from './OpenAiViewer';
import VectorSearch from './VectorSearch';
//import Search from '../Components/searchComponents/pages/Search/Search'
//import AppHeader from '../Components/searchComponents/components/AppHeader/AppHeader';
//import { searchHtml } from './searchHtml'
//const template = { __html: searchHtml };

export default function Content(props) {

    const [selectedMenuItem, setSelectedMenuItem] = useState("HOME");
    const [breadCrumbItems, setBreadCrumbItems] = useState([])
    //const [userInfo, setUserInfo] = useState();

    // useEffect(() => {
    //     getUserInfo().then(value => {
    //         setUserInfo(value)
    //     })
    // }, [])

    // const getUserInfo = async () => {
    //     try {
    //         const response = await fetch('/.auth/me');
    //         const payload = await response.json();
    //         const { clientPrincipal } = payload;
    //         return clientPrincipal;
    //     } catch (error) {
    //         console.error('No profile could be found');
    //         return undefined;
    //     }
    // }

    const onBreadcrumbHome = () => {
        setSelectedMenuItem("HOME")
        setBreadCrumbItems([])
    }

    const onSelectContent = (content) => {
        console.log(content.currentTarget.id)
        switch (content.currentTarget.id) {
            case 'CONFIGURE_PIPELINE':
                setSelectedMenuItem('CONFIGURE_PIPELINE')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'Configure Pipeline', key: 'CONFIGURE_PIPELINE' })
                setBreadCrumbItems(breadCrumbItems)
                break
            case 'CURRENT_PIPELINE':
                setSelectedMenuItem('CURRENT_PIPELINE')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'View Pipeline', key: 'CURRENT_PIPELINE' })
                setBreadCrumbItems(breadCrumbItems)
                break
            case 'UPLOAD_DOCUMENTS':
                setSelectedMenuItem('UPLOAD_DOCUMENTS')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'Upload Documents', key: 'UPLOAD_DOCUMENTS' })
                setBreadCrumbItems(breadCrumbItems)
                break
            case 'VIEW_INSIGHTS':
                setSelectedMenuItem('VIEW_INSIGHTS')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'View Insights', key: 'VIEW_INSIGHTS' })
                setBreadCrumbItems(breadCrumbItems)
                break
            case 'OPENAI_VIEWER':
                setSelectedMenuItem('OPENAI_VIEWER')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'OpenAI Viewer', key: 'OPENAI_VIEWER' })
                break;
            case 'VECTOR_SEARCH':
                setSelectedMenuItem('VECTOR_SEARCH')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'OpenAI Vector Search', key: 'VECTOR_SEARCH' })
                setBreadCrumbItems(breadCrumbItems)
                break
            default:
                break;
        }
    }

    const renderContent = () => {
        switch (selectedMenuItem) {
            case 'HOME':
                return (<Home onClick={onSelectContent} theme={props.theme} />)
            case 'CURRENT_PIPELINE':
                return (<CurrentPipeline theme={props.theme} />)
            case 'CONFIGURE_PIPELINE':
                return (<SelectPipeline theme={props.theme} onSelectContent={onSelectContent} />)
            case 'UPLOAD_DOCUMENTS':
                return (<Upload theme={props.theme} />)
            case 'VIEW_INSIGHTS':
                return (<ViewInsights />)
            case 'OPENAI_VIEWER':
                return (<OpenAiViewer />)
            case 'VECTOR_SEARCH':
                return (<VectorSearch />)

            default:
                return (<Home />)
        }
    }

    const renderBreadcrumb = () => {
        switch (selectedMenuItem) {
            case 'HOME':
                return (
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            Home
                        </Breadcrumb.Item>
                    </Breadcrumb>)
            case 'CURRENT_PIPELINE':
                return (
                    <>
                        <Breadcrumb >
                            <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                                <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Breadcrumb.Divider>
                            <ChevronEndMediumIcon />
                        </Breadcrumb.Divider>
                        <Breadcrumb.Item>
                            Create Pipeline
                        </Breadcrumb.Item>
                    </>)
            case 'CONFIGURE_PIPELINE':
                return (
                    <>
                        <Breadcrumb >
                            <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                                <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Breadcrumb.Divider>
                            <ChevronEndMediumIcon />
                        </Breadcrumb.Divider>
                        <Breadcrumb.Item>
                            View Pipeline
                        </Breadcrumb.Item>
                    </>)
            case 'UPLOAD_DOCUMENTS':
                return (<>
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Breadcrumb.Divider>
                        <ChevronEndMediumIcon />
                    </Breadcrumb.Divider>
                    <Breadcrumb.Item>
                        Ingest Documents
                    </Breadcrumb.Item>
                </>)

            case 'VIEW_INSIGHTS':
                return (<>
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Breadcrumb.Divider>
                        <ChevronEndMediumIcon />
                    </Breadcrumb.Divider>
                    <Breadcrumb.Item>
                        Sample Search Application
                    </Breadcrumb.Item>
                </>)

            case 'OPENAI_VIEWER':
                return (<>
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Breadcrumb.Divider>
                        <ChevronEndMediumIcon />
                    </Breadcrumb.Divider>
                    <Breadcrumb.Item>
                        OpenAI Viewer
                    </Breadcrumb.Item>
                </>)

            case 'VECTOR_SEARCH':
                return (<>
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Breadcrumb.Divider>
                        <ChevronEndMediumIcon />
                    </Breadcrumb.Divider>
                    <Breadcrumb.Item>
                        Vector Search Application
                    </Breadcrumb.Item>
                </>)

            default:
                return (<Home />)
        }
    }

    // const provider = "aad"
    // const redirect = window.location.pathname;
    // const showUserInfo = () => {
    //     if (userInfo) {
    //         return (<div>{JSON.stringify(userInfo)}</div>)
    //     }
    // }

    return (
        <div className="content" >
            {/* <a key={provider} href={`/.auth/login/aad?post_login_redirect_uri=${redirect}`}>
                {provider}
                {showUserInfo()}
            </a> */}
            <div style={{ paddingLeft: "0px", paddingTop: "50px", width: "80%", marginLeft: "auto", marginRight: "auto" }}>
                {renderBreadcrumb()}
                {renderContent()}
            </div>
        </div>
    )

}
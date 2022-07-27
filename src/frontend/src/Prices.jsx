import axios from "axios"
import { useEffect, useState } from "react"
import _, { isNumber } from 'lodash'
import { Dropdown, Text, Button, Input } from "@fluentui/react-northstar"


export default function Price(props) {

    const [stagePrices, setStagePrices] = useState({})
    const [price, setPrice] = useState(0)
    const [numDocuments, setNumDocuments] = useState(0)
    const [minutesPerAudioFile, setMinutesPerAudioFile] = useState(0)
    const [pagesPerDocument, setPagesPerDocument] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(false)

    useEffect(() => {
        //are all dropdowns filled in
        let _price = 0
        for (const key of Object.keys(stagePrices)) {
            const stagePrice = stagePrices[key]
            if (stagePrice.filteredItem) {
                if (numDocuments > 0 && pagesPerDocument > 0) {
                    const unitOfMeasure = stagePrice.filteredItem.unitOfMeasure
                    //const perDuration = new RegExp('(\d*/Month)|(\d*/Day)|(\d*/Year)');
                    const quantityK = /^(\d)K/ // eslint-disable-line
                    const quantityM = /^(\d)M/ // eslint-disable-line

                    //const typeDuration = perDuration.test(unitOfMeasure)
                    const typeQuantityK = quantityK.test(unitOfMeasure)
                    const typeQuantityM = quantityM.test(unitOfMeasure)
                    let quantity = 0
                    if (typeQuantityK) {
                        const quantityRe = quantityK.exec(unitOfMeasure)
                        if (quantityRe && quantityRe[1]) {
                            const quantityNum = Number(quantityRe[1])
                            quantity = quantityNum * 1000
                            const unitPrice = stagePrice.filteredItem.unitPrice
                            const pages = numDocuments * pagesPerDocument
                            _price += (pages * unitPrice) / quantity
                        }
                    }
                    if (typeQuantityM) {
                        const quantityRe = quantityM.exec(unitOfMeasure)
                        if (quantityRe && quantityRe[1]) {
                            const quantityNum = Number(quantityRe[1])
                            quantity = quantityNum * 1000000
                            const unitPrice = stagePrice.filteredItem.unitPrice
                            const characters = numDocuments * pagesPerDocument * 1800
                            _price += (characters * unitPrice) / quantity
                        }
                    }
                } else if (numDocuments > 0 && minutesPerAudioFile > 0) {
                    const unitOfMeasure = stagePrice.filteredItem.unitOfMeasure
                    //const perDuration = new RegExp('(\d*/Month)|(\d*/Day)|(\d*/Year)');
                    const quantityK = /^(\d)K/ // eslint-disable-line
                    const quantityM = /^(\d)M/ // eslint-disable-line
                    const quantityHour = /^(\d) Hour/ // eslint-disable-line

                    //const typeDuration = perDuration.test(unitOfMeasure)
                    const typeQuantityK = quantityK.test(unitOfMeasure)
                    const typeQuantityM = quantityM.test(unitOfMeasure)
                    const typeQuantityHour = quantityHour.test(unitOfMeasure)
                    let quantity = 0
                    if (typeQuantityHour) {
                        const quantityRe = quantityHour.exec(unitOfMeasure)
                        if (quantityRe && quantityRe[1]) {
                            const quantityNum = Number(quantityRe[1])
                            quantity = quantityNum
                            const unitPrice = stagePrice.filteredItem.unitPrice
                            const hours = (numDocuments * minutesPerAudioFile) / 60
                            _price += (hours * unitPrice) / quantity
                        }
                    }
                    if (typeQuantityK) {
                        const quantityRe = quantityK.exec(unitOfMeasure)
                        if (quantityRe && quantityRe[1]) {
                            const quantityNum = Number(quantityRe[1])
                            quantity = quantityNum * 1000
                            const unitPrice = stagePrice.filteredItem.unitPrice
                            const pages = (numDocuments * minutesPerAudioFile) * 30 //30 pages per minute of speech
                            _price += (pages * unitPrice) / quantity
                        }
                    }
                    if (typeQuantityM) {
                        const quantityRe = quantityM.exec(unitOfMeasure)
                        if (quantityRe && quantityRe[1]) {
                            const quantityNum = Number(quantityRe[1])
                            quantity = quantityNum * 1000000
                            const unitPrice = stagePrice.filteredItem.unitPrice
                            const characters = numDocuments * minutesPerAudioFile * 1800
                            _price += (characters * unitPrice) / quantity
                        }
                    }
                }
            }
        }
        setPrice(_price)



    }, [pagesPerDocument, minutesPerAudioFile, stagePrices, numDocuments])


    const onDropdownChange = (event, item) => {
        if (stagePrices && stagePrices[item.name]) {
            const _stagePrice = _.cloneDeep(stagePrices[item.name])
            if (item.type === 'tier') {
                _stagePrice.selectedMeter = item.value
            } else {
                _stagePrice.selectedLocation = item.value
            }


            if (_stagePrice.selectedMeter && _stagePrice.selectedLocation) {
                const _items = _stagePrice.items.filter((value, index, array) => {
                    if (value.location === _stagePrice.selectedLocation &&
                        value.meterName === _stagePrice.selectedMeter) {
                        return true
                    } else {
                        return false
                    }
                })
                _stagePrice.filteredItem = _items[0]
            }

            const _stagePrices = _.cloneDeep(stagePrices)
            _stagePrices[item.name] = _stagePrice
            setStagePrices(_stagePrices)
        }
    }

    const onButtonClick = async (event) => {
        try {
            setButtonDisabled(true)
            const _stagePrices = _.cloneDeep(stagePrices)
            let index = 0
            for (const stage of props.stages) {
                if (stage && stage.filters) {
                    if (!stagePrices[stage.name + `-${index}`]) {
                        const results = await callPriceAPi(stage)
                        _stagePrices[stage.name + `-${index}`] = results
                        _stagePrices[stage.name + `-${index}`].label = stage.label
                        _stagePrices[stage.name + `-${index}`].selectedMeter = stage.defaultTier
                        _stagePrices[stage.name + `-${index}`].defaultMeter = stage.defaultTier
                    }
                    index++
                }
            }
            
            setStagePrices(_stagePrices)
        } catch (err) {
            console.log(err)
        }
        setButtonDisabled(false)
    }



    const callPriceAPi = async (stageFilter) => {
        try {
            let url = '/api/price?filter='
            for (let i = 0; i < stageFilter.filters.length; i++) {
                const f = stageFilter.filters[i]
                url += `${f.key} eq '${f.value}'`
                if (i !== stageFilter.filters.length - 1) {
                    url += ` and `
                }
            }
            const axiosResult = await axios.get(url)
            return axiosResult.data
        } catch (err) {
            console.log(err)
        }

    }

    const estimatedPrice = () => {
        if (price > 0) {
            return <>Estimated Monthly Price (not including Cognitive Search): <span style={{ color: "blue" }}>${price}</span></>
        } else {
            return <></>
        }
    }

    const onNumDocuments = (event, value) => {
        isNumber = false
        try {
            // eslint-disable-next-line no-unused-vars
            const temp = Number(value)
            isNumber = true
        } catch (err) {

        }
        if (isNumber) {
            setNumDocuments(Number(value.value))
        }

    }

    const onMinutesPerAudioFile = (event, value) => {
        isNumber = false
        try {
            // eslint-disable-next-line no-unused-vars
            const temp = Number(value)
            isNumber = true
        } catch (err) {

        }
        if (isNumber) {
            setMinutesPerAudioFile(Number(value.value))
        }

    }

    const onPagesPerDocument = (event, value) => {
        isNumber = false
        try {
            // eslint-disable-next-line no-unused-vars
            const temp = Number(value)
            isNumber = true
        } catch (err) {

        }
        if (isNumber) {
            setPagesPerDocument(Number(value.value))
        }

    }

    //const legalMessage = "* Prices are estimates only and are not intended as actual price quotes. Actual pricing may vary depending on the type of agreement entered with Microsoft, date of purchase, and the currency exchange rate. Prices are calculated based on US dollars and converted using Thomson Reuters benchmark rates refreshed on the first day of each calendar month. Sign in to the Azure pricing calculator to see pricing based on your current program/offer with Microsoft. Contact an Azure sales specialist for more information on pricing or to request a price quote. See frequently asked questions about Azure pricing."

    const renderPriceInputs = () => {
        if (props.stages && props.stages.length > 1) {
            if (props.stages[0].name === 'pdf') {
                return (
                    <div>
                        <Text weight="normal" content="Total number of files to be processed per month" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "5px" }} />
                        <Input value={numDocuments} onChange={onNumDocuments} style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
                        <Text weight="normal" content="The average number of pages per document." style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "5px" }} />
                        <Input value={pagesPerDocument} onChange={onPagesPerDocument} style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />

                    </div>
                )
            } else if (props.stages[0].name === 'wav') {
                return (
                    <div>
                        <Text weight="normal" content="Total number of files to be processed per month" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "5px" }} />
                        <Input value={numDocuments} onChange={onNumDocuments} style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
                        <Text weight="normal" content="The average number of minutes of audio per file." style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "5px" }} />
                        <Input value={minutesPerAudioFile} onChange={onMinutesPerAudioFile} style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
                    </div>
                )
            }
        }
    }




    if (stagePrices && Object.keys(stagePrices).length > 0) {
        return (
            <div id="price-container">
                {renderPriceInputs()}
                {Object.keys(stagePrices).map(key => {
                    return (
                        <div id="price-element" style={{ display: "flex", marginBottom: "20px" }}>

                            <div id="price-tier" style={{ marginRight: "20px" }}>
                                <Text content={`${stagePrices[key].label} Tiers`} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "5px" }} />
                                <Dropdown
                                    name={key}
                                    type="tier"
                                    defaultSelectedKey={stagePrices[key].defaultMeter}
                                    defaultValue={stagePrices[key].defaultMeter}
                                    serviceName={stagePrices[key].serviceNames[0]}
                                    productName={stagePrices[key].productNames[0]}
                                    placeholder="Select Tier"
                                    label="Output"
                                    items={stagePrices[key].meterNames}
                                    onChange={onDropdownChange}
                                />
                            </div>
                            <div id="price-location" style={{ marginRight: "20px" }}>
                                <Text content={`${stagePrices[key].label} Locations`} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "5px" }} />
                                <Dropdown
                                    name={key}
                                    type="location"
                                    serviceName={stagePrices[key].serviceNames[0]}
                                    productName={stagePrices[key].productNames[0]}
                                    placeholder="Select Location"
                                    label="Output"
                                    items={stagePrices[key].locations}
                                    onChange={onDropdownChange}
                                />
                            </div>

                            {(stagePrices && stagePrices[key] && stagePrices[key].filteredItem) ? (
                                <div >
                                    <Text content={`Unit of Measure: ${stagePrices[key].filteredItem.unitOfMeasure}`} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "5px" }} />
                                    <Text content={`Unit Price: ${stagePrices[key].filteredItem.unitPrice}`} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "5px" }} />
                                </div>
                            ) : (<></>)}

                        </div>

                    )
                })}
                <Text weight="semibold" content={estimatedPrice()} style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "5px" }} />
            </div>
        )

    } else {
        return (<>
            <Button primary disabled={buttonDisabled} onClick={onButtonClick} style={{ marginRight: "10px" }}>Download Prices</Button>
            {buttonDisabled ? <Text weight="semibold" content="downloading...." style={{ fontSize: "14px" }} /> : ''}
        </>)
    }


}
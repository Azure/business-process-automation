export const getCogSearchPricing = (numDocuments) => {
    const million = 1000000
    if(numDocuments < million){
        return 500
    } else if (numDocuments >= million && numDocuments < (10*million)){
        return 5000
    }else if (numDocuments >= (10*million) && numDocuments < (100*million)){
        return 10000
    }else if (numDocuments >= (100*million) ){
        return 25000
    }
    throw new Error("error in getCogSearchPricing")
}

export const getContentModeratorPricing = (numDocuments) => {
    const million = 1000000
    if(numDocuments < million){
        return (numDocuments * 1)/1000
    } else if (numDocuments >= million && numDocuments < (10*million)){
        return (numDocuments * .75)/1000
    }else if (numDocuments >= (10*million) && numDocuments < (100*million)){
        return (numDocuments * .60)/1000
    }else if (numDocuments >= (100*million) ){
        return (numDocuments * .40)/1000
    }
    throw new Error("error in getContentModeratorPricing")
}

export const getDocumentTranslatorPricing = (pages) => {
    const million = 1000000
    if(pages < million){
        return (pages * 10 * 1.5)/100
    } else if (pages >= million && pages < (10*million)){
        return 2000.0 * 1.5
    }else if (pages >= (10*million) && pages < (100*million)){
        return 6000.0 * 1.5
    }else if (pages >= (100*million) ){
        return 45000.0 * 1.5
    }
    throw new Error("error in getDocumentTranslatorPricing")
}

export const getFormRecReadPricing = (pages) => {
    const million = 1000000
    if(pages < (1*million)){
        return (pages * 1.5)/1000
    } else {
        return (pages * .60)/1000
    }
}

export const getFormRecPrebuiltPricing = (pages) => {
    return (pages * 10)/1000
}

export const getFormRecCustomPricing = (pages) => {
    const thousand = 1000000
    if(pages < (20*thousand)){
        return (pages * 40.0)/1000
    } else if (pages >= (20*thousand) && pages < (100*thousand)){
        return (((pages - (20*thousand)) * 40.0)/1000) + 800
    } else if (pages >= (100*thousand) && pages < (500*thousand)){
        return (((pages - (100*thousand)) * 32.50)/1000) + 3250
    } else if(pages >= (500*thousand)){
        return (((pages - (500*thousand)) * 25.0)/1000) + 12500.0
    }
    
    
    throw new Error("error in getFormRecCustomPricing")
}

export const getLanguagePricing = (pages) => {
    const million = 1000000
    if(pages < (0.5*million)){
        return (pages * 1)/1000
    } else if (pages >= (0.5*million) && pages < (2.5*million)){
        return (pages * .75)/1000
    }else if (pages >= (2.5*million) && pages < (10*million)){
        return (pages * .30)/1000
    }else if (pages >= (10*million) ){
        return (pages * .25)/1000
    }
    throw new Error("error in getLanguagePricing")
}

export const getHealthLanguagePricing = (pages) => {
    const million = 1000000
    if(pages < (0.5*million)){
        return (pages * 25)/1000
    } else if (pages >= (0.5*million) && pages < (2.5*million)){
        return (pages * 15)/1000
    }else if (pages >= (2.5*million)){
        return (pages * 10)/1000
    }
    throw new Error("error in getHealthLanguagePricing")
}

export const getCustomLanguagePricing = (pages) => {
    return (pages * 5)/1000
}

export const getOcrPricing = (pages) => {
    const million = 1000000
    if(pages < million){
        return (pages * 1)/1000
    } else if (pages >= million && pages < (10*million)){
        return (pages * .65)/1000
    }else if (pages >= (10*million) && pages < (100*million)){
        return (pages * .60)/1000
    }else if (pages >= (100*million) ){
        return (pages * .40)/1000
    }
    throw new Error("error in getOcrPricing")
}

export const getSpeechPricing = (pages) => {
    const thousand = 1000
    const hours = pages/30
    if(hours < 2*thousand){
        return (hours * 1)
    } else if (hours >= (2*thousand) && hours < (10*thousand)){
        return (hours * .80)
    }else if (hours >= (10*thousand) && hours < (50*thousand)){
        return (hours * .65)
    }else if (hours >= (50*thousand) ){
        return (hours * .50)
    }
    throw new Error("error in getSpeechPricing")
}

export const getTranslationPricing = (pages) => {
    const million = 1000000
    const characters = pages * 3000
    if(characters < 250*million){
        return (characters/million)*10
    } else if (characters >= 250*million && characters < (1000*million)){
        return 2055 + ((8.22*(characters-(250*million))/million))
    }else if (characters >= (1000*million) && characters < (4000*million)){
        return 6000 + ((6.00*(characters-(250*million))/million))
    }else if (characters >= (4000*million) ){
        return 2055 + ((5.50*(characters-(250*million))/million))
    }
    throw new Error("error in getTranslationPricing")
}

export const noCharge = (pages) => {
    return 0
}

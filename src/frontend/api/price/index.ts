import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from 'axios'

const callPriceAPi = async (filter) => {
    try {
        const mergedItems = []
        let numResults = 0
        let skip = 0
        do {

            const axiosResult = await axios.get('https://prices.azure.com/api/retail/prices?$filter=' + filter + `&$skip=${skip}`)
            skip += 100
            mergedItems.push(...axiosResult.data.Items)
            numResults = axiosResult.data.Items.length
        } while (numResults == 100)

        const out = {
            locations: new Set(),
            serviceNames: new Set(),
            productNames: new Set(),
            meterNames: new Set()
        }
        for (const s of mergedItems) {
            out.locations.add(s.location)
            out.productNames.add(s.productName)
            out.serviceNames.add(s.serviceName)
            out.meterNames.add(s.meterName)
        }
        const result = {
            locations: Array.from(out.locations),
            serviceNames: Array.from(out.serviceNames),
            productNames: Array.from(out.productNames),
            meterNames: Array.from(out.meterNames),
            items: mergedItems
        }
        return result
    } catch (err) {
        console.log(err)
    }
    const mergedItems = []
    let numResults = 0
    let skip = 0

}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "GET") {
        try {
            context.log('HTTP trigger function processed a request.');
            const out = await callPriceAPi(req.query.filter)
            context.res = {
                body: out
            }
            return
        } catch (err) {
            context.log(err)
            context.res = {
                body: err
            }
            return
        }
    }
}




export default httpTrigger;

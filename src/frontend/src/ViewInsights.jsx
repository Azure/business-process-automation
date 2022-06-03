import React, { useState } from 'react';



function ViewInsights(props) {
    const [document, setDocument] = useState(null)

    const colors = ["#007BEB", "#20B883", "#A0F09A", "#E0056C", "#000FF0", "#60C6F7"]

    const highlightText = (text, offset, textLength, color) => {
      const result = text.substring(0, offset - 1) + ` <span style="background-color:${color}">` + text.substring(offset, offset + textLength) + `</span> ` +
        text.substring(offset + textLength + 1, document.aggregatedResults.ocr.length);
      return result
    }


  
    const getText = () => {
      
      if (document?.aggregatedResults) {
        const nerResults = document.aggregatedResults.recognizeEntities[0].recognizeEntitiesResults[0].results[0].entities
        let currentText = document.aggregatedResults.ocr
        let colorIndex = 0
        let categories = {}
        console.log(`ner : ${JSON.stringify(nerResults)}`)
        let lastOffset = currentText.length*2
        for (let i = nerResults.length - 1; i >= 0; i--) {
          console.log(`ner category ${nerResults[i].category}`)
          let color = null
          if (categories[nerResults[i].category]) {
            color = categories[nerResults[i].category]
          } else {
            categories[nerResults[i].category] = colors[colorIndex % colors.length]
            color = colors[colorIndex % colors.length]
            colorIndex++
          }
          if((nerResults[i].offset + nerResults[i].length) < lastOffset){
            console.log(lastOffset)
            lastOffset = nerResults[i].offset
            currentText = highlightText(currentText, nerResults[i].offset, nerResults[i].length, color)
          }
         
        }
        const keys = Object.keys(categories)
        const values = []
        for (const k of keys) {
          values.push({ [k]: categories[k] })
        }
  
        console.log(JSON.stringify(values))
        return (
            <div className='documentText'>
                OCR Results:
                <div style={{ padding: 30 }} dangerouslySetInnerHTML={{ __html: currentText }}></div>
            </div>
        );
      }
    }
  
    const documentSelected = async (selectedDocument) => {
      setDocument(selectedDocument)
    }
  
    const parseData = (documents) => {

    //   const filteredDocs = documents.data.filter(item => {
    //       if(item.ner){
    //           return true
    //       }
    //       return false
    //   })
      if (documents) {
        return (
          <>
            <div className="filenameHeader">Processed Files (select one)</div>
            {documents.map(document => (<div className="filename" onClick={() => { documentSelected(document) }}>{document.projectName}</div>))}
          </>
        )
      }
      return (<></>)
    }
  
    const showLegend = () => {
      if (document) {
        let currentText = document.aggregatedResults.ocr
        let colorIndex = 0
        let categories = {}
        const nerResults = document.aggregatedResults.recognizeEntities[0].recognizeEntitiesResults[0].results[0].entities
        console.log(`ner : ${JSON.stringify(nerResults)}`)
        for (let i = nerResults.length - 1; i >= 0; i--) {
          console.log(`ner category ${nerResults[i].category}`)
          let color = null
          if (categories[nerResults[i].category]) {
            color = categories[nerResults[i].category]
          } else {
            categories[nerResults[i].category] = colors[colorIndex % colors.length]
            color = colors[colorIndex % colors.length]
            colorIndex++
          }
          currentText = highlightText(currentText, nerResults[i].offset, nerResults[i].length, color)
        }
        const keys = Object.keys(categories)
        const values = []
        for (const k of keys) {
          values.push({ key: k, value: categories[k] })
        }
  
        console.log(JSON.stringify(values))
        return (
          <>
           <div className="filenameHeader">Custom NER Results</div>
            {values.map(v => (
              <>
                <div className='resultLabel'><span class="dot" style={{ backgroundColor: v.value }}></span> {v.key}</div>
              </>
            ))}
          </>
        )
      }
    }
    return (
        <div className="documentTextParent" style={{padding : "30px"}}>
            <div className="filenames">
                {parseData(props.documents)}
            </div>
            {getText()}
            <div className='filenames'>
                {showLegend()}
            </div>
        </div>
    )
}

export default ViewInsights


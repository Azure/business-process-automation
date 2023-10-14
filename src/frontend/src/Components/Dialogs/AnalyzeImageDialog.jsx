import React, { useState } from "react";
import { Dialog, Text, Checkbox } from "@fluentui/react-northstar";
import LanguageDropdown from "../Language/LanguageDropdown";

const languages = [
  { key: "en", text: "English" },
  { key: "es", text: "Spanish" },
  { key: "ja", text: "Japanese" },
  { key: "pt", text: "Portuguese" },
  { key: "zh", text: "Simplified Chinese" },
];

export default function AnalyzeImageDialog(props) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [read, setRead] = useState(false);
  const [caption, setCaption] = useState(false);
  const [denseCaptions, setDenseCaptions] = useState(false);
  const [smartCrops, setSmartCrops] = useState(false);
  const [objects, setObjects] = useState(false);
  const [tags, setTags] = useState(false);
  const [people, setPeople] = useState(false);

  const onDialogSave = (event) => {
    console.log(event);
    const newOption = props.currentOption;
    newOption.serviceSpecificConfig = {
      language: selectedLanguage,
      read: read,
      caption : caption,
      denseCaptions : denseCaptions,
      smartCrops : smartCrops,
      objects : objects,
      tags : tags,
      people : people
    };
    props.setHideDialog(true);
    props.addItemToPipeline(newOption);
  };

  const onDialogCancel = () => {
    props.setHideDialog(true);
  };

  const onLanguageDialogChange = (event, dropObject) => {
    setSelectedLanguage(languages[dropObject.highlightedIndex].key);
  };

  const onRead = (_, value) => {
    setRead(value.checked);
  };
  const onCaption = (_, value) => {
    setCaption(value.checked);
  };
  const onDenseCaptions = (_, value) => {
    setDenseCaptions(value.checked);
  };
  const onSmartCrops = (_, value) => {
    setSmartCrops(value.checked);
  };
  const onObjects = (_, value) => {
    setObjects(value.checked);
  };
  const onTags = (_, value) => {
    setTags(value.checked);
  };
  const onPeople = (_, value) => {
    setPeople(value.checked);
  };

  const labelStyle = {
    display: "block",
    marginLeft: "10px",
    marginBottom: "10px",
  };

  const checkboxStyle = {
    display: "block",
    marginLeft: "20px",
    marginBottom: "5px",
  };

  return (
    <Dialog
      header="Image Features"
      content={
        <>
          <div style={{ display: "flex" }}>
            <div id="image-features-labels">
              <Text content="Read" style={labelStyle} />
              <Text content="Caption" style={labelStyle} />
              <Text content="Dense Captions" style={labelStyle} />
              <Text content="Smart Crops" style={labelStyle} />
              <Text content="Objects" style={labelStyle} />
              <Text content="Tags" style={labelStyle} />
              <Text content="People" style={labelStyle} />
            </div>
            <div id="image-features-checkboxes">
              <Checkbox onClick={onRead} checked={read} style={checkboxStyle} />
              <Checkbox onClick={onCaption} checked={caption} style={checkboxStyle} />
              <Checkbox onClick={onDenseCaptions} checked={denseCaptions} style={checkboxStyle} />
              <Checkbox onClick={onSmartCrops} checked={smartCrops} style={checkboxStyle} />
              <Checkbox onClick={onObjects} checked={objects} style={checkboxStyle} />
              <Checkbox onClick={onTags} checked={tags} style={checkboxStyle} />
              <Checkbox onClick={onPeople} checked={people} style={checkboxStyle} />
            </div>
          </div>
          <LanguageDropdown
            languages={languages}
            onDialogChange={onLanguageDialogChange}
          />
        </>
      }
      open={!props.hideDialog}
      cancelButton="Cancel"
      confirmButton="Submit"
      onConfirm={onDialogSave}
      onCancel={onDialogCancel}
      style={{ overflow: "visible" }}
    />
  );
}

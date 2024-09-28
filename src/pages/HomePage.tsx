import { useContext, useEffect, useState } from "react";
import SidebarSection from "../components/organisms/SidebarSection";
import DraggableList from "../components/molecules/DraggableList";
import LegendSection from "../components/organisms/LegendSection";
import SelectableList from "../components/molecules/SelectableList";
import { SurveyContext } from "../context/SurveyContext";
import { initialPreferenceList, Preference, Section } from "../constants/surveyConstants";
import GradientBar from "../components/atoms/GradientBar";
import Colorbox from "../components/atoms/Colorbox";
import { MapAttribute, mapSections } from "../constants/mapConstants";
import { MessageContext } from "../context/MessageContext";
import { Prompt } from "../constants/messageConstants";
import { pathToSection } from "../utils/utils";
import { getInstructionPrompt } from "../services/openai";
// import CheckboxList from "../components/CheckboxList";


export default function HomePage() {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { addMessage, updatePrompt } = useContext(MessageContext);

  // Currently selected preference.
  const [preference, setPreference] = useState<Preference>(initialPreferenceList.list[0]);

  // Currently selected mapbox layer attribute. 
  const [attribute, setAttribute] = useState<MapAttribute>(
    () => mapSections.find((sec) => sec.id === "home")!.attribute!
  );

  // Retrieve selected preference from the survey context.
  useEffect(() => {
    const selectedPreference = survey.preferenceList.list.find((item) => item.selected);
    selectedPreference && setPreference(selectedPreference);
  }, [survey]);

  // Get openAI instructions on the current page.
  useEffect(() => {
    addMessage({ user: "", ai: "", type: "section" });
    const section: Section = pathToSection(location.pathname);
    const prompt: Prompt = { type: "section", content: getInstructionPrompt(section) };
    section && updatePrompt(prompt);
  }, [location.pathname]);

  return (
    <>
      {/* Site choice */}
      {/* <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughList} setSurveyContext={setSurveyContext} />
        </SidebarSection> */}

      <SidebarSection title="rank site conditions in priority to expand healthcare in shortage areas">
        <DraggableList
          list={survey.preferenceList.list}
          setSurveyContext={setSurveyContext}
          displayIcon={false}
          displayRanking
          selectable
        />
      </SidebarSection>

      <LegendSection title={preference.category as string}>
        <SelectableList
          list={preference.subCategories}
          setAttribute={setAttribute}
          mappable
        />
        <GradientBar bound={attribute.bound} unit={attribute.unit} />
        <Colorbox label={"non-shortage areas"} />
      </LegendSection>
    </>
  );
}

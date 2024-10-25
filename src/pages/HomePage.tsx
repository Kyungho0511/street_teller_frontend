import { useContext, useEffect, useState } from "react";
import SidebarSection from "../components/organisms/SidebarSection";
import DraggableList from "../components/molecules/DraggableList";
import LegendSection from "../components/organisms/LegendSection";
import SelectableList from "../components/molecules/SelectableList";
import { SurveyContext } from "../context/SurveyContext";
import { initialPreferenceList, Preference } from "../constants/surveyConstants";
import GradientBar from "../components/atoms/GradientBar";
import Colorbox from "../components/atoms/Colorbox";
import { MapAttribute, mapSections } from "../constants/mapConstants";
import { MessageContext } from "../context/MessageContext";
import PopupSection from "../components/organisms/PopupSection";
import PopupTextHome from "../components/atoms/PopupTextHome";
import { PopupContextProvider } from "../context/PopupContext";
import Sidebar from "../components/organisms/Sidebar";
import useOpenai from "../hooks/useOpenai";
// import CheckboxList from "../components/CheckboxList";

/**
 * Home page component where users select their preferences.
 */
export default function HomePage() {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { addMessage, updatePrompt } = useContext(MessageContext);

  // Currently selected preference.
  const [preference, setPreference] = useState<Preference>(initialPreferenceList.list[0]);

  // Currently selected mapbox layer attribute. 
  const [attribute, setAttribute] = useState<MapAttribute>(
    () => mapSections.find((sec) => sec.id === "home")!.attribute!
  );

  // Get openAI instructions on the current page.
  useOpenai(addMessage, updatePrompt);

  // Retrieve selected preference from the survey context.
  useEffect(() => {
    const selectedPreference = survey.preferenceList.list.find((item) => item.selected);
    selectedPreference && setPreference(selectedPreference);
  }, [survey]);

  return (
    <>
      {/* Site choice */}
      {/* <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughList} setSurveyContext={setSurveyContext} />
        </SidebarSection> */}
      <Sidebar>
        <SidebarSection>
          <DraggableList
            list={survey.preferenceList.list}
            setSurveyContext={setSurveyContext}
            displayIcon={false}
            displayRanking
            selectable
          />
        </SidebarSection>
      </Sidebar>

      <LegendSection title={preference.category as string}>
        <SelectableList
          list={preference.subCategories}
          setAttribute={setAttribute}
          mappable
        />
        <GradientBar bound={attribute.bound} unit={attribute.unit} />
        <Colorbox label={"non-shortage areas"} />
      </LegendSection>

      <PopupContextProvider>
        <PopupSection enableSelectEffect>
          <PopupTextHome selectedAttribute={attribute} />
        </PopupSection>
      </PopupContextProvider>
    </>
  );
}

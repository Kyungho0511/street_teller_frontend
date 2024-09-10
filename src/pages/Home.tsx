import { useContext, useEffect, useState } from "react";
import SidebarSection from "../components/organisms/SidebarSection";
import DraggableList from "../components/molecules/DraggableList";
import LegendSection from "../components/organisms/LegendSection";
import SelectableList from "../components/molecules/SelectableList";
import { SurveyContext } from "../context/SurveyContext";
import { initialPreferences, Preference } from "../constants/surveyConstants";
import GradientBar from "../components/atoms/GradientBar";
import Colorbox from "../components/atoms/Colorbox";
import { MapAttribute, mapSections } from "../constants/mapConstants";
// import CheckboxList from "../components/CheckboxList";


export default function Home() {
  const { survey, setSurveyContext } = useContext(SurveyContext);

  // Currently selected preference.
  const [preference, setPreference] = useState<Preference>(initialPreferences[0]);

  // Currently selected mapbox layer attribute. 
  const [attribute, setAttribute] = useState<MapAttribute>(
    () => mapSections.find((sec) => sec.id === "home")!.attribute!
  );

  // Retrieve selected preference from the survey context.
  useEffect(() => {
    const selectedPreference = survey.preferenceList.find((item) => item.selected);
    selectedPreference && setPreference(selectedPreference);
  }, [survey]);

  return (
    <>
      {/* Site choice */}
      {/* <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughList} setSurveyContext={setSurveyContext} />
        </SidebarSection> */}

      <SidebarSection title="rank healthcare site preferences">
        <DraggableList
          list={survey.preferenceList}
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

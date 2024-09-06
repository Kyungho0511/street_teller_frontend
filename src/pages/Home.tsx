import { useContext, useEffect, useState } from "react";
import SidebarSection from "../components/SidebarSection";
import DraggableList from "../components/DraggableList";
import LegendSection from "../components/LegendSection";
import SelectableList from "../components/SelectableList";
import { SurveyContext } from "../context/SurveyContext";
import { initialPreferences, Preference } from "../constants/homeConstants";
import GradientBar from "../components/GradientBar";
import Colorbox from "../components/Colorbox";
import { MapAttribute, mapSections } from "../constants/mapConstants";


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
    const selectedPreference = survey.preferences.find((item) => item.selected);
    selectedPreference && setPreference(selectedPreference);
  }, [survey]);

  return (
    <>
      {/* Site choice */}
      {/* <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughs} setSurveyContext={setSurveyContext} />
        </SidebarSection> */}

      <SidebarSection title="rank healthcare site preferences">
        <DraggableList
          list={survey.preferences}
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

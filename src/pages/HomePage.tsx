import { useContext, useEffect, useState } from "react";
import SidebarSection from "../components/organisms/SidebarSection";
import DraggableList from "../components/molecules/DraggableList";
import LegendSection from "../components/organisms/LegendSection";
import SelectableList from "../components/molecules/SelectableList";
import { SurveyContext } from "../context/SurveyContext";
import {
  initialPreferenceList,
  Preference,
} from "../constants/surveyConstants";
import { Section } from "../constants/sectionConstants";
import GradientBar from "../components/atoms/GradientBar";
import Colorbox from "../components/atoms/Colorbox";
import PopupSection from "../components/organisms/PopupSection";
import PopupContentHome from "../components/atoms/PopupContentHome";
import Sidebar from "../components/organisms/Sidebar";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";
import { MapContext } from "../context/MapContext";
import useEffectAfterMount from "../hooks/useEffectAfterMount";
import { pathToSection } from "../utils/utils";
import * as mapbox from "../services/mapbox";
import useMapSelectEffect from "../hooks/useMapSelectEffect";

/**
 * Home page component where users sort their data preferences.
 */
export default function HomePage() {
  const { survey } = useContext(SurveyContext);
  const { mapViewer, mapMode, parentLayer, attribute, color } =
    useContext(MapContext);

  // Currently selected preference.
  const [preference, setPreference] = useState<Preference>(
    initialPreferenceList.list[0]
  );

  // Set OpenAI instruction and map select effect.
  useOpenaiInstruction();
  useMapSelectEffect(parentLayer, mapViewer);

  // Retrieve selected preference from the survey context.
  useEffect(() => {
    const selectedPreference = survey.preference.list.find(
      (item) => item.selected
    );
    selectedPreference && setPreference(selectedPreference);
  }, [survey]);

  // Restore mapping on mapMode change
  useEffectAfterMount(() => {
    if (!mapViewer) return;

    mapViewer.on("style.load", () => {
      // Restore current layers and attributes.
      const section: Section = pathToSection(location.pathname);
      mapbox.setLayerSettings(section, mapViewer);
      mapbox.updateLayerAttribute(
        parentLayer,
        attribute.name,
        color!,
        mapViewer
      );
    });
  }, [mapMode]);

  return (
    <>
      <Sidebar>
        <SidebarSection>
          <DraggableList
            surveyName="preference"
            list={survey.preference.list}
            displayIcon
            displayRanking
            selectable
          />
        </SidebarSection>
      </Sidebar>

      <LegendSection title={preference.category as string}>
        <SelectableList list={preference.subCategories} />
        <GradientBar
          bound={attribute.bound}
          unit={attribute.unit}
          selectedAttribute={attribute}
        />
        <Colorbox label={"non-shortage areas"} />
      </LegendSection>

      <PopupSection>
        <PopupContentHome selectedAttribute={attribute} />
      </PopupSection>
    </>
  );
}

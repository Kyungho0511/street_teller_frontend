import { useContext } from "react";
import CheckboxList from "../components/CheckboxList";
import SidebarSection from "../components/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import DraggableList from "../components/DraggableList";

export default function Home() {
  const { survey, setSurveyContext } = useContext(SurveyContext);

  return (
    <>
        <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughs} setSurveyContext={setSurveyContext} />
        </SidebarSection>

        <SidebarSection title="Rank Your Site Preferences">
          <DraggableList
            list={survey.preferences}
            setSurveyContext={setSurveyContext}
            displayIcon
          />
        </SidebarSection>
    </>
  );
}

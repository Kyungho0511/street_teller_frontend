import { useContext } from "react";
import CheckboxList from "../components/CheckboxList";
import SidebarSection from "../components/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import DraggableList from "../components/DraggableList";

export default function Home() {
  const { survey, setSurveyContext } = useContext(SurveyContext);

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
          />
        </SidebarSection>
    </>
  );
}

import { useContext } from "react";
import CheckboxList from "../components/CheckboxList";
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import DraggableList from "../components/DraggableList";

export default function Home() {
  const { survey, setSurveyContext } = useContext(SurveyContext);

  return (
    <>
      <Sidebar>

        <SidebarSection title="Discover Sites for you">
          <p>
            Tell us about your life-style by selecting the categories important
            for your new home. We will tell you about NYC neighborhoods that
            suit your household the best.
          </p>
        </SidebarSection>

        <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughs} setSurveyContext={setSurveyContext} />
        </SidebarSection>

        <SidebarSection title="Sort Your Site Preferences">
          <DraggableList
            list={survey.preferences}
            setSurveyContext={setSurveyContext}
            displayIcon
          />
        </SidebarSection>

      </Sidebar>
    </>
  );
}

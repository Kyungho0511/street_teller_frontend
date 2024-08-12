import { useContext } from "react";
import CheckboxList from "../components/CheckboxList";
import RadioList from "../components/RadioList";
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";

export default function Home() {
  const { survey, setSurveyContext } = useContext(SurveyContext);

  return (
    <>
      <Sidebar>
        <SidebarSection title="Discover Neighborhoods for you">
          <p>
            Tell us about your life-style by selecting the categories important
            for your new home. We will tell you about NYC neighborhoods that
            suit your household the best.
          </p>
        </SidebarSection>

        <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughs} setSurveyContext={setSurveyContext} />
        </SidebarSection>

        <SidebarSection title="Rank Your Living Preferences">
          <RadioList
            name="preferences"
            list={survey.preferences.map((preference) => preference.category)}
          />
        </SidebarSection>
      </Sidebar>
    </>
  );
}

import RadioList from "../components/RadioList";
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";

export default function Home() {
  return (
    <>
      <Sidebar>
        <SidebarSection title="Choose Your Preference">
          <p>
            What is the most important factor when providing healthcare
            facilities?
          </p>
          <RadioList
            name="most-important"
            labels={[
              "Health Vulnerability of Residents",
              "Profitability of Facilities",
              "Built Environment",
            ]}
            values={["vulnerability", "profitability", "built environment"]}
          />
          <p>What is the second most important factor?</p>
          <RadioList
            name="second-important"
            labels={[
              "Health Vulnerability of Residents",
              "Profitability of Facilities",
              "Built Environment",
            ]}
            values={["vulnerability", "profitability", "built environment"]}
          />
        </SidebarSection>

        <SidebarSection title="Choose Counties">
          <p>
            Choose counties for healthcare provision. Click 'Continue' button
            after you are done.
          </p>
          <RadioList
            name="counties"
            labels={[
              "NYC Counties",
              "Upstate NY Counties",
            ]}
            values={["NYC Counties", "Upstate NY Counties"]}
          />
        </SidebarSection>
      </Sidebar>
    </>
  );
}

import RadioList, { RadioItem } from "../components/RadioList";
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";

export default function Home() {
  return (
      <Sidebar>
        <SidebarSection title="Choose Your Preference">
          <p>
            What is the most important factor when providing healthcare
            facilities?
          </p>
          <RadioList
            name="most-important"
            list={questionaire1}
          />
          <p>What is the second most important factor?</p>
          <RadioList
            name="second-important"
            list={questionaire1}
          />
        </SidebarSection>

        <SidebarSection title="Choose Counties">
          <p>
            Choose counties for healthcare provision. Click 'Continue' button
            after you are done.
          </p>
          <RadioList
            name="counties"
            list={questionaire2}
          />
        </SidebarSection>
      </Sidebar>
  );
}

const questionaire1: RadioItem[] = [
  {
    label: "Health Vulnerability of Residents",
    value: "vulnerability",
  },
  {
    label: "Profitability of Facilities",
    value: "profitability",
  },
  {
    label: "Built Environment",
    value: "built environment",
  },
];

const questionaire2: RadioItem[] = [
  {
    label: "NYC Counties",
    value: "NYC Counties",
  },
  {
    label: "Upstate NY Counties",
    value: "Upstate NY Counties",
  }
]

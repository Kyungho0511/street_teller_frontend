import CheckboxList, { CheckboxItem } from "../components/CheckboxList";
import RadioList, { RadioItem } from "../components/RadioList";
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";

export default function Home() {
  return (
    <>
      <Sidebar>
        <SidebarSection title="NYC Neighborhoods for you">
          <p>
            Tell us about your life-style by selecting the categories important
            for your new home. We will tell you about NYC neighborhoods that
            suit your household the best.
          </p>
        </SidebarSection>

        <SidebarSection title="Choose boroughs to discover">
          <CheckboxList name="boroughs" list={boroughs} />
        </SidebarSection>

        <SidebarSection title="Place Your Preference in Order">
          <RadioList name="categories" list={categories} />
        </SidebarSection>
      </Sidebar>
    </>
  );
}

const boroughs: CheckboxItem[] = [
  {
    text: "Manhattan",
    value: "0",
  },
  {
    text: "Brooklyn",
    value: "1",
  },
  {
    text: "Bronx",
    value: "2",
  },
  {
    text: "Queens",
    value: "3",
  },
  {
    text: "Staten Island",
    value: "4",
  },
];

const categories: RadioItem[] = [
  {
    label: "Healthcare",
    value: "Healthcare",
  },
  {
    label: "Community Demograhpics",
    value: "Community Demograhpics",
  },
  {
    label: "Transportation",
    value: "Transportation",
  },
  {
    label: "Housing Cost",
    value: "Housing Cost",
  },
  {
    label: "Parks & Recreation",
    value: "Parks & Recreation",
  },
  {
    label: "Groceries & Restaurants",
    value: "Groceries & Restaurants",
  },
  {
    label: "Libraries & Schools",
    value: "Libraries & Schools",
  },
];
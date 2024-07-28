import DropdownManager from "../components/DropdownManager";
import { DropdownListType } from '../components/DropdownList';
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";

const targetLists: DropdownListType[] = [
  {
    category: "Unserved Population Density",
    items: [
      "Unserved population / km2",
      "Unserved Medicaid enrollees / km2",
      "Unserved Commercial enrollees / km2",
    ],
  },
  {
    category: "Insured Population Density",
    items: [
      "Insured population / km2",
      "Medicaid enrollees / km2",
      "Commercial enrollees / km2",
    ],
  }
];

const secondaryLists: DropdownListType[] = [
  {
    category: "Health Behaviors",
    items: [
      "Current lack of health insurance",
      "No leisure-time physical activity",
      "Binge drinking",
      "Sleeping less than 7 hours",
      "Current smoking",
      "Cholesterol screening",
      "Taking medicine for high blood pressure",
      "Visits to dentist or dental clinic",
      "Visits to doctor for routine checkup"
    ]
  },
  {
    category: "Health Status",
    items: [
      "Physical health not good for >=14 days",
      "Mental health not good for >=14 days",
      "Fair or poor self-rated health status"
    ]
  },
  {
    category: "Income & Expenses",
    items: [
      "Median household income",
      "Median household disposable income",
      "Median monthly housing cost"
    ]
  },
  {
    category: "Land Use & Parcels",
    items: [
      "Average land price / ft2",
      "Residential district percent",
      "Commercial district percent",
      "Industrial district percent",
      "Agricultural land percent",
      "Vacant land percent"
    ]
  },
  {
    category: "Mode of Transportation to work",
    items: [
      "Drove alone percent",
      "Carpooled percent",
      "Public transit percent",
      "Walked percent",
      "Worked from home percent "
    ]
  }
];

export default function Explore() {
  return (
    <Sidebar>
      <SidebarSection title="Explore Datasets">
        <p>
          Explore datasets of shortage areas by comparing target data on
          shortages with other secondary data. Add or remove datasets as needed
          for the clustering analysis of healthcare shortages. Once you are
          finished, click the "Continue" button.
        </p>
      </SidebarSection>

      <SidebarSection title="Select Target Data">
        <DropdownManager
          lists={targetLists}
          defaultItem="Unserved population / km2"
          selectable
          autoCollapse
        />
      </SidebarSection>

      <SidebarSection title="Select Secondary Data">
        <DropdownManager
          lists={secondaryLists}
          defaultItem="Current lack of health insurance"
          selectable
          autoCollapse
        />
      </SidebarSection>

      <SidebarSection title="Added Features">
        <p>added features</p>
      </SidebarSection>
    </Sidebar>
  );
}

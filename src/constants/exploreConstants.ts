import { v4 as uuidv4 } from 'uuid';
import { DropdownListType } from '../components/DropdownList';

/**
 * Type definitions for the Explore page.
 */
export const targetLists: DropdownListType[] = [
  {
    category: "Unserved Population Density",
    items: [
      {name: "Unserved population / km2", id: uuidv4()},
      {name: "Unserved Medicaid enrollees / km2", id: uuidv4()},
      {name: "Unserved Commercial enrollees / km2", id: uuidv4()},
    ],
    id: uuidv4()
  },
  {
    category: "Insured Population Density",
    items: [
      {name: "Insured population / km2", id: uuidv4()},
      {name: "Medicaid enrollees / km2", id: uuidv4()},
      {name: "Commercial enrollees / km2", id: uuidv4()},
    ],
    id: uuidv4()
  }
];

export const secondaryLists: DropdownListType[] = [
  {
    category: "Health Behaviors",
    items: [
      {name: "Current lack of health insurance", id: uuidv4()},
      {name: "No leisure-time physical activity", id: uuidv4()},
      {name: "Binge drinking", id: uuidv4()},
      {name: "Sleeping less than 7 hours", id: uuidv4()},
      {name: "Current smoking", id: uuidv4()},
      {name: "Cholesterol screening", id: uuidv4()},
      {name: "Taking medicine for high blood pressure", id: uuidv4()},
      {name: "Visits to dentist or dental clinic", id: uuidv4()},
      {name: "Visits to doctor for routine checkup", id: uuidv4()},
    ],
    id: uuidv4()
  },
  {
    category: "Health Status",
    items: [
      {name: "Physical health not good for >=14 days", id: uuidv4()},
      {name: "Mental health not good for >=14 days", id: uuidv4()},
      {name: "Fair or poor self-rated health status", id: uuidv4()},
    ],
    id: uuidv4()
  },
  {
    category: "Income & Expenses",
    items: [
      {name: "Median household income", id: uuidv4()},
      {name: "Median household disposable income", id: uuidv4()},
      {name: "Median monthly housing cost", id: uuidv4()},
    ],
    id: uuidv4()
  },
  {
    category: "Land Use & Parcels",
    items: [
      {name: "Average land price / ft2", id: uuidv4()},
      {name: "Residential district percent", id: uuidv4()},
      {name: "Commercial district percent", id: uuidv4()},
      {name: "Industrial district percent", id: uuidv4()},
      {name: "Agricultural land percent", id: uuidv4()},
      {name: "Vacant land percent", id: uuidv4()},
    ],
    id: uuidv4()
  },
  {
    category: "Mode of Transportation to work",
    items: [
      {name: "Drove alone percent", id: uuidv4()},
      {name: "Carpooled percent", id: uuidv4()},
      {name: "Public transit percent", id: uuidv4()},
      {name: "Walked percent", id: uuidv4()},
      {name: "Worked from home percent ", id: uuidv4()},
    ],
    id: uuidv4()
  }
];

// Initial text for the response box.
export const initialTextExplore: string = 
  "Explore datasets of shortage areas by comparing target data on shortages with other secondary data. Add or remove datasets as needed for the clustering analysis of healthcare shortages. Once you are finished, click the 'Continue' button."
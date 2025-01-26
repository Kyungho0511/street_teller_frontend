import styles from "./CheckboxList.module.css";
import Colorbox from "../atoms/Colorbox";
import { useContext, useState } from "react";
import { Survey, SurveyContext } from "../../context/SurveyContext";
import { Message, MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { OpenAIResponseJSON } from "../../services/openai";
import { useLocation } from "react-router-dom";
import { parseString, pathToSection } from "../../utils/utils";
import { ClusterPrompt, ReportPrompt } from "../../constants/messageConstants";
import { v4 as uuidv4 } from "uuid";
import { RGBA } from "../../constants/mapConstants";

export type CheckBoxItemAI = {
  name: string;
  reasoning: string;
  color: RGBA;
  checked: boolean;
};

type CheckboxListAIProps = {
  surveyName: keyof Survey;
  list: CheckBoxItemAI[];
  colors: RGBA[];
  prompt: ClusterPrompt | ReportPrompt | undefined;
  streamOpenAI: () => AsyncGenerator<string | OpenAIResponseJSON>;
};

/**
 * Checkbox list component to display the AI response.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of AI reponses to be displayed after streaming.
 * @param colors List of colors to be used for the checkbox list.
 * @param prompt Prompts to ask to AI.
 * @param streamOpenAI Callback function to stream the OpenAI response.
 */
export default function CheckboxListAI({
  surveyName,
  list,
  colors,
  prompt,
  streamOpenAI,
}: CheckboxListAIProps) {
  const { setSurvey } = useContext(SurveyContext);
  const { messages } = useContext(MessageContext);
  const {
    addMessage,
    isStreaming,
    setIsStreaming,
    errorMessage,
    setErrorMessage,
  } = useContext(MessageContext);

  const [streaming, setStreaming] = useState<CheckBoxItemAI[]>([]);
  const listToDisplay = isStreaming.json && streaming ? streaming : list;

  if (!isStreaming.json && surveyName === "report") {
    console.log(surveyName, ": ", listToDisplay);
    console.log("colors: ", colors);
  }

  const location = useLocation();
  const section = pathToSection(location.pathname);
  const run = messages[section].find(
    (message) => message.type === parseString(surveyName)
  )
    ? false
    : true;

  // Fetch and stream OpenAI response on setting prompts.
  useEffectAfterMount(() => {
    if (!prompt || !run) return;

    displayOpenAIResponse();
  }, [prompt]);

  // Update the list context whenever a new response is added.
  const responses: string[] = streaming
    .map((cluster) => cluster.reasoning)
    .filter((reasoning) => reasoning !== "" && reasoning !== undefined);

  // Update the survey context when the new response is added.
  useEffectAfterMount(() => {
    setSurvey((prev) => ({
      ...prev,
      [surveyName]: { ...prev[surveyName], list: streaming },
    }));
  }, [responses.length]);

  /**
   * Start displaying the OpenAI streaming response.
   */
  const displayOpenAIResponse = async () => {
    // Reset the loading and error status.
    setIsStreaming((prev) => ({ ...prev, json: true }));
    setErrorMessage((prev) => ({ ...prev, json: "" }));

    let response: OpenAIResponseJSON = {
      labels: [{ name: "", reasoning: "" }],
    };
    let newList: CheckBoxItemAI[] = [...list];

    try {
      // Start OpenAI JSON response streaming.
      for await (const chunk of streamOpenAI()) {
        response = chunk as OpenAIResponseJSON;

        // Update streaming with parsed data.
        newList = [...list];
        response?.labels?.forEach((item, i) => {
          newList[i] = {
            ...newList[i],
            name: item?.name,
            reasoning: item?.reasoning,
            color: colors[i],
          };
        });
        setStreaming(newList);
      }
    } catch {
      const error = "Failed to fetch openAI JSON response.";
      setErrorMessage({ ...errorMessage, json: error });
      console.error(error);
    } finally {
      // Update the message context when the response is fully fetched.
      addMessage(section, {
        user: JSON.stringify(prompt!.content),
        ai: JSON.stringify(response),
        type: parseString(surveyName) as Message["type"],
      });
      setIsStreaming((prev) => ({ ...prev, json: false }));
      setSurvey((prev) => ({
        ...prev,
        [surveyName]: { ...prev[surveyName], list: newList },
      }));
    }
  };

  // Handle uncontrolled checkbox change
  const handleListChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedList = [...list];
    updatedList[index] = {
      ...updatedList[index],
      checked: event.target.checked,
    };

    setSurvey((prev) => ({
      ...prev,
      [surveyName]: { ...prev[surveyName], list: updatedList },
    }));
  };

  // Display error status of fetching openai response.
  if (errorMessage.json) {
    return <p>{errorMessage.json}</p>;
  }

  return (
    <>
      <ul className={styles.list}>
        {listToDisplay.map((item, index) => (
          <li key={uuidv4()}>
            <label className={styles.label}>
              <input
                className={styles.input}
                type="checkbox"
                name={surveyName}
                value={item.name}
                checked={item.checked}
                onChange={(event) => handleListChange(event, index)}
              />
              <span className={styles.indicator}></span>
              <Colorbox
                label={item.name}
                color={item.color}
                fontSize={"1rem"}
              />
            </label>
            <div className={styles.text}>{item.reasoning}</div>
          </li>
        ))}
      </ul>
    </>
  );
}

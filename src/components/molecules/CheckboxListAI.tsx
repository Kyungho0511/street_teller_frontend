import styles from "./CheckboxList.module.css";
import {
  CheckboxItem,
  ClusterCheckboxItem,
  ClusterList,
  ReportList,
} from "../../constants/surveyConstants";
import Colorbox from "../atoms/Colorbox";
import { useContext, useState } from "react";
import { Survey, SurveyContext } from "../../context/SurveyContext";
import { MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { OpenAIResponseJSON } from "../../services/openai";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import { ClusterPrompt, ReportPrompt } from "../../constants/messageConstants";
import { v4 as uuidv4 } from "uuid";

type CheckboxListAIProps = {
  surveyName: keyof Survey;
  list: CheckboxItem[];
  prompt: ClusterPrompt | ReportPrompt;
  streamOpenAI: () => AsyncGenerator<string | OpenAIResponseJSON>;
};

/**
 * Checkbox list component to display the AI response.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of AI reponses to be displayed after streaming.
 * @param prompt Prompts to ask to AI.
 * @param streamOpenAI Callback function to stream the OpenAI response.
 */
export default function CheckboxListAI({
  surveyName,
  list,
  prompt,
  streamOpenAI,
}: CheckboxListAIProps) {
  const { setSurveyContext } = useContext(SurveyContext);
  const {
    addMessage,
    isStreaming,
    setIsStreaming,
    errorMessage,
    setErrorMessage,
  } = useContext(MessageContext);

  const [streaming, setStreaming] = useState<CheckboxItem[]>([]);
  const listToDisplay = isStreaming.json && streaming ? streaming : list;

  const location = useLocation();
  const section = pathToSection(location.pathname);

  // Fetch and stream OpenAI response on setting prompts.
  useEffectAfterMount(() => {
    prompt.content.length > 0 && displayOpenAIResponse();
  }, [prompt]);

  // Update the list context whenever a new response is added.
  const responses: string[] = streaming
    .map((cluster) => cluster.reasoning)
    .filter((reasoning) => reasoning !== "" && reasoning !== undefined);

  useEffectAfterMount(() => {
    setSurveyContext({ name: surveyName, list: streaming } as
      | ClusterList
      | ReportList);
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
    let newList: CheckboxItem[] = [...list];

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
        user: JSON.stringify(prompt.content),
        ai: JSON.stringify(response),
        type: "cluster",
      });
      setIsStreaming((prev) => ({ ...prev, json: false }));
      setSurveyContext({ name: surveyName, list: newList } as ClusterList);
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

    setSurveyContext({
      name: surveyName as ClusterList["name"],
      list: updatedList as ClusterCheckboxItem[],
    });
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

      {/* <Button
        text={"retry analysis"}
        type={"sidebar"}
        handleClick={streamOpenAIResponse}
      /> */}
    </>
  );
}

import styles from "./CheckboxList.module.css";
import {
  CheckboxItem,
  ClusterCheckboxItem,
  ClusterList,
} from "../../constants/surveyConstants";
import Colorbox from "../atoms/Colorbox";
import { useContext, useState } from "react";
import { SurveyContext } from "../../context/SurveyContext";
import { MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { OpenAIResponseJSON, streamOpenAI } from "../../services/openai";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import { ClusterPrompt, Prompt } from "../../constants/messageConstants";

type CheckboxListAIProps = {
  page: string;
  list: CheckboxItem[];
  prompts: Prompt[];
};

/**
 * Checkbox list component to display the AI response.
 * @param page Page name that contains the checkbox list.
 * @param list List of AI reponses to be displayed after streaming.
 * @param prompts Prompts to ask to AI.
 */
export default function CheckboxListAI({
  page,
  list,
  prompts,
}: CheckboxListAIProps) {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const {
    messages,
    addMessage,
    isStreaming,
    setIsStreaming,
    errorMessage,
    setErrorMessage,
  } = useContext(MessageContext);

  const [streaming, setStreaming] = useState<ClusterCheckboxItem[]>([]);
  const listToDisplay = isStreaming.json && streaming ? streaming : list;

  const location = useLocation();
  const section = pathToSection(location.pathname);

  // Fetch and stream OpenAI response on setting prompts.
  useEffectAfterMount(() => {
    prompts.length > 0 && streamOpenAIResponse();
  }, [prompts]);

  // Update the list context whenever a new response is added.
  const responses: string[] = streaming
    .map((cluster) => cluster.reasoning)
    .filter((reasoning) => reasoning !== "" && reasoning !== undefined);

  useEffectAfterMount(() => {
    setSurveyContext({ name: page, list: streaming } as ClusterList);
  }, [responses.length]);

  /**
   * Start displaying the OpenAI streaming response.
   */
  const streamOpenAIResponse = async () => {
    // Reset the loading and error status.
    setIsStreaming((prev) => ({ ...prev, json: true }));
    setErrorMessage((prev) => ({ ...prev, json: "" }));

    // Construct prompt JSON for OpenAI.
    const promptJson = list.map((item, i) => ({
      name: item.name,
      centroids: kMeansLayers[index]?.attributes.map((attr, j) => ({
        name: attr,
        value: kMeansLayers[index]?.centroids[i][j],
      })),
    }));

    let response: OpenAIResponseJSON = {
      labels: [{ name: "", reasoning: "" }],
    };
    let newList: ClusterCheckboxItem[] = [...list];

    try {
      // Start OpenAI JSON response streaming.
      for await (const chunk of streamOpenAI(
        { type: "cluster", content: promptJson } as ClusterPrompt,
        messages[section],
        survey.preferenceList.list,
        index
      )) {
        response = chunk as OpenAIResponseJSON;

        // Update streaming with parsed data.
        newList = [...list];
        response?.labels?.forEach((label, i) => {
          newList[i] = {
            ...newList[i],
            name: label?.name,
            reasoning: label?.reasoning,
            centroids: kMeansLayers[index]!.attributes.map((attr, j) => ({
              name: attr,
              value: kMeansLayers[index]!.centroids[i][j],
            })),
            color: kMeansLayers[index]!.colors[i],
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
        user: JSON.stringify(promptJson),
        ai: JSON.stringify(response),
        type: "cluster",
      });
      setIsStreaming((prev) => ({ ...prev, json: false }));
      setSurveyContext({ name: page, list: newList } as ClusterList);
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
      name: page as ClusterList["name"],
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
          <li key={item.id}>
            <label className={styles.label}>
              <input
                className={styles.input}
                type="checkbox"
                name={page}
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
